import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { Client } from '@notionhq/client'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerYearSchema, validateRequest } from '@/lib/validations'
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
  SEASON_TAGS as AC_SEASON_TAGS,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToAirtable } from '@/lib/airtable-leads'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import { fulfillUtrCircuitRegistration } from '@/lib/fulfill-utr-circuit-registration'
import { determineCategory, isEarlyBird, type RegistrationType } from '@/lib/register-year-shared'
import { buildPendingCityPaymentWorkflow } from '@/lib/lead-workflow'

let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

const REGISTRATION_SEASON_TAGS: Record<string, number> = {
  winter: CAMPAIGN_TAGS.winter_2026,
  spring: CAMPAIGN_TAGS.spring_2026,
  summer: AC_SEASON_TAGS.summer_2025,
  fall: AC_SEASON_TAGS.fall_2025,
}

/** Tags for non-UTR paths (register-year still uses inline AC for seasonal/camp). */
function getApplicableTagsNonUtr(
  data: { season?: string; program?: string; registrationType?: string; division?: string },
  registrationType: RegistrationType
): number[] {
  const tags: number[] = [CAMPAIGN_TAGS.website_registration]

  if (data.season && REGISTRATION_SEASON_TAGS[data.season.toLowerCase()]) {
    tags.push(REGISTRATION_SEASON_TAGS[data.season.toLowerCase()])
  }

  if (data.program) {
    const classTag = getClassTagFromProgram(data.program)
    if (classTag) tags.push(classTag)
  }

  if (registrationType === 'camp') {
    tags.push(CLASS_TAGS.summer_camp)
  }

  return Array.from(new Set(tags))
}

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
    const frequency = (data.preferredDays || []).length

    console.log('[register-year] Received:', {
      type: registrationType,
      timestamp: new Date().toISOString(),
    })

    if (registrationType === 'utr-circuit') {
      const { acSynced } = await fulfillUtrCircuitRegistration(data, {})
      return NextResponse.json({
        success: true,
        message:
          'UTR Match Play Series registration received. Our team will contact you with division placement and next steps.',
        acSynced:
          hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY') ? acSynced : undefined,
      })
    }

    // 1. Save to Notion (seasonal, camp, etc. — not UTR handled above)
    if (hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')) {
      try {
        const notionProperties: Record<string, unknown> = {
          'Player Name': {
            title: [{ text: { content: data.studentName || data.playerName || `${data.firstName} ${data.lastName}` } }],
          },
          'Parent Name': {
            rich_text: [{ text: { content: `${data.firstName} ${data.lastName}` } }],
          },
          'Program': {
            rich_text: [{ text: { content: data.program } }],
          },
          'Category': {
            select: { name: category },
          },
          'Parent Email': {
            email: data.email,
          },
          'Parent Phone': {
            phone_number: data.phone,
          },
          'Status': {
            select: { name: 'New' },
          },
          'Timestamp': {
            date: { start: new Date().toISOString() },
          },
          'Notes': {
            rich_text: [{ text: { content: data.notes || '' } }],
          },
        }

        if (registrationType === 'seasonal') {
          notionProperties['Location'] = { select: { name: data.location || 'Not specified' } }
          notionProperties['Days Selected'] = {
            multi_select: (data.preferredDays || []).map((day: string) => ({ name: day })),
          }
          notionProperties['Time Slot'] = { rich_text: [{ text: { content: data.timeSlot || '' } }] }
          notionProperties['Frequency (days/week)'] = { number: frequency }
          notionProperties['Tuition'] = { number: parseInt(String(data.totalPrice ?? ''), 10) || 0 }
          notionProperties['Age'] = { number: parseInt(String(data.studentAge ?? ''), 10) || null }
          notionProperties['Experience Level'] = { select: { name: data.experience || 'Not specified' } }
          notionProperties['Early Bird Applied'] = { checkbox: isEarlyBird(data.season) }
        }

        if (registrationType === 'camp') {
          notionProperties['Camp Name'] = { rich_text: [{ text: { content: data.campName || data.program } }] }
          notionProperties['Camp Dates'] = { rich_text: [{ text: { content: data.campDates || '' } }] }
          notionProperties['Camp Week'] = { rich_text: [{ text: { content: data.campWeek || '' } }] }
          notionProperties['Tuition'] = { number: parseInt(String(data.price ?? ''), 10) || 0 }
          notionProperties['Age'] = {
            number: parseInt(String(data.playerAge ?? data.studentAge ?? ''), 10) || null,
          }
        }

        const notion = getNotionClient()
        await notion.pages.create({
          parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
          properties: notionProperties as never,
        })

        console.log('[register-year] Notion entry created')
      } catch (notionError) {
        console.error('[register-year] Notion error:', notionError)
      }
    }

    let acSynced = false
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const daysSelected = (data.preferredDays || []).join(', ') || 'N/A'
        const tuitionAmount = data.totalPrice || data.price || 'Contact for pricing'

        const programDisplay = data.season
          ? `${data.program || 'Not specified'} - ${data.season}`
          : data.program || 'Not specified'

        const fieldValues = [
          { field: '7', value: programDisplay },
          { field: '8', value: data.location || 'Not specified' },
          { field: '9', value: daysSelected },
          { field: '10', value: String(tuitionAmount) },
          { field: '11', value: 'website' },
          { field: '12', value: registrationType },
        ]

        const contactResult = await upsertContact({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          fieldValues,
        })

        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          acSynced = true
          console.log('[register-year] AC contact created:', { contactId })

          const websiteSignupsListId = getWebsiteSignupsListId()
          await Promise.all([
            addToList(contactId, LBTA_LIST_ID),
            websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
          ])
          console.log('[register-year] Added to list(s)')

          const tags = getApplicableTagsNonUtr(data, registrationType)
          const tagResult = await addTags(contactId, tags)
          console.log('[register-year] Tags applied:', tagResult)
        } else {
          console.error('[register-year] AC contact upsert failed')
        }
      } catch (acError) {
        console.error('[register-year] ActiveCampaign error:', acError)
        acSynced = false
      }
    }

    waitUntil(
      sendToAirtable({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        program: data.program,
        formSource: `register-year${data.registrationType ? `-${data.registrationType}` : ''}`,
        category: 'registration',
      })
    )

    waitUntil(
      storeLead({
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
      })
    )
    waitUntil(
      notifyRegistration({
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
      })
    )

    const configById = data.programId ? FORM_CONFIGS[data.programId] : undefined
    const matchedConfig =
      configById ?? Object.values(FORM_CONFIGS).find((c) => c.prePopulateData.programName === data.program)
    if (matchedConfig) {
      const pre = matchedConfig.prePopulateData
      waitUntil(
        sendConfirmationEmail({
          email: data.email,
          firstName: data.firstName,
          programName: pre.programName,
          location: pre.location,
          duration: pre.duration,
          ageGroup: pre.ageGroup,
          category: pre.category,
        })
      )
    } else {
      waitUntil(
        sendConfirmationEmail({
          email: data.email,
          firstName: data.firstName,
          programName: data.program,
          location: data.location ?? 'TBD',
          duration: 'TBD',
          category: category,
        })
      )
    }

    let confirmationMessage = 'Registration received! Our team will confirm within 24 hours.'

    if (registrationType === 'camp') {
      confirmationMessage = `Camp registration received! You'll receive a confirmation email with camp details and payment information shortly.`
    } else if (registrationType === 'inquiry') {
      confirmationMessage = `Thank you for your inquiry! Our team will reach out within 24 hours to discuss your options.`
    }

    return NextResponse.json({
      success: true,
      message: confirmationMessage,
      acSynced:
        hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY') ? acSynced : undefined,
    })
  } catch (error) {
    console.error('[register-year] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}
