import { getStalePendingCityPaymentLeads } from '@/lib/stale-city-payment-leads'
import { addTagsByContactId, findGHLContactIdByEmail } from '@/lib/gohighlevel'

export type FollowupTier = '2h' | '24h' | '72h'

export type FollowupAction = {
  leadId: string
  email: string
  name: string | null
  source: string
  createdAt: string
  ageHours: number
  tier: FollowupTier
  ghlContactId: string | null
  tagsAttempted: string[]
  tagsApplied: boolean
  error?: string
}

export type CityPaymentFollowupSummary = {
  dryRun: boolean
  totalCandidates: number
  byTier: Record<FollowupTier, number>
  actions: FollowupAction[]
  error?: string
}

type FollowupThresholds = {
  tier2h: number
  tier24h: number
  tier72h: number
}

type FollowupOwners = {
  tier2hOwnerTag: string
  tier24hOwnerTag: string
  tier72hOwnerTag: string
}

const DEFAULT_THRESHOLDS: FollowupThresholds = {
  tier2h: 2,
  tier24h: 24,
  tier72h: 72,
}

const DEFAULT_OWNERS: FollowupOwners = {
  tier2hOwnerTag: 'City Payment Owner - Front Desk',
  tier24hOwnerTag: 'City Payment Owner - Enrollment',
  tier72hOwnerTag: 'City Payment Owner - Director',
}

function computeAgeHours(createdAtIso: string): number {
  const createdAt = new Date(createdAtIso).getTime()
  if (!Number.isFinite(createdAt)) return 0
  return Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60))
}

function selectTier(ageHours: number, thresholds: FollowupThresholds): FollowupTier | null {
  if (ageHours >= thresholds.tier72h) return '72h'
  if (ageHours >= thresholds.tier24h) return '24h'
  if (ageHours >= thresholds.tier2h) return '2h'
  return null
}

function tagsForTier(tier: FollowupTier, owners: FollowupOwners): string[] {
  const base = ['Pending City Payment']
  if (tier === '2h') return [...base, 'City Payment Followup 2h', owners.tier2hOwnerTag]
  if (tier === '24h') return [...base, 'City Payment Followup 24h', owners.tier24hOwnerTag]
  return [...base, 'City Payment Followup 72h', owners.tier72hOwnerTag]
}

export async function runCityPaymentFollowupAutomation(options?: {
  dryRun?: boolean
  thresholds?: Partial<FollowupThresholds>
  owners?: Partial<FollowupOwners>
  limit?: number
}): Promise<CityPaymentFollowupSummary> {
  const dryRun = options?.dryRun !== false
  const thresholds: FollowupThresholds = {
    ...DEFAULT_THRESHOLDS,
    ...(options?.thresholds ?? {}),
  }
  const owners: FollowupOwners = {
    ...DEFAULT_OWNERS,
    ...(options?.owners ?? {}),
  }

  const report = await getStalePendingCityPaymentLeads({
    staleAfterHours: thresholds.tier2h,
    limit: options?.limit ?? 500,
  })
  if (report.error) {
    return {
      dryRun,
      totalCandidates: 0,
      byTier: { '2h': 0, '24h': 0, '72h': 0 },
      actions: [],
      error: report.error,
    }
  }

  const actions: FollowupAction[] = []
  const byTier: Record<FollowupTier, number> = { '2h': 0, '24h': 0, '72h': 0 }

  for (const row of report.rows) {
    const ageHours = computeAgeHours(row.created_at)
    const tier = selectTier(ageHours, thresholds)
    if (!tier) continue
    byTier[tier] += 1

    const tags = tagsForTier(tier, owners)
    let ghlContactId: string | null = null
    let tagsApplied = false
    let error: string | undefined

    try {
      ghlContactId = await findGHLContactIdByEmail(row.email)
      if (!ghlContactId) {
        error = 'ghl_contact_not_found'
      } else if (!dryRun) {
        const tagResult = await addTagsByContactId(ghlContactId, tags)
        tagsApplied = tagResult.ok
        if (!tagResult.ok) error = tagResult.error ?? 'ghl_tag_apply_failed'
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'unknown_error'
    }

    actions.push({
      leadId: row.id,
      email: row.email,
      name: row.name,
      source: row.source,
      createdAt: row.created_at,
      ageHours: Number(ageHours.toFixed(1)),
      tier,
      ghlContactId,
      tagsAttempted: tags,
      tagsApplied: dryRun ? false : tagsApplied,
      ...(error ? { error } : {}),
    })
  }

  return {
    dryRun,
    totalCandidates: actions.length,
    byTier,
    actions,
  }
}
