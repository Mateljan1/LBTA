import { NextResponse } from 'next/server'
import { runLeadCanary } from '@/lib/leads-canary'

/**
 * Cron endpoint: lead-pipeline canary.
 *
 * Runs every 6 hours (see vercel.json) and silently verifies the conversion
 * path is alive — Supabase write + readback + Postmark token validity.
 *
 * Auth model: same as `/api/cron/mirror-meta-leads` — `Authorization: Bearer
 * ${CRON_SECRET}`, constant-time-ish compare. Vercel cron auto-includes the
 * header on Pro+ plans.
 *
 * Returns: JSON summary `{ ok, email, steps, totalDurationMs }`. A non-`ok`
 * response shows up in Vercel logs and on the Crons dashboard, surfacing
 * silent breaks (token rotation, Supabase auth failure, etc.) within 6h.
 *
 * Synthetic rows use `source: 'health-canary'` and are filtered out of the
 * Coach Hub leads view (see `lib/leads-query.ts::getAllLeads`).
 *
 * Why this exists: 2026-05-13 — silent 13-day drought of website leads with
 * no automated detection. See `plans/2026-05-13-lead-pipeline-resilience-plan.md`.
 */

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  if (!authHeader) return false
  const expected = `Bearer ${secret}`
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

  const result = await runLeadCanary()
  const status = result.ok ? 200 : 503
  if (!result.ok) {
    const failed = result.steps.filter((s) => !s.ok).map((s) => `${s.step}: ${s.detail}`)
    console.error('[leads-canary] FAILED:', failed.join(' | '))
  }
  return NextResponse.json(result, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export const GET = handle
export const POST = handle

// 30s budget: cold start (1–3s) + Supabase write (~500ms) + readback poll (up
// to 5s) + Postmark fetch (~500ms) + prune (~100ms). Default 10s would risk
// spurious cron failures on cold starts. Mirror-meta-leads uses 60s.
export const maxDuration = 30
