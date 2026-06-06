/**
 * Notion Match Results writer — ports the reference Netlify `sync.js` into the
 * site. Upserts one match into the Notion Match Results database keyed on the
 * `Match` title. Safe no-op when the integration isn't configured.
 *
 * Env:
 *   NOTION_MATCH_RESULTS_DB_ID  — parent database ID (required to sync)
 *   NOTION_MATCH_RESULTS_TOKEN  — integration token (optional; falls back to NOTION_API_KEY)
 *   NOTION_API_KEY              — shared site Notion key (fallback token)
 */

import 'server-only'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints'

type NotionProperties = CreatePageParameters['properties']

export interface MatchResultPayload {
  matchId: string
  week: string
  pod: string
  round: number
  playerA: string
  playerB: string
  winner: string | null
  score: string
  court: string
}

export type SyncResult =
  | { ok: true; created: boolean; id: string }
  | { ok: false; skipped: true }
  | { ok: false; error: string }

/** Pod id → Notion `Division` select option. */
const DIVISION_MAP: Record<string, string> = {
  'color-ball': 'Color Ball',
  juniors: 'Juniors',
  'singles-1-3': 'Singles 1.0–3.0',
  'singles-3-5': 'Singles 3.0–5.0',
  'singles-5': 'Singles 5.0+',
  'lbhs-pod-1': 'Singles 1.0–3.0',
  'lbhs-pod-2': 'Singles 1.0–3.0',
}

let client: Client | null = null

function getConfig(): { token: string; dbId: string } | null {
  const dbId = process.env.NOTION_MATCH_RESULTS_DB_ID?.trim()
  const token =
    process.env.NOTION_MATCH_RESULTS_TOKEN?.trim() || process.env.NOTION_API_KEY?.trim()
  if (!dbId || !token) return null
  return { token, dbId }
}

export function isMatchResultsConfigured(): boolean {
  return getConfig() !== null
}

function getClient(token: string): Client {
  if (!client) client = new Client({ auth: token })
  return client
}

function richText(content: string) {
  return [{ type: 'text' as const, text: { content: content.slice(0, 2000) } }]
}

/**
 * Upsert a single match into the Notion Match Results database.
 * Returns `{ ok:false, skipped:true }` (not an error) when unconfigured so
 * callers can treat sync as best-effort.
 */
export async function syncMatchResult(payload: MatchResultPayload): Promise<SyncResult> {
  const cfg = getConfig()
  if (!cfg) return { ok: false, skipped: true }

  try {
    const notion = getClient(cfg.token)
    const matchTitle = payload.matchId.slice(0, 200)

    const properties: Record<string, unknown> = {
      Match: { title: richText(matchTitle) },
      Score: { rich_text: richText(payload.score || '') },
      Week: { select: { name: payload.week } },
      Division: { select: { name: DIVISION_MAP[payload.pod] ?? payload.pod } },
      Round: { select: { name: `R${payload.round}` } },
      Court: { rich_text: richText(payload.court || '') },
      Notes: {
        rich_text: richText(
          `${payload.playerA} vs ${payload.playerB}${
            payload.winner ? ` · Winner: ${payload.winner}` : ''
          }`
        ),
      },
      Date: { date: { start: new Date().toISOString() } },
    }

    // Upsert: find an existing page with the same Match title, else create.
    const existing = await notion.databases.query({
      database_id: cfg.dbId,
      filter: { property: 'Match', title: { equals: matchTitle } },
      page_size: 1,
    })

    if (existing.results.length > 0) {
      const pageId = existing.results[0].id
      await notion.pages.update({
        page_id: pageId,
        properties: properties as unknown as UpdatePageParameters['properties'],
      })
      return { ok: true, created: false, id: pageId }
    }

    const page = await notion.pages.create({
      parent: { database_id: cfg.dbId },
      properties: properties as unknown as NotionProperties,
    })
    return { ok: true, created: true, id: page.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Notion sync failed'
    console.error('[matchday] Notion sync error:', message)
    return { ok: false, error: message }
  }
}
