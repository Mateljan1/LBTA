import { describe, expect, it } from 'vitest'
import { CONVERSION_PAGE_PREFIXES, isConversionPage } from './conversion-pages'

describe('isConversionPage', () => {
  it('returns true for every registered conversion page', () => {
    for (const prefix of CONVERSION_PAGE_PREFIXES) {
      expect(isConversionPage(prefix)).toBe(true)
    }
  })

  it('returns true for nested paths under a conversion prefix', () => {
    expect(isConversionPage('/contact/thank-you')).toBe(true)
    expect(isConversionPage('/junior-trial/step-2')).toBe(true)
    expect(isConversionPage('/beginner-program/details')).toBe(true)
  })

  it('returns false for marketing and content pages', () => {
    expect(isConversionPage('/')).toBe(false)
    expect(isConversionPage('/schedules')).toBe(false)
    expect(isConversionPage('/coaches')).toBe(false)
    expect(isConversionPage('/coaches/andrew-mateljan')).toBe(false)
    expect(isConversionPage('/about')).toBe(false)
    expect(isConversionPage('/programs')).toBe(false)
    expect(isConversionPage('/camps')).toBe(false)
    expect(isConversionPage('/fitness')).toBe(false)
  })

  it('returns false for a similar-but-distinct prefix (no false positives)', () => {
    expect(isConversionPage('/contacts')).toBe(false)
    expect(isConversionPage('/booking-policy')).toBe(false)
  })

  it('handles null/undefined/empty safely', () => {
    expect(isConversionPage(null)).toBe(false)
    expect(isConversionPage(undefined)).toBe(false)
    expect(isConversionPage('')).toBe(false)
  })
})
