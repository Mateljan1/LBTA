import { readFileSync, existsSync, writeFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

function skipEmail(email: string): boolean {
  const e = email.toLowerCase()
  if (e.endsWith('@chat.lbta.local')) return true
  if (e === 'test@fb.com') return true
  if (e.includes('health-canary') || e.includes('lead-check') || e.includes('smoke-test'))
    return true
  if (e.includes('newsletter-check+')) return true
  return false
}

function isMetaBulk(row: { source: string; created_at: string }, all: typeof row[]): boolean {
  if (row.source !== 'meta-lead-ad') return false
  const t = new Date(row.created_at).getTime()
  const sameSecond = all.filter(
    (r) => r.source === 'meta-lead-ad' && Math.abs(new Date(r.created_at).getTime() - t) < 2000
  )
  return sameSecond.length > 10
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
  const all = data ?? []

  const website = all.filter((r) => !skipEmail(r.email) && !isMetaBulk(r, all))
  const metaOnly = all.filter((r) => r.source === 'meta-lead-ad' && !skipEmail(r.email))
  const metaUnique = [...new Map(metaOnly.map((r) => [r.email.toLowerCase(), r])).values()]

  const lines: string[] = []
  lines.push('# LBTA leads — April & May 2026')
  lines.push('')
  lines.push('**Why these felt “missed”:** forms saved to Supabase + ActiveCampaign, but **staff email (Postmark) and GHL workflow alerts were broken** (401 tokens) until fixed.')
  lines.push('')
  lines.push(`## Website & form leads (action these) — **${website.length} submissions**`)
  lines.push('')
  lines.push('| Date | Source | Name | Email | Phone | Program / notes |')
  lines.push('|------|--------|------|-------|-------|-----------------|')

  for (const r of website) {
    const payload = (r.payload as Record<string, unknown>) || {}
    const prog =
      (typeof payload.program === 'string' ? payload.program : null) ||
      (typeof payload.interest === 'string' ? payload.interest : null) ||
      r.source
    const phone = (r.phone as string) || '—'
    const name = (r.name as string) || '—'
    lines.push(
      `| ${r.created_at.slice(0, 10)} | ${r.source} | ${name.replace(/\|/g, '/')} | ${r.email} | ${phone} | ${String(prog).replace(/\|/g, '/')} |`
    )
  }

  lines.push('')
  lines.push(`## Meta lead ads (May 6 bulk mirror) — **${metaUnique.length} unique emails**`)
  lines.push('')
  lines.push('These were ingested in one batch from Notion/Meta sync, not live website forms. Full list in `docs/leads-export-2026-04-05.json`.')
  lines.push('')
  lines.push('## Duplicates to note')
  lines.push('- **paulinen88@gmail.com** — May 17 + May 21 (same family, follow up once)')
  lines.push('- **Ryan Hanley** — book + adult-beginner same minute Apr 21')
  lines.push('- **Sarah Burns** — youth-development twice Apr 23')
  lines.push('- **sophie@sendproud.com** — possible vendor/spam (3× in April)')

  const out = 'docs/leads-missed-apr-may-2026.md'
  writeFileSync(out, lines.join('\n') + '\n')
  console.log('Wrote', out, 'website rows:', website.length)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
