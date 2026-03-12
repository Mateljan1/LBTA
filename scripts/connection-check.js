#!/usr/bin/env node
/**
 * AC + GHL connection check: env status and optional read-only ping.
 * Never prints secret values. Safe for local and CI.
 *
 * Usage:
 *   node scripts/connection-check.js           # env only
 *   node scripts/connection-check.js --ping   # env + verify AC and GHL reachable (read-only)
 *
 * Exit 0 if ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY are set (and --ping succeeds when used).
 */

const ping = process.argv.includes('--ping')

const vars = {
  ACTIVECAMPAIGN_URL: 'ActiveCampaign API URL',
  ACTIVECAMPAIGN_API_KEY: 'ActiveCampaign API key',
  GHL_API_KEY: 'GoHighLevel API key (optional)',
  GHL_LOCATION_ID: 'GoHighLevel location ID (optional)',
  GHL_WORKFLOW_ID: 'GoHighLevel workflow ID (optional)',
}

function envStatus() {
  let acOk = true
  console.log('Lead pipeline — env check (values never printed):')
  for (const [key, label] of Object.entries(vars)) {
    const set = !!process.env[key]
    if (key.startsWith('ACTIVECAMPAIGN') && !set) acOk = false
    console.log(`  ${key}: ${set ? 'set' : 'missing'}  (${label})`)
  }
  const ghlPartial =
    (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) &&
    !process.env.GHL_WORKFLOW_ID
  if (ghlPartial) {
    console.log('\n  → GHL will be skipped until GHL_WORKFLOW_ID is set (see docs/how-to-get-ghl-workflow-id.md).')
  }
  return acOk
}

async function pingAC() {
  const base = (process.env.ACTIVECAMPAIGN_URL || '').replace(/\/$/, '')
  const key = process.env.ACTIVECAMPAIGN_API_KEY
  if (!base || !key) return { ok: false, message: 'AC env not set' }
  try {
    const res = await fetch(`${base}/api/3/lists?limit=1`, {
      headers: { 'Api-Token': key },
    })
    if (res.ok) return { ok: true, message: 'AC reachable' }
    return { ok: false, message: `AC returned ${res.status}` }
  } catch (e) {
    return { ok: false, message: (e && e.message) || 'AC request failed' }
  }
}

async function pingGHL() {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  if (!apiKey || !locationId) return { ok: false, message: 'GHL env not set' }
  const base = (process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com').replace(/\/$/, '')
  const isLeadConnector = base.includes('leadconnectorhq.com')
  try {
    const url = `${base}/workflows/?locationId=${encodeURIComponent(locationId)}`
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
    if (isLeadConnector) headers['Version'] = '2021-07-28'
    const res = await fetch(url, { headers })
    if (!res.ok) {
      return { ok: false, message: `GHL returned ${res.status} (workflows may require different endpoint)` }
    }
    const data = await res.json().catch(() => ({}))
    const workflows = data?.workflows ?? data?.data ?? (Array.isArray(data) ? data : [])
    if (Array.isArray(workflows) && workflows.length > 0) {
      console.log('  GHL workflows (set GHL_WORKFLOW_ID to one of these):')
      workflows.slice(0, 15).forEach((w) => {
        const id = w.id ?? w._id
        const name = w.name ?? w.title ?? '(no name)'
        if (id) console.log(`    ${id}  ${name}`)
      })
      if (workflows.length > 15) console.log(`    ... and ${workflows.length - 15} more`)
      return { ok: true, message: `GHL reachable; ${workflows.length} workflow(s) listed` }
    }
    return { ok: true, message: 'GHL reachable (no workflow list returned)' }
  } catch (e) {
    return { ok: false, message: (e && e.message) || 'GHL request failed' }
  }
}

async function main() {
  const acOk = envStatus()
  if (!ping) {
    console.log('\nLeads → ActiveCampaign (required) + GoHighLevel (optional) + Supabase (optional).')
    console.log('Full setup: docs/ac-ghl-connected-onepager.md')
    process.exit(acOk ? 0 : 1)
  }

  console.log('\n--ping: verifying AC and GHL (read-only)...')
  const [ac, ghl] = await Promise.all([pingAC(), pingGHL()])
  console.log('  ActiveCampaign:', ac.ok ? 'OK' : ac.message)
  console.log('  GoHighLevel:', ghl.ok ? 'OK' : ghl.message)
  if (!ac.ok) {
    console.log('\nFix AC URL/key in Vercel (or .env.local); see docs/activecampaign-setup-checklist.md')
  }
  const exitOk = acOk && ac.ok
  process.exit(exitOk ? 0 : 1)
}

main().catch((err) => {
  console.error('Connection check failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
