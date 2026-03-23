#!/usr/bin/env node
/**
 * Agent tool: Scholarship application
 * 
 * Calls POST /api/scholarship with the same request shape as the frontend.
 * See docs/api-contracts.md for full request/response contract.
 */

import { agentFetch, parseArgs, validateRequired } from './shared'

interface ScholarshipRequest {
  studentName: string
  parentName: string
  email: string
  phone?: string
  studentGPA?: string
  householdIncome?: string
  sessionsPerWeek?: string | number
  commitment?: string
  notes?: string
}

export async function applyScholarship(data: ScholarshipRequest) {
  return agentFetch('/api/scholarship', data as unknown as Record<string, unknown>)
}

// CLI usage
if (require.main === module) {
  const args = parseArgs(process.argv.slice(2))
  const validation = validateRequired(args, ['studentName', 'parentName', 'email'])
  
  if (!validation.valid) {
    console.error('Error: Missing required fields:', validation.missing.join(', '))
    process.exit(1)
  }

  applyScholarship(args as any as ScholarshipRequest)
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
