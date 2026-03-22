/**
 * Agent authentication utilities
 * 
 * Validates X-Agent-Secret header for agent tool calls.
 * Only allows requests when AGENT_SECRET is set in environment.
 */

import { hasEnvVar } from './env'

/**
 * Check if agent authentication is enabled (AGENT_SECRET is set)
 */
export function isAgentAuthEnabled(): boolean {
  return hasEnvVar('AGENT_SECRET')
}

/**
 * Validate agent secret from request header
 * Returns true if valid or if agent auth is disabled (dev mode)
 */
export function validateAgentSecret(request: Request): boolean {
  if (!isAgentAuthEnabled()) {
    // In dev, if AGENT_SECRET is not set, allow requests (for testing)
    return true
  }

  const providedSecret = request.headers.get('X-Agent-Secret')
  const expectedSecret = process.env.AGENT_SECRET

  if (!providedSecret || !expectedSecret) {
    return false
  }

  // Use timing-safe comparison to prevent timing attacks
  if (providedSecret.length !== expectedSecret.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < providedSecret.length; i++) {
    result |= providedSecret.charCodeAt(i) ^ expectedSecret.charCodeAt(i)
  }

  return result === 0
}
