import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, programRegistrationSchema, validateRequest } from '@/lib/validations'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import { buildPendingCityPaymentWorkflow } from '@/lib/lead-workflow'
import { upsertAndTag, buildRegistrationTags, isMailchimpConfigured } from '@/lib/mailchimp'
import { getProgramCategory } from '@/lib/activecampaign'

// ============================================================
// Program Registration API
// Primary CRM: Mailchimp (upsert + tags)
// Secondary sink: Supabase leads table
// Email: staff + customer → lib/email.ts (no-op when Postmark token unset;
//   migrate to Mailchimp Customer Journey automations once configured)
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
    rateLimitResult = await rateLimit(`register-program:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[register-program] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
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
    const validation = validateRequest(programRegistrationSchema, parsed.data)
    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[register-program] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    const data = validation.data
    const category = getProgramCategory(data.program)

    // Mailchimp: primary CRM (upsert + program tags)
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
        if (!r.success) console.error('[MC] register-program upsert failed:', r.error)
      }))
    }

    // Supabase: secondary sink (source of truth for internal queries)
    waitUntil(storeLead({
      source: 'register-program',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: {
        program: data.program,
        location: data.location,
        workflow: buildPendingCityPaymentWorkflow(24),
      },
    }))

    // Staff alert (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    waitUntil(notifyRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      program: data.program,
      location: data.location,
      studentName: data.studentName,
      studentAge: data.studentAge,
      experience: data.experience,
      notes: data.notes,
    }))

    // Customer confirmation (Postmark — no-op when POSTMARK_SERVER_TOKEN unset;
    // replace with Mailchimp Customer Journey once MC automation is live)
    const matchedConfig = Object.values(FORM_CONFIGS).find(
      c => c.prePopulateData.programName === data.program
    )
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
        programName: data.program,
        location: data.location ?? 'TBD',
        duration: 'TBD',
        category: category,
      }))
    }

    return NextResponse.json({
      success: true,
      message: 'Registration received! Our team will confirm within 24 hours.',
    })
  } catch (error) {
    console.error('[Registration] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}
