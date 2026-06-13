import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerYearSchema, validateRequest } from '@/lib/validations'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import { fulfillUtrCircuitRegistration } from '@/lib/fulfill-utr-circuit-registration'
import { determineCategory, isEarlyBird, type RegistrationType } from '@/lib/register-year-shared'
import { buildPendingCityPaymentWorkflow } from '@/lib/lead-workflow'
import { upsertAndTag, buildRegistrationTags, isMailchimpConfigured, getCurrentSeasonTag } from '@/lib/mailchimp'

// ============================================================
// Year Registration API (seasonal programs, camps, UTR circuit)
// Primary CRM: Mailchimp (upsert + tags)
// Secondary sink: Supabase leads table
// NOTE: fulfillUtrCircuitRegistration still contains AC calls;
//   those are harmless no-ops when ACTIVECAMPAIGN_API_KEY is empty.
//   MC upsert is called here at the route level for all paths.
// ============================================================

export async function POST(request: NextRequest) {
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json({ success: false, error: 'Invalid agent secret' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`register-year:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[register-year] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
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
      return NextResponse.json({ success: false, error: 'Invalid request format' }, { status: 400 })
    }
    const validation = validateRequest(registerYearSchema, parsed.data)

    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[register-year] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    const data = validation.data
    const registrationType = (data.registrationType || 'seasonal') as RegistrationType
    const category = determineCategory(data.program, registrationType)

    console.log('[register-year] Received:', {
      type: registrationType,
      timestamp: new Date().toISOString(),
    })

    // Mailchimp: primary CRM — runs for ALL paths including UTR circuit
    if (isMailchimpConfigured()) {
      const mcTags = [
        ...buildRegistrationTags(data.program),
        ...(registrationType === 'camp' ? ['program:summer-camp'] : []),
        ...(registrationType === 'utr-circuit' ? ['program:utr-circuit'] : []),
        ...(data.season ? [`season:${data.season.toLowerCase()}-2026`] : [getCurrentSeasonTag()]),
      ]
      // Deduplicate
      const uniqueTags = [...new Set(mcTags)]
      waitUntil(upsertAndTag(
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        uniqueTags
      ).then(r => {
        if (!r.success) console.error('[MC] register-year upsert failed:', r.error)
      }))
    }

    // UTR Circuit: delegate to shared fulfillment (still has AC inside — no-op when AC key empty)
    if (registrationType === 'utr-circuit') {
      await fulfillUtrCircuitRegistration(data, {})
      return NextResponse.json({
        success: true,
        message: 'UTR Match Play Series registration received. Our team will contact you with division placement and next steps.',
      })
    }

    // Supabase: secondary sink
    waitUntil(storeLead({
      source: 'register-year',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: {
        registrationType: data.registrationType,
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
      program: data.program,
      registrationType: data.registrationType,
      division: data.division,
      season: data.season,
      location: data.location,
      studentName: data.studentName ?? data.playerName,
      studentAge: data.studentAge ?? data.playerAge,
      experience: data.experience,
      notes: data.notes,
    }))

    // Customer confirmation (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
    const configById = data.programId ? FORM_CONFIGS[data.programId] : undefined
    const matchedConfig =
      configById ?? Object.values(FORM_CONFIGS).find(c => c.prePopulateData.programName === data.program)
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

    const confirmationMessage =
      registrationType === 'camp'
        ? `Camp registration received! You'll receive a confirmation email with camp details and payment information shortly.`
        : registrationType === 'inquiry'
          ? `Thank you for your inquiry! Our team will reach out within 24 hours to discuss your options.`
          : 'Registration received! Our team will confirm within 24 hours.'

    return NextResponse.json({ success: true, message: confirmationMessage })
  } catch (error) {
    console.error('[register-year] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}
