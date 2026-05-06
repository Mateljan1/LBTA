import { NextResponse } from 'next/server'
import { mirrorMetaLeadsToSupabase, DEFAULT_SCAN_WINDOW_MS } from '@/lib/meta-leads-mirror'

/**
 * Cron endpoint: pull Meta lead-ad rows from Notion → Supabase.
 *
 * Auth model: requires `Authorization: Bearer ${CRON_SECRET}` header.
 * Vercel cron auto-includes this header on Pro+ plans. On Hobby plans, an
 * external scheduler (cron-job.org, GitHub Actions) can hit this endpoint
 * with the same header.
 *
 * Schedule: defined in vercel.json (`crons` array). Daily at 03:00 PT
 * (= 10:00 UTC) so we don't conflict with peak traffic.
 *
 * Returns: JSON summary `{ scanned, metaLeads, inserted, skipped, errors,
 * errorMessages }` for observability.
 */

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  if (!authHeader) return false
  const expected = `Bearer ${secret}`
  // Constant-time-ish compare via length + char loop to avoid early-exit
  // timing leaks on the secret length.
  if (authHeader.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < authHeader.length; i++) {
    diff |= authHeader.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

async function handle(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!isAuthorized(authHeader)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  // Optional `?windowHours=` override for backfill / manual runs.
  const url = new URL(request.url)
  const windowHoursRaw = url.searchParams.get('windowHours')
  const windowHours = windowHoursRaw ? parseInt(windowHoursRaw, 10) : null
  const sinceMs =
    Number.isFinite(windowHours) && windowHours! > 0
      ? windowHours! * 60 * 60 * 1000
      : DEFAULT_SCAN_WINDOW_MS

  const summary = await mirrorMetaLeadsToSupabase({ sinceMs })
  return NextResponse.json(
    { ok: summary.errors === 0, ...summary, windowHours: sinceMs / 3_600_000 },
    { status: summary.errors === 0 ? 200 : 207, headers: { 'Cache-Control': 'no-store' } }
  )
}

// Vercel cron POSTs by default; allow GET for manual smoke testing.
export const POST = handle
export const GET = handle

// Allow up to 60s — Notion pagination + Supabase inserts can take a moment.
export const maxDuration = 60
