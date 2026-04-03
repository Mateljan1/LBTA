import { describe, expect, it } from 'vitest'
import { calculateAutoBadges } from './utr-tracker-color-ball'
import type { ColorBallAttendance } from './utr-tracker-types'

function attendanceRow(
  overrides: Partial<ColorBallAttendance>
): ColorBallAttendance {
  return {
    id: 'a1',
    player_id: 'player-1',
    week: 1,
    attended: true,
    completed_match: false,
    matches_played: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('calculateAutoBadges', () => {
  it('returns empty badges when player never attended', () => {
    const rows = [attendanceRow({ player_id: 'other-player' })]
    expect(calculateAutoBadges('player-1', rows)).toEqual([])
  })

  it('awards first_match and rally_ready after first completed match', () => {
    const rows = [
      attendanceRow({
        week: 1,
        matches_played: 1,
        completed_match: true,
      }),
    ]
    expect(calculateAutoBadges('player-1', rows)).toEqual([
      'first_match',
      'rally_ready',
    ])
  })

  it('awards three_match and high_five at match thresholds', () => {
    const rows = [
      attendanceRow({ week: 1, matches_played: 2 }),
      attendanceRow({ id: 'a2', week: 2, matches_played: 3 }),
    ]
    const badges = calculateAutoBadges('player-1', rows)
    expect(badges).toContain('three_match')
    expect(badges).toContain('high_five')
  })

  it('awards streak_starter only for 3+ consecutive attended weeks', () => {
    const nonConsecutive = [
      attendanceRow({ week: 1, matches_played: 1 }),
      attendanceRow({ id: 'a2', week: 3, matches_played: 1 }),
      attendanceRow({ id: 'a3', week: 4, matches_played: 1 }),
    ]
    expect(calculateAutoBadges('player-1', nonConsecutive)).not.toContain(
      'streak_starter'
    )

    const consecutive = [
      attendanceRow({ week: 1, matches_played: 1 }),
      attendanceRow({ id: 'a2', week: 2, matches_played: 1 }),
      attendanceRow({ id: 'a3', week: 3, matches_played: 1 }),
    ]
    expect(calculateAutoBadges('player-1', consecutive)).toContain(
      'streak_starter'
    )
  })

  it('awards season_player and all_star on attended-week thresholds', () => {
    const weekRows = Array.from({ length: 8 }).map((_, index) =>
      attendanceRow({
        id: `a-${index + 1}`,
        week: index + 1,
        matches_played: 1,
      })
    )

    const badges = calculateAutoBadges('player-1', weekRows)
    expect(badges).toContain('season_player')
    expect(badges).toContain('all_star')
  })
})
