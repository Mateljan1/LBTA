import { describe, it, expect } from 'vitest'
import { calculateMatchPoints, calculateWeeklyPoints } from './utr-tracker-points'
import type { Match } from './utr-tracker-types'

function baseMatch(overrides: Partial<Match>): Match {
  return {
    id: 'm1',
    week: 1,
    date: '2026-04-11',
    division: 'sat_utr_singles',
    is_doubles: false,
    player1_id: 'p1',
    player1_name: 'Player One',
    player1_utr: 3.0,
    player1_provisional: false,
    player2_id: 'p2',
    player2_name: 'Player Two',
    player2_utr: 4.0,
    player2_provisional: false,
    player3_id: null,
    player3_name: null,
    player3_utr: null,
    player3_provisional: false,
    player4_id: null,
    player4_name: null,
    player4_utr: null,
    player4_provisional: false,
    score: '6-4',
    winner_id: 'p1',
    winning_team: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('calculateMatchPoints', () => {
  it('awards 12 points for win vs 1.0+ higher-rated opponent', () => {
    const match = baseMatch({
      player1_utr: 3.0,
      player2_utr: 4.2,
      winner_id: 'p1',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(12)
  })

  it('awards 10 points for win vs similar-rated opponent', () => {
    const match = baseMatch({
      player1_utr: 3.5,
      player2_utr: 3.6,
      winner_id: 'p1',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(10)
  })

  it('awards 8 points for win vs lower-rated opponent', () => {
    const match = baseMatch({
      player1_utr: 4.5,
      player2_utr: 3.0,
      winner_id: 'p1',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(8)
  })

  it('awards 5 points for close loss', () => {
    const match = baseMatch({
      score: '7-6(4)',
      winner_id: 'p2',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(5)
  })

  it('awards 3 points for non-close loss', () => {
    const match = baseMatch({
      score: '6-1',
      winner_id: 'p2',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(3)
  })

  it('treats provisional matches as similar-rated (no upset bonus)', () => {
    const match = baseMatch({
      player1_utr: 3.0,
      player2_utr: 4.5,
      player1_provisional: true,
      winner_id: 'p1',
    })
    expect(calculateMatchPoints(match, 'p1')).toBe(10)
  })
})

describe('calculateWeeklyPoints', () => {
  it('returns 0 when player has no matches that week', () => {
    const matches: Match[] = []
    const res = calculateWeeklyPoints('p1', 1, matches, { '1': 2.0 })
    expect(res.played).toBe(false)
    expect(res.total).toBe(0)
  })

  it('calculates match + attendance + streak with multiplier', () => {
    const m1 = baseMatch({ id: 'm1', week: 2 })
    const mPrev = baseMatch({ id: 'm0', week: 1 })
    const res = calculateWeeklyPoints('p1', 2, [m1, mPrev], { '2': 1.25 })
    expect(res.played).toBe(true)
    expect(res.matchPoints).toBeGreaterThan(0)
    expect(res.attendance).toBe(3)
    expect(res.streak).toBe(2)
    expect(res.multiplier).toBe(1.25)
  })
})

