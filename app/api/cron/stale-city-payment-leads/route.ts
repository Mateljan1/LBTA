import { NextResponse } from 'next/server'
import { getStalePendingCityPaymentLeads } from '@/lib/stale-city-payment-leads'

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

  const url = new URL(request.url)
  const staleAfterHours = Number.parseInt(url.searchParams.get('hours') ?? '24', 10)
  const limit = Number.parseInt(url.searchParams.get('limit') ?? '200', 10)
  const report = await getStalePendingCityPaymentLeads({
    staleAfterHours: Number.isFinite(staleAfterHours) ? staleAfterHours : 24,
    limit: Number.isFinite(limit) ? limit : 200,
  })

  const count = report.rows.length
  if (report.error) {
    return NextResponse.json(
      { ok: false, staleAfterHours: report.staleAfterHours, count, error: report.error },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  if (count > 0) {
    const preview = report.rows
      .slice(0, 10)
      .map((row) => `${row.created_at} | ${row.email} | ${row.source}`)
      .join(' || ')
    console.warn(`[stale-city-payment-leads] count=${count} cutoff=${report.staleAfterHours}h | ${preview}`)
  } else {
    console.log(`[stale-city-payment-leads] clean (0 stale leads over ${report.staleAfterHours}h)`)
  }

  return NextResponse.json(
    {
      ok: true,
      staleAfterHours: report.staleAfterHours,
      count,
      rows: report.rows,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  )
}

export const GET = handle
export const POST = handle
export const maxDuration = 30

