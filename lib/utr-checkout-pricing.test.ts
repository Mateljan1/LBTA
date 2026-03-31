import { describe, it, expect } from 'vitest'
import { resolveUtrDivisionAmountCents, getAllowedUtrDivisionNames } from '@/lib/utr-checkout-pricing'

describe('utr-checkout-pricing', () => {
  it('resolves Color Ball to 34900 cents', () => {
    expect(resolveUtrDivisionAmountCents('Color Ball')).toBe(34900)
  })

  it('resolves each catalog division to a positive cent amount', () => {
    for (const name of getAllowedUtrDivisionNames()) {
      const cents = resolveUtrDivisionAmountCents(name)
      expect(cents).toBeGreaterThan(0)
    }
  })

  it('returns null for unknown division', () => {
    expect(resolveUtrDivisionAmountCents('Fake Division')).toBeNull()
  })

  it('lists division names from JSON', () => {
    const names = getAllowedUtrDivisionNames()
    expect(names).toContain('Color Ball')
    expect(names.length).toBeGreaterThan(0)
  })
})
