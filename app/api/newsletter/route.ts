import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// ActiveCampaign newsletter signup handler - v2

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json()

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    console.log('📧 Newsletter subscription request:', {
      email,
      acUrl: acUrl || 'NOT SET',
      acApiKeyLength: acApiKey?.length || 0,
      timestamp: new Date().toISOString()
    })

    // Validate environment variables
    if (!acUrl || !acApiKey) {
      console.error('Missing ActiveCampaign env vars:', { acUrl: !!acUrl, acApiKey: !!acApiKey })
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create/update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email: email,
          firstName: firstName || '',
          lastName: lastName || '',
          fieldValues: [
            { field: '15', value: 'newsletter' }  // LEAD_SOURCE
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

    // Add to Newsletter list (List ID 4 - main list, or create a separate newsletter list)
    if (contactResponse.data?.contact?.id) {
      const contactId = contactResponse.data.contact.id

      await axios.post(
        `${acUrl}/api/3/contactLists`,
        {
          contactList: {
            list: 4,  // Main LBTA list - adjust if you have a specific newsletter list
            contact: contactId,
            status: 1  // Active subscriber
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

      // Apply newsletter subscriber tag (tag ID 50 - create this in AC if needed)
      try {
        await axios.post(
          `${acUrl}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: '74'  // newsletter_subscriber tag
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
        console.error('Newsletter tag error:', tagError)
        // Continue even if tagging fails
      }

      console.log('✅ Newsletter subscription:', {
        contactId,
        email,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' })
  } catch (error: any) {
    const errorDetails = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
      url: error.config?.url
    }
    console.error('Newsletter error:', errorDetails)
    // Temporarily return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        message: 'Error subscribing. Please try again.',
        debug: {
          errorMessage: error.message,
          errorCode: error.code,
          apiUrl: error.config?.url?.replace(/api-us1\.com.*/, 'api-us1.com/...'),
          responseStatus: error.response?.status,
          responseData: error.response?.data
        }
      },
      { status: 500 }
    )
  }
}
