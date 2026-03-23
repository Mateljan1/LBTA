#!/usr/bin/env node
/**
 * Agent tool: General registration
 * 
 * Calls POST /api/register with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string | number
  skillLevel: string
  experience: string
  program?: string
  season?: string
  earlyBird?: boolean
  finalPrice?: string | number
  goals?: string
  notes?: string
}

export async function register(data: RegisterRequest) {
  return agentFetch('/api/register', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['firstName', 'lastName', 'email', 'phone', 'age', 'skillLevel', 'experience'])
  
  if (!validation.valid) {
    console.error('Error: Missing required fields:', validation.missing.join(', '))
    process.exit(1)
  }

  register(args as any as RegisterRequest)
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
