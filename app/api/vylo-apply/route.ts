import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone, playerUTR } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    // Create or update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email,
          firstName,
          lastName,
          phone: phone || '',
          fieldValues: [
            { field: '15', value: 'vylo_interest' },  // LEAD_SOURCE
            ...(playerUTR ? [{ field: '1', value: playerUTR }] : [])
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

    // Search for VYLO tag or create it
    let tagId = null
    try {
      const tagsResponse = await axios.get(
        `${acUrl}/api/3/tags?search=VYLO`,
        {
          headers: { 'Api-Token': acApiKey! }
        }
      )
      const vyloTag = tagsResponse.data.tags?.find((tag: any) =>
        tag.tag === 'VYLO - Founding Cohort Interest'
      )
      tagId = vyloTag?.id

      // Create tag if it doesn't exist
      if (!tagId) {
        const createTagResponse = await axios.post(
          `${acUrl}/api/3/tags`,
          {
            tag: {
              tag: 'VYLO - Founding Cohort Interest',
              tagType: 'contact',
              description: 'Leads who registered interest for VYLO Founding Cohort Jan 2026',
            }
          },
          {
            headers: {
              'Api-Token': acApiKey!,
              'Content-Type': 'application/json'
            }
          }
        )
        tagId = createTagResponse.data.tag.id
      }

      // Apply tag
      if (tagId) {
        await axios.post(
          `${acUrl}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: tagId
            }
          },
          {
            headers: {
              'Api-Token': acApiKey!,
              'Content-Type': 'application/json'
            }
          }
        )
      }
    } catch (tagError) {
      console.error('VYLO tag error:', tagError)
    }

    console.log('✅ VYLO interest registered:', {
      contactId,
      email,
      name: `${firstName} ${lastName}`,
      utr: playerUTR,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully registered interest',
      contactId,
    })

  } catch (error: any) {
    console.error('VYLO Apply API Error:', error.response?.data || error.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
