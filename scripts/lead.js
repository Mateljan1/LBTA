#!/usr/bin/env node
/**
 * Lead-related CLI: AC/GHL env check + where leads go.
 * Run with: npm run lead
 */
const vars = {
  ACTIVECAMPAIGN_URL: 'ActiveCampaign API URL',
  ACTIVECAMPAIGN_API_KEY: 'ActiveCampaign API key',
  GHL_API_KEY: 'GoHighLevel API key (optional)',
  GHL_LOCATION_ID: 'GoHighLevel location ID (optional)',
  GHL_WORKFLOW_ID: 'GoHighLevel workflow ID (optional)',
}

let acOk = true
console.log('Lead pipeline — env check (values never printed):')
for (const [key, label] of Object.entries(vars)) {
  const set = !!process.env[key]
  if (key.startsWith('ACTIVECAMPAIGN') && !set) acOk = false
  console.log(`  ${key}: ${set ? 'set' : 'missing'}  (${label})`)
}
console.log('\nLeads → ActiveCampaign (required) + GoHighLevel (optional) + Supabase (optional).')
console.log('Setup: docs/ac-ghl-connected-onepager.md')
process.exit(acOk ? 0 : 1)
