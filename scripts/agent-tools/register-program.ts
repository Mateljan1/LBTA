#!/usr/bin/env node
/**
 * Agent tool: Register for a program
 * 
 * Calls POST /api/register-program with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface RegisterProgramRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  location?: string
  studentName?: string
  studentAge?: string | number
  preferredDays?: string[]
  timeSlot?: string
  totalPrice?: string | number
  experience?: string
  notes?: string
}

export async function registerProgram(data: RegisterProgramRequest) {
  return agentFetch('/api/register-program', data as unknown as Record<string, unknown>)
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

  registerProgram(requestData as RegisterProgramRequest)
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
