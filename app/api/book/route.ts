import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    // Create/update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          fieldValues: [
            { field: '7', value: body.program || 'Trial Request' },  // PROGRAM
            { field: '15', value: 'trial_booking' }                   // LEAD_SOURCE
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
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone,
        program: body.program,
        preferredTime: body.preferredTime,
        experience: body.experience,
        goals: body.goals,
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
