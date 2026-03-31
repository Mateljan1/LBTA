import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, utrCheckoutSessionSchema, validateRequest } from '@/lib/validations'
import { hasEnvVar } from '@/lib/env'
import { resolveUtrDivisionAmountCents, getAllowedUtrDivisionNames } from '@/lib/utr-checkout-pricing'

export const runtime = 'nodejs'

function requestOrigin(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') ?? 'https'
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}

function trimMeta(value: string, max = 450): string {
  const s = value.trim()
  return s.length <= max ? s : s.slice(0, max)
}

export async function POST(request: NextRequest) {
  if (!hasEnvVar('STRIPE_SECRET_KEY')) {
    return NextResponse.json(
      { success: false, error: 'Online payment is not configured.', stripeNotConfigured: true },
      { status: 503 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`checkout-utr-season:${ip}`, RATE_LIMITS.form)
  } catch {
    rateLimitResult = { allowed: true, resetTime: Date.now() + RATE_LIMITS.form.interval }
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const parsed = await parseJsonBody(request)
  if (!parsed.ok) {
    return NextResponse.json({ success: false, error: 'Invalid request format' }, { status: 400 })
  }

  const validation = validateRequest(utrCheckoutSessionSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid request. Please check your input.' },
      { status: 400 }
    )
  }

  const body = validation.data
  const amountCents = resolveUtrDivisionAmountCents(body.division)
  if (amountCents == null) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid division. Please choose a division from the list.',
        allowedDivisions: getAllowedUtrDivisionNames(),
      },
      { status: 400 }
    )
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ success: false, error: 'Payment unavailable' }, { status: 503 })
  }

  const stripe = new Stripe(secret)
  const origin = requestOrigin(request)

  const meta: Record<string, string> = {
    registrationType: 'utr-circuit',
    firstName: trimMeta(body.firstName, 80),
    lastName: trimMeta(body.lastName, 80),
    email: trimMeta(body.email, 250),
    phone: trimMeta(body.phone, 30),
    program: trimMeta(body.program, 200),
    division: trimMeta(body.division, 100),
    playerName: body.playerName ? trimMeta(body.playerName, 200) : '',
    playerAge: body.playerAge != null ? trimMeta(String(body.playerAge), 20) : '',
    experience: body.experience ? trimMeta(body.experience, 200) : '',
    notes: body.notes ? trimMeta(body.notes, 450) : '',
    currentUtr: body.currentUtr ? trimMeta(body.currentUtr, 20) : '',
    programId: body.programId ? trimMeta(body.programId, 100) : '',
    season: '',
  }

  const dollars = amountCents / 100
  const productName = `UTR Match Play Series — Season 1 — ${body.division}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: body.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: productName,
              description: `Full season registration — ${body.division}`,
            },
          },
        },
      ],
      metadata: meta,
      success_url: `${origin}/thank-you?type=year&paid=1&program=${encodeURIComponent(body.program)}`,
      cancel_url: `${origin}/programs/utr-match-play?checkout=cancelled`,
      phone_number_collection: { enabled: false },
    })

    if (!session.url) {
      return NextResponse.json({ success: false, error: 'Could not start checkout.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      amountLabel: `$${dollars}`,
    })
  } catch (e) {
    console.error('[checkout/utr-season]', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { success: false, error: 'Could not start payment. Please try again or call (949) 534-0457.' },
      { status: 500 }
    )
  }
}
