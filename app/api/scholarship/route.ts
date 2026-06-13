import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, scholarshipSchema, validateRequest } from '@/lib/validations'
import { storeLead } from '@/lib/leads-store'
import { validateAgentSecret } from '@/lib/agent-auth'
import { notifyScholarship, sendScholarshipConfirmationEmail } from '@/lib/email'
import { upsertAndTag, buildScholarshipTags, isMailchimpConfigured } from '@/lib/mailchimp'

// ============================================================
// Scholarship Application API
// Primary CRM: Mailchimp (upsert + tags)
// Secondary sink: Supabase leads table
// ============================================================

export async function POST(request: NextRequest) {
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Invalid agent secret' },
      { status: 401 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`scholarship:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[scholarship] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
    rateLimitResult = { allowed: true, resetTime: Date.now() + RATE_LIMITS.form.interval }
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
    const validation = validateRequest(scholarshipSchema, parsed.data)

    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[scholarship] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    console.log('[scholarship] Application received', { timestamp: new Date().toISOString() })

    const parentName = (validation.data.parentName ?? '').trim()
    const spaceIdx = parentName.indexOf(' ')
    const firstName = spaceIdx > 0 ? parentName.slice(0, spaceIdx) : parentName || 'Parent'
    const lastName = spaceIdx > 0 ? parentName.slice(spaceIdx + 1) : ''

    // Mailchimp: primary CRM
    if (isMailchimpConfigured()) {
      waitUntil(upsertAndTag(
        {
          email: validation.data.email,
          firstName: firstName,
          lastName: lastName,
          phone: validation.data.phone ?? undefined,
        },
        buildScholarshipTags()
      ).then(r => {
        if (!r.success) console.error('[MC] scholarship upsert failed:', r.error)
      }))
    }

    // Supabase: secondary sink
    waitUntil(storeLead({
      source: 'scholarship',
      email: validation.data.email,
      name: validation.data.parentName ?? undefined,
      phone: validation.data.phone ?? undefined,
      payload: { studentName: validation.data.studentName },
    }))

    // Staff alert (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    waitUntil(notifyScholarship({
      parentName: validation.data.parentName,
      email: validation.data.email,
      phone: validation.data.phone,
      studentName: validation.data.studentName,
    }))

    // Applicant confirmation (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    const scholarshipFirstName = spaceIdx > 0 ? parentName.slice(0, spaceIdx) : parentName || 'there'
    waitUntil(sendScholarshipConfirmationEmail({
      email: validation.data.email,
      firstName: scholarshipFirstName,
      studentName: validation.data.studentName,
    }))

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
