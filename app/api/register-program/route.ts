import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { programRegistrationSchema, validateRequest } from '@/lib/validations'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTag,
  getClassTagFromProgram,
  getProgramCategory,
  LBTA_LIST_ID,
} from '@/lib/activecampaign'

// Initialize Notion client lazily
let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

// Helper function to check if Early Bird discount applies
function isEarlyBird(): boolean {
  const now = new Date()
  const earlyBirdDeadline = new Date('2025-12-20T23:59:59')
  return now < earlyBirdDeadline
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`register:${ip}`, RATE_LIMITS.form)

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
    const validation = validateRequest(programRegistrationSchema, rawData)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
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
          email: data.email,
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
            { field: '15', value: 'website' }, // LEAD_SOURCE (for webhook filtering)
          ],
        })

        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          console.log('[AC] Contact created:', { contactId, email: data.email })

          // Add to list to trigger automation
          await addToList(contactId, LBTA_LIST_ID)
          console.log('[AC] Added to List 4:', { contactId, email: data.email })

          // Apply class-specific tag for program segmentation
          const classTagId = getClassTagFromProgram(data.program)
          if (classTagId) {
            const tagResult = await addTag(contactId, classTagId)
            if (tagResult.success) {
              console.log('[AC] Class tag applied:', {
                contactId,
                tagId: classTagId,
                program: data.program,
              })
            }
          } else {
            console.log('[AC] No class tag mapping for program:', data.program)
          }
        }
      } catch (acError) {
        console.error('[AC] Error:', acError)
        // Continue even if AC fails
      }
    }

    // 3. Return success
    return NextResponse.json({
      success: true,
      message: 'Registration received! Our team will confirm within 24 hours.',
    })
  } catch (error) {
    console.error('[Registration] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing registration. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
