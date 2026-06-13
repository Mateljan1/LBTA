import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await sb
    .from('leads')
    .select('created_at, source, email, name')
    .gte('created_at', since)
    .neq('source', 'health-canary')
    .order('created_at', { ascending: false })
    .limit(25)

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  console.log('=== Real leads (last 14 days, excl canary) ===')
  for (const r of data || []) {
    console.log(r.created_at.slice(0, 19), r.source.padEnd(18), r.email)
  }
  console.log('Count:', data?.length ?? 0)

  const probe = await sb
    .from('leads')
    .select('id, created_at, email')
    .ilike('email', 'lead-check-urgent%')
    .eq('source', 'book')
    .order('created_at', { ascending: false })
    .limit(3)
  console.log('\n=== lead-check-urgent probe rows ===')
  for (const r of probe.data || []) console.log(r.created_at, r.email)
  console.log('Found:', probe.data?.length ?? 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
