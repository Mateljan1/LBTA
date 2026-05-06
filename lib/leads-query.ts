/**
 * Server-only leads query — single source of truth for the /coach-hub/leads
 * page and its CSV export route. Reads from Supabase using the service role
 * key, which is never exposed to the client.
 */

import { getClient } from '@/lib/leads-store'

/** Row shape returned to UI. Keeps payload as `unknown` until callers read fields. */
export type LeadRow = {
  id: string
  created_at: string
  source: string
  email: string
  name: string | null
  phone: string | null
  payload: Record<string, unknown>
  notion_page_id: string | null
}

/** Channel buckets the UI groups by. Display label + filter logic. */
export const LEAD_CHANNELS = [
  { id: 'all', label: 'All channels' },
  { id: 'trial', label: 'Trial bookings' },
  { id: 'private', label: 'Private lessons' },
  { id: 'program', label: 'Program registration' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'scholarship', label: 'Scholarship' },
  { id: 'meta', label: 'Meta lead ad' },
  { id: 'chat', label: 'Chatbot' },
] as const

export type ChannelId = (typeof LEAD_CHANNELS)[number]['id']

export function isValidChannel(value: string | undefined | null): value is ChannelId {
  if (!value) return false
  return LEAD_CHANNELS.some((c) => c.id === value)
}

/**
 * Returns true if the given lead row matches the requested channel filter.
 * Implemented in JS (not SQL) because some channels are payload-derived
 * (book + bookingType=private → 'private'); keeps the query simple.
 */
export function leadMatchesChannel(row: LeadRow, channel: ChannelId): boolean {
  if (channel === 'all') return true
  const src = row.source
  const isPrivate = src === 'book' && (row.payload as { bookingType?: string })?.bookingType === 'private'
  switch (channel) {
    case 'trial':
      return src === 'book' && !isPrivate
    case 'private':
      return isPrivate
    case 'program':
      return src === 'register' || src === 'register-program' || src === 'register-year'
    case 'newsletter':
      return src === 'newsletter'
    case 'scholarship':
      return src === 'scholarship'
    case 'meta':
      return src === 'meta-lead-ad'
    case 'chat':
      return src === 'chat'
    default:
      return false
  }
}

/**
 * Friendly source label for one row — same mapping used by the table and CSV.
 */
export function channelLabel(row: LeadRow): string {
  const src = row.source
  const payload = row.payload as { bookingType?: string }
  if (src === 'book' && payload?.bookingType === 'private') return 'Private Lesson Booking'
  if (src === 'book') return 'Trial Booking'
  if (src === 'register-program') return 'Program Registration'
  if (src === 'register-year') return 'Year Registration'
  if (src === 'register') return 'Registration'
  if (src === 'newsletter') return 'Newsletter'
  if (src === 'scholarship') return 'Scholarship'
  if (src === 'chat') return 'Chatbot Inquiry'
  if (src === 'meta-lead-ad') return 'Meta Lead Ad'
  return src
}

/**
 * Class / Program Interest — what the lead was looking at.
 */
export function programLabel(row: LeadRow): string {
  const src = row.source
  const payload = row.payload as { program?: string; bookingType?: string }
  if (src === 'book' && payload?.bookingType === 'private') return 'Private Lesson'
  if (payload?.program) return payload.program
  if (src === 'newsletter') return 'Newsletter Subscriber'
  if (src === 'scholarship') return 'Scholarship Application'
  if (src === 'chat') return 'Chatbot Inquiry'
  if (src === 'meta-lead-ad') return 'Meta Lead Ad'
  return '—'
}

/**
 * Fetch all leads from Supabase, ordered newest-first. Up to `limit` rows.
 * Returns empty array (not error) when Supabase env is not configured —
 * so the page renders an empty state instead of a 500.
 */
export async function getAllLeads(opts: { limit?: number } = {}): Promise<LeadRow[]> {
  const supabase = getClient()
  if (!supabase) return []

  const limit = opts.limit ?? 1000
  const { data, error } = await supabase
    .from('leads')
    .select('id, created_at, source, email, name, phone, payload, notion_page_id')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[leads-query] Fetch failed:', error.message)
    return []
  }
  return (data as LeadRow[]) ?? []
}

/**
 * Convert a leads list → CSV string with the same columns as the
 * Desktop export. Headers + RFC-4180 quoting.
 */
export function leadsToCsv(rows: LeadRow[]): string {
  const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Channel', 'Class / Program Interest', 'Details']
  const lines: string[] = [headers.join(',')]
  for (const r of rows) {
    const ts = r.created_at
    const date = ts.slice(0, 10)
    const time = ts.slice(11, 16)
    const details = formatDetails(r)
    lines.push(
      [date, time, r.name ?? '', r.email, r.phone ?? '', channelLabel(r), programLabel(r), details]
        .map(csvField)
        .join(',')
    )
  }
  return lines.join('\n') + '\n'
}

function formatDetails(row: LeadRow): string {
  const p = (row.payload || {}) as Record<string, unknown>
  const parts: string[] = []
  if (typeof p.coach === 'string') parts.push(`Coach: ${p.coach}`)
  if (typeof p.option === 'string' || typeof p.option === 'number') parts.push(`Option: ${p.option}`)
  if (typeof p.location === 'string') parts.push(`Location: ${p.location}`)
  if (typeof p.season === 'string') parts.push(`Season: ${p.season}`)
  if (typeof p.studentName === 'string') parts.push(`Student: ${p.studentName}`)
  if (typeof p.campaign === 'string') parts.push(`Campaign: ${p.campaign}`)
  if (typeof p.ad === 'string') parts.push(`Ad: ${p.ad}`)
  if (typeof p.form === 'string') parts.push(`Form: ${p.form}`)
  if (typeof p.platform === 'string') parts.push(`Platform: ${p.platform}`)
  if (typeof p.message === 'string') parts.push(`Message: ${p.message.slice(0, 200)}`)
  if (typeof p.pathname === 'string') parts.push(`Page: ${p.pathname}`)
  return parts.join(' | ')
}

function csvField(value: string | number | null | undefined): string {
  const s = value == null ? '' : String(value)
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}
