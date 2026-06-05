import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { newsletterSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { hasEnvVar } from '@/lib/env'
import { validateAgentSecret } from '@/lib/agent-auth'
import { upsertContact, addToList, addTag, getWebsiteSignupsListId, CAMPAIGN_TAGS } from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToAirtable } from '@/lib/airtable-leads'
import { notifyNewsletter } from '@/lib/email'
import { writeNotionLead } from '@/lib/notion-leads'

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  // Agent auth: validate X-Agent-Secret header if present (for agent tool calls)
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Invalid agent secret' },
      { status: 401 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`newsletter:${ip}`, RATE_LIMITS.form)
  } catch {
    rateLimitResult = { allowed: true, remaining: RATE_LIMITS.form.maxRequests, resetTime: Date.now() + RATE_LIMITS.form.interval }
  }

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
    const parsed = await parseJsonBody(request)
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }
    const validation = validateRequest(newsletterSchema, parsed.data)

    if (!validation.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[newsletter] Validation failed:', validation.error)
      }
      return NextResponse.json(
        { success: false, error: 'Invalid request. Please check your input.' },
        { status: 400 }
      )
    }

    const { email } = validation.data

    if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
      try {
        const result = await upsertContact({
          email: email.trim(),
          firstName: '',
          lastName: '',
        })

        if (result.success && result.data?.id) {
          const listResult = await addToList(result.data.id)
          if (!listResult.success) {
            console.error('[newsletter] ActiveCampaign addToList failed')
          }
          const websiteSignupsListId = getWebsiteSignupsListId()
          if (websiteSignupsListId !== null) {
            await addToList(result.data.id, websiteSignupsListId)
          }
          await addTag(result.data.id, CAMPAIGN_TAGS.website_registration)
        } else {
          console.error('[newsletter] ActiveCampaign upsert failed')
        }
      } catch (acError) {
        console.error('[newsletter] ActiveCampaign error:', acError instanceof Error ? acError.message : acError)
      }
    }

    waitUntil(writeNotionLead({
      parentName: email.trim(),
      email: email.trim(),
      program: 'Newsletter Signup',
      category: 'Newsletter',
    }))
    waitUntil(sendToAirtable({ name: email.trim(), email: email.trim(), category: 'newsletter', formSource: 'newsletter' }))
    waitUntil(storeLead({ source: 'newsletter', email: email.trim() }))
    waitUntil(notifyNewsletter(email.trim()))

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (err) {
    console.error('[newsletter] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: 'Subscription unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
