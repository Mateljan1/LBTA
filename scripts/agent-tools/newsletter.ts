#!/usr/bin/env node
/**
 * Agent tool: Newsletter signup
 * 
 * Calls POST /api/newsletter with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface NewsletterRequest {
  email: string
}

export async function newsletterSignup(data: NewsletterRequest) {
  return agentFetch('/api/newsletter', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['email'])
  
  if (!validation.valid) {
    console.error('Error: Missing required field: email')
    process.exit(1)
  }

  newsletterSignup(args as any as NewsletterRequest)
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
