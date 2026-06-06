import { describe, it, expect } from 'vitest'
import {
  generateRoundRobin,
  matchKey,
  levelFromUtr,
  computeStandings,
  parseScore,
  formatScore,
  evaluateWinner,
  orderPodPlayers,
  POD_META,
  type Player,
} from './matchday-config'

function mk(id: string, name: string, extra: Partial<Player> = {}): Player {
  return { id, name, level: 'adult1-3', pod: 'singles-1-3', walkin: false, ...extra }
}

describe('generateRoundRobin', () => {
  it('produces a full round robin for an even count with no byes', () => {
    const players = [mk('a', 'A'), mk('b', 'B'), mk('c', 'C'), mk('d', 'D')]
    const rounds = generateRoundRobin(players)
    expect(rounds).toHaveLength(3)
    rounds.forEach((r) => expect(r).toHaveLength(2))
    // Every unique pair appears exactly once.
    const seen = new Set<string>()
    rounds.flat().forEach(([x, y]) => seen.add([x.id, y.id].sort().join('-')))
    expect(seen.size).toBe(6)
  })

  it('rotates a single bye fairly for odd counts', () => {
    const players = [mk('a', 'A'), mk('b', 'B'), mk('c', 'C')]
    const rounds = generateRoundRobin(players)
    expect(rounds).toHaveLength(3)
    // Exactly one match per round (the third player sits).
    rounds.forEach((r) => expect(r).toHaveLength(1))
    // Each player sits exactly once.
    const sits: Record<string, number> = { a: 0, b: 0, c: 0 }
    rounds.forEach((r) => {
      const playing = new Set(r.flat().map((p) => p.id))
      players.forEach((p) => {
        if (!playing.has(p.id)) sits[p.id]++
      })
    })
    expect(sits).toEqual({ a: 1, b: 1, c: 1 })
  })

  it('returns no rounds for fewer than two players', () => {
    expect(generateRoundRobin([mk('a', 'A')])).toHaveLength(0)
    expect(generateRoundRobin([])).toHaveLength(0)
  })
})

describe('matchKey', () => {
  it('is stable regardless of player order', () => {
    expect(matchKey('singles-1-3', 'x', 'y')).toBe(matchKey('singles-1-3', 'y', 'x'))
  })
  it('scopes by pod', () => {
    expect(matchKey('color-ball', 'x', 'y')).not.toBe(matchKey('juniors', 'x', 'y'))
  })
})

describe('levelFromUtr', () => {
  it('routes color-ball stages', () => {
    expect(levelFromUtr(null, { colorBall: true, stage: 'green' })).toBe('green')
    expect(levelFromUtr(null, { colorBall: true, stage: 'orange' })).toBe('orange')
    expect(levelFromUtr(null, { colorBall: true })).toBe('red')
  })
  it('buckets adults by UTR', () => {
    expect(levelFromUtr(1.6)).toBe('adult1-3')
    expect(levelFromUtr(4.2)).toBe('adult3-5')
    expect(levelFromUtr(6.0)).toBe('adult5')
  })
  it('falls back to yellow when UTR is unknown', () => {
    expect(levelFromUtr(null)).toBe('yellow')
    expect(levelFromUtr(undefined)).toBe('yellow')
  })
})

describe('orderPodPlayers', () => {
  it('sorts seeded pods by seed', () => {
    const players = [mk('a', 'A', { seed: 3 }), mk('b', 'B', { seed: 1 }), mk('c', 'C', { seed: 2 })]
    expect(orderPodPlayers(players).map((p) => p.id)).toEqual(['b', 'c', 'a'])
  })
  it('preserves order for unseeded pods', () => {
    const players = [mk('a', 'A'), mk('b', 'B')]
    expect(orderPodPlayers(players).map((p) => p.id)).toEqual(['a', 'b'])
  })
})

describe('computeStandings', () => {
  it('ranks by wins then fewest losses', () => {
    const players = [mk('a', 'A'), mk('b', 'B'), mk('c', 'C')]
    const results: Record<string, string> = {
      [matchKey('singles-1-3', 'a', 'b')]: 'a',
      [matchKey('singles-1-3', 'a', 'c')]: 'a',
      [matchKey('singles-1-3', 'b', 'c')]: 'b',
    }
    const standings = computeStandings('singles-1-3', players, results)
    expect(standings[0]).toMatchObject({ id: 'a', w: 2, l: 0 })
    expect(standings[1]).toMatchObject({ id: 'b', w: 1, l: 1 })
    expect(standings[2]).toMatchObject({ id: 'c', w: 0, l: 2 })
  })
})

describe('parseScore / formatScore', () => {
  it('round-trips a multi-set score', () => {
    expect(parseScore('4-2, 3-4')).toEqual([
      { a: 4, b: 2 },
      { a: 3, b: 4 },
    ])
    expect(formatScore([{ a: 4, b: 2 }, { a: 3, b: 4 }])).toBe('4-2, 3-4')
  })
  it('ignores malformed parts and empty sets', () => {
    expect(parseScore('abc')).toEqual([])
    expect(formatScore([{ a: 0, b: 0 }])).toBe('')
  })
})

describe('evaluateWinner', () => {
  it('decides a color-ball short set', () => {
    const fmt = POD_META['color-ball'].scoring
    expect(evaluateWinner(fmt, [{ a: 4, b: 2 }])).toBe('a')
    expect(evaluateWinner(fmt, [{ a: 2, b: 1 }])).toBe(null)
  })
  it('requires win-by-2 on an 8-game pro set', () => {
    const fmt = POD_META['singles-1-3'].scoring
    expect(evaluateWinner(fmt, [{ a: 8, b: 7 }])).toBe(null)
    expect(evaluateWinner(fmt, [{ a: 9, b: 7 }])).toBe('a')
  })
  it('needs two sets in a best-of-three Fast 4 pod', () => {
    const fmt = POD_META['lbhs-pod-1'].scoring
    expect(evaluateWinner(fmt, [{ a: 4, b: 2 }])).toBe(null)
    expect(evaluateWinner(fmt, [{ a: 4, b: 2 }, { a: 4, b: 1 }])).toBe('a')
    expect(evaluateWinner(fmt, [{ a: 4, b: 2 }, { a: 2, b: 4 }, { a: 4, b: 3 }])).toBe('a')
  })
  it('treats the decider as a match tiebreak when configured', () => {
    const fmt = POD_META['singles-3-5'].scoring
    // 1 set each, decider is first-to-10 win-by-2.
    expect(evaluateWinner(fmt, [{ a: 6, b: 4 }, { a: 4, b: 6 }, { a: 10, b: 7 }])).toBe('a')
    expect(evaluateWinner(fmt, [{ a: 6, b: 4 }, { a: 4, b: 6 }, { a: 9, b: 8 }])).toBe(null)
  })
})
