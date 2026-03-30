import { describe, it, expect } from 'vitest'
import {
  formatUtrWeekendPairShort,
  getUtrDropInDateOptions,
  getUtrSeasonWeekNumber,
} from './utr-match-play'

describe('getUtrDropInDateOptions', () => {
  it('returns eight ISO dates for Saturday', () => {
    const opts = getUtrDropInDateOptions('Saturday')
    expect(opts).toHaveLength(8)
    for (const o of opts) {
      expect(o.iso).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(o.label.length).toBeGreaterThan(6)
    }
  })

  it('returns eight ISO dates for Sunday', () => {
    const opts = getUtrDropInDateOptions('Sunday')
    expect(opts).toHaveLength(8)
    expect(opts[0].iso).not.toBe(getUtrDropInDateOptions('Saturday')[0].iso)
  })

  it('defaults to Saturday dates when match day omitted', () => {
    const explicit = getUtrDropInDateOptions('Saturday')
    const fallback = getUtrDropInDateOptions()
    expect(fallback.map((o) => o.iso)).toEqual(explicit.map((o) => o.iso))
  })
})

describe('getUtrSeasonWeekNumber / formatUtrWeekendPairShort', () => {
  it('formats week 1 weekend pair from leagues data', () => {
    expect(formatUtrWeekendPairShort(1)).toMatch(/April\s+11\s+[–-]\s+12/)
  })

  it('returns a week number in 1–8', () => {
    const n = getUtrSeasonWeekNumber()
    expect(n).toBeGreaterThanOrEqual(1)
    expect(n).toBeLessThanOrEqual(8)
  })
})
