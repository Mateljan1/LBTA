import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { jttRegistrationSchema, validateRequest } from '@/lib/validations'
import { escapeHtml } from '@/lib/sanitize'
import { getEnvVar, hasEnvVar } from '@/lib/env'

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = await rateLimit(`jtt:${ip}`, RATE_LIMITS.form)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
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
        { error: validation.error },
        { status: 400 }
      )
    }

    const formData = validation.data

    // Send to ActiveCampaign (or your CRM)
    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      const acResponse = await fetch(`${getEnvVar('ACTIVECAMPAIGN_URL')}/api/3/contacts`, {
        method: 'POST',
        headers: {
          'Api-Token': getEnvVar('ACTIVECAMPAIGN_API_KEY'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: {
            email: formData.parentEmail,
            firstName: formData.parentFirstName,
            lastName: formData.parentLastName,
            phone: formData.parentPhone,
            fieldValues: [
              {
                field: '1', // Custom field ID for Player Name
                value: `${formData.playerFirstName} ${formData.playerLastName}`,
              },
              {
                field: '2', // Custom field ID for Player Age
                value: String(formData.playerAge),
              },
              {
                field: '3', // Custom field ID for Division
                value: formData.division,
              },
              {
                field: '4', // Custom field ID for Payment Preference
                value: formData.paymentPreference,
              },
            ],
          },
        }),
      })

      if (!acResponse.ok) {
        console.error('ActiveCampaign error:', await acResponse.text())
      }
    }

    // Generate sanitized email HTML
    const emailHtml = generateEmailHTML(formData)

    // Log for now (integrate with email service later)
    console.log('JTT Registration received:', {
      player: `${formData.playerFirstName} ${formData.playerLastName}`,
      division: formData.division,
      parent: formData.parentEmail,
    })

    // TODO: Send email via SendGrid/Postmark
    // await sendEmail({
    //   to: 'support@lagunabeachtennisacademy.com',
    //   subject: `New JTT Registration: ${formData.playerFirstName} ${formData.playerLastName}`,
    //   html: emailHtml,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing JTT registration:', error)
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    )
  }
}

/**
 * Generate sanitized email HTML
 * All user input is escaped to prevent XSS
 */
function generateEmailHTML(data: ReturnType<typeof jttRegistrationSchema.parse>): string {
  // Helper to safely escape all user input
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
