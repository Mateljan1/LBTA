import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

async function main() {
  const staleAfterHours = Number.parseInt(process.env.STALE_AFTER_HOURS ?? '24', 10)
  const sbUrl = process.env.SUPABASE_URL
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!sbUrl || !sbKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  const supabase = createClient(sbUrl, sbKey, { auth: { persistSession: false } })
  const cutoffIso = new Date(Date.now() - staleAfterHours * 60 * 60 * 1000).toISOString()
  const allowedSources = ['book', 'register', 'register-program', 'register-year']

  const { data, error } = await supabase
    .from('leads')
    .select('created_at, source, email, name')
    .in('source', allowedSources)
    .contains('payload', { workflow: { cityPaymentStatus: 'pending_city_payment' } })
    .lte('created_at', cutoffIso)
    .order('created_at', { ascending: true })
    .limit(500)

  if (error) throw new Error(error.message)

  const rows = data ?? []
  console.log(`=== Stale pending city payment leads (> ${staleAfterHours}h) ===`)
  if (rows.length === 0) {
    console.log('None')
    return
  }

  for (const row of rows) {
    console.log(`${row.created_at} | ${row.source.padEnd(16)} | ${row.email} | ${row.name ?? '—'}`)
  }
  console.log(`Total: ${rows.length}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

