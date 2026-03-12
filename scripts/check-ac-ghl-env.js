#!/usr/bin/env node
/**
 * Check which AC and GHL env vars are set (for local or CI).
 * Prints only "set" or "missing" — never prints values.
 * Exit 0 if ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY are set; else 1.
 */
const vars = {
  ACTIVECAMPAIGN_URL: 'ActiveCampaign API URL',
  ACTIVECAMPAIGN_API_KEY: 'ActiveCampaign API key',
  GHL_API_KEY: 'GoHighLevel API key (optional)',
  GHL_LOCATION_ID: 'GoHighLevel location ID (optional)',
  GHL_WORKFLOW_ID: 'GoHighLevel workflow ID (optional)',
}

let acOk = true
console.log('AC / GHL env check (values never printed):')
for (const [key, label] of Object.entries(vars)) {
  const set = !!process.env[key]
  if (key.startsWith('ACTIVECAMPAIGN') && !set) acOk = false
  console.log(`  ${key}: ${set ? 'set' : 'missing'}  (${label})`)
}
process.exit(acOk ? 0 : 1)
