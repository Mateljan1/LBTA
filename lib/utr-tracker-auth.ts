export const UTR_TRACKER_ADMIN_COOKIE_NAME = 'lbta_utr_admin'

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyUtrTrackerAdminCookie(
  secret: string,
  value: string
): Promise<boolean> {
  if (!secret || !value) return false
  const dot = value.indexOf('.')
  if (dot <= 0 || dot === value.length - 1) return false

  const payloadB64 = value.slice(0, dot)
  const sigHex = value.slice(dot + 1)

  let payloadStr = ''
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

  const maxLen = Math.max(sigHex.length, computedHex.length)
  let diff = 0
  for (let i = 0; i < maxLen; i++) {
    const a = i < sigHex.length ? sigHex.charCodeAt(i) : 0
    const b = i < computedHex.length ? computedHex.charCodeAt(i) : 0
    diff |= a ^ b
  }
  return diff === 0 && sigHex.length === computedHex.length
}

const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export function getUtrTrackerCookieMaxAge(): number {
  return COOKIE_MAX_AGE_SECONDS
}
