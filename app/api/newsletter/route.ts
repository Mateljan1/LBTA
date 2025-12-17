import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import axios from 'axios'

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per minute per IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = rateLimit(`newsletter:${ip}`, { interval: 60000, maxRequests: 3 })

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const { email, firstName, lastName } = await request.json()

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

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
    console.error('Newsletter error:', error.response?.data || error.message)
    return NextResponse.json(
      { success: false, message: 'Error subscribing. Please try again.' },
      { status: 500 }
    )
  }
}
