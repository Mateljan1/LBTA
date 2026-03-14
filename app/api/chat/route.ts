import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { chatSchema, parseJsonBody, validateRequest } from '@/lib/validations'

/**
 * Chat widget stub: validates input, rate limits, and returns a friendly
 * reply directing users to contact the academy. No AI/LLM integration.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`chat:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[chat] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
    return NextResponse.json(
      { reply: "We're having trouble right now. Please call us at (949) 534-0457 or email info@lagunabeachtennisacademy.com." },
      { status: 500 }
    )
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        reply: "We're getting a lot of messages right now. Please call us at (949) 534-0457 or email info@lagunabeachtennisacademy.com.",
      },
      {
        status: 200,
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
        {
          reply: "Please send a short message and we'll get back to you. You can also call (949) 534-0457.",
        },
        { status: 400 }
      )
    }
    const validation = validateRequest(chatSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        {
          reply: "Please send a short message and we'll get back to you. You can also call (949) 534-0457.",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      reply: "Thanks for reaching out. For the fastest response, call us at (949) 534-0457 or use the Contact form on this site. We'd love to hear from you.",
    })
  } catch (err) {
    console.error('[chat] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      {
        reply: "We're having trouble processing your message. Please call (949) 534-0457 or email info@lagunabeachtennisacademy.com.",
      },
      { status: 500 }
    )
  }
}
