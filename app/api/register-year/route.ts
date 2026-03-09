import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import axios from 'axios'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, registerYearSchema, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import { storeLead } from '@/lib/leads-store'

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
type RegistrationType = 'seasonal' | 'camp' | 'jtt' | 'swim-tennis' | 'private' | 'inquiry'

// Helper function to determine program category
function determineCategory(programName: string, registrationType: RegistrationType): string {
  if (registrationType === 'camp' || registrationType === 'swim-tennis') return 'Camp'
  if (registrationType === 'jtt') return 'JTT'
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
// Season Tags (for email automations)
const SEASON_TAGS: Record<string, number> = {
  'winter': 27,      // LBTA_Winter2026
  'spring': 50,      // LBTA_Spring2026
  'summer': 51,      // LBTA_Summer2026
  'fall': 52,        // LBTA_Fall2026
}

// Camp Tags
const CAMP_TAGS: Record<string, number> = {
  'swim-tennis': 60,      // camp:swim_tennis
  'ski-week': 61,         // camp:ski_week
  'spring-break': 62,     // camp:spring_break
  'summer': 63,           // camp:summer
  'back-to-school': 64,   // camp:back_to_school
  'thanksgiving': 65,     // camp:thanksgiving
  'winter-break': 66,     // camp:winter_break
}

// JTT Tags
const JTT_TAGS: Record<string, number> = {
  'spring-jtt': 70,       // jtt:spring
  'fall-jtt': 71,         // jtt:fall
  '10u': 72,              // jtt:10u
  '12u': 73,              // jtt:12u
  '14u': 74,              // jtt:14u
  '18u': 75,              // jtt:18u
}

// Class-specific tags (existing)
const CLASS_TAGS: Record<string, number> = {
  'little-stars': 49,
  'red-ball': 38,
  'orange-ball': 39,
  'green-dot': 40,
  'youth-development': 21,
  'high-performance': 41,
  'adult-beginner': 17,
  'adult-beginner-bridge': 42,
  'adult-intermediate': 16,
  'adult-advanced': 15,
  'cardio': 14,
  'liveball-intermediate': 19,
  'liveball-advanced': 18,
}

// Registration source tag
const WEBSITE_REGISTRATION_TAG = 33  // Winter 2026 - Website Registration

// Get all applicable tags for a registration
function getApplicableTags(data: any): number[] {
  const tags: number[] = [WEBSITE_REGISTRATION_TAG]  // Always add website registration tag
  
  const registrationType = data.registrationType as RegistrationType
  
  // Add season tag if applicable
  if (data.season && SEASON_TAGS[data.season.toLowerCase()]) {
    tags.push(SEASON_TAGS[data.season.toLowerCase()])
  }
  
  // Add camp tag
  if (registrationType === 'camp' || registrationType === 'swim-tennis') {
    const campId = data.campId || data.programId
    if (campId && CAMP_TAGS[campId]) {
      tags.push(CAMP_TAGS[campId])
    }
  }
  
  // Add JTT tags
  if (registrationType === 'jtt') {
    const jttId = data.jttId || data.programId
    if (jttId && JTT_TAGS[jttId]) {
      tags.push(JTT_TAGS[jttId])
    }
    // Add division tag
    if (data.division && JTT_TAGS[data.division.toLowerCase()]) {
      tags.push(JTT_TAGS[data.division.toLowerCase()])
    }
  }
  
  // Add class tag for seasonal programs
  if (registrationType === 'seasonal') {
    const programId = data.programId?.toLowerCase().replace(/\s+/g, '-')
    if (programId && CLASS_TAGS[programId]) {
      tags.push(CLASS_TAGS[programId])
    }
  }
  
  return Array.from(new Set(tags))  // Remove duplicates
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`register-year:${ip}`, RATE_LIMITS.form)

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
      return NextResponse.json(
        { success: false, error: validation.error },
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
      const notionProperties: any = {
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

      if (registrationType === 'jtt') {
        notionProperties['JTT Season'] = { rich_text: [{ text: { content: data.jttSeason || '' } }] }
        notionProperties['Division'] = { rich_text: [{ text: { content: data.division || '' } }] }
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
      // Format display values
      const daysSelected = (data.preferredDays || []).join(', ') || 'N/A'
      const tuitionAmount = data.totalPrice || data.price || 'Contact for pricing'
      
      // Build custom field values based on registration type
      const fieldValues = [
        { field: '7', value: data.program || 'Not specified' },        // PROGRAM
        { field: '8', value: data.location || 'Not specified' },       // LOCATION
        { field: '9', value: daysSelected },                           // DAYS_SELECTED
        { field: '10', value: String(tuitionAmount) },                 // TUITION
        { field: '15', value: 'website' },                             // LEAD_SOURCE
        { field: '16', value: registrationType },                      // REGISTRATION_TYPE
        { field: '17', value: data.season || 'N/A' },                  // SEASON
      ]

      // Add camp-specific fields
      if (registrationType === 'camp' || registrationType === 'swim-tennis') {
        fieldValues.push({ field: '18', value: data.campDates || '' })  // CAMP_DATES
        fieldValues.push({ field: '19', value: data.campWeek || '' })   // CAMP_WEEK
      }

      // Add JTT-specific fields
      if (registrationType === 'jtt') {
        fieldValues.push({ field: '20', value: data.jttSeason || '' })  // JTT_SEASON
        fieldValues.push({ field: '21', value: data.division || '' })   // JTT_DIVISION
      }

      const acUrl = getEnvVar('ACTIVECAMPAIGN_URL')
      const acKey = getEnvVar('ACTIVECAMPAIGN_API_KEY')

      // Create/update contact
      const contactResponse = await axios.post(
        `${acUrl}/api/3/contacts`,
        {
          contact: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            fieldValues
          }
        },
        {
          headers: {
            'Api-Token': acKey,
            'Content-Type': 'application/json'
          }
        }
      )

      const rawContactId = contactResponse.data?.contact?.id
      const contactId =
        typeof rawContactId === 'number' && Number.isInteger(rawContactId) && rawContactId > 0
          ? rawContactId
          : null
      if (contactId == null) {
        console.error('[register-year] ActiveCampaign did not return a valid contact id:', rawContactId)
        return NextResponse.json(
          { success: false, error: 'Registration received. We could not complete all steps; we will contact you shortly.', acSynced: false },
          { status: 503 }
        )
      }
      acSynced = true
      console.log('[register-year] AC contact created')

      // Add to list (triggers automation)
      await axios.post(
        `${acUrl}/api/3/contactLists`,
        {
          contactList: {
            list: 4,  // Laguna Beach Tennis Academy list
            contact: contactId,
            status: 1  // Active subscriber
          }
        },
        {
          headers: {
            'Api-Token': acKey,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('[register-year] Added to list')

      // Apply all applicable tags
      const tags = getApplicableTags(data)

      for (const tagId of tags) {
        try {
          await axios.post(
            `${acUrl}/api/3/contactTags`,
            {
              contactTag: {
                contact: contactId,
                tag: tagId.toString()
              }
            },
            {
              headers: {
                'Api-Token': acKey,
                'Content-Type': 'application/json'
              }
            }
          )
        } catch (tagError: unknown) {
          const err = tagError as { response?: { data?: unknown }; message?: string }
          console.error('[register-year] Failed to apply tag:', err.response?.data ?? err.message)
        }
      }

    } catch (acError: unknown) {
      const err = acError as { response?: { data?: unknown }; message?: string }
      console.error('[register-year] ActiveCampaign error:', err.response?.data ?? err.message)
      acSynced = false
      // Continue; response will include acSynced: false
    }
    }

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

    // 3. Return success with confirmation message based on type
    let confirmationMessage = 'Registration received! Our team will confirm within 24 hours.'
    
    if (registrationType === 'camp' || registrationType === 'swim-tennis') {
      confirmationMessage = `Camp registration received! You'll receive a confirmation email with camp details and payment information shortly.`
    } else if (registrationType === 'jtt') {
      confirmationMessage = `JTT registration received! Our team will contact you with team placement information and next steps.`
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

