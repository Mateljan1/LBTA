import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, scholarshipSchema, validateRequest } from '@/lib/validations'
import { storeLead } from '@/lib/leads-store'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`scholarship:${ip}`, RATE_LIMITS.form)

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
    const validation = validateRequest(scholarshipSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // No PII in logs
    console.log('[scholarship] Application received', {
      timestamp: new Date().toISOString(),
    })

    void storeLead({
      source: 'scholarship',
      email: validation.data.email,
      name: validation.data.parentName ?? undefined,
      phone: validation.data.phone ?? undefined,
      payload: { studentName: validation.data.studentName },
    })

    return NextResponse.json({
      success: true,
      message: 'Scholarship application submitted successfully',
    })
  } catch (error) {
    console.error('[scholarship] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
