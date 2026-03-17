/**
 * Coach Hub auth — Edge-safe verification only.
 * Signing is in coach-hub-auth-server.ts (Node crypto); this file uses Web Crypto for middleware.
 */

export const COACH_HUB_COOKIE_NAME = 'lbta_coach_hub'

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
 * Verify signed cookie value (Edge-safe; uses Web Crypto).
 * Cookie format: base64url(JSON.stringify({ exp })) + '.' + hex(HMAC-SHA256(payload, secret))
 */
export async function verifyCoachHubCookie(
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

  // Constant-time compare: run loop over max length then check length so timing does not leak length (Edge has no Buffer/crypto.timingSafeEqual).
  const maxLen = Math.max(sigHex.length, computedHex.length)
  let diff = 0
  for (let i = 0; i < maxLen; i++) {
    const a = i < sigHex.length ? sigHex.charCodeAt(i) : 0
    const b = i < computedHex.length ? computedHex.charCodeAt(i) : 0
    diff |= a ^ b
  }
  return diff === 0 && sigHex.length === computedHex.length
}

/** Cookie duration: 7 days, in seconds (for Set-Cookie Max-Age). Single source for auth and auth-server. */
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/**
 * Max age for the cookie (seconds) for Set-Cookie.
 */
export function getCoachHubCookieMaxAge(): number {
  return COOKIE_MAX_AGE_SECONDS
}
