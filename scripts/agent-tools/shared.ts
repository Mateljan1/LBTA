/**
 * Shared utilities for agent tools
 * 
 * Provides:
 * - Base URL resolution (env or default)
 * - AGENT_SECRET validation
 * - Common fetch wrapper with error handling
 * - Response parsing
 */

const AGENT_SECRET = process.env.AGENT_SECRET
const LBTA_API_URL = process.env.LBTA_API_URL || 'http://localhost:3000'

if (!AGENT_SECRET) {
  console.error('Error: AGENT_SECRET environment variable is required')
  console.error('Set it in your .env or export it before running agent tools')
  process.exit(1)
}

// TypeScript: AGENT_SECRET is guaranteed to be defined after the check above
const AGENT_SECRET_VALUE: string = AGENT_SECRET

export interface AgentToolResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

/**
 * Make an authenticated request to an LBTA API endpoint
 */
export async function agentFetch<T = unknown>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<AgentToolResponse<T>> {
  const url = `${LBTA_API_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': AGENT_SECRET_VALUE,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        statusCode: response.status,
      }
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Parse CLI arguments into an object
 * Handles: --key value, --key=value, --booleanFlag
 */
export function parseArgs(args: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '').replace(/=.*$/, '')
      const value = arg.includes('=') 
        ? arg.split('=').slice(1).join('=')
        : args[i + 1] && !args[i + 1].startsWith('--')
          ? args[++i]
          : true
      parsed[key] = value
    }
  }
  
  return parsed
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  required: string[]
): { valid: boolean; missing: string[] } {
  const missing = required.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''))
  return {
    valid: missing.length === 0,
    missing,
  }
}
