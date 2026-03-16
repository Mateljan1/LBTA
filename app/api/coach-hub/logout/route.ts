import { NextRequest, NextResponse } from 'next/server'
import { buildCoachHubClearCookie } from '@/lib/coach-hub-auth-server'

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/coach-hub/login', request.url))
  res.headers.append('Set-Cookie', buildCoachHubClearCookie())
  return res
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.headers.append('Set-Cookie', buildCoachHubClearCookie())
  return res
}
