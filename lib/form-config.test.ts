import { describe, it, expect } from 'vitest'
import { getAllConfiguredPrograms } from './form-config'
import { registrationModalPricing } from './pricing-supplemental'

/**
 * Data integrity: every form-config program ID must have a registrationModalPricing
 * entry in data/pricing-supplemental.json so the modal shows correct pricing.
 */
describe('form-config vs registrationModalPricing', () => {
  it('every configured program ID has a registrationModalPricing key', () => {
    const configured = getAllConfiguredPrograms()
    const pricingKeys = Object.keys(registrationModalPricing)
    const missing = configured.filter((id) => !pricingKeys.includes(id))
    expect(missing).toEqual([])
  })
})
