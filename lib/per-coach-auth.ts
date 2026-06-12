/**
 * Per-Coach Hub auth — Edge-safe verification only.
 * Signing lives in per-coach-auth-server.ts (Node crypto); this file uses Web Crypto
 * for proxy.ts (Edge runtime).
 *
 * Cookie scheme:
 *   - Name: lbta_coach_{slug} (e.g. lbta_coach_allison)
 *   - Path: /coach-hub/{slug} (narrow scope — Allison's cookie not sent for /coach-hub/peter)
 *   - Format: base64url(JSON.stringify({ exp })) + '.' + hex(HMAC-SHA256(payload, coachPassword))
 *   - Same shape as the existing lbta_coach_hub cookie (intentional consistency).
 */

const COOKIE_NAME_PREFIX = 'lbta_coach_'

/**
 * Per-coach cookie name for a given slug. Matches what the auth route sets.
 */
export function perCoachCookieName(slug: string): string {
  return `${COOKIE_NAME_PREFIX}${slug}`
}

/**
 * Per-coach cookie path. Set to `/` so the cookie is sent for BOTH:
 *   - /coach-hub/{slug}/* (page routes — gated by proxy.ts)
 *   - /api/coach-hub/{slug}/* (API routes — gated by handler-level cookie verify)
 *
 * Why `/` (was `/coach-hub/{slug}` originally): per-coach cookies are HMAC-signed
 * with the coach's own password. Allison's cookie can NOT be forged into Peter's
 * because the signing secret differs. Path scoping was a defense-in-depth bonus,
 * but it broke the API-route auth check (cookies at narrower paths don't bubble up
 * to sibling path trees). Widening to `/` sends the cookie everywhere, but each
 * cookie is still cryptographically scoped to its own coach via the HMAC.
 *
 * NOTE: After this change, existing logged-in coaches need to log out + back in
 * to get a cookie with the new path. Old narrow-path cookies stop working.
 */
export function perCoachCookiePath(_slug: string): string {
  return `/`
}

/** Cookie duration: 7 days, in seconds (for Set-Cookie Max-Age). */
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export function getPerCoachCookieMaxAge(): number {
  return COOKIE_MAX_AGE_SECONDS
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Verify a per-coach signed cookie value against the coach's password (used as HMAC secret).
 * Edge-safe — uses Web Crypto, no Node Buffer/crypto.
 */
export async function verifyPerCoachCookie(
  secret: string,
  value: string
): Promise<boolean> {
  if (!secret || !value) return false
  const dot = value.indexOf('.')
  if (dot <= 0 || dot === value.length - 1) return false

  const payloadB64 = value.slice(0, dot)
  const sigHex = value.slice(dot + 1)

  let payloadStr: string
  try {
    payloadStr = base64UrlDecode(payloadB64)
  } catch {
    return false
  }

  let payload: { exp?: number }
  try {
    payload = JSON.parse(payloadStr) as { exp?: number }
  } catch {
    return false
  }

  const exp = payload.exp
  if (typeof exp !== 'number' || exp <= Date.now()) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadStr)
  )
  const computedHex = bufferToHex(sigBuffer)

  // Constant-time compare; loop over max length then check length so timing doesn't leak length.
  const maxLen = Math.max(sigHex.length, computedHex.length)
  let diff = 0
  for (let i = 0; i < maxLen; i++) {
    const a = i < sigHex.length ? sigHex.charCodeAt(i) : 0
    const b = i < computedHex.length ? computedHex.charCodeAt(i) : 0
    diff |= a ^ b
  }
  return diff === 0 && sigHex.length === computedHex.length
}
