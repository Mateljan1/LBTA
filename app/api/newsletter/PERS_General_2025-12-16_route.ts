import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per minute per IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const rateLimitResult = rateLimit(`newsletter:${ip}`, { interval: 60000, maxRequests: 3 })

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

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

