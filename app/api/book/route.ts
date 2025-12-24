import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import axios from 'axios'

// ============================================================
// LBTA Booking/Trial Request API
// ============================================================
// Handles trial class requests and general booking inquiries
// Integrates with ActiveCampaign for contact management and email automation
// ============================================================

// Tag IDs for program categories
const PROGRAM_TAGS: Record<string, number> = {
  'little-tennis-stars': 49,
  'red-ball': 38,
  'orange-ball': 39,
  'green-dot': 40,
  'youth-development': 21,
  'high-performance': 41,
  'adult-beginner': 17,
  'adult-intermediate': 16,
  'adult-advanced': 15,
  'cardio-tennis': 14,
  'private-lessons': 80, // Private lesson inquiry tag
  'not-sure': 81, // General inquiry tag
}

// Website registration tag
const WEBSITE_REGISTRATION_TAG = 33
// Trial request tag
const TRIAL_REQUEST_TAG = 82

// Determine category from program
function determineCategory(program: string): string {
  const p = program.toLowerCase()
  
  if (p.includes('little') || p.includes('red') || p.includes('orange') || p.includes('green')) {
    return 'Junior'
  }
  if (p.includes('youth') || p.includes('high-performance')) {
    return 'Youth'
  }
  if (p.includes('cardio') || p.includes('liveball')) {
    return 'Fitness'
  }
  if (p.includes('private')) {
    return 'Private'
  }
  return 'Adult'
}

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute per IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = rateLimit(`book:${ip}`, { interval: 60000, maxRequests: 5 })

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    )
  }

  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    console.log('🎾 LBTA Trial Request:', {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      program: body.program,
      timestamp: new Date().toISOString()
    })

    // Determine program category
    const category = determineCategory(body.program || '')
    const daysSelected = (body.preferredDays || []).join(', ') || 'Flexible'

    // 1. Create/Update contact in ActiveCampaign
    try {
      const contactResponse = await axios.post(
        `${process.env.ACTIVECAMPAIGN_URL}/api/3/contacts`,
        {
          contact: {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            fieldValues: [
              { field: '7', value: body.program || 'Trial Request' },    // PROGRAM
              { field: '8', value: body.location || 'Not specified' },   // LOCATION
              { field: '9', value: daysSelected },                        // DAYS_SELECTED
              { field: '15', value: 'website' },                          // LEAD_SOURCE
              { field: '16', value: 'trial' },                            // REGISTRATION_TYPE
              { field: '22', value: body.experience || 'Not specified' }, // EXPERIENCE_LEVEL
              { field: '23', value: body.goals || '' },                   // GOALS
            ]
          }
        },
        {
          headers: {
            'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )

      const contactId = contactResponse.data.contact.id
      console.log('✅ AC Contact Created:', { contactId, email: body.email })

      // 2. Add to list (triggers welcome/confirmation automation)
      await axios.post(
        `${process.env.ACTIVECAMPAIGN_URL}/api/3/contactLists`,
        {
          contactList: {
            list: 4,  // Laguna Beach Tennis Academy list
            contact: contactId,
            status: 1  // Active subscriber
          }
        },
        {
          headers: {
            'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('✅ Added to List 4:', { contactId, email: body.email })

      // 3. Apply tags
      const tagsToApply = [WEBSITE_REGISTRATION_TAG, TRIAL_REQUEST_TAG]
      
      // Add program-specific tag if available
      if (body.program && PROGRAM_TAGS[body.program]) {
        tagsToApply.push(PROGRAM_TAGS[body.program])
      }

      for (const tagId of tagsToApply) {
        try {
          await axios.post(
            `${process.env.ACTIVECAMPAIGN_URL}/api/3/contactTags`,
            {
              contactTag: {
                contact: contactId,
                tag: tagId.toString()
              }
            },
            {
              headers: {
                'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
                'Content-Type': 'application/json'
              }
            }
          )
          console.log(`✅ Tag ${tagId} applied to contact ${contactId}`)
        } catch (tagError: any) {
          console.error(`⚠️ Failed to apply tag ${tagId}:`, tagError.response?.data || tagError.message)
        }
      }

      console.log('✅ All tags applied:', { contactId, tags: tagsToApply, email: body.email })

    } catch (acError: any) {
      console.error('❌ ActiveCampaign Error:', {
        email: body.email,
        error: acError.response?.data || acError.message
      })
      // Continue even if AC fails - we don't want to block the user
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Trial request received! You\'ll receive a confirmation email shortly, and our team will contact you within 24 hours.' 
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing request. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
