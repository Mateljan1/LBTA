/**
 * Lead notification routing — when GHL workflow is fully configured,
 * customer + staff comms run through GHL (SMS + email in workflow), not Postmark.
 */

import { hasEnvVar } from './env'

/** True when production should use GHL workflow for lead email/SMS (Postmark staff alerts skipped). */
export function useGhlLeadDelivery(): boolean {
  if (process.env.LEADS_DELIVERY_GHL_ONLY === 'false') return false
  const hasKey = !!(process.env.GHL_API_KEY?.trim() || process.env.GHL_PIT_TOKEN?.trim())
  return hasKey && hasEnvVar('GHL_LOCATION_ID') && hasEnvVar('GHL_WORKFLOW_ID')
}
