import { existsSync, readFileSync } from 'fs'
import { findPendingCityPaymentMatches, markCityPaidForEmails } from '../lib/city-payment-workflow'

for (const line of existsSync('.env.local') ? readFileSync('.env.local', 'utf-8').split('\n') : []) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

function parseArgs(): { filePath: string | null; dryRun: boolean } {
  const args = process.argv.slice(2)
  let filePath: string | null = null
  let dryRun = process.env.DRY_RUN !== '0'

  for (let i = 0; i < args.length; i++) {
    const token = args[i]
    if (token === '--file' && args[i + 1]) {
      filePath = args[i + 1]
      i++
      continue
    }
    if (token.startsWith('--file=')) {
      filePath = token.split('=').slice(1).join('=')
      continue
    }
    if (token === '--apply') {
      dryRun = false
      continue
    }
    if (token === '--dry-run') {
      dryRun = true
      continue
    }
  }

  return { filePath, dryRun }
}

function parseCsvEmails(raw: string): string[] {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) return []

  const header = lines[0].split(',').map((col) => col.trim().toLowerCase())
  let emailIndex = header.findIndex((col) => col === 'email')
  if (emailIndex < 0) {
    emailIndex = header.findIndex((col) => col.includes('email'))
  }
  if (emailIndex < 0) return []

  const emails: string[] = []
  for (const line of lines.slice(1)) {
    const cols = line.split(',').map((col) => col.trim().replace(/^"|"$/g, ''))
    const email = cols[emailIndex]?.toLowerCase()
    if (email && email.includes('@')) emails.push(email)
  }
  return emails
}

function parseJsonEmails(raw: string): string[] {
  const parsed = JSON.parse(raw) as unknown
  if (!Array.isArray(parsed)) return []
  const emails: string[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const maybeEmail = (record.email ?? record.Email ?? record.EMAIL) as string | undefined
    if (typeof maybeEmail === 'string' && maybeEmail.includes('@')) {
      emails.push(maybeEmail.toLowerCase().trim())
    }
  }
  return emails
}

function unique(emails: string[]): string[] {
  return [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))]
}

async function main() {
  const { filePath, dryRun } = parseArgs()
  if (!filePath) {
    throw new Error(
      'Usage: npm run leads:city-payment-sync-from-export -- --file path/to/city-paid.csv [--dry-run|--apply]'
    )
  }
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const raw = readFileSync(filePath, 'utf-8')
  const isJson = filePath.toLowerCase().endsWith('.json')
  const emails = unique(isJson ? parseJsonEmails(raw) : parseCsvEmails(raw))

  if (emails.length === 0) {
    throw new Error('No emails found in export file. Ensure there is an email column.')
  }

  const summary = dryRun
    ? await findPendingCityPaymentMatches(emails)
    : await markCityPaidForEmails(emails)

  if (summary.error) {
    throw new Error(summary.error)
  }

  console.log(`file: ${filePath}`)
  console.log(`dryRun: ${dryRun}`)
  console.log(`emailsParsed: ${emails.length}`)
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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
