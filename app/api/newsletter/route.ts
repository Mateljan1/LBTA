import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { newsletterSchema, validateRequest } from '@/lib/validations'
import { upsertContact, addToList, addTag, CAMPAIGN_TAGS } from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`newsletter:${ip}`, RATE_LIMITS.form)

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
    const rawData = await request.json()
    const validation = validateRequest(newsletterSchema, rawData)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const { email } = validation.data

    const result = await upsertContact({
      email: email.trim(),
      firstName: '',
      lastName: '',
    })

    if (!result.success || !result.data?.id) {
      console.error('[newsletter] ActiveCampaign upsert failed')
      return NextResponse.json(
        { success: false, error: 'Subscription unavailable. Please try again later.' },
        { status: 500 }
      )
    }

    const listResult = await addToList(result.data.id)
    if (!listResult.success) {
      console.error('[newsletter] ActiveCampaign addToList failed')
    }

    await addTag(result.data.id, CAMPAIGN_TAGS.website_registration)

    void storeLead({ source: 'newsletter', email: email.trim() })

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (err) {
    const isValidationError = err instanceof SyntaxError
    console.error('[newsletter] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      {
        success: false,
        error: isValidationError
          ? 'Invalid request format'
          : 'Subscription unavailable. Please try again later.',
      },
      { status: isValidationError ? 400 : 500 }
    )
  }
}
