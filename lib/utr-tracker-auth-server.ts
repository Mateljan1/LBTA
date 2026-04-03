import { createHmac } from 'crypto'
import {
  UTR_TRACKER_ADMIN_COOKIE_NAME,
  getUtrTrackerCookieMaxAge,
} from './utr-tracker-auth'

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function signUtrTrackerCookie(secret: string): string {
  const exp = Date.now() + getUtrTrackerCookieMaxAge() * 1000
  const payloadStr = JSON.stringify({ exp })
  const sig = createHmac('sha256', secret).update(payloadStr).digest('hex')
  const payloadB64 = base64UrlEncode(payloadStr)
  return `${payloadB64}.${sig}`
}

export function buildUtrTrackerSetCookie(value: string, secure: boolean): string {
  const maxAge = getUtrTrackerCookieMaxAge()
  const parts = [
    `${UTR_TRACKER_ADMIN_COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function buildUtrTrackerClearCookie(): string {
  const parts = [
    `${UTR_TRACKER_ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}
