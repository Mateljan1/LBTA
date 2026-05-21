/**
 * GoHighLevel (GHL) / Lead Connector integration for LBTA website.
 * Creates/updates contacts and enrolls them in the website workflow (SMS + email
 * configured in GHL UI — "LBTA Website – SMS" or successor).
 * Failures are logged only; they do not affect the API response.
 */

import { getEnvVar, hasEnvVar } from './env'

/** Lead Connector API (PIT tokens). Do not set GHL_API_BASE to legacy rest.gohighlevel.com/v1. */
const GHL_BASE = 'https://services.leadconnectorhq.com'
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
  /** Set when sync could not create or find a contact (for cron diagnostics). */
  error?: string
}

function getGhlAuthKey(): string | null {
  return process.env.GHL_API_KEY?.trim() || process.env.GHL_PIT_TOKEN?.trim() || null
}

function isGHLConfigured(): boolean {
  return !!(
    getGhlAuthKey() &&
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

function ghlLocationId(): string {
  return (process.env.GHL_LOCATION_ID ?? getEnvVar('GHL_LOCATION_ID', true)).trim()
}

async function findContactByEmail(email: string): Promise<string | null> {
  const locationId = ghlLocationId()
  const apiKey = getGhlAuthKey()
  if (!apiKey) return null
  const normalized = email.trim().toLowerCase()

  const listQ = new URLSearchParams({ locationId, query: email.trim() })
  const listRes = await fetch(`${GHL_BASE}/contacts/?${listQ}`, {
    method: 'GET',
    headers: apiHeaders(apiKey),
  })
  if (listRes.ok) {
    const listData = (await listRes.json()) as {
      contacts?: Array<{ id?: string; email?: string; emailLowerCase?: string }>
    }
    const hit = listData.contacts?.find((c) => {
      const e = (c.email ?? c.emailLowerCase ?? '').toLowerCase()
      return e === normalized
    })
    if (hit?.id) return hit.id
  }

  const dupQ = new URLSearchParams({ locationId, email: email.trim() })
  const dupRes = await fetch(`${GHL_BASE}/contacts/search/duplicate?${dupQ}`, {
    method: 'GET',
    headers: apiHeaders(apiKey),
  })
  if (!dupRes.ok) return null
  const dupData = (await dupRes.json()) as { contact?: { id?: string }; id?: string }
  const id = dupData?.contact?.id ?? dupData?.id
  return typeof id === 'string' ? id : null
}

async function createContact(payload: GHLContactPayload): Promise<string | null> {
  const locationId = ghlLocationId()
  const apiKey = getGhlAuthKey()
  if (!apiKey) return null

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
    if (res.status === 422 || res.status === 400 || res.status === 409) {
      return findContactByEmail(payload.email)
    }
    const text = await res.text()
    console.error('[GHL] Create contact failed:', res.status, text.slice(0, 200))
    return null
  }
  const data = (await res.json()) as { contact?: { id?: string }; id?: string }
  const id = data?.contact?.id ?? data?.id
  return typeof id === 'string' ? id : null
}

async function addContactToWorkflow(contactId: string): Promise<boolean> {
  const apiKey = getGhlAuthKey()
  const workflowId = getEnvVar('GHL_WORKFLOW_ID', true)
  if (!apiKey) return false

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
  if (!isGHLConfigured()) {
    result.error = 'GHL not configured (API key, location, or workflow missing)'
    return result
  }

  let contactId = await findContactByEmail(payload.email)
  if (!contactId) {
    contactId = await createContact(payload)
    result.created = !!contactId
    if (!contactId) result.error = 'create and lookup failed'
  }
  result.contactId = contactId
  if (contactId) {
    result.workflowEnrolled = await addContactToWorkflow(contactId)
    if (!result.workflowEnrolled) result.error = 'workflow enroll failed'
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
