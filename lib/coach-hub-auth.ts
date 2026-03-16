/**
 * Coach Hub auth — Edge-safe verification only.
 * Signing is in coach-hub-auth-server.ts (Node crypto); this file uses Web Crypto for middleware.
 */

export const COACH_HUB_COOKIE_NAME = 'lbta_coach_hub'

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

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

  if (sigHex.length !== computedHex.length) return false
  // Constant-time compare (Edge has no Buffer/crypto.timingSafeEqual)
  let diff = 0
  for (let i = 0; i < sigHex.length; i++) {
    diff |= sigHex.charCodeAt(i) ^ computedHex.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Max age for the cookie (seconds) for Set-Cookie.
 */
export function getCoachHubCookieMaxAge(): number {
  return Math.floor(COOKIE_MAX_AGE_MS / 1000)
}
