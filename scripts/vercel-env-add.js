#!/usr/bin/env node
/**
 * Add LBTA env vars to Vercel production via API.
 * Uses VERCEL_TOKEN from .env.vercel (or process.env). Values for AC/GHL
 * must be in process.env when you run this (do not commit them).
 *
 * Usage:
 *   export $(grep -v '^#' .env.vercel | xargs)
 *   ACTIVECAMPAIGN_URL=https://YOUR_ACCOUNT.api-us1.com \
 *   ACTIVECAMPAIGN_API_KEY=your_key \
 *   node scripts/vercel-env-add.js
 *
 * Optional GHL (all three required for SMS):
 *   GHL_WORKFLOW_ID=xxx node scripts/vercel-env-add.js
 *   (GHL_API_KEY and GHL_LOCATION_ID must already be in Vercel or add them here too)
 */

const fs = require('fs')
const path = require('path')

const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'lbta-website'
const TEAM_SLUG = process.env.VERCEL_TEAM_SLUG || 'andrew-mateljans-projects'

function loadEnvVercel() {
  const p = path.join(__dirname, '..', '.env.vercel')
  if (!fs.existsSync(p)) return
  const content = fs.readFileSync(p, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+)\s*$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
}

loadEnvVercel()

const token = process.env.VERCEL_TOKEN
if (!token) {
  console.error('Missing VERCEL_TOKEN. Set it in .env.vercel or export it.')
  process.exit(1)
}

const vars = [
  { key: 'ACTIVECAMPAIGN_URL', value: process.env.ACTIVECAMPAIGN_URL, required: false },
  { key: 'ACTIVECAMPAIGN_API_KEY', value: process.env.ACTIVECAMPAIGN_API_KEY, required: false },
  { key: 'GHL_API_KEY', value: process.env.GHL_API_KEY, required: false },
  { key: 'GHL_LOCATION_ID', value: process.env.GHL_LOCATION_ID, required: false },
  { key: 'GHL_WORKFLOW_ID', value: process.env.GHL_WORKFLOW_ID, required: false },
]
const body = vars
  .filter((v) => v.value)
  .map((v) => ({
    key: v.key,
    value: v.value,
    type: v.key.includes('KEY') || v.key.includes('SECRET') ? 'sensitive' : 'plain',
    target: ['production', 'preview'],
  }))

if (body.length === 0) {
  console.error('No env vars to add.')
  process.exit(1)
}

const url = `https://api.vercel.com/v10/projects/${encodeURIComponent(PROJECT_NAME)}/env?slug=${encodeURIComponent(TEAM_SLUG)}&upsert=true`

fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})
  .then((res) => {
    if (!res.ok) return Promise.reject(new Error(`Vercel API error: ${res.status}`))
    return res.json()
  })
  .then((data) => {
    const created = Array.isArray(data) ? data : (data && data.created) || []
    console.log('Added/updated', created.length, 'env var(s) for production + preview:', created.map((e) => e.key).join(', '))
  })
  .catch((err) => {
    console.error('Vercel API error:', err.message)
    process.exit(1)
  })
