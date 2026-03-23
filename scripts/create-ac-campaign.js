#!/usr/bin/env node
/**
 * Create an email campaign in ActiveCampaign using your API connection.
 * Uses LBTA list ID 4 (master list). Creates a DRAFT campaign so you can
 * review and send from the AC UI.
 *
 * Flow (ActiveCampaign v3 cannot attach list+message in one JSON create; the
 * legacy admin API is required for that):
 *   1. POST /api/3/messages — template + HTML (`html` field)
 *   2. POST admin message_edit — `htmlconstructor=editor` + list `p[id]` so the designer/preview resolve
 *   3. POST /admin/api.php?api_action=campaign_create — p[listId] and m[messageId]=100
 *
 * Usage:
 *   node scripts/create-ac-campaign.js <path-to-html-file> [campaignName] [subject]
 *
 * Example:
 *   node scripts/create-ac-campaign.js assets/emails/lbta-spring-2026.html
 *
 * To remove draft/test campaigns (v3 DELETE is not supported; legacy GET works):
 *   node scripts/delete-ac-campaign.js <campaignId>
 *
 * Env (from .env.local or shell):
 *   ACTIVECAMPAIGN_URL   e.g. https://tennisbeast.api-us1.com
 *   ACTIVECAMPAIGN_API_KEY
 */

const fs = require('fs')
const path = require('path')
const { legacyMessageEdit } = require('./ac-legacy-message-edit')

// Load env from .env.local or .env if dotenv is available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {
  // No dotenv; use process.env (export ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY before running)
}

const LBTA_LIST_ID = 4

/** Split-test percentage: use 100 so the full list receives this message (see AC campaign_create docs). */
const MESSAGE_PERCENT = 100

const htmlPath = process.argv[2]
const campaignNameArg = process.argv[3]
const subjectArg = process.argv[4]
if (!htmlPath) {
  console.error(
    'Usage: node scripts/create-ac-campaign.js <path-to-html-file> [campaignName] [subject]'
  )
  process.exit(1)
}

const base = (process.env.ACTIVECAMPAIGN_URL || '').replace(/\/$/, '')
const apiKey = process.env.ACTIVECAMPAIGN_API_KEY
if (!base || !apiKey) {
  console.error('Missing ACTIVECAMPAIGN_URL or ACTIVECAMPAIGN_API_KEY (set in .env.local or shell)')
  process.exit(1)
}

const fullPath = path.resolve(process.cwd(), htmlPath)
if (!fs.existsSync(fullPath)) {
  console.error('File not found:', fullPath)
  process.exit(1)
}

const htmlContent = fs.readFileSync(fullPath, 'utf-8')

const campaignName = campaignNameArg || 'LBTA Spring 2026'
const subject =
  subjectArg || 'Your Week at LBTA — Spring 2026 Schedule & Registration'

const headers = {
  'Api-Token': apiKey,
  'Content-Type': 'application/json',
}

/**
 * @param {Record<string, string | number>} fields
 */
async function createCampaignLegacy(fields) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) {
    body.append(k, String(v))
  }
  const url = `${base}/admin/api.php?api_action=campaign_create&api_output=json`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Legacy campaign_create failed: ${res.status} ${text}`)
  }
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Legacy campaign_create: non-JSON response: ${text.slice(0, 500)}`)
  }
  if (Number(data.result_code) !== 1) {
    throw new Error(
      `Legacy campaign_create: ${data.result_message || 'unknown error'} — ${text.slice(0, 500)}`
    )
  }
  return data
}

async function main() {
  // 1. Create message (v3)
  const messageRes = await fetch(`${base}/api/3/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: {
        type: 'template',
        name: campaignName,
        subject,
        fromname: 'Laguna Beach Tennis Academy',
        fromemail: 'support@lagunabeachtennisacademy.com',
        reply2: 'support@lagunabeachtennisacademy.com',
        // AC v3 persists body only on `html`; `htmlcontent` is accepted but stores nothing (no preview).
        html: htmlContent,
        textcontent: '',
      },
    }),
  })
  if (!messageRes.ok) {
    const t = await messageRes.text()
    throw new Error(`Message create failed: ${messageRes.status} ${t}`)
  }
  const { message } = await messageRes.json()
  const messageId = message.id

  // 2. Legacy message_edit — required so AC treats body as editor HTML (not external fetch) and ties list
  await legacyMessageEdit({
    baseUrl: base,
    apiKey,
    messageId,
    html: htmlContent,
    subject,
    fromname: 'Laguna Beach Tennis Academy',
    fromemail: 'support@lagunabeachtennisacademy.com',
    reply2: 'support@lagunabeachtennisacademy.com',
    listId: LBTA_LIST_ID,
  })

  // 3. Create campaign (draft) — legacy API links list + message
  const legacyFields = {
    type: 'single',
    segmentid: 0,
    name: campaignName,
    // Required by campaign_create for non-responder types; draft still needs a placeholder date.
    sdate: '2030-01-01 09:00:00',
    status: 0,
    public: 1,
    tracklinks: 'all',
    trackreads: 1,
    trackreplies: 0,
    htmlunsub: 1,
    textunsub: 1,
    [`p[${LBTA_LIST_ID}]`]: LBTA_LIST_ID,
    [`m[${messageId}]`]: MESSAGE_PERCENT,
  }

  const created = await createCampaignLegacy(legacyFields)
  const campaignId = created.id

  const acAppUrl = base.replace('api-us1.com', 'activehosted.com')
  console.log('Campaign created in ActiveCampaign (draft)')
  console.log('  Campaign ID:', campaignId)
  console.log('  Message ID:', messageId)
  console.log('  Name:', campaignName)
  console.log('  List ID:', LBTA_LIST_ID)
  console.log('  Edit / send:', `${acAppUrl}/app/campaigns/${campaignId}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
