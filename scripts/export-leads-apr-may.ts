import { readFileSync, existsSync, writeFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })

  const { data, error } = await sb
    .from('leads')
    .select('id, created_at, source, email, name, phone, payload')
    .gte('created_at', '2026-04-01T00:00:00Z')
    .lt('created_at', '2026-06-01T00:00:00Z')
    .neq('source', 'health-canary')
    .not('email', 'ilike', '%health-canary%')
    .not('email', 'ilike', '%lead-check%')
    .not('email', 'ilike', '%smoke-test%')
    .not('email', 'ilike', '%canary%')
    .order('created_at', { ascending: true })

  if (error) {
    console.error(error.message)
    process.exit(1)
  }

  const rows = data ?? []
  writeFileSync('docs/leads-export-2026-04-05.json', JSON.stringify(rows, null, 2))
  console.log('Total:', rows.length)
  console.log('Written: docs/leads-export-2026-04-05.json\n')

  const byMonth: Record<string, typeof rows> = { '2026-04': [], '2026-05': [] }
  for (const r of rows) {
    const m = r.created_at.slice(0, 7)
    if (byMonth[m]) byMonth[m].push(r)
  }

  for (const [month, list] of Object.entries(byMonth)) {
    console.log(`\n=== ${month} (${list.length} leads) ===`)
    for (const r of list) {
      const dt = r.created_at.slice(0, 16).replace('T', ' ')
      const name = (r.name as string) || '—'
      const phone = (r.phone as string) || '—'
      const payload = (r.payload as Record<string, unknown>) || {}
      const prog =
        (typeof payload.program === 'string' ? payload.program : null) ||
        (typeof payload.form === 'string' ? payload.form : null) ||
        (r.source as string)
      console.log(`${dt} | ${prog.padEnd(20)} | ${name.padEnd(22)} | ${r.email}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
