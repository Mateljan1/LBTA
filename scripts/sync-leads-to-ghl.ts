/**
 * Backfill Supabase leads into GHL (create contact + add to workflow).
 * Usage:
 *   GHL_API_KEY=... GHL_LOCATION_ID=... GHL_WORKFLOW_ID=... \
 *     npx tsx scripts/sync-leads-to-ghl.ts [--from 2026-04-01] [--dry-run]
 *
 * Skips: health-canary, chat@, test@fb.com, obvious test emails.
 * Dedupes by email (case-insensitive); keeps earliest created_at per email.
 */

import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const GHL_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const dryRun = process.argv.includes('--dry-run')
const fromArg = process.argv.find((a) => a.startsWith('--from='))
const fromDate = fromArg?.split('=')[1] || '2026-04-01T00:00:00Z'

function skipEmail(email: string): boolean {
  const e = email.toLowerCase()
  if (!e || !e.includes('@')) return true
  if (e.includes('health-canary') || e.includes('lead-check') || e.includes('smoke-test'))
    return true
  if (e.endsWith('@chat.lbta.local')) return true
  if (e === 'test@fb.com') return true
  if (e.includes('newsletter-check+')) return true
  return false
}

function splitName(name: string | null): { firstName?: string; lastName?: string } {
  if (!name?.trim()) return {}
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

async function ghlHeaders(): Promise<Record<string, string>> {
  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) throw new Error('GHL_API_KEY missing')
  const h: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: GHL_VERSION,
  }
  return h
}

async function searchContact(email: string): Promise<string | null> {
  const locationId = process.env.GHL_LOCATION_ID!
  const q = new URLSearchParams({ locationId, query: email.trim() })
  const res = await fetch(`${GHL_BASE}/contacts/?${q}`, { headers: await ghlHeaders() })
  if (!res.ok) return null
  const data = (await res.json()) as { contacts?: Array<{ id?: string; email?: string }> }
  const hit = data.contacts?.find((c) => c.email?.toLowerCase() === email.toLowerCase())
  return hit?.id ?? null
}

async function createContact(payload: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
}): Promise<string | null> {
  const locationId = process.env.GHL_LOCATION_ID!
  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: await ghlHeaders(),
    body: JSON.stringify({
      locationId,
      email: payload.email.trim(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      tags: payload.tags ?? ['Website Lead', 'Backfill 2026-04-05'],
    }),
  })
  if (res.ok) {
    const data = (await res.json()) as { contact?: { id?: string }; id?: string }
    return data.contact?.id ?? data.id ?? null
  }
  if (res.status === 422) {
    return searchContact(payload.email)
  }
  const text = await res.text()
  console.error(`  create failed ${res.status}: ${text.slice(0, 120)}`)
  return null
}

async function addToWorkflow(contactId: string): Promise<boolean> {
  const workflowId = process.env.GHL_WORKFLOW_ID!
  const res = await fetch(
    `${GHL_BASE}/contacts/${encodeURIComponent(contactId)}/workflow/${encodeURIComponent(workflowId)}`,
    { method: 'POST', headers: await ghlHeaders() }
  )
  return res.ok
}

async function main() {
  for (const k of ['GHL_API_KEY', 'GHL_LOCATION_ID', 'GHL_WORKFLOW_ID', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
    if (!process.env[k]) {
      console.error(`Missing ${k}`)
      process.exit(1)
    }
  }

  const ping = await fetch(`${GHL_BASE}/locations/${process.env.GHL_LOCATION_ID}`, {
    headers: await ghlHeaders(),
  })
  if (!ping.ok) {
    console.error(`GHL auth failed: HTTP ${ping.status}. Rotate GHL_API_KEY in Vercel first.`)
    process.exit(1)
  }
  console.log('GHL auth OK')

  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })

  const { data, error } = await sb
    .from('leads')
    .select('created_at, source, email, name, phone, payload')
    .gte('created_at', fromDate)
    .lt('created_at', '2026-06-01T00:00:00Z')
    .order('created_at', { ascending: true })

  if (error) {
    console.error(error.message)
    process.exit(1)
  }

  const byEmail = new Map<string, (typeof data)[0]>()
  for (const row of data ?? []) {
    if (skipEmail(row.email)) continue
    const key = row.email.toLowerCase()
    if (!byEmail.has(key)) byEmail.set(key, row)
  }

  const leads = [...byEmail.values()]
  console.log(`Syncing ${leads.length} unique emails (dry-run=${dryRun})`)

  let created = 0
  let workflow = 0
  let failed = 0

  for (const row of leads) {
    const { firstName, lastName } = splitName(row.name)
    const phone = row.phone?.trim() || undefined
    const payload = (row.payload as Record<string, unknown>) || {}
    const program =
      (typeof payload.program === 'string' ? payload.program : null) ||
      row.source

    console.log(`\n${row.created_at.slice(0, 10)} ${row.email} (${program})`)
    if (dryRun) continue

    let contactId = await searchContact(row.email)
    if (!contactId) {
      contactId = await createContact({
        email: row.email,
        firstName,
        lastName,
        phone,
        tags: ['Website Lead', `Source: ${row.source}`],
      })
      if (contactId) created++
    } else {
      console.log('  exists in GHL')
    }

    if (contactId) {
      const ok = await addToWorkflow(contactId)
      if (ok) workflow++
      else {
        failed++
        console.log('  workflow enroll failed')
      }
    } else {
      failed++
    }

    await new Promise((r) => setTimeout(r, 350))
  }

  console.log(`\nDone. created=${created} workflow=${workflow} failed=${failed}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
