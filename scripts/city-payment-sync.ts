import { readFileSync, existsSync } from 'fs'
import { markCityPaidForEmails, findPendingCityPaymentMatches } from '../lib/city-payment-workflow'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

function parseEmailsArg(): string[] {
  const raw = process.argv
    .slice(2)
    .join(',')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  return [...new Set(raw)]
}

async function main() {
  const dryRun = process.env.DRY_RUN === '1'
  const emails = parseEmailsArg()
  if (emails.length === 0) {
    throw new Error('Usage: npm run leads:city-payment-sync -- email1@example.com,email2@example.com')
  }

  const summary = dryRun
    ? await findPendingCityPaymentMatches(emails)
    : await markCityPaidForEmails(emails)

  if (summary.error) {
    throw new Error(summary.error)
  }

  console.log(`dryRun: ${dryRun}`)
  console.log(`requested: ${summary.requestedEmails.length}`)
  console.log(`matches: ${summary.matches.length}`)
  console.log(`updated: ${summary.updatedLeadIds.length}`)
  console.log(`skipped: ${summary.skippedEmails.length}`)

  if (summary.matches.length > 0) {
    console.log('\nMatches:')
    for (const match of summary.matches) {
      console.log(`- ${match.email} -> ${match.source} (${match.leadId})`)
    }
  }

  if (summary.skippedEmails.length > 0) {
    console.log('\nSkipped (no pending city payment lead found):')
    for (const email of summary.skippedEmails) {
      console.log(`- ${email}`)
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

