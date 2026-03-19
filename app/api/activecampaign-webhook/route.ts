import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { hasEnvVar } from '@/lib/env'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, validateRequest, webhookPayloadSchema, type WebhookPayload } from '@/lib/validations'
import {
  addToList,
  addTag,
  getContact,
  isOnList,
  getClassTagFromProgram,
  getClassTagFromLevel,
  LBTA_LIST_ID,
  CAMPAIGN_TAGS,
  CLASS_TAGS,
  INTEREST_TAGS,
  TYPE_TAGS,
} from '@/lib/activecampaign'

// ============================================================
// ActiveCampaign Webhook Handler - LBTA Auto-Tagging System
// ============================================================
// This endpoint receives webhooks from ActiveCampaign when:
// - New contact is created (from Facebook Lead Ads, forms, etc.)
// - Contact is updated
//
// It automatically:
// 1. Adds the contact to LBTA master list (list 4)
// 2. Applies the season tag (e.g. winter_2026 = 228) to trigger confirmation email
// 3. Applies the appropriate class-specific tag based on their level/interest
//
// SECURITY MODEL:
// Webhook authenticity is verified via a shared secret (AC_WEBHOOK_SECRET).
// The caller must include the secret as either:
//   - Header: x-webhook-secret
//   - Query param: ?secret=<value>
// If AC_WEBHOOK_SECRET is not set in env, verification is skipped to allow
// local development and staging without configuration. In production, always
// set AC_WEBHOOK_SECRET to a strong random value and configure ActiveCampaign
// to send it with every webhook request.
// ============================================================

const AC_WEBHOOK_SECRET = process.env.AC_WEBHOOK_SECRET

function verifyWebhookSecret(request: NextRequest): NextResponse | null {
  if (!AC_WEBHOOK_SECRET) return null

  const headerSecret = request.headers.get('x-webhook-secret')
  const urlSecret = request.nextUrl.searchParams.get('secret')
  const provided = headerSecret ?? urlSecret ?? ''

  try {
    const expected = Buffer.from(AC_WEBHOOK_SECRET, 'utf8')
    const actual = Buffer.from(provided, 'utf8')
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return null
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// PROGRAM_INTEREST dropdown field values (field 3) → CLASS_TAGS keys
// These match the exact values added to the AC dropdown options
const PROGRAM_VALUE_TO_TAG: Record<string, number> = {
  'little_tennis_stars': CLASS_TAGS.little_tennis_stars,
  'red_ball': CLASS_TAGS.red_ball,
  'orange_ball': CLASS_TAGS.orange_ball,
  'green_dot': CLASS_TAGS.green_dot,
  'youth_development': CLASS_TAGS.youth_development,
  'high_performance': CLASS_TAGS.high_performance,
  'adult_beginner_1': CLASS_TAGS.adult_beginner,
  'adult_beginner_2': CLASS_TAGS.adult_beginner_bridge,
  'adult_intermediate': CLASS_TAGS.adult_intermediate,
  'adult_advanced': CLASS_TAGS.adult_advanced,
  'liveball_intermediate': CLASS_TAGS.live_ball_intermediate,
  'liveball_advanced': CLASS_TAGS.live_ball_advanced,
  'cardio_tennis': CLASS_TAGS.cardio,
  'private_lessons': CLASS_TAGS.private_lessons,
}

// Lead source/interest/type tags → default class tag (fallback when no field-level match)
const SOURCE_TAG_TO_CLASS_TAG: Record<number, number> = {
  [INTEREST_TAGS.junior_program]: CLASS_TAGS.youth_development,   // 213 → 148
  [TYPE_TAGS.junior]: CLASS_TAGS.high_performance,                // 190 → 149
  [INTEREST_TAGS.adult_program]: CLASS_TAGS.adult_beginner,       // 212 → 150 (refined by TENNIS_LEVEL)
}

export async function POST(request: NextRequest) {
  // In production, require webhook secret (401 if unset)
  if (process.env.NODE_ENV === 'production' && !AC_WEBHOOK_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const authError = verifyWebhookSecret(request)
  if (authError) return authError

  // Rate limit webhook requests (allow on failure to avoid blocking legitimate traffic)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
  try {
    const rl = await rateLimit(`webhook:${ip}`, RATE_LIMITS.webhook)
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
  } catch {
    // Allow request if rate-limit check fails (e.g. KV unavailable)
  }

  try {
    if (!hasEnvVar('ACTIVECAMPAIGN_URL') || !hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      console.error('[activecampaign-webhook] Missing ACTIVECAMPAIGN_URL or ACTIVECAMPAIGN_API_KEY')
      return NextResponse.json(
        { success: false, error: 'Webhook not configured' },
        { status: 503 }
      )
    }

    // Parse and validate webhook payload from ActiveCampaign
    const parsed = await parseJsonBody(request)
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
    const validation = validateRequest(webhookPayloadSchema, parsed.data)
    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[activecampaign-webhook] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }
    const data: WebhookPayload = validation.data

    if (process.env.NODE_ENV !== 'production') {
      console.log('[activecampaign-webhook] Received', { hasContactId: !!(data.contact?.id || data.contact_id || data.id) })
    }

    // ActiveCampaign sends different formats depending on webhook type.
    // Normalize to a positive integer to prevent path manipulation.
    const rawContactId = data.contact?.id ?? data.contact_id ?? data.id
    if (rawContactId == null || rawContactId === '') {
      console.log('[activecampaign-webhook] No contact ID in webhook, skipping')
      return NextResponse.json({ success: true, message: 'No contact ID' })
    }
    const contactIdNum =
      typeof rawContactId === 'number'
        ? rawContactId
        : parseInt(String(rawContactId), 10)
    if (!Number.isInteger(contactIdNum) || contactIdNum < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact ID' },
        { status: 400 }
      )
    }
    const contactId = contactIdNum

    if (process.env.NODE_ENV !== 'production') {
      console.log('[activecampaign-webhook] Processing contact ID:', contactId)
    }

    // Step 1: Get contact details, field values, and tags via consolidated module
    const contactResult = await getContact(contactId)
    if (!contactResult.success || !contactResult.data) {
      console.error('[activecampaign-webhook] Failed to fetch contact:', contactId)
      return NextResponse.json(
        { success: false, error: 'Could not fetch contact' },
        { status: 502 }
      )
    }

    const { fieldValues, tags: currentTagIds } = contactResult.data

    // CRITICAL: Check lead source and handle appropriately
    // Field 11 = LEAD_SOURCE (updated from old field 15)
    const leadSourceField = fieldValues.find((fv) => fv.field === '11')
    const leadSource = leadSourceField?.value || 'unknown'

    if (leadSource === 'website' || leadSource === 'website_jtt') {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[activecampaign-webhook] Skipping - website registration already processed')
      }
      return NextResponse.json({
        success: true,
        message: 'Website registration - skipped duplicate processing',
      })
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[activecampaign-webhook] Lead source:', leadSource, '| Tags:', currentTagIds.length)
    }

    // Step 2: Add to LBTA master list if not already on it
    const alreadyOnList = await isOnList(contactId, LBTA_LIST_ID)
    if (!alreadyOnList) {
      await addToList(contactId, LBTA_LIST_ID)
    }

    // Step 3: Apply season tag if not already applied
    const seasonTagId = CAMPAIGN_TAGS.winter_2026  // 228
    if (!currentTagIds.includes(seasonTagId)) {
      await addTag(contactId, seasonTagId)
    }

    // Step 4: Determine the appropriate class tag
    let classTagId: number | null = null

    // Method 1: Check PROGRAM_INTEREST dropdown field (field 3) - most reliable
    const programInterestField = fieldValues.find((fv) => fv.field === '3')
    if (programInterestField?.value) {
      const programValue = programInterestField.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
      classTagId = PROGRAM_VALUE_TO_TAG[programValue] || null
    }

    // Method 2: Check TENNIS_LEVEL field (field 5) for adult level (if no program specified)
    const tennisLevelField = fieldValues.find((fv) => fv.field === '5')
    if (!classTagId && tennisLevelField?.value) {
      classTagId = getClassTagFromLevel(tennisLevelField.value)
    }

    // Method 3: Check PROGRAM field (field 7) for program interest text
    if (!classTagId) {
      const programField = fieldValues.find((fv) => fv.field === '7')
      if (programField?.value) {
        classTagId = getClassTagFromProgram(programField.value)
      }
    }

    // Method 4: Check existing source/interest tags for default class mapping
    if (!classTagId) {
      for (const [sourceTagId, defaultClassTag] of Object.entries(SOURCE_TAG_TO_CLASS_TAG)) {
        const srcId = parseInt(sourceTagId)
        if (currentTagIds.includes(srcId)) {
          // For adult program interest, refine by tennis level if available
          if (srcId === INTEREST_TAGS.adult_program && tennisLevelField?.value) {
            classTagId = getClassTagFromLevel(tennisLevelField.value) || defaultClassTag
          } else {
            classTagId = defaultClassTag
          }
          break
        }
      }
    }

    // Step 5: Apply class tag if determined and not already applied
    if (classTagId && !currentTagIds.includes(classTagId)) {
      await addTag(contactId, classTagId)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[activecampaign-webhook] Error:', message)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle GET for webhook verification
export async function GET(request: NextRequest) {
  const authError = verifyWebhookSecret(request)
  if (authError) return authError

  return NextResponse.json({
    success: true,
    message: 'ActiveCampaign webhook endpoint is active',
  })
}
