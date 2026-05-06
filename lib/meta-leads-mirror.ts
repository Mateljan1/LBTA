/**
 * Meta lead-ad mirror — pulls Meta lead-ad rows from the Notion registrations
 * database into Supabase so the `leads` table becomes the unified source of
 * truth across all lead channels.
 *
 * Why: Meta (Facebook/Instagram) lead-ad forms write directly to Notion via
 * Zapier and never touch the website code path. Without this mirror, Supabase
 * is missing ~66% of leads (audit 2026-05-06: 86 / 251).
 *
 * Idempotency: keyed on the Notion page ID. Stored as `notion_page_id` on
 * the lead row + enforced by a unique partial index. Re-running the mirror is
 * safe.
 *
 * Trigger: Vercel cron (daily) → `/api/cron/mirror-meta-leads`. Can also be
 * invoked manually with the same auth secret.
 */

import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { hasEnvVar, getEnvVar } from '@/lib/env'
import { storeLead } from '@/lib/leads-store'

export type MirrorSummary = {
  scanned: number
  metaLeads: number
  inserted: number
  skipped: number
  errors: number
  errorMessages: string[]
}

/**
 * Default scan window: 36 hours back. Slightly more than the cron interval
 * (24h) so a one-off skipped run doesn't lose leads.
 */
export const DEFAULT_SCAN_WINDOW_MS = 36 * 60 * 60 * 1000

/**
 * Read a Notion page property as a plain string from any of the supported
 * shapes (rich_text / title / select / multi_select / email / phone_number /
 * number). Returns '' when the property is missing or empty.
 */
function readProp(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (!prop) return ''
  switch (prop.type) {
    case 'rich_text':
      return prop.rich_text.map((t) => t.plain_text).join('').trim()
    case 'title':
      return prop.title.map((t) => t.plain_text).join('').trim()
    case 'select':
      return prop.select?.name ?? ''
    case 'multi_select':
      return prop.multi_select.map((s) => s.name).join(', ')
    case 'email':
      return (prop.email ?? '').trim()
    case 'phone_number':
      return (prop.phone_number ?? '').trim()
    case 'number':
      return prop.number != null ? String(prop.number) : ''
    case 'checkbox':
      return prop.checkbox ? 'true' : 'false'
    case 'date':
      return prop.date?.start ?? ''
    default:
      return ''
  }
}

/**
 * Detect whether a Notion page came from a Meta lead-ad form (vs the website
 * form, which writes capitalized props like "Player Name"). Meta lead-ad rows
 * (via Zapier) populate snake_case props like `campaign_name`, `ad_name`,
 * `form_name`, `platform`.
 */
export function isMetaLeadPage(page: PageObjectResponse): boolean {
  const signals = ['campaign_name', 'ad_name', 'form_name', 'platform', 'form_id', 'campaign_id']
  return signals.some((k) => Boolean(readProp(page, k)))
}

/**
 * Map a Meta lead-ad Notion page → StoreLeadParams shape.
 * Falls back to whichever fields are populated; never throws.
 */
export function mapMetaLeadToStoreParams(page: PageObjectResponse) {
  const email =
    readProp(page, 'email') ||
    readProp(page, 'email_norm') ||
    readProp(page, 'Parent Email')
  const name =
    readProp(page, 'full_name') ||
    readProp(page, 'Player Name') ||
    readProp(page, 'Parent Name')
  const phone =
    readProp(page, 'phone') ||
    readProp(page, 'Parent Phone') ||
    readProp(page, 'phone_norm')

  const program =
    readProp(page, 'which_program_are_you_most_interested_in?') ||
    readProp(page, 'which_program_interests_you?') ||
    readProp(page, 'Program') ||
    'Meta Lead Ad'

  const payload: Record<string, unknown> = {
    program,
    campaign: readProp(page, 'campaign_name'),
    ad: readProp(page, 'ad_name'),
    form: readProp(page, 'form_name'),
    platform: readProp(page, 'platform'),
    notionPageUrl: page.url,
  }
  // Strip empty payload fields to keep rows compact.
  for (const k of Object.keys(payload)) {
    if (payload[k] === '' || payload[k] == null) delete payload[k]
  }

  return {
    source: 'meta-lead-ad',
    email,
    name: name || null,
    phone: phone || null,
    payload,
    notionPageId: page.id,
  }
}

/**
 * Pull Meta lead-ad rows from the Notion DB (created within `sinceMs` window)
 * and insert any new ones into Supabase. Idempotent.
 *
 * Returns a structured summary suitable for logging or returning from the
 * cron route.
 */
export async function mirrorMetaLeadsToSupabase(
  opts: { sinceMs?: number } = {}
): Promise<MirrorSummary> {
  const summary: MirrorSummary = {
    scanned: 0,
    metaLeads: 0,
    inserted: 0,
    skipped: 0,
    errors: 0,
    errorMessages: [],
  }

  if (!hasEnvVar('NOTION_API_KEY') || !hasEnvVar('NOTION_DATABASE_ID')) {
    summary.errorMessages.push('NOTION_API_KEY or NOTION_DATABASE_ID not configured')
    summary.errors = 1
    return summary
  }
  if (!hasEnvVar('SUPABASE_URL') || !hasEnvVar('SUPABASE_SERVICE_ROLE_KEY')) {
    summary.errorMessages.push('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured')
    summary.errors = 1
    return summary
  }

  const windowMs = opts.sinceMs ?? DEFAULT_SCAN_WINDOW_MS
  const sinceIso = new Date(Date.now() - windowMs).toISOString()
  const notion = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  const databaseId = getEnvVar('NOTION_DATABASE_ID')

  let cursor: string | undefined
  while (true) {
    let page
    try {
      page = await notion.databases.query({
        database_id: databaseId,
        page_size: 100,
        start_cursor: cursor,
        filter: {
          timestamp: 'created_time',
          created_time: { after: sinceIso },
        },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      })
    } catch (err) {
      summary.errors += 1
      summary.errorMessages.push(
        `Notion query failed: ${err instanceof Error ? err.message : String(err)}`
      )
      break
    }

    for (const result of page.results) {
      summary.scanned += 1
      // databases.query returns either PageObjectResponse or PartialPageObjectResponse.
      // Only PageObjectResponse has `.properties`.
      if (!('properties' in result)) {
        summary.skipped += 1
        continue
      }
      const fullPage = result as PageObjectResponse

      if (!isMetaLeadPage(fullPage)) {
        summary.skipped += 1
        continue
      }
      summary.metaLeads += 1

      const params = mapMetaLeadToStoreParams(fullPage)
      if (!params.email) {
        summary.skipped += 1
        continue
      }

      try {
        await storeLead(params)
        summary.inserted += 1
      } catch (err) {
        summary.errors += 1
        summary.errorMessages.push(
          `Insert failed for page ${fullPage.id}: ${err instanceof Error ? err.message : String(err)}`
        )
      }
    }

    if (!page.has_more) break
    cursor = page.next_cursor ?? undefined
  }

  // Note: storeLead silently skips on existing notion_page_id, so `inserted`
  // here counts BOTH new inserts and successful idempotent skips. To get
  // strict insert count, we'd need storeLead to return a status — out of
  // scope for v1. The summary still surfaces total scanned + meta-lead pages
  // found, which is enough to verify the cron is working.
  return summary
}
