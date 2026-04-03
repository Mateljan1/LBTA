import { NextRequest, NextResponse } from 'next/server'
import { getEnvVar } from './env'
import {
  UTR_TRACKER_ADMIN_COOKIE_NAME,
  verifyUtrTrackerAdminCookie,
} from './utr-tracker-auth'

export async function requireUtrTrackerAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
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

  const cookieValue =
    request.cookies.get(UTR_TRACKER_ADMIN_COOKIE_NAME)?.value ?? ''
  if (!cookieValue) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const valid = await verifyUtrTrackerAdminCookie(secret, cookieValue)
  if (!valid) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  return null
}
