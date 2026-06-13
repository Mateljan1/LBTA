import { readFileSync, existsSync, writeFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

function skipEmail(email: string): boolean {
  const e = email.toLowerCase()
  if (e.endsWith('@chat.lbta.local') || e === 'test@fb.com') return true
  if (e.includes('health-canary') || e.includes('lead-check') || e.includes('smoke-test'))
    return true
  if (e.includes('newsletter-check+')) return true
  return false
}

function splitName(name: string | null): { first: string; last: string } {
  if (!name?.trim()) return { first: '', last: '' }
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })

  const { data, error } = await sb
    .from('leads')
    .select('created_at, source, email, name, phone, payload')
    .gte('created_at', '2026-04-01T00:00:00Z')
    .lt('created_at', '2026-06-01T00:00:00Z')
    .order('created_at', { ascending: true })

  if (error) throw error

  const byEmail = new Map<string, (typeof data)[0]>()
  for (const row of data ?? []) {
    if (skipEmail(row.email)) continue
    if (row.source === 'meta-lead-ad') continue
    const key = row.email.toLowerCase()
    if (!byEmail.has(key)) byEmail.set(key, row)
  }

  const header = 'First Name,Last Name,Email,Phone,Tags,Source,Submitted'
  const rows = [header]
  for (const r of byEmail.values()) {
    const { first, last } = splitName(r.name)
    const phone = (r.phone || '').replace(/,/g, '')
    const tags = `Website Lead;Backfill Apr-May 2026;${r.source}`
    rows.push(
      [
        `"${first.replace(/"/g, '""')}"`,
        `"${last.replace(/"/g, '""')}"`,
        r.email,
        phone,
        `"${tags}"`,
        r.source,
        r.created_at.slice(0, 10),
      ].join(',')
    )
  }

  const path = 'docs/ghl-import-apr-may-2026.csv'
  writeFileSync(path, rows.join('\n') + '\n')
  console.log(`Wrote ${path} (${byEmail.size} contacts)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
