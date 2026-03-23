#!/usr/bin/env node
/**
 * Agent tool: Send chat message
 * 
 * Calls POST /api/chat with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface ChatRequest {
  message: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  pathname?: string
}

export async function sendChatMessage(data: ChatRequest) {
  return agentFetch('/api/chat', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['message'])
  
  if (!validation.valid) {
    console.error('Error: Missing required field: message')
    process.exit(1)
  }

  sendChatMessage(args as any as ChatRequest)
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
