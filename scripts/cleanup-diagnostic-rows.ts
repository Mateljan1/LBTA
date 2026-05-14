/**
 * One-shot cleanup for synthetic probe rows in Supabase that pre-date the
 * `health-canary` source (so they were not auto-filtered out of Coach Hub).
 *
 * Targets emails matching the diagnostic patterns we used during the 2026-05-13
 * lead-pipeline incident:
 *   - diag-probe+*@lagunabeachtennisacademy.com
 *   - health-probe+*@lagunabeachtennisacademy.com
 *   - browser-diag-test+*@lagunabeachtennisacademy.com
 *   - mobile-smoke-test+*@lagunabeachtennisacademy.com
 *   - mobile-smoke-contact+*@lagunabeachtennisacademy.com
 *   - mobile-smoke-newsletter+*@lagunabeachtennisacademy.com
 *
 * Future probes use `source = 'health-canary'` and are filtered by
 * `lib/leads-query.ts::getAllLeads`, so this script is a one-off — not part
 * of the recurring canary.
 *
 * Usage:
 *   npx tsx scripts/cleanup-diagnostic-rows.ts            # dry-run (default)
 *   npx tsx scripts/cleanup-diagnostic-rows.ts --apply    # actually delete
 */

import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (!m) continue
  const [, k, v] = m
  if (process.env[k] === undefined) process.env[k] = v.replace(/^["']|["']$/g, '')
}

const PATTERNS = [
  'diag-probe+%@lagunabeachtennisacademy.com',
  'health-probe+%@lagunabeachtennisacademy.com',
  'browser-diag-test+%@lagunabeachtennisacademy.com',
  'mobile-smoke-test+%@lagunabeachtennisacademy.com',
  'mobile-smoke-contact+%@lagunabeachtennisacademy.com',
  'mobile-smoke-newsletter+%@lagunabeachtennisacademy.com',
]

const apply = process.argv.includes('--apply')

async function main() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    process.exit(2)
  }
  const sb = createClient(url, key, { auth: { persistSession: false } })

  for (const pattern of PATTERNS) {
    const { data, error } = await sb
      .from('leads')
      .select('id, created_at, email')
      .ilike('email', pattern)
    if (error) {
      console.error(`[${pattern}] query failed:`, error.message)
      continue
    }
    console.log(`[${pattern}] ${data.length} match(es)`)
    for (const r of data) {
      console.log(`  - ${(r.created_at as string).slice(0, 19)}  ${r.email}`)
    }
    if (apply && data.length > 0) {
      const { error: delErr } = await sb.from('leads').delete().ilike('email', pattern)
      if (delErr) console.error(`  delete failed: ${delErr.message}`)
      else console.log(`  ✓ deleted ${data.length} rows`)
    }
  }

  if (!apply) {
    console.log('\nDRY RUN — re-run with --apply to delete.')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
