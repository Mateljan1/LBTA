import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  COACH_HUB_COOKIE_NAME,
  verifyCoachHubCookie,
} from '@/lib/coach-hub-auth'

const COACH_HUB_LOGIN = '/coach-hub/login'
const COACH_HUB_PREFIX = '/coach-hub'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and API routes
  if (pathname === COACH_HUB_LOGIN || pathname.startsWith('/api/coach-hub')) {
    return NextResponse.next()
  }

  if (!pathname.startsWith(COACH_HUB_PREFIX)) {
    return NextResponse.next()
  }

  const secret = process.env.COACH_HUB_SECRET
  if (!secret) {
    return NextResponse.next()
  }

  const cookieValue = request.cookies.get(COACH_HUB_COOKIE_NAME)?.value
  if (!cookieValue) {
    const login = new URL(COACH_HUB_LOGIN, request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  // Verify asynchronously; Edge middleware supports async
  return verifyCoachHubCookie(secret, cookieValue).then((valid) => {
    if (valid) return NextResponse.next()
    const login = new URL(COACH_HUB_LOGIN, request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  })
}

export const config = {
  matcher: ['/coach-hub', '/coach-hub/:path*'],
}
