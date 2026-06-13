import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerSchema, validateRequest } from '@/lib/validations'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import { buildPendingCityPaymentWorkflow } from '@/lib/lead-workflow'
import { upsertAndTag, buildRegistrationTags, isMailchimpConfigured } from '@/lib/mailchimp'

// ============================================================
// General Registration API
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
    rateLimitResult = await rateLimit(`register:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[register] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457 or try again later.' },
      { status: 500 }
    )
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
    const validation = validateRequest(registerSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const data = validation.data

    console.log('[register] Received', {
      program: data.program ?? 'unspecified',
      season: data.season ?? 'unspecified',
      timestamp: new Date().toISOString(),
    })

    // Mailchimp: primary CRM
    if (isMailchimpConfigured()) {
      waitUntil(upsertAndTag(
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        buildRegistrationTags(data.program)
      ).then(r => {
        if (!r.success) console.error('[MC] register upsert failed:', r.error)
      }))
    }

    // Supabase: secondary sink
    waitUntil(storeLead({
      source: 'register',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: {
        program: data.program,
        season: data.season,
        workflow: buildPendingCityPaymentWorkflow(24),
      },
    }))

    // Staff alert (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    waitUntil(notifyRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      program: data.program ?? 'Not specified',
      season: data.season,
      experience: data.experience,
    }))

    // Customer confirmation (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    const matchedConfig = data.program
      ? Object.values(FORM_CONFIGS).find(
          c => c.prePopulateData.programName === data.program
        )
      : undefined
    if (matchedConfig) {
      const pre = matchedConfig.prePopulateData
      waitUntil(sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: pre.programName,
        location: pre.location,
        duration: pre.duration,
        ageGroup: pre.ageGroup,
        category: pre.category,
      }))
    } else {
      waitUntil(sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: data.program ?? 'Tennis Program',
        location: 'TBD',
        duration: 'TBD',
        category: 'Adult',
      }))
    }

    return NextResponse.json({
      success: true,
      message: 'Registration received. We will contact you within 24 hours.',
    })
  } catch (error) {
    console.error('[register] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457 or try again later.' },
      { status: 500 }
    )
  }
}
