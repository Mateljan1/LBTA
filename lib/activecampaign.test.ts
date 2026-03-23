import { describe, it, expect } from 'vitest'
import { getUtrDivisionTag } from './activecampaign'

describe('getUtrDivisionTag', () => {
  it('maps division names from leagues data (ASCII hyphen)', () => {
    expect(getUtrDivisionTag('Color Ball')).toBeTruthy()
    expect(getUtrDivisionTag('Doubles Round Robin')).toBeTruthy()
  })

  it('maps division labels with en dash (UTR 2.0–4.0 style)', () => {
    expect(getUtrDivisionTag('UTR 2.0–4.0')).toBeTruthy()
    expect(getUtrDivisionTag('UTR 3.0–5.0')).toBeTruthy()
    expect(getUtrDivisionTag('UTR 5.0–7.0')).toBeTruthy()
  })
})
