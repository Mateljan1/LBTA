import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { coachHubAuthSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { getEnvVar } from '@/lib/env'
import {
  signCoachHubCookie,
  buildCoachHubSetCookie,
} from '@/lib/coach-hub-auth-server'
import { timingSafeEqual } from 'crypto'

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number }
  // On KV/rate-limit failure we allow the request (fail-open) to avoid locking out users when KV is unavailable. Consider monitoring KV health.
  try {
    rateLimitResult = await rateLimit(
      `coach-hub-auth:${ip}`,
      RATE_LIMITS.sensitive
    )
  } catch {
    rateLimitResult = {
      allowed: true,
      remaining: RATE_LIMITS.sensitive.maxRequests,
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

  let secret: string
  try {
    secret = getEnvVar('COACH_HUB_SECRET', false)
  } catch {
    secret = ''
  }
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'Coach Hub is not configured.' },
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

  const validation = validateRequest(coachHubAuthSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    )
  }

  const { password } = validation.data

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

  const cookieValue = signCoachHubCookie(secret)
  const secure = process.env.NODE_ENV === 'production'
  const setCookie = buildCoachHubSetCookie(cookieValue, secure)
  const res = NextResponse.json({ success: true })
  res.headers.append('Set-Cookie', setCookie)
  return res
}
