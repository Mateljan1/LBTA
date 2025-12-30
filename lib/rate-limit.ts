import { kv } from '@vercel/kv'

interface RateLimitOptions {
  /** Time window in milliseconds */
  interval: number
  /** Maximum requests allowed in the window */
  maxRequests: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

/**
 * Rate limiter using Vercel KV
 * Enforces request limits per identifier (typically IP address)
 *
 * @param identifier - Unique identifier for rate limiting (e.g., IP:route)
 * @param options - Rate limit configuration
 * @returns Promise with rate limit status
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { interval, maxRequests } = options
  const windowInSeconds = Math.floor(interval / 1000)
  const key = `rate-limit:${identifier}`

  try {
    // Check if we're in development without KV configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      // In development, allow requests but log warning
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Rate Limit] Vercel KV not configured - allowing request in development')
        return {
          allowed: true,
          remaining: maxRequests,
          resetTime: Date.now() + interval
        }
      }
      // In production without KV, still allow but log error
      console.error('[Rate Limit] Vercel KV not configured in production!')
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: Date.now() + interval
      }
    }

    // Increment the counter for this identifier
    const current = await kv.incr(key)

    // Set expiry on first request in window
    if (current === 1) {
      await kv.expire(key, windowInSeconds)
    }

    // Get TTL to calculate reset time
    const ttl = await kv.ttl(key)
    const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : interval)

    const allowed = current <= maxRequests
    const remaining = Math.max(0, maxRequests - current)

    if (!allowed) {
      console.warn(`[Rate Limit] Exceeded for ${identifier}: ${current}/${maxRequests}`)
    }

    return {
      allowed,
      remaining,
      resetTime
    }
  } catch (error) {
    // If KV fails, log error but allow request to prevent service disruption
    console.error('[Rate Limit] KV error:', error)
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: Date.now() + interval
    }
  }
}

/**
 * Standard rate limit configurations
 */
export const RATE_LIMITS = {
  /** API routes: 100 requests per 15 minutes */
  api: { interval: 15 * 60 * 1000, maxRequests: 100 },
  /** Form submissions: 10 per minute */
  form: { interval: 60 * 1000, maxRequests: 10 },
  /** Sensitive operations: 5 per minute */
  sensitive: { interval: 60 * 1000, maxRequests: 5 },
  /** Webhooks: 1000 per minute (higher for integrations) */
  webhook: { interval: 60 * 1000, maxRequests: 1000 }
} as const
