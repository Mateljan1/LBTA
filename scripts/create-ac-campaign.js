#!/usr/bin/env node
/**
 * Create an email campaign in ActiveCampaign using your API connection.
 * Uses LBTA list ID 4 (master list). Creates a DRAFT campaign so you can
 * review and send from the AC UI.
 *
 * Usage:
 *   node scripts/create-ac-campaign.js <path-to-html-file>
 *
 * Example:
 *   node scripts/create-ac-campaign.js assets/emails/lbta-spring-2026.html
 *
 * Env (from .env.local or shell):
 *   ACTIVECAMPAIGN_URL   e.g. https://tennisbeast.api-us1.com
 *   ACTIVECAMPAIGN_API_KEY
 */

const fs = require('fs')
const path = require('path')

// Load env from .env.local or .env if dotenv is available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {
  // No dotenv; use process.env (export ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY before running)
}

const LBTA_LIST_ID = 4

const htmlPath = process.argv[2]
if (!htmlPath) {
  console.error('Usage: node scripts/create-ac-campaign.js <path-to-html-file>')
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

const campaignName = 'LBTA Spring 2026'
const subject = 'Your Week at LBTA — Spring 2026 Schedule & Registration'

const headers = {
  'Api-Token': apiKey,
  'Content-Type': 'application/json',
}

async function main() {
  // 1. Create message
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
        htmlcontent: htmlContent,
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

  // 2. Create campaign (draft) linked to list 4 and this message
  const campaignRes = await fetch(`${base}/api/3/campaigns`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      campaign: {
        type: 'single',
        name: campaignName,
        sdate: null,
        status: 0, // 0 = draft
        public: 1,
        tracklinks: 'all',
        trackreads: '1',
        trackreadsanalytics: '1',
        segmentid: 0,
        bounceid: -1,
        realcid: 0,
        waitid: 0,
        m_dealid: 0,
        m_groupid: 0,
        m_link: 0,
        [`p[${LBTA_LIST_ID}]`]: LBTA_LIST_ID,
        [`m[${messageId}]`]: messageId,
      },
    }),
  })
  if (!campaignRes.ok) {
    const t = await campaignRes.text()
    throw new Error(`Campaign create failed: ${campaignRes.status} ${t}`)
  }
  const { campaign } = await campaignRes.json()
  const campaignId = campaign.id

  const acAppUrl = base.replace('api-us1.com', 'activehosted.com')
  console.log('Campaign created in ActiveCampaign (draft)')
  console.log('  Campaign ID:', campaignId)
  console.log('  Name:', campaignName)
  console.log('  List ID:', LBTA_LIST_ID)
  console.log('  Edit / send:', `${acAppUrl}/app/campaigns/${campaignId}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
