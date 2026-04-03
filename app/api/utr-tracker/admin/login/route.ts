import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  parseJsonBody,
  utrTrackerAdminAuthSchema,
  validateRequest,
} from '@/lib/validations'
import { getEnvVar } from '@/lib/env'
import {
  buildUtrTrackerSetCookie,
  signUtrTrackerCookie,
} from '@/lib/utr-tracker-auth-server'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`utr-admin-auth:${ip}`, RATE_LIMITS.sensitive)
  } catch {
    rateLimitResult = {
      allowed: true,
      resetTime: Date.now() + RATE_LIMITS.sensitive.interval,
    }
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  }

  let secret = ''
  try {
    secret = getEnvVar('UTR_TRACKER_ADMIN_SECRET', false).trim()
  } catch {
    secret = ''
  }
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'UTR Tracker admin is not configured.' },
      { status: 503 }
    )
  }

  const parsed = await parseJsonBody(request)
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: 'Invalid request format' },
      { status: 400 }
    )
  }

  const validation = validateRequest(utrTrackerAdminAuthSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    )
  }

  const password = validation.data.password.trim()
  const secretBuf = Buffer.from(secret, 'utf8')
  const passwordBuf = Buffer.from(password, 'utf8')
  if (secretBuf.length !== passwordBuf.length) {
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  }
  if (!timingSafeEqual(secretBuf, passwordBuf)) {
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  }

  const cookieValue = signUtrTrackerCookie(secret)
  const secure = process.env.NODE_ENV === 'production'
  const setCookie = buildUtrTrackerSetCookie(cookieValue, secure)
  const res = NextResponse.json({ success: true })
  res.headers.append('Set-Cookie', setCookie)
  return res
}
