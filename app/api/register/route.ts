import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerSchema, validateRequest } from '@/lib/validations'
import { hasEnvVar } from '@/lib/env'
import { validateAgentSecret } from '@/lib/agent-auth'
import {
  upsertContact,
  addToList,
  addTags,
  getClassTagFromProgram,
  getClassTagFromLevel,
  LBTA_LIST_ID,
  getWebsiteSignupsListId,
  CAMPAIGN_TAGS,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToAirtable } from '@/lib/airtable-leads'
import { writeNotionLead } from '@/lib/notion-leads'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import { buildPendingCityPaymentWorkflow } from '@/lib/lead-workflow'

export async function POST(request: NextRequest) {
  // Agent auth: validate X-Agent-Secret header if present (for agent tool calls)
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

    // Log without PII: program/season only
    console.log('[register] Received', {
      program: data.program ?? 'unspecified',
      season: data.season ?? 'unspecified',
      timestamp: new Date().toISOString(),
    })

    // ActiveCampaign: create/update contact with tags
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const contactResult = await upsertContact({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          fieldValues: [
            { field: '7', value: data.program || 'Not specified' },
            { field: '5', value: data.experience || 'Not specified' },
            { field: '11', value: 'website' },
          ],
        })
        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          const websiteSignupsListId = getWebsiteSignupsListId()
          await Promise.all([
            addToList(contactId, LBTA_LIST_ID),
            websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
          ])
          const tagsToApply: number[] = [CAMPAIGN_TAGS.website_registration]
          const classTag = data.program ? getClassTagFromProgram(data.program) : null
          const levelTag = data.skillLevel ? getClassTagFromLevel(data.skillLevel) : null
          if (classTag) tagsToApply.push(classTag)
          else if (levelTag) tagsToApply.push(levelTag)
          await addTags(contactId, tagsToApply)
        }
      } catch (acError) {
        console.error('[register] AC error:', acError)
      }
    }

    waitUntil(sendToAirtable({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      program: data.program,
      formSource: 'register',
      category: 'registration',
    }))

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
    waitUntil(writeNotionLead({
      parentName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      program: data.program ?? 'Not specified',
      category: 'Adult',
    }))
    waitUntil(notifyRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      program: data.program ?? 'Not specified',
      season: data.season,
      experience: data.experience,
    }))

    // Send branded confirmation email TO the registrant
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
