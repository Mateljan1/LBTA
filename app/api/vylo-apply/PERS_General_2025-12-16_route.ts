import { NextRequest, NextResponse } from 'next/server'

const ACTIVE_CAMPAIGN_API_URL = process.env.ACTIVE_CAMPAIGN_API_URL
const ACTIVE_CAMPAIGN_API_KEY = process.env.ACTIVE_CAMPAIGN_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone, playerUTR } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Step 1: Create or update contact in ActiveCampaign
    const contactData = {
      contact: {
        email,
        firstName,
        lastName,
        phone: phone || '',
        fieldValues: playerUTR ? [
          {
            field: '1', // You'll need to replace this with the actual custom field ID for UTR
            value: playerUTR,
          }
        ] : [],
      }
    }

    const contactResponse = await fetch(`${ACTIVE_CAMPAIGN_API_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers: {
        'Api-Token': ACTIVE_CAMPAIGN_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json()
      console.error('ActiveCampaign contact error:', errorData)
      throw new Error('Failed to create contact')
    }

    const contactResult = await contactResponse.json()
    const contactId = contactResult.contact.id

    // Step 2: Get or create the "VYLO - Founding Cohort Interest" tag
    // First, search for the tag
    const tagsResponse = await fetch(
      `${ACTIVE_CAMPAIGN_API_URL}/api/3/tags?search=VYLO`,
      {
        headers: {
          'Api-Token': ACTIVE_CAMPAIGN_API_KEY || '',
        },
      }
    )

    let tagId = null
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json()
      const vyloTag = tagsData.tags?.find((tag: any) =>
        tag.tag === 'VYLO - Founding Cohort Interest'
      )
      tagId = vyloTag?.id
    }

    // If tag doesn't exist, create it
    if (!tagId) {
      const createTagResponse = await fetch(`${ACTIVE_CAMPAIGN_API_URL}/api/3/tags`, {
        method: 'POST',
        headers: {
          'Api-Token': ACTIVE_CAMPAIGN_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag: {
            tag: 'VYLO - Founding Cohort Interest',
            tagType: 'contact',
            description: 'Leads who registered interest for VYLO Founding Cohort Jan 2026',
          },
        }),
      })

      if (createTagResponse.ok) {
        const tagData = await createTagResponse.json()
        tagId = tagData.tag.id
      }
    }

    // Step 3: Add tag to contact
    if (tagId) {
      await fetch(`${ACTIVE_CAMPAIGN_API_URL}/api/3/contactTags`, {
        method: 'POST',
        headers: {
          'Api-Token': ACTIVE_CAMPAIGN_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactTag: {
            contact: contactId,
            tag: tagId,
          },
        }),
      })
    }

    // Optional: Add to a specific list (if you have a VYLO list)
    // Uncomment and update list ID when ready:
    /*
    await fetch(`${ACTIVE_CAMPAIGN_API_URL}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Api-Token': ACTIVE_CAMPAIGN_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactList: {
          list: 'YOUR_VYLO_LIST_ID', // Replace with actual list ID
          contact: contactId,
          status: 1, // 1 = subscribed
        },
      }),
    })
    */

    return NextResponse.json({
      success: true,
      message: 'Successfully registered interest',
      contactId,
    })

  } catch (error) {
    console.error('VYLO Apply API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
