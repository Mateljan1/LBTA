import { NextResponse } from 'next/server'

/**
 * @deprecated JTT has been replaced by UTR Circuit (Spring 2026).
 * All registrations now go through /api/register-year with registrationType: 'utr-circuit'.
 * This route returns 410 Gone to signal deprecation.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'JTT registration is no longer available. Please use the UTR Circuit registration at /programs/utr-match-play.',
    },
    { status: 410 }
  )
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'JTT registration is no longer available. Use /api/register-year with registrationType: "utr-circuit".',
    },
    { status: 410 }
  )
}
