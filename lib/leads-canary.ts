/**
 * Lead-pipeline canary — shared logic for the cron route + manual smoke script.
 *
 * What it verifies (silently — no side effects on CRM or email systems):
 *   1. Supabase write path (storeLead → row appears in `leads` table)
 *   2. Supabase read path (we can fetch the row back within READ_TIMEOUT_MS)
 *   3. Mailchimp API reachability (GET /ping returns healthy)
 *
 * What it does NOT verify (intentionally):
 *   - The `/api/book` route handler logic. That belongs in a separate "full"
 *     smoke that runs pre-deploy, not on a cron — to avoid polluting Mailchimp
 *     audience with synthetic traffic 4× per day.
 *   - Frontend form rendering. That is a Playwright job.
 *
 * The `health-canary` source is filtered out of Coach Hub views by
 * `lib/leads-query.ts::getAllLeads`, so synthetic rows do not pollute the UI.
 *
 * Why this exists: 2026-05-13 — silent 13-day drought of website leads with
 * no automated detection. We had no canary on the conversion path.
 * Updated 2026-06-12: replaced Postmark + GHL steps with Mailchimp ping.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { pingMailchimp } from './mailchimp'

export const HEALTH_CANARY_SOURCE = 'health-canary'
const HEALTH_CANARY_EMAIL_PREFIX = 'health-canary+'

/** Time we wait for the Supabase row to be readable after insert. */
const READ_TIMEOUT_MS = 5000
const READ_POLL_MS = 250

/**
 * Prune canary rows older than this. Keeps the table from growing forever
 * (~1,460 rows/year at 4/day). 7 days is plenty of history to investigate
 * any past Vercel cron failure.
 */
const PRUNE_OLDER_THAN_DAYS = 7

export type CanaryStepResult = {
  step: string
  ok: boolean
  durationMs: number
  detail?: string
}

export type CanaryResult = {
  ok: boolean
  email: string
  steps: CanaryStepResult[]
  totalDurationMs: number
}

/**
 * Run the full canary. Safe to call from a Vercel cron route or a local
 * script — does not need a network round-trip to /api/book.
 *
 * The Supabase write goes directly through the supabase-js client (NOT
 * through `lib/leads-store.ts::storeLead`) because storeLead is intentionally
 * fire-and-forget and swallows insert errors via console.error. The canary
 * needs insert failures to surface so revoked service-role keys / RLS
 * regressions / dedup-window collisions show up as a failed step.
 */
export async function runLeadCanary(): Promise<CanaryResult> {
  const start = Date.now()
  const ts = Date.now()
  const email = `${HEALTH_CANARY_EMAIL_PREFIX}${ts}@lagunabeachtennisacademy.com`
  const steps: CanaryStepResult[] = []

  const sb = getCanaryClient()

  steps.push(await runStep('supabase-write', async () => {
    if (!sb) throw new Error('SUPABASE_URL / SERVICE_ROLE_KEY not set')
    const { error } = await sb.from('leads').insert({
      source: HEALTH_CANARY_SOURCE,
      email,
      name: 'Health Canary',
      payload: { ts, runner: 'leads-canary' },
    })
    if (error) throw new Error(`insert failed: ${error.message}`)
    return 'inserted'
  }))

  steps.push(await runStep('supabase-readback', async () => {
    if (!sb) throw new Error('SUPABASE_URL / SERVICE_ROLE_KEY not set')
    const deadline = Date.now() + READ_TIMEOUT_MS
    while (Date.now() < deadline) {
      const { data, error } = await sb
        .from('leads')
        .select('id, source, email')
        .eq('email', email)
        .eq('source', HEALTH_CANARY_SOURCE)
        .limit(1)
        .maybeSingle()
      if (error) throw new Error(`readback query failed: ${error.message}`)
      if (data) return `row id ${data.id}`
      await sleep(READ_POLL_MS)
    }
    throw new Error(`row not visible within ${READ_TIMEOUT_MS}ms`)
  }))

  steps.push(await runStep('mailchimp-ping', async () => {
    const result = await pingMailchimp()
    if (!result.ok) throw new Error(result.detail)
    return result.detail
  }))

  // Best-effort prune of old canary rows so the table doesn't grow forever.
  // Failure here is logged but doesn't fail the overall canary — pruning is
  // hygiene, not a health signal.
  steps.push(await runStep('prune-old-canary-rows', async () => {
    if (!sb) throw new Error('SUPABASE_URL / SERVICE_ROLE_KEY not set')
    const cutoff = new Date(Date.now() - PRUNE_OLDER_THAN_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const { count, error } = await sb
      .from('leads')
      .delete({ count: 'exact' })
      .eq('source', HEALTH_CANARY_SOURCE)
      .lt('created_at', cutoff)
    if (error) throw new Error(`prune failed: ${error.message}`)
    return `deleted ${count ?? 0} rows older than ${PRUNE_OLDER_THAN_DAYS}d`
  }))

  // Treat the optional prune step as non-blocking for overall ok/fail.
  const blockingSteps = steps.filter((s) => s.step !== 'prune-old-canary-rows')

  return {
    ok: blockingSteps.every((s) => s.ok),
    email,
    steps,
    totalDurationMs: Date.now() - start,
  }
}

/**
 * Builds a fresh Supabase client per canary run rather than reusing the cached
 * `getClient()` from `lib/leads-store.ts`. This is intentional — the canary
 * exists to verify env access is healthy, so we shouldn't use a client that
 * was instantiated at module load time and might be referencing a stale (or
 * since-rotated) cached connection. Don't "simplify" by importing `getClient`.
 */
function getCanaryClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

async function runStep(
  name: string,
  fn: () => Promise<string>
): Promise<CanaryStepResult> {
  const start = Date.now()
  try {
    const detail = await fn()
    return { step: name, ok: true, durationMs: Date.now() - start, detail }
  } catch (err) {
    return {
      step: name,
      ok: false,
      durationMs: Date.now() - start,
      detail: err instanceof Error ? err.message : String(err),
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
