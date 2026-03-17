#!/usr/bin/env node
/**
 * Create "Prospect" and "Returning" tags in ActiveCampaign for Spring 2026
 * drip segments/automations. Idempotent: skips create if tag name already exists.
 *
 * Env: ACTIVECAMPAIGN_URL + ACTIVECAMPAIGN_API_KEY, or AC_API_URL + AC_API_TOKEN
 * Writes: assets/emails/spring-2026/tag-ids.json
 */

const fs = require('fs')
const path = require('path')
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {}

const BASE = (process.env.ACTIVECAMPAIGN_URL || process.env.AC_API_URL || '').replace(/\/$/, '')
const API_KEY = process.env.ACTIVECAMPAIGN_API_KEY || process.env.AC_API_TOKEN
if (!BASE || !API_KEY) {
  console.error('Missing AC credentials (ACTIVECAMPAIGN_* or AC_API_*)')
  process.exit(1)
}

const ROOT = path.resolve(__dirname, '..')
const headers = { 'Api-Token': API_KEY, 'Content-Type': 'application/json' }

async function listTags() {
  const res = await fetch(`${BASE}/api/3/tags?limit=500`, { headers })
  if (!res.ok) throw new Error(`List tags: ${res.status}`)
  const data = await res.json()
  return data.tags || []
}

async function createTag(name, description) {
  const res = await fetch(`${BASE}/api/3/tags`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tag: { tag: name, tagType: 'contact', description } }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Create tag "${name}": ${res.status} ${t}`)
  }
  const { tag } = await res.json()
  return tag
}

async function main() {
  const tags = await listTags()
  const byName = new Map(tags.map((t) => [t.tag.toLowerCase(), t]))
  const want = [
    { name: 'Prospect', description: 'Never paid; Spring 2026 prospect drip' },
    { name: 'Returning', description: 'Ever paid; Spring 2026 returning drip' },
  ]
  const ids = {}
  for (const { name, description } of want) {
    const existing = byName.get(name.toLowerCase())
    if (existing) {
      ids[name] = existing.id
      console.log(`Tag "${name}" already exists (id: ${existing.id})`)
    } else {
      const tag = await createTag(name, description)
      ids[name] = tag.id
      console.log(`Created tag "${name}" (id: ${tag.id})`)
    }
  }
  const outPath = path.join(ROOT, 'assets/emails/spring-2026/tag-ids.json')
  fs.writeFileSync(outPath, JSON.stringify(ids, null, 2), 'utf-8')
  console.log(`Tag IDs written to ${outPath}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
