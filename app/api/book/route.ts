import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { bookingSchema, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTags,
  getClassTagFromProgram,
  getProgramCategory,
  LBTA_LIST_ID,
  CAMPAIGN_TAGS,
} from '@/lib/activecampaign'

// ============================================================
// LBTA Booking/Trial Request API
// ============================================================
// Handles trial class requests and general booking inquiries
// Integrates with ActiveCampaign for contact management and email automation
// ============================================================

// Tag IDs for program categories (using CLASS_TAGS from activecampaign module)
const PROGRAM_TAGS: Record<string, number> = {
  'little-tennis-stars': 49,
  'red-ball': 38,
  'orange-ball': 39,
  'green-dot': 40,
  'youth-development': 21,
  'high-performance': 41,
  'adult-beginner': 17,
  'adult-intermediate': 16,
  'adult-advanced': 15,
  'cardio-tennis': 14,
  'private-lessons': 80,
  'not-sure': 81,
}

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`book:${ip}`, RATE_LIMITS.sensitive)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
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

    // Validate input with Zod
    const validation = validateRequest(bookingSchema, rawData)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }

    const body = validation.data

    console.log('[Trial] Request received:', {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      program: body.program,
      timestamp: new Date().toISOString(),
    })

    // Determine program category
    const category = getProgramCategory(body.program || '')
    const daysSelected = body.preferredDays.join(', ') || 'Flexible'

    // Process with ActiveCampaign
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        // Create/update contact
        const contactResult = await upsertContact({
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          fieldValues: [
            { field: '7', value: body.program || 'Trial Request' }, // PROGRAM
            { field: '8', value: body.location || 'Not specified' }, // LOCATION
            { field: '9', value: daysSelected }, // DAYS_SELECTED
            { field: '15', value: 'website' }, // LEAD_SOURCE
            { field: '16', value: 'trial' }, // REGISTRATION_TYPE
            { field: '22', value: body.experience || 'Not specified' }, // EXPERIENCE_LEVEL
            { field: '23', value: body.goals || '' }, // GOALS
          ],
        })

        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          console.log('[AC] Contact created:', { contactId, email: body.email })

          // Add to list (triggers welcome/confirmation automation)
          await addToList(contactId, LBTA_LIST_ID)
          console.log('[AC] Added to List 4:', { contactId, email: body.email })

          // Build tag list
          const tagsToApply: number[] = [
            CAMPAIGN_TAGS.website_registration,
            CAMPAIGN_TAGS.trial_request,
          ]

          // Add program-specific tag if available
          if (body.program && PROGRAM_TAGS[body.program]) {
            tagsToApply.push(PROGRAM_TAGS[body.program])
          }

          // Apply all tags
          const tagResult = await addTags(contactId, tagsToApply)
          console.log('[AC] Tags applied:', {
            contactId,
            tags: tagsToApply,
            success: tagResult.success,
            failed: tagResult.failed,
          })
        }
      } catch (acError) {
        console.error('[AC] Error:', acError)
        // Continue even if AC fails - we don't want to block the user
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Trial request received! You'll receive a confirmation email shortly, and our team will contact you within 24 hours.",
    })
  } catch (error) {
    console.error('[Booking] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing request. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
