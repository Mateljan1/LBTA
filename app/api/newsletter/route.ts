import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { newsletterSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { hasEnvVar } from '@/lib/env'
import { upsertContact, addToList, addTag, CAMPAIGN_TAGS } from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToGHL } from '@/lib/gohighlevel'

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
    const parsed = await parseJsonBody(request)
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }
    const validation = validateRequest(newsletterSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const { email } = validation.data

    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const result = await upsertContact({
          email: email.trim(),
          firstName: '',
          lastName: '',
        })

        if (result.success && result.data?.id) {
          const listResult = await addToList(result.data.id)
          if (!listResult.success) {
            console.error('[newsletter] ActiveCampaign addToList failed')
          }
          await addTag(result.data.id, CAMPAIGN_TAGS.website_registration)
        } else {
          console.error('[newsletter] ActiveCampaign upsert failed')
        }
      } catch (acError) {
        console.error('[newsletter] ActiveCampaign error:', acError instanceof Error ? acError.message : acError)
      }
    }

    void sendToGHL({ email: email.trim() })

    void storeLead({ source: 'newsletter', email: email.trim() })

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (err) {
    console.error('[newsletter] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Subscription unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
