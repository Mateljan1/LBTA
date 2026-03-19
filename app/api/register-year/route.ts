import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerYearSchema, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTags,
  getClassTagFromProgram,
  getUtrDivisionTag,
  LBTA_LIST_ID,
  getWebsiteSignupsListId,
  CAMPAIGN_TAGS,
  CLASS_TAGS,
  INTEREST_TAGS,
  SEASON_TAGS as AC_SEASON_TAGS,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToGHL } from '@/lib/gohighlevel'
import { notifyRegistration } from '@/lib/email'

let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

// ============================================================
// LBTA Year-Round Registration API
// ============================================================
// Handles registrations for:
// - Seasonal Programs (Winter, Spring, Summer, Fall)
// - Holiday Camps (Ski Week, Spring Break, Summer, etc.)
// - JTT (Junior Team Tennis)
// - Swim & Tennis Camp
// ============================================================

// Registration types
type RegistrationType = 'seasonal' | 'camp' | 'utr-circuit' | 'jtt' | 'swim-tennis' | 'private' | 'inquiry'

// Helper function to determine program category
function determineCategory(programName: string, registrationType: RegistrationType): string {
  if (registrationType === 'camp' || registrationType === 'swim-tennis') return 'Camp'
  if (registrationType === 'utr-circuit' || registrationType === 'jtt') return 'Match Play Series'
  if (registrationType === 'private') return 'Private'
  
  const program = programName.toLowerCase()
  
  if (program.includes('little stars') || 
      program.includes('red ball') || 
      program.includes('orange ball') || 
      program.includes('green dot')) {
    return 'Junior'
  }
  
  if (program.includes('youth development') || 
      program.includes('high performance')) {
    return 'Youth'
  }
  
  if (program.includes('cardio') || 
      program.includes('liveball') || 
      program.includes('family tennis') || 
      program.includes('match play')) {
    return 'Fitness'
  }
  
  return 'Adult'
}

// Helper function to check if Early Bird discount applies
function isEarlyBird(season?: string): boolean {
  const now = new Date()

  // Season-specific early bird deadlines
  const earlyBirdDeadlines: Record<string, Date> = {
    'winter': new Date('2025-12-20T23:59:59'),
    'spring': new Date('2026-03-20T23:59:59'),
    'summer': new Date('2026-05-20T23:59:59'),
    'fall': new Date('2026-08-01T23:59:59'),
  }

  if (season && earlyBirdDeadlines[season.toLowerCase()]) {
    return now < earlyBirdDeadlines[season.toLowerCase()]
  }

  // Default to winter deadline
  return now < new Date('2025-12-20T23:59:59')
}

// ============================================================
// ActiveCampaign Tag Mapping
// ============================================================
// Season list tags — winter/spring use 2026 campaign tags; summer/fall use AC season tags until dedicated 2026 list tags exist (see lib/activecampaign SEASON_TAGS).
const REGISTRATION_SEASON_TAGS: Record<string, number> = {
  winter: CAMPAIGN_TAGS.winter_2026,
  spring: CAMPAIGN_TAGS.spring_2026,
  summer: AC_SEASON_TAGS.summer_2025,
  fall: AC_SEASON_TAGS.fall_2025,
}

// Get all applicable tags for a registration
function getApplicableTags(
  data: { season?: string; program?: string; registrationType?: string },
  registrationType: RegistrationType
): number[] {
  const tags: number[] = [CAMPAIGN_TAGS.website_registration] // 180

  // Add season tag if applicable
  if (data.season && REGISTRATION_SEASON_TAGS[data.season.toLowerCase()]) {
    tags.push(REGISTRATION_SEASON_TAGS[data.season.toLowerCase()])
  }

  // Add UTR Match Play / program tag utr_circuit (also handle legacy 'jtt' type)
  if (registrationType === 'utr-circuit' || registrationType === 'jtt') {
    tags.push(CAMPAIGN_TAGS.utr_circuit)     // 242
    tags.push(INTEREST_TAGS.utr_circuit)     // 215
    // Add UTR division tag if specified
    if (data.program) {
      const divisionTag = getUtrDivisionTag(data.program)
      if (divisionTag) tags.push(divisionTag)
    }
  }

  // Add class tag using the consolidated mapping
  if (data.program) {
    const classTag = getClassTagFromProgram(data.program)
    if (classTag) {
      tags.push(classTag)
    }
  }

  // Add summer camp tag for camp registrations
  if (registrationType === 'camp' || registrationType === 'swim-tennis') {
    tags.push(CLASS_TAGS.summer_camp) // 156
  }

  return Array.from(new Set(tags))
}

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
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

    // No PII in logs
    console.log('[register-year] Received:', {
      type: registrationType,
      timestamp: new Date().toISOString(),
    })

    // 1. Save to Notion
    if (hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')) {
    try {
      // Notion SDK property types are deeply nested; using `any` for dynamic property construction
      const notionProperties: Record<string, any> = { // eslint-disable-line
        'Parent Name': {
          title: [{ text: { content: `${data.firstName} ${data.lastName}` } }]
        },
        'Player Name': {
          rich_text: [{ text: { content: data.studentName || data.playerName || `${data.firstName} ${data.lastName}` } }]
        },
        'Program': {
          rich_text: [{ text: { content: data.program } }]
        },
        'Category': {
          select: { name: category }
        },
        'Parent Email': {
          email: data.email
        },
        'Parent Phone': {
          phone_number: data.phone
        },
        'Status': {
          select: { name: 'New' }
        },
        'Timestamp': {
          date: { start: new Date().toISOString() }
        },
        'Notes': {
          rich_text: [{ text: { content: data.notes || '' } }]
        }
      }

      // Add type-specific fields
      if (registrationType === 'seasonal') {
        notionProperties['Location'] = { select: { name: data.location || 'Not specified' } }
        notionProperties['Days Selected'] = { multi_select: (data.preferredDays || []).map((day: string) => ({ name: day })) }
        notionProperties['Time Slot'] = { rich_text: [{ text: { content: data.timeSlot || '' } }] }
        notionProperties['Frequency (days/week)'] = { number: frequency }
        notionProperties['Tuition'] = { number: parseInt(String(data.totalPrice ?? ''), 10) || 0 }
        notionProperties['Age'] = { number: parseInt(String(data.studentAge ?? ''), 10) || null }
        notionProperties['Experience Level'] = { select: { name: data.experience || 'Not specified' } }
        notionProperties['Early Bird Applied'] = { checkbox: isEarlyBird(data.season) }
      }

      if (registrationType === 'camp' || registrationType === 'swim-tennis') {
        notionProperties['Camp Name'] = { rich_text: [{ text: { content: data.campName || data.program } }] }
        notionProperties['Camp Dates'] = { rich_text: [{ text: { content: data.campDates || '' } }] }
        notionProperties['Camp Week'] = { rich_text: [{ text: { content: data.campWeek || '' } }] }
        notionProperties['Tuition'] = { number: parseInt(String(data.price ?? ''), 10) || 0 }
        notionProperties['Age'] = { number: parseInt(String(data.playerAge ?? data.studentAge ?? ''), 10) || null }
      }

      if (registrationType === 'utr-circuit' || registrationType === 'jtt') {
        notionProperties['Division'] = { rich_text: [{ text: { content: data.division || data.program || '' } }] }
        notionProperties['Tuition'] = { number: parseInt(String(data.price ?? ''), 10) || 0 }
        notionProperties['Age'] = { number: parseInt(String(data.playerAge ?? data.studentAge ?? ''), 10) || null }
      }

      const notion = getNotionClient()
      await notion.pages.create({
        parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
        properties: notionProperties
      })

      console.log('[register-year] Notion entry created')
    } catch (notionError) {
      console.error('[register-year] Notion error:', notionError)
      // Continue even if Notion fails
    }
    }

    // 2. Add to ActiveCampaign with proper tagging
    let acSynced = false
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const daysSelected = (data.preferredDays || []).join(', ') || 'N/A'
        const tuitionAmount = data.totalPrice || data.price || 'Contact for pricing'

        // Build program display value (include season if present)
        const programDisplay = data.season
          ? `${data.program || 'Not specified'} - ${data.season}`
          : data.program || 'Not specified'

        const fieldValues = [
          { field: '7', value: programDisplay },                        // PROGRAM
          { field: '8', value: data.location || 'Not specified' },      // LOCATION
          { field: '9', value: daysSelected },                          // DAYS_SELECTED
          { field: '10', value: String(tuitionAmount) },                // TUITION
          { field: '11', value: 'website' },                            // LEAD_SOURCE
          { field: '12', value: registrationType },                     // registration_type
        ]

        // Add Match Play Series / legacy JTT division field
        if (registrationType === 'utr-circuit' || registrationType === 'jtt') {
          fieldValues.push({ field: '15', value: data.division || data.program || '' })
        }

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

          // Add to lists
          const websiteSignupsListId = getWebsiteSignupsListId()
          await Promise.all([
            addToList(contactId, LBTA_LIST_ID),
            websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
          ])
          console.log('[register-year] Added to list(s)')

          // Apply all applicable tags
          const tags = getApplicableTags(data, registrationType)
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

    void sendToGHL({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })

    void storeLead({
      source: 'register-year',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: {
        registrationType: data.registrationType,
        program: data.program,
        season: data.season,
      },
    })
    void notifyRegistration({
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

    // 3. Return success with confirmation message based on type
    let confirmationMessage = 'Registration received! Our team will confirm within 24 hours.'
    
    if (registrationType === 'camp' || registrationType === 'swim-tennis') {
      confirmationMessage = `Camp registration received! You'll receive a confirmation email with camp details and payment information shortly.`
    } else if (registrationType === 'utr-circuit' || registrationType === 'jtt') {
      confirmationMessage = `UTR Match Play Series registration received. Our team will contact you with division placement and next steps.`
    } else if (registrationType === 'inquiry') {
      confirmationMessage = `Thank you for your inquiry! Our team will reach out within 24 hours to discuss your options.`
    }

    return NextResponse.json({
      success: true,
      message: confirmationMessage,
      acSynced: hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY') ? acSynced : undefined,
    })
  } catch (error) {
    console.error('[register-year] Error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Error processing registration. Please call (949) 534-0457' },
      { status: 500 }
    )
  }
}

