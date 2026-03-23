import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { bookingSchema, privateLessonBookingSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import { validateAgentSecret } from '@/lib/agent-auth'
import {
  upsertContact,
  addToList,
  addTags,
  getClassTagFromProgram,
  LBTA_LIST_ID,
  getWebsiteSignupsListId,
  CAMPAIGN_TAGS,
  CLASS_TAGS,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToGHL } from '@/lib/gohighlevel'
import { notifyTrialRequest, notifyPrivateLesson } from '@/lib/email'

// ============================================================
// LBTA Booking/Trial Request API
// ============================================================
// Handles trial class requests and general booking inquiries
// Integrates with ActiveCampaign for contact management and email automation
// ============================================================

// Kebab-case program slug → AC tag ID (from canonical CLASS_TAGS)
const PROGRAM_TAGS: Record<string, number> = {
  'little-tennis-stars': CLASS_TAGS.little_tennis_stars,
  'red-ball': CLASS_TAGS.red_ball,
  'orange-ball': CLASS_TAGS.orange_ball,
  'green-dot': CLASS_TAGS.green_dot,
  'youth-development': CLASS_TAGS.youth_development,
  'high-performance': CLASS_TAGS.high_performance,
  'adult-beginner': CLASS_TAGS.adult_beginner,
  'adult-intermediate': CLASS_TAGS.adult_intermediate,
  'adult-advanced': CLASS_TAGS.adult_advanced,
  'cardio-tennis': CLASS_TAGS.cardio,
  'private-lessons': CLASS_TAGS.private_lessons,
  'not-sure': CAMPAIGN_TAGS.not_sure,
}

export async function POST(request: NextRequest) {
  // Agent auth: validate X-Agent-Secret header if present (for agent tool calls)
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Invalid agent secret' },
      { status: 401 }
    )
  }

  // Rate limiting: 5 requests per minute per IP
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
    // Only bookingType === 'private' uses private-lesson schema; missing or any other value → trial path
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

    if (isPrivateLesson) {
      const privateBody = body as import('@/lib/validations').PrivateLessonBookingRequest
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Private] Request received:', { coach: privateBody.coach, option: privateBody.option, timestamp: new Date().toISOString() })
      }

      if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
        try {
          const contactResult = await upsertContact({
            email: privateBody.email,
            firstName: privateBody.firstName,
            lastName: privateBody.lastName,
            phone: privateBody.phone,
            fieldValues: [
              { field: '7', value: `Private: ${privateBody.coach} — ${privateBody.option}` },
              { field: '11', value: 'website' },
              { field: '12', value: 'private-lesson' },
            ],
          })
          if (contactResult.success && contactResult.data) {
            const contactId = contactResult.data.id
            const websiteSignupsListId = getWebsiteSignupsListId()
            await Promise.all([
              addToList(contactId, LBTA_LIST_ID),
              websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
            ])
            await addTags(contactId, [CAMPAIGN_TAGS.website_registration, PROGRAM_TAGS['private-lessons']])
          }
        } catch (acError) {
          console.error('[AC] Error:', acError)
        }
      }

      void sendToGHL({
        email: privateBody.email,
        firstName: privateBody.firstName,
        lastName: privateBody.lastName,
        phone: privateBody.phone,
      })
      // Leads and signup intent stored in Supabase (leads table) and ActiveCampaign (contact + lists + tags) for redundancy.
      void storeLead({
        source: 'book',
        email: privateBody.email,
        name: `${privateBody.firstName ?? ''} ${privateBody.lastName ?? ''}`.trim() || undefined,
        phone: privateBody.phone ?? undefined,
        payload: { bookingType: 'private', coach: privateBody.coach, option: privateBody.option },
      })
      void notifyPrivateLesson({
        firstName: privateBody.firstName,
        lastName: privateBody.lastName,
        email: privateBody.email,
        phone: privateBody.phone,
        coach: privateBody.coach,
        option: privateBody.option,
      })

      return NextResponse.json({
        success: true,
        message: "We received your request. We'll reach out within 24 hours to get you booked in.",
      })
    }

    const trialBody = body as import('@/lib/validations').BookingRequest
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Trial] Request received:', { program: trialBody.program, timestamp: new Date().toISOString() })
    }
    const daysSelected = (trialBody.preferredDays ?? []).join(', ') || 'Flexible'

    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const contactResult = await upsertContact({
          email: trialBody.email,
          firstName: trialBody.firstName,
          lastName: trialBody.lastName,
          phone: trialBody.phone,
          fieldValues: [
            { field: '7', value: trialBody.program || 'Trial Request' },
            { field: '8', value: trialBody.location || 'Not specified' },
            { field: '9', value: daysSelected },
            { field: '11', value: 'website' },
            { field: '12', value: 'trial' },
            { field: '5', value: trialBody.experience || 'Not specified' },
          ],
        })
        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          const websiteSignupsListId = getWebsiteSignupsListId()
          await Promise.all([
            addToList(contactId, LBTA_LIST_ID),
            websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
          ])
          const tagsToApply: number[] = [CAMPAIGN_TAGS.website_registration, CAMPAIGN_TAGS.trial_request]
          if (trialBody.program && PROGRAM_TAGS[trialBody.program]) tagsToApply.push(PROGRAM_TAGS[trialBody.program])
          await addTags(contactId, tagsToApply)
        }
      } catch (acError) {
        console.error('[AC] Error:', acError)
      }
    }

    void sendToGHL({ email: trialBody.email, firstName: trialBody.firstName, lastName: trialBody.lastName, phone: trialBody.phone })
    void storeLead({
      source: 'book',
      email: trialBody.email,
      name: `${trialBody.firstName ?? ''} ${trialBody.lastName ?? ''}`.trim() || undefined,
      phone: trialBody.phone ?? undefined,
      payload: { program: trialBody.program, location: trialBody.location },
    })
    void notifyTrialRequest({
      firstName: trialBody.firstName,
      lastName: trialBody.lastName,
      email: trialBody.email,
      phone: trialBody.phone,
      program: trialBody.program,
      location: trialBody.location,
      experience: trialBody.experience,
      preferredDays: trialBody.preferredDays,
    })

    return NextResponse.json({
      success: true,
      message: "Trial request received! Our team will contact you within 24 hours.",
    })
  } catch (error) {
    console.error('[Booking] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error processing request. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}
