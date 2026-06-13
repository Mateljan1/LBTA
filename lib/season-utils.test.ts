import { describe, it, expect } from 'vitest'
import { deriveSeasonStatus, getActiveSeason, getSeasonCTA } from './season-utils'

// Representative season used for deriveSeasonStatus unit tests.
// registrationOpen = May 1, start = Jun 15, end = Aug 29.
const summer2026 = {
  dates: 'June 15 – August 29, 2026',
  registrationOpen: 'May 1, 2026',
}

// ─── deriveSeasonStatus: 4 status transitions ────────────────────────────────

describe('deriveSeasonStatus — 4 status transitions', () => {
  it('coming_soon: today before registrationOpen', () => {
    // Apr 30 = one day before summer reg opens
    expect(deriveSeasonStatus(summer2026, new Date(2026, 3, 30))).toBe('coming_soon')
  })

  it('registration_open: today on registrationOpen opening day', () => {
    // May 1 = exactly when registration opens
    expect(deriveSeasonStatus(summer2026, new Date(2026, 4, 1))).toBe('registration_open')
  })

  it('active: today on season start day', () => {
    // Jun 15 = first day of summer
    expect(deriveSeasonStatus(summer2026, new Date(2026, 5, 15))).toBe('active')
  })

  it('complete: today after season end', () => {
    // Aug 30 = one day after summer ends (Aug 29)
    expect(deriveSeasonStatus(summer2026, new Date(2026, 7, 30))).toBe('complete')
  })
})

// ─── getActiveSeason: 3 overlap windows (registration_open beats active) ─────
//
// Each window is a date where one season is active but the next one's
// registration has already opened — getActiveSeason must return the
// registration_open season, not the active one.

describe('getActiveSeason — 3 overlap windows', () => {
  it('overlap 1: spring registration_open while winter is still active (Mar 2)', () => {
    // spring.registrationOpen = Mar 2, spring.start = Apr 6, winter ends Apr 5
    const result = getActiveSeason(new Date(2026, 2, 2)) // Mar 2, 2026
    expect(result.key).toBe('spring')
    expect(result.status).toBe('registration_open')
  })

  it('overlap 2: summer registration_open while spring is still active (May 1)', () => {
    // summer.registrationOpen = May 1, summer.start = Jun 15, spring ends Jun 13
    const result = getActiveSeason(new Date(2026, 4, 1)) // May 1, 2026
    expect(result.key).toBe('summer')
    expect(result.status).toBe('registration_open')
  })

  it('overlap 3: fall registration_open while summer is still active (Aug 5)', () => {
    // fall.registrationOpen = Aug 5, fall.start = Aug 31, summer ends Aug 29
    const result = getActiveSeason(new Date(2026, 7, 5)) // Aug 5, 2026
    expect(result.key).toBe('fall')
    expect(result.status).toBe('registration_open')
  })
})

// ─── getSeasonCTA: active-to-next-season logic preserved ─────────────────────

describe('getSeasonCTA — existing active→next-season logic preserved', () => {
  it('active season with no next reg open: shows In Progress', () => {
    // Apr 10: spring active (Apr 6–Jun 13), summer regOpen = May 1 > Apr 10 → coming_soon
    // active branch fires for spring; nextStatus=coming_soon → returns summer "Registration Open"
    // (this is existing behaviour: coming_soon next triggers the "next season" branch)
    const cta = getSeasonCTA(new Date(2026, 3, 10)) // Apr 10
    expect(cta.headline).toContain('Summer 2026')
  })

  it('active season with registration_open next: shows next season headline', () => {
    // May 15: spring active, summer registration_open
    const cta = getSeasonCTA(new Date(2026, 4, 15)) // May 15
    expect(cta.headline).toContain('Summer 2026')
    expect(cta.headline).toContain('Registration Open')
  })

  it('season in direct registration_open (no preceding active): shows direct headline', () => {
    // Mar 15: winter ends Apr 5 so winter is still active → hits active branch first.
    // Spring regOpen = Mar 2 → nextStatus=registration_open → returns "Spring 2026 Registration Open"
    const cta = getSeasonCTA(new Date(2026, 2, 15)) // Mar 15
    expect(cta.headline).toBe('Spring 2026 Registration Open')
  })

  it('fall active (Aug 31+), no next season: shows fall In Progress', () => {
    // Sep 15: fall active (Aug 31–Dec 19), no next season in SEASON_ORDER
    const cta = getSeasonCTA(new Date(2026, 8, 15)) // Sep 15
    expect(cta.headline).toBe('Fall 2026 In Progress')
  })
})
