import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { syncContactToGHL } from '@/lib/gohighlevel'

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || !authHeader) return false
  const expected = `Bearer ${secret}`
  if (authHeader.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < authHeader.length; i++) {
    diff |= authHeader.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

function skipEmail(email: string): boolean {
  const e = email.toLowerCase()
  if (!e.includes('@')) return true
  if (e.endsWith('@chat.lbta.local') || e === 'test@fb.com') return true
  if (e.includes('health-canary') || e.includes('lead-check') || e.includes('smoke-test'))
    return true
  return false
}

function splitName(name: string | null): { firstName?: string; lastName?: string } {
  if (!name?.trim()) return {}
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

/**
 * One-time (or manual) backfill: April–May 2026 Supabase leads → GHL + workflow.
 * Auth: Bearer CRON_SECRET (same as other cron routes).
 * Query: ?dryRun=1 to list only; default runs sync.
 */
async function handle(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!isAuthorized(authHeader)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const dryRun = url.searchParams.get('dryRun') === '1'

  const sbUrl = process.env.SUPABASE_URL
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!sbUrl || !sbKey) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 })
  }

  const sb = createClient(sbUrl, sbKey, { auth: { persistSession: false } })
  const { data, error } = await sb
    .from('leads')
    .select('created_at, source, email, name, phone')
    .gte('created_at', '2026-04-01T00:00:00Z')
    .lt('created_at', '2026-06-01T00:00:00Z')
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const byEmail = new Map<string, (typeof data)[0]>()
  for (const row of data ?? []) {
    if (skipEmail(row.email)) continue
    if (row.source === 'meta-lead-ad') continue
    byEmail.set(row.email.toLowerCase(), row)
  }

  const leads = [...byEmail.values()]
  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      count: leads.length,
      emails: leads.map((l) => ({ email: l.email, date: l.created_at.slice(0, 10), source: l.source })),
    })
  }

  let workflowEnrolled = 0
  let contacts = 0
  const failures: string[] = []
  for (const row of leads) {
    const { firstName, lastName } = splitName(row.name)
    try {
      const result = await syncContactToGHL({
        email: row.email,
        firstName,
        lastName,
        phone: row.phone?.trim() || undefined,
        tags: ['Website Lead', 'Backfill Apr-May 2026', `Source: ${row.source}`],
      })
      if (result.contactId) contacts++
      if (result.workflowEnrolled) workflowEnrolled++
      else if (result.contactId) failures.push(`${row.email}: workflow not enrolled`)
      else failures.push(`${row.email}: no contact id`)
    } catch (err) {
      failures.push(`${row.email}: ${err instanceof Error ? err.message : String(err)}`)
    }
    await new Promise((r) => setTimeout(r, 400))
  }

  return NextResponse.json({
    ok: failures.length === 0,
    contacts,
    workflowEnrolled,
    total: leads.length,
    failures: failures.slice(0, 25),
  })
}

export const GET = handle
export const POST = handle
export const maxDuration = 60
