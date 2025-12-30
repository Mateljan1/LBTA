import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// ============================================================
// ActiveCampaign Webhook Handler - LBTA Auto-Tagging System
// ============================================================
// This endpoint receives webhooks from ActiveCampaign when:
// - New contact is created (from Facebook Lead Ads, forms, etc.)
// - Contact is updated
//
// It automatically:
// 1. Adds the contact to List 4 (LBTA master list)
// 2. Applies the LBTA_Winter2026 tag (27) to trigger confirmation email
// 3. Applies the appropriate class-specific tag based on their level/interest
// ============================================================

const AC_URL = process.env.ACTIVECAMPAIGN_URL
const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY

// Tag mapping based on TENNIS_LEVEL custom field values (from Facebook Lead Ads)
const LEVEL_TO_TAG: { [key: string]: number } = {
  // Facebook Lead Ad level options
  'complete_beginner': 17,      // class:adult_beginner
  'some_experience': 16,        // class:adult_intermediate
  'intermediate_advanced': 15,  // class:adult_advanced
  'beginner': 17,               // class:adult_beginner
  'intermediate': 16,           // class:adult_intermediate
  'advanced': 15,               // class:adult_advanced
}

// Tag mapping based on PROGRAM_INTEREST dropdown field values (field 3)
// These match the exact values we added to the dropdown options
const PROGRAM_VALUE_TO_TAG: { [key: string]: number } = {
  // Junior Programs
  'little_tennis_stars': 37,   // class:little_stars
  'red_ball': 38,              // class:red_ball
  'orange_ball': 39,           // class:orange_ball
  'green_dot': 40,             // class:green_dot

  // Youth Programs
  'youth_development': 21,     // class:youth_development
  'high_performance': 41,      // class:high_performance

  // Adult Programs
  'adult_beginner_1': 17,      // class:adult_beginner
  'adult_beginner_2': 47,      // class:adult_beginner_2
  'adult_intermediate': 16,    // class:adult_intermediate
  'adult_advanced': 15,        // class:adult_advanced

  // Fitness Programs
  'liveball_intermediate': 19, // class:live_ball_intermediate
  'liveball_advanced': 18,     // class:live_ball_advanced
  'cardio_tennis': 14,         // class:cardio

  // Special
  'private_lessons': 48,       // class:private_lessons
}

// Tag mapping based on program/interest field text (fallback for text fields)
const INTEREST_TO_TAG: { [key: string]: number } = {
  // Junior Programs
  'little stars': 37,
  'little tennis stars': 37,
  'red ball': 38,
  'orange ball': 39,
  'green dot': 40,

  // Youth Programs
  'youth development': 21,
  'youth program': 21,
  'high performance': 41,

  // Adult Programs
  'bridge': 47,
  'beginner 2': 47,
  'adult beginner': 17,
  'adult intermediate': 16,
  'adult advanced': 15,

  // Fitness Programs
  'cardio': 14,
  'cardio tennis': 14,
  'liveball advanced': 18,
  'live ball advanced': 18,
  'liveball intermediate': 19,
  'live ball intermediate': 19,
  'liveball': 19,  // Default to intermediate
  'live ball': 19,

  // Seasonal
  'summer camp': 13,
  'camp': 13,

  // Special
  'private': 48,
  'private lessons': 48,
}

// Lead source tags that indicate program interest
const SOURCE_TAG_TO_CLASS_TAG: { [key: number]: number } = {
  24: 21,  // Youth Development Lead → class:youth_development
  25: 41,  // High Performance Lead → class:high_performance
  26: 17,  // Adult Programming Lead → class:adult_beginner (will be refined by TENNIS_LEVEL)
}

// Helper function to determine class tag from program interest text
function getClassTagFromInterest(interestText: string): number | null {
  const text = interestText.toLowerCase()

  for (const [keyword, tagId] of Object.entries(INTEREST_TO_TAG)) {
    if (text.includes(keyword)) {
      return tagId
    }
  }

  return null
}

// Helper function to get class tag from tennis level
function getClassTagFromLevel(level: string): number | null {
  const normalizedLevel = level.toLowerCase().replace(/[^a-z_]/g, '_')
  return LEVEL_TO_TAG[normalizedLevel] || null
}

export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload from ActiveCampaign
    const data = await request.json()

    console.log('📥 ActiveCampaign webhook received:', JSON.stringify(data, null, 2))

    // ActiveCampaign sends different formats depending on webhook type
    // We need to extract the contact info
    const contactId = data.contact?.id || data.contact_id || data.id
    const contactEmail = data.contact?.email || data.email

    if (!contactId) {
      console.log('⚠️ No contact ID in webhook, skipping')
      return NextResponse.json({ success: true, message: 'No contact ID' })
    }

    console.log(`🔄 Processing contact ID: ${contactId}, Email: ${contactEmail}`)

    // Step 1: Get full contact details including custom fields and tags
    const contactResponse = await axios.get(
      `${AC_URL}/api/3/contacts/${contactId}`,
      {
        headers: { 'Api-Token': AC_API_KEY! }
      }
    )

    const contact = contactResponse.data.contact

    // Get contact's field values
    const fieldValuesResponse = await axios.get(
      `${AC_URL}/api/3/contacts/${contactId}/fieldValues`,
      {
        headers: { 'Api-Token': AC_API_KEY! }
      }
    )

    const fieldValues = fieldValuesResponse.data.fieldValues || []

    // CRITICAL: Check lead source and handle appropriately
    // Field 15 = LEAD_SOURCE
    const leadSourceField = fieldValues.find((fv: any) => fv.field === '15')
    const leadSource = leadSourceField?.value || 'unknown'
    
    if (leadSource === 'website') {
      console.log('⏭️ Skipping webhook - website registration already processed by /api/register-program')
      return NextResponse.json({ 
        success: true, 
        message: 'Website registration - skipped duplicate processing' 
      })
    }

    if (leadSource === 'website_embedded') {
      console.log('✅ Embedded form submission detected - processing with full tagging')
    } else {
      console.log('✅ Facebook/external lead detected - proceeding with webhook processing')
    }

    // Get contact's current tags
    const tagsResponse = await axios.get(
      `${AC_URL}/api/3/contacts/${contactId}/contactTags`,
      {
        headers: { 'Api-Token': AC_API_KEY! }
      }
    )

    const contactTags = tagsResponse.data.contactTags || []
    const currentTagIds = contactTags.map((ct: any) => parseInt(ct.tag))

    console.log(`📋 Current tags for contact: ${currentTagIds.join(', ')}`)

    // Step 2: Check if contact is already on List 4
    const listMembershipResponse = await axios.get(
      `${AC_URL}/api/3/contacts/${contactId}/contactLists`,
      {
        headers: { 'Api-Token': AC_API_KEY! }
      }
    )

    const listMemberships = listMembershipResponse.data.contactLists || []
    const isOnList4 = listMemberships.some((lm: any) => lm.list === '4' && lm.status === '1')

    // Add to List 4 if not already on it
    if (!isOnList4) {
      console.log(`📝 Adding contact to List 4 (LBTA)...`)
      await axios.post(
        `${AC_URL}/api/3/contactLists`,
        {
          contactList: {
            list: 4,
            contact: contactId,
            status: 1
          }
        },
        {
          headers: {
            'Api-Token': AC_API_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`✅ Contact added to List 4`)
    } else {
      console.log(`✓ Contact already on List 4`)
    }

    // Step 3: Apply LBTA_Winter2026 tag (27) if not already applied
    if (!currentTagIds.includes(27)) {
      console.log(`🏷️ Applying LBTA_Winter2026 tag (27)...`)
      await axios.post(
        `${AC_URL}/api/3/contactTags`,
        {
          contactTag: {
            contact: contactId,
            tag: 27
          }
        },
        {
          headers: {
            'Api-Token': AC_API_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`✅ LBTA_Winter2026 tag applied`)
    }

    // Step 4: Determine the appropriate class tag
    let classTagId: number | null = null

    // Method 1: Check PROGRAM_INTEREST dropdown field (field 3) - most reliable
    const programInterestField = fieldValues.find((fv: any) => fv.field === '3')
    if (programInterestField?.value) {
      const programValue = programInterestField.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
      classTagId = PROGRAM_VALUE_TO_TAG[programValue] || null
      console.log(`📊 PROGRAM_INTEREST (field 3): ${programInterestField.value} → Tag ${classTagId}`)
    }

    // Method 2: Check TENNIS_LEVEL field (field 5) for adult level (if no program specified)
    const tennisLevelField = fieldValues.find((fv: any) => fv.field === '5')
    if (!classTagId) {
      if (tennisLevelField?.value) {
        classTagId = getClassTagFromLevel(tennisLevelField.value)
        console.log(`📊 TENNIS_LEVEL (field 5): ${tennisLevelField.value} → Tag ${classTagId}`)
      }
    }

    // Method 3: Check PROGRAM field (field 7) for program interest text
    if (!classTagId) {
      const programField = fieldValues.find((fv: any) => fv.field === '7')
      if (programField?.value) {
        classTagId = getClassTagFromInterest(programField.value)
        console.log(`📊 PROGRAM (field 7): ${programField.value} → Tag ${classTagId}`)
      }
    }

    // Method 4: Check existing source tags (Youth Dev Lead, High Perf Lead, Adult Lead)
    if (!classTagId) {
      for (const [sourceTagId, defaultClassTag] of Object.entries(SOURCE_TAG_TO_CLASS_TAG)) {
        if (currentTagIds.includes(parseInt(sourceTagId))) {
          // For Adult Programming Lead (26), refine by TENNIS_LEVEL if available
          if (parseInt(sourceTagId) === 26 && tennisLevelField?.value) {
            classTagId = getClassTagFromLevel(tennisLevelField.value) || defaultClassTag
          } else {
            classTagId = defaultClassTag
          }
          console.log(`📊 Source tag ${sourceTagId} → Class tag ${classTagId}`)
          break
        }
      }
    }

    // Step 5: Apply class tag if determined and not already applied
    if (classTagId && !currentTagIds.includes(classTagId)) {
      console.log(`🏷️ Applying class tag ${classTagId}...`)
      await axios.post(
        `${AC_URL}/api/3/contactTags`,
        {
          contactTag: {
            contact: contactId,
            tag: classTagId
          }
        },
        {
          headers: {
            'Api-Token': AC_API_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`✅ Class tag ${classTagId} applied`)
    } else if (classTagId) {
      console.log(`✓ Class tag ${classTagId} already applied`)
    } else {
      console.log(`⚠️ No class tag determined for contact`)
    }

    return NextResponse.json({
      success: true,
      contactId,
      addedToList4: !isOnList4,
      classTagApplied: classTagId
    })

  } catch (error: any) {
    console.error('❌ Webhook error:', error.response?.data || error.message)
    // Return 200 even on error to prevent ActiveCampaign from retrying
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}

// Handle GET for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'active',
    endpoint: 'ActiveCampaign Webhook Handler',
    purpose: 'Auto-tagging for LBTA Winter 2026 registrations',
    version: '1.0'
  })
}
