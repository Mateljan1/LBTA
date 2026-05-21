/**
 * GoHighLevel (GHL) / Lead Connector integration for LBTA website.
 * Creates/updates contacts and enrolls them in the website workflow (SMS + email
 * configured in GHL UI — "LBTA Website – SMS" or successor).
 * Failures are logged only; they do not affect the API response.
 */

import { getEnvVar, hasEnvVar } from './env'

const GHL_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com'
const GHL_VERSION_HEADER = '2021-07-28'
const GHL_CONVERSATIONS_API = 'https://services.leadconnectorhq.com/conversations/messages'

export type GHLContactPayload = {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
  customFields?: Array<{ key: string; field_value: string }>
}

export type GHLSyncResult = {
  contactId: string | null
  workflowEnrolled: boolean
  created: boolean
}

function isGHLConfigured(): boolean {
  return !!(
    hasEnvVar('GHL_API_KEY') &&
    hasEnvVar('GHL_LOCATION_ID') &&
    hasEnvVar('GHL_WORKFLOW_ID')
  )
}

function apiHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
  if (GHL_BASE.includes('leadconnectorhq.com')) {
    headers['Version'] = GHL_VERSION_HEADER
  }
  return headers
}

async function findContactByEmail(email: string): Promise<string | null> {
  const locationId = getEnvVar('GHL_LOCATION_ID', true)
  const apiKey = getEnvVar('GHL_API_KEY', true)
  const q = new URLSearchParams({
    locationId,
    email: email.trim(),
  })
  const res = await fetch(`${GHL_BASE}/contacts/search/duplicate?${q}`, {
    method: 'GET',
    headers: apiHeaders(apiKey),
  })
  if (!res.ok) {
    const fallback = new URLSearchParams({ locationId, query: email.trim() })
    const res2 = await fetch(`${GHL_BASE}/contacts/?${fallback}`, {
      method: 'GET',
      headers: apiHeaders(apiKey),
    })
    if (!res2.ok) return null
    const data2 = (await res2.json()) as { contacts?: Array<{ id?: string; email?: string }> }
    const hit = data2.contacts?.find((c) => c.email?.toLowerCase() === email.toLowerCase())
    return hit?.id ?? null
  }
  const data = (await res.json()) as { contact?: { id?: string }; id?: string }
  const id = data?.contact?.id ?? data?.id
  return typeof id === 'string' ? id : null
}

async function createContact(payload: GHLContactPayload): Promise<string | null> {
  const locationId = getEnvVar('GHL_LOCATION_ID', true)
  const apiKey = getEnvVar('GHL_API_KEY', true)

  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: apiHeaders(apiKey),
    body: JSON.stringify({
      locationId,
      email: payload.email.trim(),
      firstName: (payload.firstName ?? '').trim() || undefined,
      lastName: (payload.lastName ?? '').trim() || undefined,
      phone: (payload.phone ?? '').trim() || undefined,
      tags: payload.tags,
      customFields: payload.customFields,
    }),
  })
  if (!res.ok) {
    if (res.status === 422 || res.status === 400) {
      return findContactByEmail(payload.email)
    }
    if (process.env.NODE_ENV === 'production') {
      console.error('[GHL] Create contact failed:', res.status)
    } else {
      const text = await res.text()
      console.error('[GHL] Create contact failed:', res.status, text.slice(0, 120))
    }
    return null
  }
  const data = (await res.json()) as { contact?: { id?: string }; id?: string }
  const id = data?.contact?.id ?? data?.id
  return typeof id === 'string' ? id : null
}

async function addContactToWorkflow(contactId: string): Promise<boolean> {
  const apiKey = getEnvVar('GHL_API_KEY', true)
  const workflowId = getEnvVar('GHL_WORKFLOW_ID', true)

  const res = await fetch(
    `${GHL_BASE}/contacts/${encodeURIComponent(contactId)}/workflow/${encodeURIComponent(workflowId)}`,
    { method: 'POST', headers: apiHeaders(apiKey) }
  )
  if (!res.ok) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[GHL] Add to workflow failed:', res.status)
    } else {
      const text = await res.text()
      console.error('[GHL] Add to workflow failed:', res.status, text.slice(0, 120))
    }
    return false
  }
  return true
}

/**
 * Sync one lead to GHL: find or create contact, enroll in website workflow.
 */
export async function syncContactToGHL(payload: GHLContactPayload): Promise<GHLSyncResult> {
  const result: GHLSyncResult = {
    contactId: null,
    workflowEnrolled: false,
    created: false,
  }
  if (!isGHLConfigured()) return result

  let contactId = await findContactByEmail(payload.email)
  if (!contactId) {
    contactId = await createContact(payload)
    result.created = !!contactId
  }
  result.contactId = contactId
  if (contactId) {
    result.workflowEnrolled = await addContactToWorkflow(contactId)
  }
  return result
}

/**
 * Create contact in GHL (if configured) and add to workflow.
 */
export async function sendToGHL(payload: GHLContactPayload): Promise<void> {
  if (!isGHLConfigured()) return
  try {
    const { contactId, workflowEnrolled } = await syncContactToGHL(payload)
    if (contactId && workflowEnrolled) {
      console.log('[GHL] Contact synced + workflow:', contactId)
    }
  } catch (err) {
    console.error('[GHL] Error:', err instanceof Error ? err.message : err)
  }
}
