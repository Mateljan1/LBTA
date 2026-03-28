/**
 * Notion lead storage — writes form submissions to the Notion registrations database.
 * Env: NOTION_API_KEY, NOTION_DATABASE_ID (both optional — no-op when unset).
 */

import { Client } from '@notionhq/client'
import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { hasEnvVar, getEnvVar } from '@/lib/env'

let notionClient: Client | null = null

function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

function isNotionConfigured(): boolean {
  return hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')
}

type NotionLeadParams = {
  parentName: string
  playerName?: string
  email: string
  phone?: string
  program: string
  category: string
  location?: string
  status?: string
  notes?: string
  age?: number | string | null
  /** Extra properties to merge (e.g. Days Selected, Tuition, etc.) */
  extra?: Record<string, unknown>
}

/**
 * Write a lead/registration to the Notion database.
 * Safe to call even when Notion is not configured — returns silently.
 * Never throws; logs errors so API handlers can continue.
 */
export async function writeNotionLead(params: NotionLeadParams): Promise<void> {
  if (!isNotionConfigured()) return

  try {
    const notion = getNotionClient()
    const ageNum = params.age != null ? parseInt(String(params.age), 10) : null

    const properties: Record<string, unknown> = {
      'Player Name': {
        title: [{ text: { content: params.playerName || params.parentName } }],
      },
      'Parent Name': {
        rich_text: [{ text: { content: params.parentName } }],
      },
      Program: {
        rich_text: [{ text: { content: params.program } }],
      },
      Category: {
        select: { name: params.category },
      },
      'Parent Email': {
        email: params.email,
      },
      Status: {
        select: { name: params.status ?? 'New' },
      },
      Timestamp: {
        date: { start: new Date().toISOString() },
      },
    }

    if (params.phone) {
      properties['Parent Phone'] = { phone_number: params.phone }
    }
    if (params.location) {
      properties['Location'] = { select: { name: params.location } }
    }
    if (params.notes) {
      properties['Notes'] = { rich_text: [{ text: { content: params.notes } }] }
    }
    if (ageNum && !isNaN(ageNum)) {
      properties['Age'] = { number: ageNum }
    }

    // Merge any extra properties (route-specific fields like Days Selected, Tuition, etc.)
    if (params.extra) {
      Object.assign(properties, params.extra)
    }

    await notion.pages.create({
      parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
      properties: properties as CreatePageParameters['properties'],
    })
  } catch (err) {
    console.error('[Notion] Error writing lead:', err instanceof Error ? err.message : err)
  }
}
