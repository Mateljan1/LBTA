import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'skillLevel', 'experience']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    // Create/update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          fieldValues: [
            { field: '7', value: data.program || 'General Registration' },  // PROGRAM
            { field: '15', value: 'registration' }                           // LEAD_SOURCE
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

      // Create a note with registration details
      try {
        await axios.post(
          `${acUrl}/api/3/notes`,
          {
            note: {
              note: `REGISTRATION\n` +
                    `Program: ${data.program || 'Not specified'}\n` +
                    `Season: ${data.season || 'Not specified'}\n` +
                    `Age: ${data.age}\n` +
                    `Skill Level: ${data.skillLevel}\n` +
                    `Experience: ${data.experience}\n` +
                    `Goals: ${data.goals || 'Not specified'}\n` +
                    `Early Bird: ${data.earlyBird ? 'Yes' : 'No'}\n` +
                    `Price: ${data.finalPrice || 'Contact for pricing'}\n` +
                    `Notes: ${data.notes || 'None'}`,
              relid: contactId,
              reltype: 'Subscriber'
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
      } catch (noteError) {
        console.error('Note creation error:', noteError)
      }

      console.log('✅ Registration submitted:', {
        contactId,
        program: data.program,
        season: data.season,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Registration received. We will contact you within 24 hours.'
    })

  } catch (error: any) {
    console.error('Registration API error:', error.response?.data || error.message)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
