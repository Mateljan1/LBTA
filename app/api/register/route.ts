import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'skillLevel', 'experience']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Log registration data (you can replace this with email sending or CRM integration)
    console.log('=== NEW REGISTRATION ===')
    console.log('Program:', data.program)
    console.log('Season:', data.season)
    console.log('Early Bird:', data.earlyBird)
    console.log('Final Price:', data.finalPrice)
    console.log('Contact:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone
    })
    console.log('Player Info:', {
      age: data.age,
      skillLevel: data.skillLevel,
      experience: data.experience,
      goals: data.goals
    })
    if (data.notes) {
      console.log('Notes:', data.notes)
    }
    console.log('========================')

    // TODO: Send email notification using lib/email-config.ts
    // TODO: Save to database/CRM
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Registration received. We will contact you within 24 hours.'
    })
    
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

