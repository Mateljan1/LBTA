/**
 * Lead notification routing — formerly used to route staff notifications through GHL.
 * GHL has been removed. This always returns false so all staff notifications
 * route through Postmark.
 */

/** Always false — GHL workflow routing removed. Staff notifications go to Postmark. */
export function shouldUseGhlLeadDelivery(): boolean {
  return false
}

/** @deprecated Use shouldUseGhlLeadDelivery(). Kept for backwards compatibility. */
export const useGhlLeadDelivery = shouldUseGhlLeadDelivery
