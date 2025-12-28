// Production-ready rate limiter using Vercel KV (Redis)
// Scales across serverless functions and persists across deployments

import { kv } from '@vercel/kv'

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate-limit:${identifier}`
  const now = Date.now()
  
  try {
    // Get current count and increment atomically
    const count = await kv.incr(key)
    
    // Set expiry on first request
    if (count === 1) {
      await kv.expire(key, Math.ceil(config.interval / 1000))
    }
    
    // Get TTL for resetTime calculation
    const ttl = await kv.ttl(key)
    const resetTime = now + (ttl * 1000)
    
    // Check if limit exceeded
    const allowed = count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - count)
    
    return {
      allowed,
      remaining,
      resetTime
    }
  } catch (error) {
    // Fallback to allowing request if Redis is unavailable
    console.error('Rate limit error:', error)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: now + config.interval
    }
  }
}
