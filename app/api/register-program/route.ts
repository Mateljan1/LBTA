import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, programRegistrationSchema, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import { validateAgentSecret } from '@/lib/agent-auth'
import {
  upsertContact,
  addToList,
  addTags,
  getClassTagFromProgram,
  getProgramCategory,
  LBTA_LIST_ID,
  getWebsiteSignupsListId,
  CAMPAIGN_TAGS,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToGHL } from '@/lib/gohighlevel'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'

// Initialize Notion client lazily
let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

// Helper function to check if Early Bird discount applies
// Early bird = registered 2+ weeks before session start
function isEarlyBird(): boolean {
  const now = new Date()
  // Spring 2026: session starts Apr 6, early bird cutoff = Mar 23
  const earlyBirdDeadline = new Date('2026-03-23T23:59:59')
  return now < earlyBirdDeadline
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

    // Determine category from program name
    const category = getProgramCategory(data.program)

    // Calculate frequency from selected days
    const frequency = data.preferredDays.length

    // 1. Save to Notion (aligned with your database structure)
    if (hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')) {
      try {
        const notion = getNotionClient()
        await notion.pages.create({
          parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
          properties: {
            // Parent Name (Title field)
            'Parent Name': {
              title: [{ text: { content: `${data.firstName} ${data.lastName}` } }],
            },
            // Player Name (student's name)
            'Player Name': {
              rich_text: [
                { text: { content: data.studentName || `${data.firstName} ${data.lastName}` } },
              ],
            },
            // Program
            Program: {
              rich_text: [{ text: { content: data.program } }],
            },
            // Category (auto-determined)
            Category: {
              select: { name: category },
            },
            // Location
            Location: {
              select: { name: data.location || 'Not specified' },
            },
            // Days Selected (multi-select)
            'Days Selected': {
              multi_select: data.preferredDays.map((day: string) => ({ name: day })),
            },
            // Time Slot
            'Time Slot': {
              rich_text: [{ text: { content: data.timeSlot || '' } }],
            },
            // Frequency (days/week)
            'Frequency (days/week)': {
              number: frequency,
            },
            // Tuition
            Tuition: {
              number: parseInt(String(data.totalPrice)) || 0,
            },
            // Age (for juniors/youth)
            Age: {
              number: parseInt(String(data.studentAge)) || null,
            },
            // Parent Email
            'Parent Email': {
              email: data.email,
            },
            // Parent Phone
            'Parent Phone': {
              phone_number: data.phone,
            },
            // Experience Level
            'Experience Level': {
              select: { name: data.experience || 'Not specified' },
            },
            // Status (set to "New" as per your workflow)
            Status: {
              select: { name: 'New' },
            },
            // Timestamp (current date/time)
            Timestamp: {
              date: { start: new Date().toISOString() },
            },
            // Early Bird Applied (checkbox)
            'Early Bird Applied': {
              checkbox: isEarlyBird(),
            },
            // Notes (optional field from form)
            Notes: {
              rich_text: [{ text: { content: data.notes || '' } }],
            },
          },
        })
      } catch (notionError) {
        console.error('[Notion] Error saving registration:', notionError)
        // Continue even if Notion fails
      }
    }

    // 2. Add to ActiveCampaign with automatic tagging
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        console.log('[AC] Processing registration:', {
          program: data.program,
          timestamp: new Date().toISOString(),
        })

        // Format days for display
        const daysSelected = data.preferredDays.join(', ') || 'Not specified'

        // Format tuition
        const tuitionAmount = data.totalPrice ? String(data.totalPrice) : 'Contact for pricing'

        // Create/update contact with all custom fields
        const contactResult = await upsertContact({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          fieldValues: [
            { field: '7', value: data.program || 'Not specified' }, // PROGRAM
            { field: '8', value: data.location || 'Not specified' }, // LOCATION
            { field: '9', value: daysSelected }, // DAYS_SELECTED
            { field: '10', value: tuitionAmount }, // TUITION
            { field: '11', value: 'website' }, // LEAD_SOURCE (for webhook filtering)
          ],
        })

        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          console.log('[AC] Contact created:', { contactId })

          await addToList(contactId, LBTA_LIST_ID)
          const websiteSignupsListId = getWebsiteSignupsListId()
          if (websiteSignupsListId !== null) {
            await addToList(contactId, websiteSignupsListId)
          }
          console.log('[AC] Added to list(s):', { contactId })

          // Apply website_registration + class-specific tag
          const tagsToApply: number[] = [CAMPAIGN_TAGS.website_registration]
          const classTagId = getClassTagFromProgram(data.program)
          if (classTagId) tagsToApply.push(classTagId)
          const tagResult = await addTags(contactId, tagsToApply)
          console.log('[AC] Tags applied:', { contactId, tags: tagsToApply, result: tagResult })
        }
      } catch (acError) {
        console.error('[AC] Error:', acError)
        // Continue even if AC fails
      }
    }

    void sendToGHL({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })

    void storeLead({
      source: 'register-program',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: { program: data.program, location: data.location },
    })
    void notifyRegistration({
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
    })

    // Send branded confirmation email TO the registrant (fire-and-forget).
    // Look up form config by matching program display name to get precise metadata.
    const matchedConfig = Object.values(FORM_CONFIGS).find(
      c => c.prePopulateData.programName === data.program
    )
    if (matchedConfig) {
      const pre = matchedConfig.prePopulateData
      void sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: pre.programName,
        location: pre.location,
        duration: pre.duration,
        ageGroup: pre.ageGroup,
        category: pre.category,
      })
    } else {
      // Fallback: send with whatever data the form submitted
      void sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: data.program,
        location: data.location ?? 'TBD',
        duration: 'TBD',
        category: category,
      })
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
