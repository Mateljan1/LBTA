import { getClient } from '@/lib/leads-store'

const REGISTRATION_SOURCES = ['book', 'register', 'register-program', 'register-year'] as const

type LeadRow = {
  id: string
  email: string
  source: string
  payload: Record<string, unknown> | null
}

export type CityPaymentMatch = {
  email: string
  leadId: string
  source: string
}

export type CityPaymentUpdateSummary = {
  requestedEmails: string[]
  matches: CityPaymentMatch[]
  updatedLeadIds: string[]
  skippedEmails: string[]
  error?: string
}

function normalizeEmails(emails: string[]): string[] {
  return [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))]
}

function buildCityPaidPayload(original: Record<string, unknown> | null): Record<string, unknown> {
  const payload = original ?? {}
  const workflowRaw = payload.workflow
  const workflow = (typeof workflowRaw === 'object' && workflowRaw !== null
    ? workflowRaw
    : {}) as Record<string, unknown>

  return {
    ...payload,
    workflow: {
      ...workflow,
      stage: 'city_paid',
      cityPaymentStatus: 'city_paid',
      cityPaidAt: new Date().toISOString(),
    },
  }
}

export async function findPendingCityPaymentMatches(emails: string[]): Promise<CityPaymentUpdateSummary> {
  const normalizedEmails = normalizeEmails(emails)
  const supabase = getClient()
  if (!supabase) {
    return {
      requestedEmails: normalizedEmails,
      matches: [],
      updatedLeadIds: [],
      skippedEmails: normalizedEmails,
      error: 'Supabase is not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing).',
    }
  }

  const matches: CityPaymentMatch[] = []
  const skippedEmails: string[] = []

  for (const email of normalizedEmails) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, email, source, payload')
      .in('source', [...REGISTRATION_SOURCES])
      .ilike('email', email)
      .contains('payload', { workflow: { cityPaymentStatus: 'pending_city_payment' } })
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      return {
        requestedEmails: normalizedEmails,
        matches,
        updatedLeadIds: [],
        skippedEmails,
        error: error.message,
      }
    }

    const row = (data?.[0] ?? null) as LeadRow | null
    if (!row) {
      skippedEmails.push(email)
      continue
    }

    matches.push({
      email: row.email,
      leadId: row.id,
      source: row.source,
    })
  }

  return {
    requestedEmails: normalizedEmails,
    matches,
    updatedLeadIds: [],
    skippedEmails,
  }
}

export async function markCityPaidForEmails(emails: string[]): Promise<CityPaymentUpdateSummary> {
  const matchSummary = await findPendingCityPaymentMatches(emails)
  if (matchSummary.error) return matchSummary
  if (matchSummary.matches.length === 0) return matchSummary

  const supabase = getClient()
  if (!supabase) {
    return {
      ...matchSummary,
      error: 'Supabase is not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing).',
    }
  }

  const updatedLeadIds: string[] = []
  for (const match of matchSummary.matches) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, payload')
      .eq('id', match.leadId)
      .limit(1)
      .maybeSingle()

    if (error) {
      return { ...matchSummary, updatedLeadIds, error: error.message }
    }

    const row = data as { id: string; payload: Record<string, unknown> | null } | null
    if (!row) continue
    const nextPayload = buildCityPaidPayload(row.payload)

    const { error: updateError } = await supabase
      .from('leads')
      .update({ payload: nextPayload })
      .eq('id', row.id)

    if (updateError) {
      return { ...matchSummary, updatedLeadIds, error: updateError.message }
    }

    updatedLeadIds.push(row.id)
  }

  return {
    ...matchSummary,
    updatedLeadIds,
  }
}

