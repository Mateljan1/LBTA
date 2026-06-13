/**
 * Per-Coach Hub passwords — parses COACH_PASSWORDS_JSON env var into a slug→password map.
 *
 * Format: {"allison":"allison-lbta-2026","andrew":"andrew-lbta-2026","peter":"peter-lbta-2026"}
 *
 * Trust model: plain text comparison (timing-safe) at the API layer; the JSON map is
 * stored in Vercel-encrypted env vars, never in code or .env.example. Adding a coach
 * later means editing one env var. Per-coach view is disabled (503) when unset.
 *
 * IMPORTANT: This module is server-only. Do not import in middleware/Edge runtime.
 * Use `getKnownCoachSlugsForEdge()` (synchronous, env-only) if you need slug list in proxy.
 */

import { getEnvVar } from './env'

export type CoachSlug = string

interface CoachPasswordsCache {
  raw: string | null
  parsed: Record<CoachSlug, string> | null
}

const cache: CoachPasswordsCache = { raw: null, parsed: null }

function parseEnv(): Record<CoachSlug, string> {
  let raw: string
  try {
    raw = getEnvVar('COACH_PASSWORDS_JSON', false).trim()
  } catch {
    raw = ''
  }

  if (!raw) return {}
  if (cache.raw === raw && cache.parsed) return cache.parsed

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

  const result: Record<CoachSlug, string> = {}
  for (const [slug, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof value !== 'string' || value.length === 0) continue
    if (!/^[a-z0-9-]{1,32}$/.test(slug)) continue
    result[slug] = value.trim()
  }

  cache.raw = raw
  cache.parsed = result
  return result
}

/**
 * Get the password for a given coach slug. Returns empty string if unknown coach
 * or env var unset (auth route should treat as 503 / 401 respectively).
 */
export function getCoachPassword(slug: string): string {
  const map = parseEnv()
  return map[slug] ?? ''
}

/**
 * Returns the list of coach slugs that currently have a password set.
 * Server-only (reads env). Do not call from middleware/Edge.
 */
export function getKnownCoachSlugs(): CoachSlug[] {
  return Object.keys(parseEnv())
}

/**
 * True if at least one coach password is configured.
 */
export function isPerCoachAuthConfigured(): boolean {
  return Object.keys(parseEnv()).length > 0
}
