import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Here you would integrate with SendGrid, Resend, or email service
    // For now, this is a placeholder that logs the submission
    
    console.log('Booking submission:', {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      phone: body.phone,
      program: body.program,
      preferredTime: body.preferredTime,
      experience: body.experience,
      goals: body.goals,
      timestamp: new Date().toISOString()
    })

    // TODO: Replace with actual email service
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    await sgMail.send({
      to: 'support@lagunabeachtennisacademy.com',
      from: 'noreply@lagunabeachtennisacademy.com',
      subject: `New Trial Request: ${body.firstName} ${body.lastName}`,
      html: `
        <h2>New Trial Class Request</h2>
        <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Program:</strong> ${body.program}</p>
        <p><strong>Preferred Time:</strong> ${body.preferredTime}</p>
        <p><strong>Experience:</strong> ${body.experience}</p>
        <p><strong>Goals:</strong> ${body.goals}</p>
      `
    })
    */

    return NextResponse.json({ success: true, message: 'Request received' })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing request' },
      { status: 500 }
    )
  }
}

