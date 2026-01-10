import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { jttRegistrationSchema, validateRequest } from '@/lib/validations'
import { escapeHtml } from '@/lib/sanitize'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTag,
  LBTA_LIST_ID,
  CAMPAIGN_TAGS,
} from '@/lib/activecampaign'

// Initialize Notion client lazily
let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

// Map division to readable format
function formatDivision(division: string): string {
  const divisionMap: Record<string, string> = {
    '10u-orange': '10U Orange Ball',
    '10u-green': '10U Green Dot',
    '12u': '12U Division',
    '14u': '14U Division',
    '16u': '16U Division',
    '18u': '18U Division',
  }
  return divisionMap[division] || division
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`jtt:${ip}`, RATE_LIMITS.form)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  }

  try {
    const rawData = await request.json()

    // Validate input with Zod
    const validation = validateRequest(jttRegistrationSchema, rawData)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const formData = validation.data
    const playerName = `${formData.playerFirstName} ${formData.playerLastName}`
    const parentName = `${formData.parentFirstName} ${formData.parentLastName}`

    console.log('[JTT] Processing registration:', {
      player: playerName,
      division: formData.division,
      parent: formData.parentEmail,
      timestamp: new Date().toISOString(),
    })

    // ============================================================
    // 1. Save to Notion for internal visibility
    // ============================================================
    let notionSuccess = false
    if (hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')) {
      try {
        const notion = getNotionClient()
        await notion.pages.create({
          parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
          properties: {
            // Parent Name (Title field)
            'Parent Name': {
              title: [{ text: { content: parentName } }],
            },
            // Player Name
            'Player Name': {
              rich_text: [{ text: { content: playerName } }],
            },
            // Program
            Program: {
              rich_text: [{ text: { content: `JTT Spring 2026 - ${formatDivision(formData.division)}` } }],
            },
            // Category
            Category: {
              select: { name: 'JTT' },
            },
            // Location (based on division)
            Location: {
              select: {
                name: formData.division.includes('10u')
                  ? (formData.division.includes('orange') ? 'Moulton Meadows' : 'Alta Laguna Park')
                  : 'LBHS'
              },
            },
            // Age
            Age: {
              number: parseInt(String(formData.playerAge)) || null,
            },
            // Parent Email
            'Parent Email': {
              email: formData.parentEmail,
            },
            // Parent Phone
            'Parent Phone': {
              phone_number: formData.parentPhone,
            },
            // Experience Level
            'Experience Level': {
              select: { name: formData.experienceLevel || 'Not specified' },
            },
            // Status
            Status: {
              select: { name: 'New' },
            },
            // Timestamp
            Timestamp: {
              date: { start: new Date().toISOString() },
            },
            // Notes (combine JTT-specific info)
            Notes: {
              rich_text: [{
                text: {
                  content: [
                    `Division: ${formatDivision(formData.division)}`,
                    `Shirt Size: ${formData.shirtSize}`,
                    `USTA: ${formData.ustaRegistered === 'yes' ? `Yes (${formData.ustaMemberNumber || 'No #'})` : 'No - needs registration'}`,
                    `Payment: ${formData.paymentPreference}`,
                    formData.hasSibling === 'yes' ? `Sibling: ${formData.siblingName} (15% discount)` : '',
                    formData.medicalNotes ? `Medical: ${formData.medicalNotes}` : '',
                    formData.additionalNotes ? `Notes: ${formData.additionalNotes}` : '',
                  ].filter(Boolean).join('\n'),
                },
              }],
            },
          },
        })
        notionSuccess = true
        console.log('[JTT] Saved to Notion successfully')
      } catch (notionError) {
        console.error('[JTT] Notion error:', notionError)
        // Continue even if Notion fails - AC is more important for email
      }
    }

    // ============================================================
    // 2. Add to ActiveCampaign with proper tagging for email automation
    // ============================================================
    let acSuccess = false
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        // Create/update contact with JTT-specific fields
        const contactResult = await upsertContact({
          email: formData.parentEmail,
          firstName: formData.parentFirstName,
          lastName: formData.parentLastName,
          phone: formData.parentPhone,
          fieldValues: [
            { field: '1', value: playerName },  // Player Name
            { field: '2', value: String(formData.playerAge) },  // Player Age
            { field: '3', value: formatDivision(formData.division) },  // Division/Program
            { field: '4', value: formData.paymentPreference },  // Payment Preference
            { field: '7', value: `JTT Spring 2026 - ${formatDivision(formData.division)}` },  // PROGRAM field
            { field: '15', value: 'website_jtt' },  // Lead source
          ],
        })

        if (contactResult.success && contactResult.data) {
          const contactId = contactResult.data.id
          console.log('[JTT] Contact created/updated:', { contactId, email: formData.parentEmail })

          // Add to LBTA master list (required for automations)
          await addToList(contactId, LBTA_LIST_ID)
          console.log('[JTT] Added to List 4')

          // Apply JTT Spring 2026 tag to trigger confirmation email automation
          const tagResult = await addTag(contactId, CAMPAIGN_TAGS.jtt_spring_2026)
          if (tagResult.success) {
            console.log('[JTT] JTT Spring 2026 tag (107) applied - email automation triggered')
            acSuccess = true
          }

          // Apply website registration tag for source tracking
          await addTag(contactId, CAMPAIGN_TAGS.website_registration)
        }
      } catch (acError) {
        console.error('[JTT] ActiveCampaign error:', acError)
        // Don't fail the whole request if AC fails
      }
    }

    // ============================================================
    // 3. Generate email HTML for internal notification
    // ============================================================
    const emailHtml = generateEmailHTML(formData)

    // Log the registration for server logs
    console.log('[JTT] Registration complete:', {
      player: playerName,
      division: formatDivision(formData.division),
      parent: formData.parentEmail,
      notionSaved: notionSuccess,
      acSynced: acSuccess,
    })

    // Return success - even if AC or Notion partially failed, we want to show success
    // since the data was received and at least logged
    return NextResponse.json({
      success: true,
      message: 'Registration received successfully!',
    })
  } catch (error) {
    console.error('[JTT] Error processing registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process registration. Please try again or call (949) 464-6645.' },
      { status: 500 }
    )
  }
}

/**
 * Generate sanitized email HTML for internal notification
 * All user input is escaped to prevent XSS
 */
function generateEmailHTML(data: ReturnType<typeof jttRegistrationSchema.parse>): string {
  const safe = (value: unknown): string => escapeHtml(String(value ?? ''))

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 3px solid #F8A121; }
    .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
    .field { margin: 8px 0; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New JTT Spring 2026 Registration</h1>
    </div>

    <div class="section">
      <div class="section-title">Player Information</div>
      <div class="field"><span class="label">Name:</span> ${safe(data.playerFirstName)} ${safe(data.playerLastName)}</div>
      <div class="field"><span class="label">Date of Birth:</span> ${safe(data.playerDOB)}</div>
      <div class="field"><span class="label">Age:</span> ${safe(data.playerAge)}</div>
      <div class="field"><span class="label">Grade:</span> ${safe(data.playerGrade || 'Not provided')}</div>
      <div class="field"><span class="label">School:</span> ${safe(data.playerSchool || 'Not provided')}</div>
    </div>

    <div class="section">
      <div class="section-title">Parent/Guardian Information</div>
      <div class="field"><span class="label">Name:</span> ${safe(data.parentFirstName)} ${safe(data.parentLastName)}</div>
      <div class="field"><span class="label">Email:</span> ${safe(data.parentEmail)}</div>
      <div class="field"><span class="label">Phone:</span> ${safe(data.parentPhone)}</div>
      <div class="field"><span class="label">Address:</span> ${safe(data.parentAddress)}, ${safe(data.parentCity)}, CA ${safe(data.parentZip)}</div>
    </div>

    <div class="section">
      <div class="section-title">Emergency Contact</div>
      <div class="field"><span class="label">Name:</span> ${safe(data.emergencyName)}</div>
      <div class="field"><span class="label">Phone:</span> ${safe(data.emergencyPhone)}</div>
      <div class="field"><span class="label">Relationship:</span> ${safe(data.emergencyRelation)}</div>
    </div>

    <div class="section">
      <div class="section-title">Team Selection</div>
      <div class="field"><span class="label">Division:</span> ${safe(data.division)}</div>
      <div class="field"><span class="label">Shirt Size:</span> ${safe(data.shirtSize)}</div>
    </div>

    <div class="section">
      <div class="section-title">USTA Registration</div>
      <div class="field"><span class="label">Registered:</span> ${safe(data.ustaRegistered)}</div>
      ${data.ustaMemberNumber ? `<div class="field"><span class="label">Member Number:</span> ${safe(data.ustaMemberNumber)}</div>` : ''}
    </div>

    <div class="section">
      <div class="section-title">Tennis Experience</div>
      <div class="field"><span class="label">Level:</span> ${safe(data.experienceLevel)}</div>
      ${data.currentUTR ? `<div class="field"><span class="label">UTR:</span> ${safe(data.currentUTR)}</div>` : ''}
    </div>

    <div class="section">
      <div class="section-title">Payment Preferences</div>
      <div class="field"><span class="label">Payment Option:</span> ${safe(data.paymentPreference)}</div>
      <div class="field"><span class="label">Card Authorization:</span> ${data.cardAuthConsent ? 'Yes' : 'No'}</div>
    </div>

    ${data.hasSibling === 'yes' ? `
    <div class="section">
      <div class="section-title">Sibling Information</div>
      <div class="field"><span class="label">Sibling Name:</span> ${safe(data.siblingName)}</div>
      <div class="field" style="color: green;"><strong>15% discount applies</strong></div>
    </div>
    ` : ''}

    ${data.medicalNotes || data.additionalNotes ? `
    <div class="section">
      <div class="section-title">Medical &amp; Additional Notes</div>
      ${data.medicalNotes ? `<div class="field"><span class="label">Medical:</span> ${safe(data.medicalNotes)}</div>` : ''}
      ${data.additionalNotes ? `<div class="field"><span class="label">Notes:</span> ${safe(data.additionalNotes)}</div>` : ''}
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">Consent</div>
      <div class="field"><span class="label">Photo/Video:</span> ${data.photoConsent ? 'Yes' : 'No'}</div>
      <div class="field"><span class="label">Liability Waiver:</span> ${data.liabilityConsent ? 'Agreed' : 'Not agreed'}</div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #fff7ed; border: 1px solid #F8A121;">
      <strong>Next Steps:</strong>
      <ol>
        <li>Forward this registration to City of Laguna Beach Recreation Department</li>
        <li>City will contact parent for payment processing</li>
        ${data.ustaRegistered === 'no' ? '<li>Send USTA registration instructions to parent</li>' : ''}
        <li>Add player to JTT roster and team assignment</li>
      </ol>
    </div>
  </div>
</body>
</html>
  `
}
