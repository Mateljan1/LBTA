/**
 * Coach slug ↔ display name for book URLs and modal pre-selection.
 * Matches data/coaches.json and year2026.privateCoaching coach names.
 */

import coachesData from '@/data/coaches.json'

const coaches = (coachesData as { coaches: Array<{ slug: string; name: string }> }).coaches

const slugToName: Record<string, string> = {}
const nameToSlug: Record<string, string> = {}
for (const c of coaches) {
  slugToName[c.slug] = c.name
  nameToSlug[c.name] = c.slug
}

/** Resolve ?coach=andrew-mateljan to "Andrew Mateljan" for PrivateLessonModal. */
export function getCoachNameBySlug(slug: string | null | undefined): string | undefined {
  if (!slug || typeof slug !== 'string') return undefined
  return slugToName[slug.trim().toLowerCase()] ?? undefined
}

/** Resolve "Andrew Mateljan" to andrew-mateljan for /book?type=private&coach= slug. */
export function getCoachSlugByName(name: string | null | undefined): string | undefined {
  if (!name || typeof name !== 'string') return undefined
  return nameToSlug[name.trim()] ?? undefined
}

export const COACH_SLUGS = coaches.map((c) => c.slug) as readonly string[]
