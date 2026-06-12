import { NextResponse } from 'next/server'
import { getLeadFunnelSummary } from '@/lib/lead-funnel-summary'

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
  const windowHours = Number.parseInt(url.searchParams.get('hours') ?? '24', 10)
  const summary = await getLeadFunnelSummary(Number.isFinite(windowHours) ? windowHours : 24)
  const ok = !summary.error

  if (ok) {
    console.log(
      `[lead-funnel-summary] window=${summary.windowHours}h new=${summary.counts.newLeads} pending24=${summary.counts.pendingCityPaymentOver24h} pending72=${summary.counts.pendingCityPaymentOver72h}`
    )
  } else {
    console.error('[lead-funnel-summary] failed:', summary.error)
  }

  return NextResponse.json(
    { ok, ...summary },
    { status: ok ? 200 : 500, headers: { 'Cache-Control': 'no-store' } }
  )
}

export const GET = handle
export const maxDuration = 30

