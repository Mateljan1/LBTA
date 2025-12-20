import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Map program slugs to display names for ActiveCampaign
const programDisplayNames: Record<string, string> = {
  'little-tennis-stars': 'Little Tennis Stars (Ages 3-4)',
  'red-ball': 'Red Ball Tennis (Ages 5-7)',
  'orange-ball': 'Orange Ball Tennis (Ages 7-9)',
  'green-dot': 'Green Dot Tennis (Ages 9-11)',
  'youth-development': 'Youth Development (Ages 11-15)',
  'high-performance': 'High Performance (Ages 12-17)',
  'adult-beginner': 'Adult Beginner (NTRP 1.0-2.5)',
  'adult-intermediate': 'Adult Intermediate (NTRP 3.0-3.5)',
  'adult-advanced': 'Adult Advanced (NTRP 4.0+)',
  'cardio-tennis': 'Cardio Tennis',
  'private-lessons': 'Private Lessons',
  'not-sure': 'Undecided - Needs Consultation',
  'Adult Trial Lesson': 'Adult Trial Lesson',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    // Get display name for program (fall back to raw value if not mapped)
    const programDisplay = programDisplayNames[body.program] || body.program || 'Trial Request'

    // Format preferred days
    const daysSelected = Array.isArray(body.preferredDays)
      ? body.preferredDays.join(', ')
      : (body.preferredDays || 'Flexible')

    // Location with fallback
    const location = body.location || 'TBD - Will be discussed'

    // Create/update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email: body.email,
          firstName: body.firstName || body.name?.split(' ')[0] || '',
          lastName: body.lastName || body.name?.split(' ').slice(1).join(' ') || '',
          phone: body.phone,
          fieldValues: [
            { field: '7', value: programDisplay },                    // PROGRAM (display name)
            { field: '8', value: location },                          // LOCATION
            { field: '9', value: daysSelected },                      // DAYS_SELECTED
            { field: '10', value: 'Trial - No charge' },              // TUITION (trials are free)
            { field: '15', value: body.source || 'trial_booking' }    // LEAD_SOURCE
          ]
        }
      },
      {
        headers: {
          'Api-Token': acApiKey!,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    if (contactResponse.data?.contact?.id) {
      const contactId = contactResponse.data.contact.id

      // Add to main list
      await axios.post(
        `${acUrl}/api/3/contactLists`,
        {
          contactList: {
            list: 4,
            contact: contactId,
            status: 1
          }
        },
        {
          headers: {
            'Api-Token': acApiKey!,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )

      // Apply trial request tag (tag ID 51 - create this in AC if needed)
      try {
        await axios.post(
          `${acUrl}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: '75'  // trial_request tag
            }
          },
          {
            headers: {
              'Api-Token': acApiKey!,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        )
      } catch (tagError) {
        console.error('Trial tag error:', tagError)
      }

      console.log('✅ Trial booking submitted:', {
        contactId,
        name: body.name || `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone,
        programRaw: body.program,
        programDisplay,
        location,
        daysSelected,
        experience: body.experience,
        goals: body.goals,
        source: body.source || 'trial_booking',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true, message: 'Trial request received! We\'ll contact you within 24 hours.' })
  } catch (error: any) {
    console.error('Booking error:', error.response?.data || error.message)
    return NextResponse.json(
      { success: false, message: 'Error processing request. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
