/**
 * UTR Match Play Series (utr-circuit) — leads, ops email, confirmation.
 * Shared by POST /api/register-year and Stripe webhook after successful payment.
 *
 * Primary CRM (Mailchimp): upsert + tags happen at the CALLER level
 * (register-year route and stripe webhook) before this function is invoked.
 * This function handles: Supabase sink, staff notification, customer confirmation.
 */

import { waitUntil } from '@vercel/functions'
import { storeLead } from '@/lib/leads-store'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import type { RegisterYearRequest } from '@/lib/validations'
import { determineCategory, type RegistrationType } from '@/lib/register-year-shared'

function buildUtrNotes(data: RegisterYearRequest, paymentStripeSessionId?: string): string {
  const parts = [data.notes?.trim()].filter(Boolean) as string[]
  if (data.colorBallStage) {
    parts.push(`Color Ball stage: ${data.colorBallStage} ball`)
  }
  if (data.currentUtr?.trim()) {
    parts.push(`Self-reported UTR: ${data.currentUtr.trim()}`)
  }
  if (paymentStripeSessionId) {
    parts.push(`Paid via Stripe — session ${paymentStripeSessionId}`)
  }
  return parts.join(' | ')
}

export async function fulfillUtrCircuitRegistration(
  data: RegisterYearRequest,
  options: { paymentStripeSessionId?: string } = {}
): Promise<void> {
  const registrationType = (data.registrationType || 'utr-circuit') as RegistrationType
  const category = determineCategory(data.program, registrationType)
  const notesMerged = buildUtrNotes(data, options.paymentStripeSessionId)

  // Supabase: secondary sink
  waitUntil(storeLead({
    source: options.paymentStripeSessionId ? 'stripe-utr-season' : 'register-year',
    email: data.email,
    name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
    phone: data.phone ?? undefined,
    payload: {
      registrationType: data.registrationType,
      program: data.program,
      division: data.division,
      colorBallStage: data.colorBallStage,
      stripeSessionId: options.paymentStripeSessionId,
      currentUtr: data.currentUtr,
    },
  }))

  // Staff alert (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
  waitUntil(notifyRegistration({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    program: data.program,
    registrationType: data.registrationType,
    division: data.division,
    season: data.season,
    location: data.location,
    studentName: data.studentName ?? data.playerName,
    studentAge: data.studentAge ?? data.playerAge,
    experience: data.experience,
    notes: notesMerged,
  }))

  // Customer confirmation (Postmark — no-op when POSTMARK_SERVER_TOKEN unset)
  const configById = data.programId ? FORM_CONFIGS[data.programId] : undefined
  const matchedConfig =
    configById ?? Object.values(FORM_CONFIGS).find(c => c.prePopulateData.programName === data.program)
  if (matchedConfig) {
    const pre = matchedConfig.prePopulateData
    waitUntil(sendConfirmationEmail({
      email: data.email,
      firstName: data.firstName,
      programName: pre.programName,
      location: pre.location,
      duration: pre.duration,
      ageGroup: pre.ageGroup,
      category: pre.category,
    }))
  } else {
    waitUntil(sendConfirmationEmail({
      email: data.email,
      firstName: data.firstName,
      programName: data.program,
      location: data.location ?? 'TBD',
      duration: 'TBD',
      category,
    }))
  }
}
