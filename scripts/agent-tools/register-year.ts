#!/usr/bin/env node
/**
 * Agent tool: Year-round registration
 * 
 * Calls POST /api/register-year with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface RegisterYearRequest {
  registrationType?: 'seasonal' | 'camp' | 'utr-circuit' | 'jtt' | 'swim-tennis' | 'private' | 'inquiry'
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  studentName?: string
  playerName?: string
  preferredDays?: string[]
  location?: string
  timeSlot?: string
  totalPrice?: string | number
  price?: string | number
  studentAge?: string | number
  playerAge?: string | number
  season?: string
  experience?: string
  notes?: string
  programId?: string
  campId?: string
  campName?: string
  campDates?: string
  campWeek?: string
  division?: string
}

export async function registerYear(data: RegisterYearRequest) {
  return agentFetch('/api/register-year', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['firstName', 'lastName', 'email', 'phone', 'program'])
  
  if (!validation.valid) {
    console.error('Error: Missing required fields:', validation.missing.join(', '))
    process.exit(1)
  }

  // Handle array fields
  const requestData = { ...args } as any
  if (args.preferredDays && typeof args.preferredDays === 'string') {
    requestData.preferredDays = args.preferredDays.split(',').map(s => s.trim())
  }

  registerYear(requestData as RegisterYearRequest)
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
