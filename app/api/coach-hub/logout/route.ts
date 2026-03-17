import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { buildCoachHubClearCookie } from '@/lib/coach-hub-auth-server'

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/coach-hub/login', request.url))
  res.headers.append('Set-Cookie', buildCoachHubClearCookie())
  return res
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let allowed = true
  let resetTime = Date.now() + RATE_LIMITS.sensitive.interval
  try {
    const result = await rateLimit(`coach-hub-logout:${ip}`, RATE_LIMITS.sensitive)
    allowed = result.allowed
    resetTime = result.resetTime
  } catch {
    // Fail-open: allow logout if rate-limit/KV fails
  }
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        },
      }
    )
  }
  const res = NextResponse.json({ success: true })
  res.headers.append('Set-Cookie', buildCoachHubClearCookie())
  return res
}
