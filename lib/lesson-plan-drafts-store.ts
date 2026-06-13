/**
 * Per-coach lesson plan drafts store — backed by Vercel KV.
 *
 * Why KV (not Supabase or fs):
 *   - Vercel filesystem is read-only in production (fs.writeFile fails).
 *   - Supabase would need a new table migration; overkill for a small list.
 *   - KV is already configured (KV_REST_API_URL, KV_REST_API_TOKEN in env).
 *
 * Storage shape (per-coach namespacing — fixes flood-eviction risk):
 *   - One key per coach: `coach-lesson-plan-drafts:{slug}`
 *   - List backed by KV's lpush/lrange/ltrim — atomic, no read-modify-write race.
 *   - Cap per coach: 100 drafts (FIFO eviction via ltrim).
 *
 * History: v1 used a single shared key + JSON read-modify-write. Reviewers
 * (Reliability, Security, CodeRabbit) flagged the race + the flood-eviction
 * attack vector. v2 (this file) uses atomic lpush/ltrim and per-slug keys.
 */

import { kv } from '@vercel/kv'
import type { LessonPlanDraft } from './lesson-plan-types'

const KV_KEY_PREFIX = 'coach-lesson-plan-drafts'
const MAX_DRAFTS_PER_COACH = 100

function keyFor(slug: string): string {
  return `${KV_KEY_PREFIX}:${slug}`
}

/**
 * Return drafts for a single coach (newest first). Returns empty array if KV
 * unavailable or if no drafts have been created yet.
 */
export async function listDraftsForCoach(slug: string): Promise<LessonPlanDraft[]> {
  try {
    const value = await kv.lrange<LessonPlanDraft>(keyFor(slug), 0, MAX_DRAFTS_PER_COACH - 1)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

/**
 * Return drafts across all coaches in the registry (newest-first within each coach,
 * then merged + sorted by createdAt descending). Used by the library landing.
 */
export async function listAllDrafts(slugs: string[]): Promise<LessonPlanDraft[]> {
  if (slugs.length === 0) return []
  try {
    const perCoach = await Promise.all(slugs.map((s) => listDraftsForCoach(s)))
    const merged = perCoach.flat()
    merged.sort((a, b) => {
      const ta = Date.parse(a._meta?.createdAt ?? '') || 0
      const tb = Date.parse(b._meta?.createdAt ?? '') || 0
      return tb - ta
    })
    return merged
  } catch {
    return []
  }
}

/**
 * Append a draft for a coach using atomic lpush + ltrim.
 * Returns the persisted draft. Throws on KV write failure so the API
 * route can surface a clear 500 to the coach.
 */
export async function addDraft(draft: LessonPlanDraft): Promise<LessonPlanDraft> {
  const slug = draft._meta.generatedBy
  const key = keyFor(slug)
  // Atomic: prepend then trim. No read-modify-write race.
  await kv.lpush(key, draft)
  await kv.ltrim(key, 0, MAX_DRAFTS_PER_COACH - 1)
  return draft
}

/**
 * Look up a draft by ID. Scans the registry's coaches' lists.
 * Returns null if unknown or KV unavailable.
 */
export async function getDraft(
  id: string,
  slugs: string[]
): Promise<LessonPlanDraft | null> {
  if (!/^draft-[a-z0-9-]{1,64}$/i.test(id)) return null
  for (const slug of slugs) {
    const drafts = await listDraftsForCoach(slug)
    const match = drafts.find((d) => d.id === id)
    if (match) return match
  }
  return null
}
