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
      // Create/update contact
      const contactResponse = await axios.post(
        `${process.env.ACTIVECAMPAIGN_URL}/api/3/contacts`,
        {
          contact: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            fieldValues: [
              {
                field: '1',
                value: data.program
              }
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

      // Add tags to trigger automation
      if (contactResponse.data?.contact?.id) {
        const contactId = contactResponse.data.contact.id
        
        // Add Winter 2026 tag (ID: 34)
        await axios.post(
          `${process.env.ACTIVECAMPAIGN_URL}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: 34  // Winter 2026 tag
            }
          },
          {
            headers: {
              'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
              'Content-Type': 'application/json'
            }
          }
        )
        
        // Add Website Registration tag (ID: 36)
        await axios.post(
          `${process.env.ACTIVECAMPAIGN_URL}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: 36  // Website Registration tag
            }
          },
          {
            headers: {
              'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY!,
              'Content-Type': 'application/json'
            }
          }
        )
        
        console.log(`✅ ActiveCampaign contact synced with tags: ${data.email}`)
      }
    } catch (acError) {
      console.error('ActiveCampaign error:', acError)
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
