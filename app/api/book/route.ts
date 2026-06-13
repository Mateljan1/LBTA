import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { bookingSchema, privateLessonBookingSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import {
  upsertAndTag,
  buildTrialTags,
  buildContactTags,
  buildPrivateLessonTags,
  isMailchimpConfigured,
} from '@/lib/mailchimp'
import {
  buildRegistrationAssistWorkflow,
  buildTrialRequestedWorkflow,
} from '@/lib/lead-workflow'

// ============================================================
// LBTA Booking/Trial Request API
// Primary CRM: Mailchimp (upsert + tags)
// Secondary sink: Supabase leads table
// Email: customer confirmations → Mailchimp Customer Journey automations
//        staff alerts → Mailchimp internal notification automation (tag: source:website-form)
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
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`book:${ip}`, RATE_LIMITS.sensitive)
  } catch {
    rateLimitResult = { allowed: true, remaining: RATE_LIMITS.sensitive.maxRequests, resetTime: Date.now() + RATE_LIMITS.sensitive.interval }
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
    const raw = parsed.data as Record<string, unknown>
    const isPrivateLesson = raw.bookingType === 'private'

    const validation = isPrivateLesson
      ? validateRequest(privateLessonBookingSchema, parsed.data)
      : validateRequest(bookingSchema, parsed.data)
    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Booking] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    const body = validation.data

    // ── Private lesson path ──────────────────────────────────────
    if (isPrivateLesson) {
      const pb = body as import('@/lib/validations').PrivateLessonBookingRequest
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Private] Request received:', { coach: pb.coach, option: pb.option, timestamp: new Date().toISOString() })
      }

      // Mailchimp: upsert + tags (primary CRM)
      if (isMailchimpConfigured()) {
        waitUntil(upsertAndTag(
          {
            email: pb.email,
            firstName: pb.firstName,
            lastName: pb.lastName,
            phone: pb.phone,
          },
          buildPrivateLessonTags()
        ).then(r => {
          if (!r.success) console.error('[MC] Private lesson upsert failed:', r.error)
        }))
      }

      // Supabase: secondary sink (source of truth for internal queries)
      waitUntil(storeLead({
        source: 'book',
        email: pb.email,
        name: `${pb.firstName ?? ''} ${pb.lastName ?? ''}`.trim() || undefined,
        phone: pb.phone ?? undefined,
        payload: {
          bookingType: 'private',
          coach: pb.coach,
          option: pb.option,
          workflow: {
            stage: 'not_required',
            cityPaymentStatus: 'not_required',
            createdAt: new Date().toISOString(),
          },
        },
      }))

      return NextResponse.json({
        success: true,
        message: "We received your request. We'll reach out within 24 hours to get you booked in.",
      })
    }

    // ── Trial / contact / registration-assist path ───────────────
    const tb = body as import('@/lib/validations').BookingRequest
    const isContactPage = tb.source === 'contact-page'
    const isRacquetRescue = tb.source === 'racquet-rescue'
    const isRegistrationAssist = [
      'schedules_modal',
      'camps_schedules_modal',
      'programs_page',
      'camps_page_modal',
    ].includes(tb.source ?? '')
    const contactMessage = tb.message?.trim()

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Trial] Request received:', {
        program: tb.program,
        source: tb.source,
        isContactPage,
        timestamp: new Date().toISOString(),
      })
    }

    // Mailchimp: upsert + tags (primary CRM — awaited for reliability)
    if (isMailchimpConfigured()) {
      try {
        const mcTags = isContactPage || isRacquetRescue || isRegistrationAssist
          ? buildContactTags(isRacquetRescue ? 'racquet-rescue' : isRegistrationAssist ? 'registration-assist' : 'contact')
          : buildTrialTags(tb.program)
        const mcResult = await upsertAndTag(
          { email: tb.email, firstName: tb.firstName, lastName: tb.lastName, phone: tb.phone },
          mcTags
        )
        if (mcResult.success) {
          console.log('[MC] Upserted:', tb.email)
        } else {
          console.error('[MC] Upsert failed:', mcResult.error)
        }
      } catch (mcErr) {
        console.error('[MC] Error:', mcErr instanceof Error ? mcErr.message : mcErr)
      }
    } else {
      console.warn('[MC] Not configured — skipping upsert')
    }

    // Supabase: secondary sink
    waitUntil(storeLead({
      source: 'book',
      email: tb.email,
      name: `${tb.firstName ?? ''} ${tb.lastName ?? ''}`.trim() || undefined,
      phone: tb.phone ?? undefined,
      payload: {
        program: tb.program,
        location: tb.location,
        source: tb.source,
        ...((isContactPage || isRacquetRescue || isRegistrationAssist) && contactMessage ? { message: contactMessage } : {}),
        workflow: isRacquetRescue
          ? { stage: 'not_required', cityPaymentStatus: 'not_required', createdAt: new Date().toISOString() }
          : isContactPage
            ? { stage: 'not_required', cityPaymentStatus: 'not_required', createdAt: new Date().toISOString() }
            : isRegistrationAssist
              ? buildRegistrationAssistWorkflow(24)
              : buildTrialRequestedWorkflow(),
      },
    }))

    return NextResponse.json({
      success: true,
      message: isRacquetRescue
        ? 'Thanks — we received your stringing request and will confirm within one business day.'
        : isContactPage
          ? 'Thanks — we received your message and will respond within 24 hours.'
          : isRegistrationAssist
            ? 'Thanks — we received your request and will help you complete City registration within 24 hours.'
          : 'Trial request received! Our team will contact you within 24 hours.',
    })
  } catch (error) {
    console.error('[Booking] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error processing request. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}
