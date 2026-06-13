import { readFileSync, existsSync } from 'fs'
import { runCityPaymentFollowupAutomation } from '../lib/city-payment-followups'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

async function main() {
  const dryRun = process.env.DRY_RUN !== '0'
  const tier2h = Number.parseInt(process.env.FOLLOWUP_TIER_2H ?? '2', 10)
  const tier24h = Number.parseInt(process.env.FOLLOWUP_TIER_24H ?? '24', 10)
  const tier72h = Number.parseInt(process.env.FOLLOWUP_TIER_72H ?? '72', 10)
  const tier2hOwnerTag = process.env.FOLLOWUP_TIER_2H_OWNER_TAG ?? 'City Payment Owner - Front Desk'
  const tier24hOwnerTag = process.env.FOLLOWUP_TIER_24H_OWNER_TAG ?? 'City Payment Owner - Enrollment'
  const tier72hOwnerTag = process.env.FOLLOWUP_TIER_72H_OWNER_TAG ?? 'City Payment Owner - Director'

  const summary = await runCityPaymentFollowupAutomation({
    dryRun,
    thresholds: {
      tier2h: Number.isFinite(tier2h) ? tier2h : 2,
      tier24h: Number.isFinite(tier24h) ? tier24h : 24,
      tier72h: Number.isFinite(tier72h) ? tier72h : 72,
    },
    owners: {
      tier2hOwnerTag,
      tier24hOwnerTag,
      tier72hOwnerTag,
    },
  })

  if (summary.error) {
    throw new Error(summary.error)
  }

  console.log(`dryRun: ${summary.dryRun}`)
  console.log(`totalCandidates: ${summary.totalCandidates}`)
  console.log(`tiers: 2h=${summary.byTier['2h']} 24h=${summary.byTier['24h']} 72h=${summary.byTier['72h']}`)

  if (summary.actions.length === 0) {
    console.log('No follow-up actions needed.')
    return
  }

  console.log('\nActions:')
  for (const action of summary.actions) {
    const suffix = action.error ? ` | error=${action.error}` : ''
    console.log(
      `- ${action.tier.padEnd(3)} | ${action.ageHours.toFixed(1).padStart(5)}h | ${action.email} | ghl=${action.ghlContactId ?? 'none'} | tags=${action.tagsAttempted.join(', ')}${suffix}`
    )
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
