import { describe, expect, it } from 'vitest'
import { leadMatchesChannel, type LeadRow } from './leads-query'
import { HEALTH_CANARY_SOURCE } from './leads-canary'

/**
 * Contract test: the entire canary design depends on synthetic rows being
 * filtered out of the team-facing Coach Hub views. `getAllLeads` itself can't
 * be unit-tested without a Supabase mock — but we can lock in the constants
 * and the channel-matcher behavior so a future refactor can't accidentally
 * surface canary rows to the UI.
 */
describe('canary source filter contract', () => {
  it('exposes a stable HEALTH_CANARY_SOURCE constant', () => {
    expect(HEALTH_CANARY_SOURCE).toBe('health-canary')
  })

  it('does not match any UI channel filter — defense in depth if filter is ever bypassed', () => {
    const canaryRow: LeadRow = {
      id: 'test-id',
      created_at: new Date().toISOString(),
      source: HEALTH_CANARY_SOURCE,
      email: 'health-canary+1@lagunabeachtennisacademy.com',
      name: 'Health Canary',
      phone: null,
      payload: {},
      notion_page_id: null,
    }

    for (const channel of ['trial', 'private', 'program', 'newsletter', 'scholarship', 'meta', 'chat'] as const) {
      expect(leadMatchesChannel(canaryRow, channel)).toBe(false)
    }
  })
})
