/**
 * Per-Coach Hub auth — server-only signing (Node crypto).
 * Used by API route only; do not import in proxy.ts (Edge).
 */

import { createHmac } from 'crypto'
import {
  perCoachCookieName,
  perCoachCookiePath,
  getPerCoachCookieMaxAge,
} from './per-coach-auth'

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Produce signed cookie value for a per-coach session.
 * Format: base64url(JSON.stringify({ exp })) + '.' + hex(HMAC-SHA256(payload, secret))
 * Secret = the coach's password (already trimmed by caller).
 */
export function signPerCoachCookie(secret: string): string {
  const exp = Date.now() + getPerCoachCookieMaxAge() * 1000
  const payloadStr = JSON.stringify({ exp })
  const sig = createHmac('sha256', secret).update(payloadStr).digest('hex')
  const payloadB64 = base64UrlEncode(payloadStr)
  return `${payloadB64}.${sig}`
}

/**
 * Set-Cookie header value for a per-coach session.
 * httpOnly, narrow Path=/coach-hub/{slug}, SameSite=Lax, Secure in production.
 */
export function buildPerCoachSetCookie(
  value: string,
  slug: string,
  secure: boolean
): string {
  const maxAge = getPerCoachCookieMaxAge()
  const parts = [
    `${perCoachCookieName(slug)}=${value}`,
    `Path=${perCoachCookiePath(slug)}`,
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

/**
 * Clear-Cookie header (Max-Age=0). Include Secure in production so HTTPS browsers clear it.
 */
export function buildPerCoachClearCookie(slug: string): string {
  const parts = [
    `${perCoachCookieName(slug)}=; Path=${perCoachCookiePath(slug)}; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}
