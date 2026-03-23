#!/usr/bin/env node
/**
 * Re-sync HTML from disk onto an existing ActiveCampaign message using legacy message_edit.
 * Use when the designer shows empty / “No Preview” but API has content, or after template edits.
 *
 * Usage:
 *   node scripts/sync-ac-message-html.js <messageId> <path-to-html>
 *
 * Env: ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY
 */

const fs = require('fs')
const path = require('path')
const { legacyMessageEdit } = require('./ac-legacy-message-edit')

try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {
  /* optional */
}

const messageId = process.argv[2]
const htmlPath = process.argv[3]
if (!messageId || !htmlPath) {
  console.error('Usage: node scripts/sync-ac-message-html.js <messageId> <path-to-html>')
  process.exit(1)
}

const base = (process.env.ACTIVECAMPAIGN_URL || '').replace(/\/$/, '')
const apiKey = process.env.ACTIVECAMPAIGN_API_KEY
if (!base || !apiKey) {
  console.error('Missing ACTIVECAMPAIGN_URL or ACTIVECAMPAIGN_API_KEY')
  process.exit(1)
}

const fullPath = path.resolve(process.cwd(), htmlPath)
if (!fs.existsSync(fullPath)) {
  console.error('File not found:', fullPath)
  process.exit(1)
}

let html = fs.readFileSync(fullPath, 'utf-8')

// Prep for AC: strip BOM, remove any CDATA bleed (]]>)
if (html.charCodeAt(0) === 0xfeff) html = html.slice(1)
html = html.replace(/\]\]\s*>/g, '')
html = html.trimEnd()

async function main() {
  const headers = { 'Api-Token': apiKey, 'Content-Type': 'application/json' }
  const mRes = await fetch(`${base}/api/3/messages/${messageId}`, { headers })
  if (!mRes.ok) {
    const t = await mRes.text()
    throw new Error(`GET message ${messageId}: ${mRes.status} ${t}`)
  }
  const { message } = await mRes.json()

  await legacyMessageEdit({
    baseUrl: base,
    apiKey,
    messageId,
    html,
    subject: message.subject || 'LBTA',
    fromname: message.fromname || 'Laguna Beach Tennis Academy',
    fromemail: message.fromemail || 'support@lagunabeachtennisacademy.com',
    reply2: message.reply2 || message.fromemail || 'support@lagunabeachtennisacademy.com',
    listId: 4,
  })

  console.log(`Message ${messageId} updated via legacy message_edit (editor HTML + list 4).`)
  console.log(`Bytes HTML: ${Buffer.byteLength(html, 'utf8')}`)
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
