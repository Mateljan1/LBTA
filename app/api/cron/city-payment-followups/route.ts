import { NextResponse } from 'next/server'
import { runCityPaymentFollowupAutomation } from '@/lib/city-payment-followups'

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
  const dryRun = (url.searchParams.get('dryRun') ?? '1') !== '0'
  const t2 = Number.parseInt(url.searchParams.get('tier2h') ?? '2', 10)
  const t24 = Number.parseInt(url.searchParams.get('tier24h') ?? '24', 10)
  const t72 = Number.parseInt(url.searchParams.get('tier72h') ?? '72', 10)
  const limit = Number.parseInt(url.searchParams.get('limit') ?? '500', 10)

  const summary = await runCityPaymentFollowupAutomation({
    dryRun,
    limit: Number.isFinite(limit) ? limit : 500,
    thresholds: {
      tier2h: Number.isFinite(t2) ? t2 : 2,
      tier24h: Number.isFinite(t24) ? t24 : 24,
      tier72h: Number.isFinite(t72) ? t72 : 72,
    },
    owners: {
      tier2hOwnerTag: process.env.FOLLOWUP_TIER_2H_OWNER_TAG ?? 'City Payment Owner - Front Desk',
      tier24hOwnerTag: process.env.FOLLOWUP_TIER_24H_OWNER_TAG ?? 'City Payment Owner - Enrollment',
      tier72hOwnerTag: process.env.FOLLOWUP_TIER_72H_OWNER_TAG ?? 'City Payment Owner - Director',
    },
  })

  const ok = !summary.error
  if (ok) {
    console.log(
      `[city-payment-followups] dryRun=${dryRun} total=${summary.totalCandidates} t2=${summary.byTier['2h']} t24=${summary.byTier['24h']} t72=${summary.byTier['72h']}`
    )
  } else {
    console.error('[city-payment-followups] failed:', summary.error)
  }

  return NextResponse.json({ ok, ...summary }, { status: ok ? 200 : 500, headers: { 'Cache-Control': 'no-store' } })
}

export const GET = handle
export const POST = handle
export const maxDuration = 30
