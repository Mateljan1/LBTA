import { describe, it, expect } from 'vitest'
import {
  calculateWeeklyDelta,
  calculateMatchPoints,
  calculateRankMovement,
  calculateStandings,
  getAroundYouContext,
  getGrandFinalsRaceStatus,
  getMomentumSummary,
  calculateWeeklyPoints,
  getUpsetOfWeek,
} from './utr-tracker-points'
import type { Match, SeasonConfig } from './utr-tracker-types'

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

describe('calculateStandings', () => {
  it('counts doubles wins/losses using winning_team for all partners', () => {
    const doublesMatch: Match = {
      ...baseMatch({
        id: 'd1',
        division: 'sun_doubles',
        is_doubles: true,
        player1_id: 'p1',
        player1_name: 'P1',
        player1_utr: 3.0,
        player2_id: 'p2',
        player2_name: 'P2',
        player2_utr: 3.1,
        player3_id: 'p3',
        player3_name: 'P3',
        player3_utr: 3.2,
        player4_id: 'p4',
        player4_name: 'P4',
        player4_utr: 3.0,
        score: '6-4',
        winner_id: 'p1',
        winning_team: 1,
      }),
    }

    const config: SeasonConfig = {
      multipliers: { '1': 1 },
      tiers: [{ name: 'Baseline', min: 0, max: 9999, color: '#9CA3AF', badge: 'gray' }],
      current_week: 1,
      total_weeks: 1,
      grand_finals_min_weeks: 1,
    }

    const standings = calculateStandings(
      'sun_doubles',
      [doublesMatch],
      [
        { id: 'p1', name: 'P1', divisions: ['sun_doubles'] },
        { id: 'p2', name: 'P2', divisions: ['sun_doubles'] },
        { id: 'p3', name: 'P3', divisions: ['sun_doubles'] },
        { id: 'p4', name: 'P4', divisions: ['sun_doubles'] },
      ],
      config
    )

    const p3 = standings.find((s) => s.playerId === 'p3')
    const p2 = standings.find((s) => s.playerId === 'p2')
    expect(p3?.wins).toBe(1)
    expect(p3?.losses).toBe(0)
    expect(p2?.wins).toBe(0)
    expect(p2?.losses).toBe(1)
  })

  it('marks grand finals eligibility only after minimum weeks played', () => {
    const config: SeasonConfig = {
      multipliers: { '1': 1, '2': 1 },
      tiers: [{ name: 'Baseline', min: 0, max: 9999, color: '#9CA3AF', badge: 'gray' }],
      current_week: 2,
      total_weeks: 2,
      grand_finals_min_weeks: 2,
    }

    const standings = calculateStandings(
      'sat_utr_singles',
      [baseMatch({ id: 'w1', week: 1, winner_id: 'p1' })],
      [{ id: 'p1', name: 'P1', divisions: ['sat_utr_singles'] }],
      config
    )

    expect(standings[0]?.weeksPlayed).toBe(1)
    expect(standings[0]?.gfEligible).toBe(false)
  })

  it('assigns tier based on total points range', () => {
    const config: SeasonConfig = {
      multipliers: { '1': 1, '2': 1 },
      tiers: [
        { name: 'Baseline', min: 0, max: 20, color: '#9CA3AF', badge: 'gray' },
        { name: 'Rally', min: 21, max: 60, color: '#2563EB', badge: 'blue' },
      ],
      current_week: 2,
      total_weeks: 2,
      grand_finals_min_weeks: 1,
    }

    const standings = calculateStandings(
      'sat_utr_singles',
      [
        baseMatch({ id: 'w1', week: 1, winner_id: 'p1', score: '6-2' }),
        baseMatch({ id: 'w2', week: 2, winner_id: 'p1', score: '6-3' }),
      ],
      [{ id: 'p1', name: 'P1', divisions: ['sat_utr_singles'] }],
      config
    )

    expect(standings[0]?.totalPoints).toBeGreaterThan(20)
    expect(standings[0]?.tier?.name).toBe('Rally')
  })
})

describe('getUpsetOfWeek', () => {
  it('returns the highest UTR-gap singles upset winner', () => {
    const weekMatches: Match[] = [
      baseMatch({
        id: 'm-upset-big',
        week: 3,
        division: 'sat_utr_singles',
        player1_id: 'p1',
        player1_name: 'P1',
        player1_utr: 3.0,
        player2_id: 'p2',
        player2_name: 'P2',
        player2_utr: 4.4,
        winner_id: 'p1',
      }),
      baseMatch({
        id: 'm-upset-small',
        week: 3,
        division: 'sat_utr_singles',
        player1_id: 'p3',
        player1_name: 'P3',
        player1_utr: 3.4,
        player2_id: 'p4',
        player2_name: 'P4',
        player2_utr: 3.9,
        winner_id: 'p3',
      }),
    ]

    const upset = getUpsetOfWeek(3, 'sat_utr_singles', weekMatches)
    expect(upset?.id).toBe('p1')
    expect(upset?.diff).toBeCloseTo(1.4)
  })

  it('ignores doubles matches for upset detection', () => {
    const doublesOnly: Match[] = [
      baseMatch({
        id: 'd-upset',
        division: 'sun_doubles',
        is_doubles: true,
        player3_id: 'p3',
        player3_name: 'P3',
        player3_utr: 2.9,
        player4_id: 'p4',
        player4_name: 'P4',
        player4_utr: 3.0,
        winning_team: 1,
      }),
    ]
    expect(getUpsetOfWeek(1, 'sun_doubles', doublesOnly)).toBeNull()
  })
})

describe('calculateRankMovement', () => {
  it('marks players as up/down/same/new correctly week-over-week', () => {
    const config: SeasonConfig = {
      multipliers: { '1': 1, '2': 1 },
      tiers: [{ name: 'Baseline', min: 0, max: 9999, color: '#9CA3AF', badge: 'gray' }],
      current_week: 2,
      total_weeks: 2,
      grand_finals_min_weeks: 1,
    }

    const players = [
      { id: 'p1', name: 'P1', divisions: ['sat_utr_singles'] },
      { id: 'p2', name: 'P2', divisions: ['sat_utr_singles'] },
      { id: 'p3', name: 'P3', divisions: ['sat_utr_singles'] },
      { id: 'p4', name: 'P4', divisions: ['sat_utr_singles'] },
    ]

    const matches: Match[] = [
      baseMatch({
        id: 'w1-a',
        week: 1,
        player1_id: 'p1',
        player1_name: 'P1',
        player2_id: 'p2',
        player2_name: 'P2',
        winner_id: 'p1',
      }),
      baseMatch({
        id: 'w2-a',
        week: 2,
        player1_id: 'p1',
        player1_name: 'P1',
        player2_id: 'p2',
        player2_name: 'P2',
        winner_id: 'p2',
      }),
      baseMatch({
        id: 'w2-b',
        week: 2,
        player1_id: 'p3',
        player1_name: 'P3',
        player2_id: 'p1',
        player2_name: 'P1',
        winner_id: 'p3',
      }),
    ]

    const standings = calculateStandings('sat_utr_singles', matches, players, config)
    const movement = calculateRankMovement(
      standings,
      matches,
      config.multipliers,
      config.current_week,
      'sat_utr_singles'
    )

    expect(movement.get('p3')?.trend).toBe('new')
    expect(movement.get('p1')?.trend).toBe('same')
    expect(movement.get('p2')?.trend).toBe('same')
    expect(movement.get('p4')?.trend).toBe('same')
  })
})

describe('engagement helpers', () => {
  it('calculates positive weekly delta exactly', () => {
    const matches: Match[] = [
      baseMatch({
        id: 'w1-loss',
        week: 1,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p2',
        score: '6-2',
      }),
      baseMatch({
        id: 'w2-win',
        week: 2,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p1',
        score: '6-2',
      }),
    ]
    const delta = calculateWeeklyDelta('p1', 2, matches, { '1': 1, '2': 1 })
    expect(delta).toBe(11)
  })

  it('calculates negative weekly delta exactly', () => {
    const matches: Match[] = [
      baseMatch({
        id: 'w1-win',
        week: 1,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p1',
        score: '6-2',
      }),
      baseMatch({
        id: 'w2-loss',
        week: 2,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p2',
        score: '6-2',
      }),
    ]
    const delta = calculateWeeklyDelta('p1', 2, matches, { '1': 1, '2': 1 })
    expect(delta).toBe(-7)
  })

  it('calculates zero weekly delta exactly', () => {
    const matches: Match[] = [
      baseMatch({
        id: 'w1-win',
        week: 1,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p2',
        score: '7-6(4)',
      }),
      baseMatch({
        id: 'w2-win',
        week: 2,
        player1_id: 'p1',
        player2_id: 'p2',
        winner_id: 'p2',
        score: '6-2',
      }),
    ]
    const delta = calculateWeeklyDelta('p1', 2, matches, { '1': 1, '2': 1 })
    expect(delta).toBe(0)
  })

  it('returns around-you context with gaps', () => {
    const context = getAroundYouContext(
      [
        { playerId: 'p1', playerName: 'P1', totalPoints: 40, weeksPlayed: 2, rank: 1 },
        { playerId: 'p2', playerName: 'P2', totalPoints: 33, weeksPlayed: 2, rank: 2 },
        { playerId: 'p3', playerName: 'P3', totalPoints: 30, weeksPlayed: 2, rank: 3 },
      ],
      'p2'
    )

    expect(context?.above?.playerId).toBe('p1')
    expect(context?.above?.gap).toBe(7)
    expect(context?.below?.playerId).toBe('p3')
    expect(context?.below?.gap).toBe(3)
  })

  it('computes grand finals race states', () => {
    expect(getGrandFinalsRaceStatus(5, 4, 8, 6).trend).toBe('qualified')
    expect(getGrandFinalsRaceStatus(2, 4, 8, 5).trend).toBe('on-pace')
    expect(getGrandFinalsRaceStatus(1, 5, 6, 5).trend).toBe('behind')
  })

  it('computes momentum summary from movement and weekly deltas', () => {
    const standings = [
      { playerId: 'p1', playerName: 'P1', totalPoints: 30, weeksPlayed: 2, rank: 1 },
      { playerId: 'p2', playerName: 'P2', totalPoints: 25, weeksPlayed: 2, rank: 2 },
      { playerId: 'p3', playerName: 'P3', totalPoints: 20, weeksPlayed: 2, rank: 3 },
    ]

    const movement = new Map([
      ['p1', { trend: 'same', delta: 0, previousRank: 1 }],
      ['p2', { trend: 'up', delta: 2, previousRank: 4 }],
      ['p3', { trend: 'up', delta: 1, previousRank: 4 }],
    ] as const)

    const matches: Match[] = [
      baseMatch({ id: 'w1-a', week: 1, player1_id: 'p1', player2_id: 'p2', winner_id: 'p1' }),
      baseMatch({ id: 'w2-a', week: 2, player1_id: 'p2', player2_id: 'p1', winner_id: 'p2' }),
      baseMatch({ id: 'w2-b', week: 2, player1_id: 'p3', player2_id: 'p1', winner_id: 'p3' }),
    ]

    const summary = getMomentumSummary(standings, movement, 2, matches, {
      '1': 1,
      '2': 1,
    })
    expect(summary.biggestClimb?.playerId).toBe('p2')
    expect(summary.biggestClimb?.delta).toBe(2)
    expect(summary.biggestWeeklyGain).not.toBeNull()
  })
})

