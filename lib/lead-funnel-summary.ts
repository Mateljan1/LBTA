import { getClient } from '@/lib/leads-store'

export type LeadFunnelSummary = {
  windowHours: number
  counts: {
    newLeads: number
    trialsRequested: number
    registrationAssistRequested: number
    pendingCityPaymentOver24h: number
    pendingCityPaymentOver72h: number
    cityPaidInWindow: number
  }
  error?: string
}

async function countPendingCityPayment(hours: number): Promise<number> {
  const supabase = getClient()
  if (!supabase) return 0
  const cutoffIso = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .in('source', ['book', 'register', 'register-program', 'register-year'])
    .contains('payload', { workflow: { cityPaymentStatus: 'pending_city_payment' } })
    .lte('created_at', cutoffIso)
  if (error) return 0
  return count ?? 0
}

async function countCityPaidInWindow(windowHours: number): Promise<number> {
  const supabase = getClient()
  if (!supabase) return 0
  const fromIso = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('leads')
    .select('payload')
    .in('source', ['book', 'register', 'register-program', 'register-year'])
    .contains('payload', { workflow: { cityPaymentStatus: 'city_paid' } })
    .limit(1000)

  if (error) return 0
  let count = 0
  for (const row of data ?? []) {
    const payload = (row.payload ?? {}) as Record<string, unknown>
    const workflow = (payload.workflow ?? {}) as Record<string, unknown>
    const paidAt = typeof workflow.cityPaidAt === 'string' ? workflow.cityPaidAt : null
    if (paidAt && paidAt >= fromIso) count += 1
  }
  return count
}

export async function getLeadFunnelSummary(windowHours = 24): Promise<LeadFunnelSummary> {
  const supabase = getClient()
  if (!supabase) {
    return {
      windowHours,
      counts: {
        newLeads: 0,
        trialsRequested: 0,
        registrationAssistRequested: 0,
        pendingCityPaymentOver24h: 0,
        pendingCityPaymentOver72h: 0,
        cityPaidInWindow: 0,
      },
      error: 'Supabase is not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing).',
    }
  }

  const sinceIso = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('leads')
    .select('payload, source, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(2000)

  if (error) {
    return {
      windowHours,
      counts: {
        newLeads: 0,
        trialsRequested: 0,
        registrationAssistRequested: 0,
        pendingCityPaymentOver24h: 0,
        pendingCityPaymentOver72h: 0,
        cityPaidInWindow: 0,
      },
      error: error.message,
    }
  }

  let trialsRequested = 0
  let registrationAssistRequested = 0
  for (const row of data ?? []) {
    const payload = (row.payload ?? {}) as Record<string, unknown>
    const workflow = (payload.workflow ?? {}) as Record<string, unknown>
    const stage = typeof workflow.stage === 'string' ? workflow.stage : null
    if (stage === 'trial_requested') trialsRequested += 1
    if (stage === 'registration_assist_requested') registrationAssistRequested += 1
  }

  const pendingCityPaymentOver24h = await countPendingCityPayment(24)
  const pendingCityPaymentOver72h = await countPendingCityPayment(72)
  const cityPaidInWindow = await countCityPaidInWindow(windowHours)

  return {
    windowHours,
    counts: {
      newLeads: data?.length ?? 0,
      trialsRequested,
      registrationAssistRequested,
      pendingCityPaymentOver24h,
      pendingCityPaymentOver72h,
      cityPaidInWindow,
    },
  }
}

