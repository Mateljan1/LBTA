import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, scholarshipSchema, validateRequest } from '@/lib/validations'
import { storeLead } from '@/lib/leads-store'
import { hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTag,
  LBTA_LIST_ID,
  CAMPAIGN_TAGS,
} from '@/lib/activecampaign'
import { sendToGHL } from '@/lib/gohighlevel'

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

    const parentName = (validation.data.parentName ?? '').trim()
    const spaceIdx = parentName.indexOf(' ')
    const ghlFirstName = spaceIdx > 0 ? parentName.slice(0, spaceIdx) : parentName || undefined
    const ghlLastName = spaceIdx > 0 ? parentName.slice(spaceIdx + 1) : undefined

    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      const firstName = spaceIdx > 0 ? parentName.slice(0, spaceIdx) : parentName
      const lastName = spaceIdx > 0 ? parentName.slice(spaceIdx + 1) : ''
      const acResult = await upsertContact({
        email: validation.data.email,
        firstName: firstName || 'Parent',
        lastName: lastName || '',
        phone: validation.data.phone ?? undefined,
      })
      if (acResult.success && acResult.data?.id) {
        await addToList(acResult.data.id, LBTA_LIST_ID)
        await addTag(acResult.data.id, CAMPAIGN_TAGS.scholarship)
      }
    }

    void sendToGHL({
      email: validation.data.email,
      firstName: ghlFirstName,
      lastName: ghlLastName,
      phone: validation.data.phone ?? undefined,
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
