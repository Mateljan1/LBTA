import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import axios from 'axios'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // 1. Save to Notion
    try {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID! },
        properties: {
          'Name': {
            title: [{ text: { content: `${data.firstName} ${data.lastName}` } }]
          },
          'Email': {
            email: data.email
          },
          'Phone': {
            phone_number: data.phone
          },
          'Program': {
            rich_text: [{ text: { content: data.program } }]
          },
          'Student Name': {
            rich_text: [{ text: { content: data.studentName || '' } }]
          },
          'Student Age': {
            number: parseInt(data.studentAge) || null
          },
          'Experience': {
            select: { name: data.experience || 'Not specified' }
          },
          'Preferred Days': {
            multi_select: (data.preferredDays || []).map((day: string) => ({ name: day }))
          },
          'Location': {
            select: { name: data.location || 'Not specified' }
          },
          'Total Price': {
            number: parseInt(data.totalPrice) || 0
          },
          'Status': {
            select: { name: 'Pending' }
          }
        }
      })
    } catch (notionError) {
      console.error('Notion error:', notionError)
      // Continue even if Notion fails
    }

    // 2. Add to ActiveCampaign
    try {
      await axios.post(
        `${process.env.ACTIVECAMPAIGN_URL}/api/3/contacts`,
        {
          contact: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            fieldValues: [
              {
                field: '1', // Program field ID (update as needed)
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

      // Trigger automation (tag for Winter 2026 registration)
      // This would require the automation ID from ActiveCampaign
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
