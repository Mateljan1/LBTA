import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  COACH_HUB_COOKIE_NAME,
  verifyCoachHubCookie,
} from '@/lib/coach-hub-auth'
import {
  UTR_TRACKER_ADMIN_COOKIE_NAME,
  verifyUtrTrackerAdminCookie,
} from '@/lib/utr-tracker-auth'

const COACH_HUB_LOGIN = '/coach-hub/login'
const COACH_HUB_PREFIX = '/coach-hub'
const UTR_ADMIN_LOGIN = '/utr-tracker/admin/login'
const UTR_ADMIN_PREFIX = '/utr-tracker/admin'

/** Coach Hub auth gate — Next.js 16 `proxy` (replaces deprecated middleware). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname === COACH_HUB_LOGIN ||
    pathname.startsWith('/api/coach-hub') ||
    pathname === UTR_ADMIN_LOGIN ||
    pathname.startsWith('/api/utr-tracker/admin/login')
  ) {
    return NextResponse.next()
  }

  const isCoachHubPath = pathname.startsWith(COACH_HUB_PREFIX)
  const isUtrAdminPath = pathname.startsWith(UTR_ADMIN_PREFIX)
  if (!isCoachHubPath && !isUtrAdminPath) {
    return NextResponse.next()
  }

  if (isCoachHubPath) {
    const secret = process.env.COACH_HUB_SECRET
    if (!secret) {
      const login = new URL(COACH_HUB_LOGIN, request.url)
      return NextResponse.redirect(login)
    }

    const cookieValue = request.cookies.get(COACH_HUB_COOKIE_NAME)?.value
    if (!cookieValue) {
      const login = new URL(COACH_HUB_LOGIN, request.url)
      login.searchParams.set('next', pathname)
      return NextResponse.redirect(login)
    }

    return verifyCoachHubCookie(secret, cookieValue).then((valid) => {
      if (valid) return NextResponse.next()
      const login = new URL(COACH_HUB_LOGIN, request.url)
      login.searchParams.set('next', pathname)
      return NextResponse.redirect(login)
    })
  }

  const utrSecret = process.env.UTR_TRACKER_ADMIN_SECRET
  if (!utrSecret) {
    const login = new URL(UTR_ADMIN_LOGIN, request.url)
    return NextResponse.redirect(login)
  }

  const cookieValue = request.cookies.get(UTR_TRACKER_ADMIN_COOKIE_NAME)?.value
  if (!cookieValue) {
    const login = new URL(UTR_ADMIN_LOGIN, request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  return verifyUtrTrackerAdminCookie(utrSecret, cookieValue).then((valid) => {
    if (valid) return NextResponse.next()
    const login = new URL(UTR_ADMIN_LOGIN, request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  })
}

export const config = {
  matcher: [
    '/coach-hub',
    '/coach-hub/:path*',
    '/utr-tracker/admin',
    '/utr-tracker/admin/:path*',
  ],
}
