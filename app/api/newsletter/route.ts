import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Log subscription (replace with actual email service)
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString()
    })

    // TODO: Replace with email service (SendGrid, Mailchimp, etc.)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { success: false, message: 'Error subscribing' },
      { status: 500 }
    )
  }
}

