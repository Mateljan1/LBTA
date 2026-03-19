import { describe, it, expect } from 'vitest'
import rawLeagues from '@/data/leagues-2026.json'
import { getAllConfiguredPrograms, getPrepopulateData } from './form-config'
import { registrationModalPricing } from './pricing-supplemental'
import { parseLeagues } from './schedule-schemas'
import { getUtrCircuitModalPricingSummary } from './utr-circuit-modal-pricing'

/**
 * Data integrity: every form-config program ID must have a registrationModalPricing
 * entry in data/pricing-supplemental.json so the modal shows correct pricing.
 * Exception: utr-circuit — pricing is derived from data/leagues-2026.json (utr.divisions).
 */
describe('form-config vs registrationModalPricing', () => {
  it('every configured program ID has a registrationModalPricing key or leagues-derived pricing', () => {
    const configured = getAllConfiguredPrograms()
    const pricingKeys = Object.keys(registrationModalPricing)
    const missing = configured.filter(
      (id) => id !== 'utr-circuit' && !pricingKeys.includes(id)
    )
    expect(missing).toEqual([])
  })

  it('utr-circuit modal pricing matches leagues-2026 utr division min/max', () => {
    const { utr } = parseLeagues(rawLeagues)
    const amounts = utr.divisions
      .map((d) => parseInt(String(d.price).replace(/[$,]/g, ''), 10))
      .filter((n) => Number.isFinite(n))
    const min = Math.min(...amounts)
    const max = Math.max(...amounts)
    const summary = getUtrCircuitModalPricingSummary()
    expect(summary).toContain(`$${min.toLocaleString('en-US')}`)
    expect(summary).toContain(`$${max.toLocaleString('en-US')}`)
    expect(getPrepopulateData('utr-circuit')?.pricing).toBe(summary)
  })
})
