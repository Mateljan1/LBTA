import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import axios from 'axios'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// Helper function to determine program category
function determineCategory(programName: string): string {
  const program = programName.toLowerCase()
  
  // Junior Programs
  if (program.includes('little stars') || 
      program.includes('red ball') || 
      program.includes('orange ball') || 
      program.includes('green dot')) {
    return 'Junior'
  }
  
  // Youth Programs
  if (program.includes('youth development') || 
      program.includes('high performance')) {
    return 'Youth'
  }
  
  // Fitness Programs
  if (program.includes('cardio') || 
      program.includes('liveball') || 
      program.includes('family tennis') || 
      program.includes('match play')) {
    return 'Fitness'
  }
  
  // Adult Programs (default)
  return 'Adult'
}

// Helper function to check if Early Bird discount applies
function isEarlyBird(): boolean {
  const now = new Date()
  const earlyBirdDeadline = new Date('2025-12-20T23:59:59')
  return now < earlyBirdDeadline
}

// Helper function to determine class tag ID based on program name
// This auto-adds registrants to the correct class segment in ActiveCampaign
// LBTA Winter 2026 Schedule - Complete Tag Mapping (Verified from form-config.ts)
function getClassTagId(programName: string): number | null {
  const program = programName.toLowerCase()

  // ===== JUNIOR PROGRAMS (Moulton Meadows) =====
  // Little Tennis Stars (Ages 3-5)
  if (program.includes('little stars') || program.includes('little tennis stars')) {
    return 49  // class:little_tennis_stars
  }
  // Red Ball (Ages 5-6)
  if (program.includes('red ball')) {
    return 38  // class:red_ball
  }
  // Orange Ball (Ages 7-8) - includes match play
  if (program.includes('orange ball')) {
    return 39  // class:orange_ball
  }
  // Green Dot (Ages 9-11) - includes match play
  if (program.includes('green dot')) {
    return 40  // class:green_dot
  }

  // ===== YOUTH PROGRAMS =====
  // Youth Development (Ages 11-15) - Alta Laguna Park
  if (program.includes('youth development') || program.includes('youth program')) {
    return 21  // class:youth_development
  }
  // High Performance (Ages 12-17, UTR 5-8) - LBHS
  if (program.includes('high performance')) {
    return 41  // class:high_performance
  }

  // ===== ADULT PROGRAMS =====
  // Adult Beginner 2 / Bridge Program (Moulton) - check FIRST before generic beginner
  if (program.includes('bridge') || program.includes('beginner 2')) {
    return 42  // class:adult_beginner_bridge
  }
  // Adult Beginner 1 - True Beginner (LBHS)
  if (program.includes('beginner') && (program.includes('adult') || !program.includes('youth'))) {
    return 17  // class:adult_beginner
  }
  // Adult Intermediate (NTRP 3.0-3.5) - LBHS
  if (program.includes('intermediate') && (program.includes('adult') || !program.includes('youth'))) {
    return 16  // class:adult_intermediate
  }
  // Adult Advanced (NTRP 4.0+) - LBHS
  if (program.includes('advanced') && (program.includes('adult') || !program.includes('live'))) {
    return 15  // class:adult_advanced
  }

  // ===== FITNESS PROGRAMS =====
  // Cardio Tennis - LBHS
  if (program.includes('cardio')) {
    return 14  // class:cardio
  }
  // LiveBall (Adults)
  if (program.includes('liveball') || program.includes('live ball')) {
    if (program.includes('advanced')) {
      return 18  // class:live_ball_advanced
    }
    if (program.includes('intermediate')) {
      return 19  // class:live_ball_intermediate
    }
    if (program.includes('drop') || program.includes('dropin')) {
      return 20  // class:live_ball_dropin
    }
    // Default LiveBall to intermediate
    return 19  // class:live_ball_intermediate
  }

  // ===== SEASONAL PROGRAMS =====
  // Summer Camp
  if (program.includes('summer') || program.includes('camp')) {
    return 13  // class:summer_camp
  }

  return null  // No matching class tag
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Determine category from program name
    const category = determineCategory(data.program)
    
    // Calculate frequency from selected days
    const frequency = (data.preferredDays || []).length
    
    // 1. Save to Notion (aligned with your database structure)
    try {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID! },
        properties: {
          // Parent Name (Title field)
          'Parent Name': {
            title: [{ text: { content: `${data.firstName} ${data.lastName}` } }]
          },
          // Player Name (student's name)
          'Player Name': {
            rich_text: [{ text: { content: data.studentName || `${data.firstName} ${data.lastName}` } }]
          },
          // Program
          'Program': {
            rich_text: [{ text: { content: data.program } }]
          },
          // Category (auto-determined)
          'Category': {
            select: { name: category }
          },
          // Location
          'Location': {
            select: { name: data.location || 'Not specified' }
          },
          // Days Selected (multi-select)
          'Days Selected': {
            multi_select: (data.preferredDays || []).map((day: string) => ({ name: day }))
          },
          // Time Slot (can be added later manually, or derived from schedule)
          'Time Slot': {
            rich_text: [{ text: { content: data.timeSlot || '' } }]
          },
          // Frequency (days/week)
          'Frequency (days/week)': {
            number: frequency
          },
          // Tuition
          'Tuition': {
            number: parseInt(data.totalPrice) || 0
          },
          // Age (for juniors/youth)
          'Age': {
            number: parseInt(data.studentAge) || null
          },
          // Parent Email
          'Parent Email': {
            email: data.email
          },
          // Parent Phone
          'Parent Phone': {
            phone_number: data.phone
          },
          // Experience Level
          'Experience Level': {
            select: { name: data.experience || 'Not specified' }
          },
          // Status (set to "New" as per your workflow)
          'Status': {
            select: { name: 'New' }
          },
          // Timestamp (current date/time)
          'Timestamp': {
            date: { start: new Date().toISOString() }
          },
          // Early Bird Applied (checkbox)
          'Early Bird Applied': {
            checkbox: isEarlyBird()
          },
          // Notes (optional field from form)
          'Notes': {
            rich_text: [{ text: { content: data.notes || '' } }]
          }
        }
      })
    } catch (notionError) {
      console.error('Notion error:', notionError)
      // Continue even if Notion fails
    }

    // 2. Add to ActiveCampaign with automatic tagging
    try {
      console.log('🎾 LBTA Registration Started:', {
        email: data.email,
        program: data.program,
        timestamp: new Date().toISOString()
      })

      // Format days for display
      const daysSelected = (data.preferredDays || []).join(', ') || 'Not specified'

      // Format tuition (no $ sign - template already has it)
      const tuitionAmount = data.totalPrice || 'Contact for pricing'

      // Create/update contact with all custom fields for email personalization
      const contactResponse = await axios.post(
        `${process.env.ACTIVECAMPAIGN_URL}/api/3/contacts`,
        {
          contact: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            fieldValues: [
              { field: '7', value: data.program || 'Not specified' },        // PROGRAM
              { field: '8', value: data.location || 'Not specified' },       // LOCATION
              { field: '9', value: daysSelected },                           // DAYS_SELECTED
              { field: '10', value: tuitionAmount },                         // TUITION
              { field: '15', value: 'website' }                              // LEAD_SOURCE (for webhook filtering)
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

      console.log('✅ AC Contact Created:', {
        contactId: contactResponse.data.contact.id,
        email: data.email
      })

      // Add to list to trigger automation
      // CRITICAL: Add contact to List ID 4 (Laguna Beach Tennis Academy)
      // This is the SINGLE automation trigger (automation will apply tags)
      if (contactResponse.data?.contact?.id) {
        const contactId = contactResponse.data.contact.id

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

        console.log('✅ Added to List 4:', {
          contactId,
          email: data.email,
          listId: 4,
          message: 'Automation will trigger on list subscription'
        })

        // Apply class-specific tag for program segmentation
        const classTagId = getClassTagId(data.program)
        if (classTagId) {
          try {
            await axios.post(
              `${process.env.ACTIVECAMPAIGN_URL}/api/3/contactTags`,
              {
                contactTag: {
                  contact: contactId,
                  tag: classTagId.toString()
                }
              },
              {
                headers: {
                  'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
                  'Content-Type': 'application/json'
                }
              }
            )
            console.log('✅ Class Tag Applied:', {
              contactId,
              email: data.email,
              tagId: classTagId,
              program: data.program
            })
          } catch (tagError: any) {
            console.error('⚠️ Failed to apply class tag:', {
              contactId,
              tagId: classTagId,
              error: tagError.response?.data || tagError.message
            })
            // Continue even if tagging fails - contact is still in system
          }
        } else {
          console.log('ℹ️ No class tag mapping for program:', data.program)
        }
      }
    } catch (acError: any) {
      console.error('❌ ActiveCampaign Error:', {
        email: data.email,
        error: acError.response?.data || acError.message,
        stack: acError.stack
      })
      // Continue even if AC fails
    }

    // 3. Return success
    return NextResponse.json({ 
      success: true, 
      message: 'Registration received! Our team will confirm within 24 hours.' 
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing registration. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
