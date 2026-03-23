#!/usr/bin/env node
/**
 * Delete one or more campaigns in ActiveCampaign (draft or other).
 * v3 DELETE /api/3/campaigns/{id} returns 405; use legacy campaign_delete (GET).
 *
 * Usage:
 *   node scripts/delete-ac-campaign.js <campaignId> [campaignId ...]
 *
 * Env: ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY (e.g. .env.local)
 */

const path = require('path')
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {
  /* optional */
}

const ids = process.argv.slice(2).map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n))
if (ids.length === 0) {
  console.error('Usage: node scripts/delete-ac-campaign.js <campaignId> [campaignId ...]')
  process.exit(1)
}

const base = (process.env.ACTIVECAMPAIGN_URL || '').replace(/\/$/, '')
const apiKey = process.env.ACTIVECAMPAIGN_API_KEY
if (!base || !apiKey) {
  console.error('Missing ACTIVECAMPAIGN_URL or ACTIVECAMPAIGN_API_KEY')
  process.exit(1)
}

async function main() {
  const headers = { 'Api-Token': apiKey }
  for (const id of ids) {
    const url = `${base}/admin/api.php?api_action=campaign_delete&api_output=json&id=${id}`
    const res = await fetch(url, { headers })
    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error(`Campaign ${id}: bad response`, res.status, text.slice(0, 200))
      continue
    }
    if (Number(data.result_code) === 1) {
      console.log(`Deleted campaign ${id}: ${data.result_message || 'ok'}`)
    } else {
      console.error(`Campaign ${id}:`, data.result_message || text.slice(0, 300))
    }
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
