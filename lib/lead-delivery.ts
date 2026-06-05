/**
 * Lead notification routing — when GHL workflow is fully configured,
 * STAFF notifications are routed through GHL (SMS + email in workflow), not Postmark.
 *
 * Customer-facing confirmation emails (sendConfirmationEmail, sendTrialConfirmationEmail,
 * sendContactFormConfirmationEmail, sendPrivateLessonConfirmationEmail,
 * sendScholarshipConfirmationEmail) always send via Postmark regardless of this flag.
 * Only the notify* helpers (notifyTrialRequest, notifyRegistration, etc.) respect this gate.
 */

import { hasEnvVar } from './env'

/** True when production should use GHL workflow for lead email/SMS (Postmark staff alerts skipped). */
export function shouldUseGhlLeadDelivery(): boolean {
  if (process.env.LEADS_DELIVERY_GHL_ONLY === 'false') return false
  const hasKey = !!(process.env.GHL_API_KEY?.trim() || process.env.GHL_PIT_TOKEN?.trim())
  return hasKey && hasEnvVar('GHL_LOCATION_ID') && hasEnvVar('GHL_WORKFLOW_ID')
}

/** @deprecated Use shouldUseGhlLeadDelivery(). Kept for backwards compatibility. */
export const useGhlLeadDelivery = shouldUseGhlLeadDelivery
