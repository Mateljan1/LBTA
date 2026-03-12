/**
 * GoHighLevel (GHL) integration for LBTA website.
 * Optional: when GHL_API_KEY, GHL_LOCATION_ID, and GHL_WORKFLOW_ID are set,
 * form submissions create a contact in GHL and add them to the SMS workflow.
 * Failures are logged only; they do not affect the API response.
 */

import { getEnvVar, hasEnvVar } from './env'

const GHL_BASE = 'https://rest.gohighlevel.com/v1'

export type GHLContactPayload = {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

function isGHLConfigured(): boolean {
  return !!(
    hasEnvVar('GHL_API_KEY') &&
    hasEnvVar('GHL_LOCATION_ID') &&
    hasEnvVar('GHL_WORKFLOW_ID')
  )
}

/**
 * Create a contact in GHL. If the API returns 422 (e.g. duplicate), we log and return null.
 * Caller should not fail the request.
 */
async function createContact(payload: GHLContactPayload): Promise<string | null> {
  const locationId = getEnvVar('GHL_LOCATION_ID', true)
  const apiKey = getEnvVar('GHL_API_KEY', true)
  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId,
      email: payload.email.trim(),
      firstName: (payload.firstName ?? '').trim() || undefined,
      lastName: (payload.lastName ?? '').trim() || undefined,
      phone: (payload.phone ?? '').trim() || undefined,
    }),
  })
  if (!res.ok) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[GHL] Create contact failed:', res.status)
    } else {
      const text = await res.text()
      const safeMsg = text.length > 100 ? `${text.slice(0, 100)}…` : text
      console.error('[GHL] Create contact failed:', res.status, safeMsg)
    }
    return null
  }
  const data = (await res.json()) as { contact?: { id?: string } }
  const id = data?.contact?.id
  return typeof id === 'string' ? id : null
}

/**
 * Add an existing contact to the configured workflow (e.g. SMS automation).
 */
async function addContactToWorkflow(contactId: string): Promise<boolean> {
  const apiKey = getEnvVar('GHL_API_KEY', true)
  const workflowId = getEnvVar('GHL_WORKFLOW_ID', true)
  const res = await fetch(
    `${GHL_BASE}/contacts/${encodeURIComponent(contactId)}/workflow/${encodeURIComponent(workflowId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[GHL] Add to workflow failed:', res.status)
    } else {
      const text = await res.text()
      const safeMsg = text.length > 100 ? `${text.slice(0, 100)}…` : text
      console.error('[GHL] Add to workflow failed:', res.status, safeMsg)
    }
    return false
  }
  return true
}

/**
 * Create contact in GHL (if configured) and add to SMS workflow.
 * On any failure: log only; do not throw. Call after AC success in form APIs.
 */
export async function sendToGHL(payload: GHLContactPayload): Promise<void> {
  if (!isGHLConfigured()) return
  try {
    const contactId = await createContact(payload)
    if (contactId) {
      const ok = await addContactToWorkflow(contactId)
      if (ok) console.log('[GHL] Contact added to workflow:', contactId)
    }
  } catch (err) {
    console.error('[GHL] Error:', err instanceof Error ? err.message : err)
  }
}
