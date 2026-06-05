import { NextResponse } from 'next/server'

/**
 * GHL backfill cron — retired.
 * GHL has been removed from the lead pipeline. This route is a no-op stub
 * kept to avoid 404s from any existing cron schedules while they are cleaned up.
 */
export async function GET() {
  return NextResponse.json({ ok: true, message: 'GHL backfill retired — no-op.' })
}

export async function POST() {
  return NextResponse.json({ ok: true, message: 'GHL backfill retired — no-op.' })
}
