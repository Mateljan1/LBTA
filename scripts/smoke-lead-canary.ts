/**
 * smoke-leads — manual end-to-end probe of the lead pipeline.
 *
 * Modes:
 *   default → runs the same canary logic as the cron (Supabase write + readback
 *             + Postmark token ping). Silent: no AC / Notion / Postmark / GHL.
 *   --full  → ALSO POSTs to a deployed /api/book and verifies a real lead
 *             flows through every integration. Use before shipping a change
 *             that touches any form path. NOTE: --full creates real AC contact
 *             + Postmark email + Notion page; use sparingly.
 *
 * Production safety: --full against a production-looking URL refuses to run
 * without `SMOKE_CONFIRM_PROD=yes` to prevent accidental dev-machine pollution
 * of AC + Postmark + Notion with synthetic contacts.
 *
 * Env source: reads .env.local (no dotenv dep) so the script is portable.
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more pipeline steps failed
 *   2 — env not configured (missing SUPABASE_URL / POSTMARK_SERVER_TOKEN)
 *   3 — refused: --full + production URL without SMOKE_CONFIRM_PROD=yes
 *
 * Usage:
 *   npm run smoke:lead-canary
 *   SMOKE_BASE_URL=http://localhost:3000 npm run smoke:lead-canary -- --full
 *   SMOKE_CONFIRM_PROD=yes npm run smoke:lead-canary -- --full   # against prod
 */

import { readFileSync, existsSync } from 'node:fs'
import { runLeadCanary } from '../lib/leads-canary'

loadDotEnvLocal()

const args = process.argv.slice(2)
const fullMode = args.includes('--full')
const baseUrl = process.env.SMOKE_BASE_URL ?? 'https://lagunabeachtennisacademy.com'

function looksLikeProduction(url: string): boolean {
  return /lagunabeachtennisacademy\.com$/i.test(new URL(url).host)
}

async function main(): Promise<number> {
  console.log('🔍 LBTA lead-pipeline smoke test')
  console.log(`   mode: ${fullMode ? 'FULL (POST /api/book + integrations)' : 'CANARY (Supabase + Postmark token)'}`)
  console.log(`   target: ${baseUrl}`)
  console.log()

  if (fullMode && looksLikeProduction(baseUrl) && process.env.SMOKE_CONFIRM_PROD !== 'yes') {
    console.error('❌ Refusing to run --full against a production URL without explicit confirmation.')
    console.error('   This would create a real ActiveCampaign contact, Notion page, and Postmark email.')
    console.error('   Re-run with: SMOKE_CONFIRM_PROD=yes npm run smoke:lead-canary -- --full')
    return 3
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    return 2
  }
  if (!process.env.POSTMARK_SERVER_TOKEN) {
    console.error('❌ Missing POSTMARK_SERVER_TOKEN in .env.local')
    return 2
  }

  const canary = await runLeadCanary()
  printCanary(canary)
  if (!canary.ok) return 1

  if (!fullMode) {
    console.log()
    console.log('🟢 Canary passed.')
    console.log('   Run with --full to also POST a real lead through /api/book (non-prod by default).')
    return 0
  }

  console.log()
  console.log(`📨 FULL: POST ${baseUrl}/api/book ...`)
  const ok = await postFullProbe(baseUrl)
  if (!ok) return 1

  console.log()
  console.log('🟢 Full smoke passed. Real lead created — please clean up in AC / Notion / Coach Hub.')
  return 0
}

function printCanary(result: { ok: boolean; email: string; steps: Array<{ step: string; ok: boolean; durationMs: number; detail?: string }>; totalDurationMs: number }) {
  for (const s of result.steps) {
    const icon = s.ok ? '✅' : '❌'
    const detail = s.detail ? `  — ${s.detail}` : ''
    console.log(`${icon} ${s.step.padEnd(22)} ${String(s.durationMs).padStart(4)}ms${detail}`)
  }
  console.log(`   probe email: ${result.email}`)
  console.log(`   total: ${result.totalDurationMs}ms`)
}

async function postFullProbe(base: string): Promise<boolean> {
  const ts = Date.now()
  const body = {
    firstName: 'SmokeFull',
    lastName: 'Probe',
    email: `smoke-full-probe+${ts}@lagunabeachtennisacademy.com`,
    phone: '9495340457',
    program: 'not-sure',
    experience: 'Automated full smoke probe — please ignore.',
    source: 'smoke-leads-cli',
  }
  const start = Date.now()
  try {
    const res = await fetch(`${base}/api/book`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }
    const ms = Date.now() - start
    if (res.ok && json.success) {
      console.log(`✅ POST /api/book          ${String(ms).padStart(4)}ms  — HTTP ${res.status}, success`)
      return true
    }
    console.error(`❌ POST /api/book          ${String(ms).padStart(4)}ms  — HTTP ${res.status}: ${json.error ?? 'unknown'}`)
    return false
  } catch (err) {
    console.error(`❌ POST /api/book          — ${err instanceof Error ? err.message : err}`)
    return false
  }
}

function loadDotEnvLocal() {
  const p = '.env.local'
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    const [, k, vRaw] = m
    if (process.env[k] === undefined) {
      process.env[k] = vRaw.replace(/^["']|["']$/g, '')
    }
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
