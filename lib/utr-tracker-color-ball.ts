import type { ColorBallAttendance } from './utr-tracker-types'

export const COLOR_BALL_BADGES = [
  { id: 'first_match', type: 'auto' as const },
  { id: 'rally_ready', type: 'auto' as const },
  { id: 'three_match', type: 'auto' as const },
  { id: 'streak_starter', type: 'auto' as const },
  { id: 'high_five', type: 'auto' as const },
  { id: 'season_player', type: 'auto' as const },
  { id: 'all_star', type: 'auto' as const },
] as const

export type ColorBallAutoBadgeId = (typeof COLOR_BALL_BADGES)[number]['id']

export function calculateAutoBadges(
  playerId: string,
  attendance: ColorBallAttendance[]
): ColorBallAutoBadgeId[] {
  const playerWeeks = attendance.filter(
    (a) => a.player_id === playerId && a.attended
  )
  if (playerWeeks.length === 0) return []

  const totalMatches = playerWeeks.reduce(
    (sum, w) => sum + w.matches_played,
    0
  )
  const totalWeeks = playerWeeks.length
  const completedMatch = playerWeeks.some((w) => w.completed_match)

  const weekNums = playerWeeks
    .map((w) => w.week)
    .sort((a, b) => a - b)
  let maxConsecutive = 0
  let current = 1
  for (let i = 1; i < weekNums.length; i++) {
    if (weekNums[i] === weekNums[i - 1] + 1) {
      current++
      if (current > maxConsecutive) maxConsecutive = current
    } else {
      current = 1
    }
  }
  maxConsecutive = Math.max(maxConsecutive, current)

  const earned: ColorBallAutoBadgeId[] = []
  if (totalMatches >= 1) earned.push('first_match')
  if (completedMatch) earned.push('rally_ready')
  if (totalMatches >= 3) earned.push('three_match')
  if (maxConsecutive >= 3) earned.push('streak_starter')
  if (totalMatches >= 5) earned.push('high_five')
  if (totalWeeks >= 5) earned.push('season_player')
  if (totalWeeks >= 8) earned.push('all_star')

  return earned
}

