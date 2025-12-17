import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const acUrl = process.env.ACTIVECAMPAIGN_URL
    const acApiKey = process.env.ACTIVECAMPAIGN_API_KEY

    // Create/update contact in ActiveCampaign
    const contactResponse = await axios.post(
      `${acUrl}/api/3/contact/sync`,
      {
        contact: {
          email: data.email,
          firstName: data.parentName?.split(' ')[0] || '',
          lastName: data.parentName?.split(' ').slice(1).join(' ') || '',
          phone: data.phone || '',
          fieldValues: [
            { field: '7', value: 'Scholarship Application' },  // PROGRAM
            { field: '15', value: 'scholarship' }               // LEAD_SOURCE
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

      // Apply scholarship applicant tag (tag ID 52 - create this in AC if needed)
      try {
        await axios.post(
          `${acUrl}/api/3/contactTags`,
          {
            contactTag: {
              contact: contactId,
              tag: '76'  // scholarship_applicant tag
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
        console.error('Scholarship tag error:', tagError)
      }

      // Create a note with the scholarship details
      try {
        await axios.post(
          `${acUrl}/api/3/notes`,
          {
            note: {
              note: `SCHOLARSHIP APPLICATION\n` +
                    `Student: ${data.studentName}\n` +
                    `GPA: ${data.studentGPA}\n` +
                    `Household Income: ${data.householdIncome}\n` +
                    `Requested Sessions/Week: ${data.sessionsPerWeek}\n` +
                    `Statement: ${data.financialStatement || 'Not provided'}\n` +
                    `Goals: ${data.goals || 'Not provided'}`,
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

      console.log('✅ Scholarship application submitted:', {
        contactId,
        student: data.studentName,
        parent: data.parentName,
        email: data.email,
        gpa: data.studentGPA,
        income: data.householdIncome,
        commitment: data.sessionsPerWeek,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Scholarship application submitted successfully! We\'ll review and contact you within 5 business days.'
    })
  } catch (error: any) {
    console.error('Scholarship submission error:', error.response?.data || error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please call (949) 464-6645' },
      { status: 500 }
    )
  }
}
