import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerSchema, validateRequest } from '@/lib/validations'
import { storeLead } from '@/lib/leads-store'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`register:${ip}`, RATE_LIMITS.form)

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
    const validation = validateRequest(registerSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const data = validation.data

    // Log without PII: program/season only
    console.log('[register] Received', {
      program: data.program ?? 'unspecified',
      season: data.season ?? 'unspecified',
      timestamp: new Date().toISOString(),
    })

    void storeLead({
      source: 'register',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: { program: data.program, season: data.season },
    })

    return NextResponse.json({
      success: true,
      message: 'Registration received. We will contact you within 24 hours.',
    })
  } catch (error) {
    console.error('[register] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
