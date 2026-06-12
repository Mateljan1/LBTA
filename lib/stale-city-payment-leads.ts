import { getClient } from '@/lib/leads-store'

export type StalePendingLead = {
  id: string
  created_at: string
  source: string
  email: string
  name: string | null
  phone: string | null
  payload: Record<string, unknown> | null
}

export async function getStalePendingCityPaymentLeads(options?: {
  staleAfterHours?: number
  limit?: number
}): Promise<{ staleAfterHours: number; rows: StalePendingLead[]; error?: string }> {
  const staleAfterHours = options?.staleAfterHours ?? 24
  const limit = options?.limit ?? 200
  const supabase = getClient()
  if (!supabase) {
    return {
      staleAfterHours,
      rows: [],
      error: 'Supabase is not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing).',
    }
  }

  const cutoffIso = new Date(Date.now() - staleAfterHours * 60 * 60 * 1000).toISOString()
  const allowedSources = ['book', 'register', 'register-program', 'register-year']

  const { data, error } = await supabase
    .from('leads')
    .select('id, created_at, source, email, name, phone, payload')
    .in('source', allowedSources)
    .contains('payload', { workflow: { cityPaymentStatus: 'pending_city_payment' } })
    .lte('created_at', cutoffIso)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    return { staleAfterHours, rows: [], error: error.message }
  }

  return {
    staleAfterHours,
    rows: (data ?? []) as StalePendingLead[],
  }
}

