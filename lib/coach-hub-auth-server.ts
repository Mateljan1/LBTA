/**
 * Coach Hub auth — server-only signing (Node crypto).
 * Used by API route only; do not import in middleware (Edge).
 */

import { createHmac } from 'crypto'
import { COACH_HUB_COOKIE_NAME, getCoachHubCookieMaxAge } from './coach-hub-auth'

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Produce signed cookie value for Coach Hub session.
 * Format: base64url(JSON.stringify({ exp })) + '.' + hex(HMAC-SHA256(payload, secret))
 */
export function signCoachHubCookie(secret: string): string {
  const exp = Date.now() + getCoachHubCookieMaxAge() * 1000
  const payloadStr = JSON.stringify({ exp })
  const sig = createHmac('sha256', secret).update(payloadStr).digest('hex')
  const payloadB64 = base64UrlEncode(payloadStr)
  return `${payloadB64}.${sig}`
}

/**
 * Set-Cookie header value for Coach Hub session (httpOnly, secure in prod, path=/coach-hub).
 */
export function buildCoachHubSetCookie(value: string, secure: boolean): string {
  const maxAge = getCoachHubCookieMaxAge()
  const parts = [
    `${COACH_HUB_COOKIE_NAME}=${value}`,
    'Path=/coach-hub',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

/**
 * Clear-Cookie header value (Max-Age=0). Include Secure in production to match set-cookie.
 */
export function buildCoachHubClearCookie(): string {
  const parts = [
    `${COACH_HUB_COOKIE_NAME}=; Path=/coach-hub; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}
