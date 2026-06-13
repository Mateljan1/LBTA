import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { hasEnvVar } from '@/lib/env'
import { fulfillUtrCircuitRegistration } from '@/lib/fulfill-utr-circuit-registration'
import type { RegisterYearRequest } from '@/lib/validations'
import { UTR_COLOR_BALL_DIVISION_NAME, colorBallStageSchema } from '@/lib/validations'
import { resolveUtrDivisionAmountCents } from '@/lib/utr-checkout-pricing'
import { upsertAndTag, buildRegistrationTags, isMailchimpConfigured } from '@/lib/mailchimp'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!hasEnvVar('STRIPE_WEBHOOK_SECRET') || !hasEnvVar('STRIPE_SECRET_KEY')) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhooks/stripe] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = session.metadata || {}
  const division = meta.division?.trim()
  if (!division) {
    console.warn('[webhooks/stripe] checkout.session.completed missing division metadata')
    return NextResponse.json({ received: true })
  }

  const expectedCents = resolveUtrDivisionAmountCents(division)
  if (expectedCents == null) {
    console.error('[webhooks/stripe] Division not in price catalog; skipping fulfillment', {
      division,
      sessionId: session.id,
    })
    return NextResponse.json({ received: true })
  }

  const paidCents = session.amount_total ?? 0
  // Allow less than list price (promotion codes / LBTAJTT comp) and $0 when fully discounted.
  if (paidCents > expectedCents) {
    console.error('[webhooks/stripe] Amount over list', { division, expectedCents, paidCents, sessionId: session.id })
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  const colorBallParsed = colorBallStageSchema.safeParse(meta.colorBallStage?.trim().toLowerCase())
  if (division === UTR_COLOR_BALL_DIVISION_NAME && !colorBallParsed.success) {
    console.error('[webhooks/stripe] Color Ball checkout missing valid colorBallStage metadata', session.id)
    return NextResponse.json({ error: 'Missing color ball stage' }, { status: 400 })
  }
  const colorBallStage = colorBallParsed.success ? colorBallParsed.data : undefined

  const priceDollars = paidCents / 100

  const data: RegisterYearRequest = {
    registrationType: 'utr-circuit',
    firstName: meta.firstName || 'Unknown',
    lastName: meta.lastName?.trim() || 'Registrant',
    email: meta.email || session.customer_email || '',
    phone: meta.phone || '',
    program: meta.program || 'UTR Match Play Series — Season 1',
    division,
    preferredDays: [],
    playerName: meta.playerName || undefined,
    playerAge: meta.playerAge || undefined,
    experience: meta.experience || undefined,
    notes: meta.notes || undefined,
    currentUtr: meta.currentUtr || undefined,
    colorBallStage,
    programId: meta.programId || 'utr-circuit',
    price: priceDollars,
    totalPrice: priceDollars,
    season: meta.season || undefined,
  }

  if (!data.email) {
    console.error('[webhooks/stripe] Missing email on session', session.id)
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  // Mailchimp: primary CRM for Stripe-paid UTR registrations
  if (isMailchimpConfigured() && data.email) {
    void upsertAndTag(
      { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      [...buildRegistrationTags(data.program), 'program:utr-circuit', 'form:stripe-payment']
    ).catch(e => console.error('[MC] Stripe UTR upsert failed:', e))
  }

  try {
    await fulfillUtrCircuitRegistration(data, { paymentStripeSessionId: session.id })
  } catch (e) {
    console.error('[webhooks/stripe] Fulfillment error:', e)
    return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
