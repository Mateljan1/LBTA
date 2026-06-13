import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { newsletterSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import { upsertAndTag, buildNewsletterTags, isMailchimpConfigured } from '@/lib/mailchimp'

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Invalid agent secret' },
      { status: 401 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`newsletter:${ip}`, RATE_LIMITS.form)
  } catch {
    rateLimitResult = { allowed: true, remaining: RATE_LIMITS.form.maxRequests, resetTime: Date.now() + RATE_LIMITS.form.interval }
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  }

  try {
    const parsed = await parseJsonBody(request)
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }
    const validation = validateRequest(newsletterSchema, parsed.data)

    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[newsletter] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Mailchimp: primary CRM
    if (isMailchimpConfigured()) {
      waitUntil(upsertAndTag(
        { email: email.trim() },
        buildNewsletterTags()
      ).then(r => {
        if (!r.success) console.error('[MC] Newsletter upsert failed:', r.error)
      }))
    }

    // Supabase: secondary sink
    waitUntil(storeLead({ source: 'newsletter', email: email.trim() }))

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (err) {
    console.error('[newsletter] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Subscription unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
