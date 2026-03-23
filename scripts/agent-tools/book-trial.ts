#!/usr/bin/env node
/**
 * Agent tool: Book a trial
 * 
 * Calls POST /api/book with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface BookTrialRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  program?: string
  location?: string
  preferredDays?: string[]
  experience?: string
  goals?: string
  bookingType?: 'private'
  coach?: string
  option?: '60' | '90' | '10-pack' | '20-pack'
  message?: string
}

export async function bookTrial(data: BookTrialRequest) {
  return agentFetch('/api/book', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['firstName', 'lastName', 'email', 'phone'])
  
  if (!validation.valid) {
    console.error('Error: Missing required fields:', validation.missing.join(', '))
    console.error('Usage: npx tsx book-trial.ts --firstName "John" --lastName "Doe" --email "john@example.com" --phone "9495551234"')
    process.exit(1)
  }

  // Handle array fields (preferredDays)
  const requestData = { ...args } as any
  if (args.preferredDays && typeof args.preferredDays === 'string') {
    requestData.preferredDays = args.preferredDays.split(',').map(s => s.trim())
  }

  bookTrial(requestData as BookTrialRequest)
    .then(result => {
      if (result.success) {
        console.log('Success:', result.data)
      } else {
        console.error('Error:', result.error)
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}
