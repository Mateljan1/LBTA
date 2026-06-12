import { NextResponse } from 'next/server'
import { findPendingCityPaymentMatches, markCityPaidForEmails } from '@/lib/city-payment-workflow'

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || !authHeader) return false
  const expected = `Bearer ${secret}`
  if (authHeader.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < authHeader.length; i++) {
    diff |= authHeader.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

async function handle(request: Request) {
  if (!isAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    emails?: string[]
    dryRun?: boolean
  }
  const emails = Array.isArray(body.emails) ? body.emails : []
  const dryRun = body.dryRun === true

  if (emails.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Provide non-empty emails array.' },
      { status: 400 }
    )
  }

  if (dryRun) {
    const summary = await findPendingCityPaymentMatches(emails)
    return NextResponse.json(
      {
        ok: !summary.error,
        dryRun: true,
        ...summary,
      },
      { status: summary.error ? 500 : 200, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const summary = await markCityPaidForEmails(emails)
  const ok = !summary.error
  if (ok) {
    console.log(
      `[city-payment-sync] updated=${summary.updatedLeadIds.length} requested=${summary.requestedEmails.length} skipped=${summary.skippedEmails.length}`
    )
  } else {
    console.error('[city-payment-sync] failed:', summary.error)
  }

  return NextResponse.json(
    { ok, dryRun: false, ...summary },
    { status: ok ? 200 : 500, headers: { 'Cache-Control': 'no-store' } }
  )
}

export const POST = handle
export const maxDuration = 30

