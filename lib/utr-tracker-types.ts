export type DivisionId = 'sat_color_ball' | 'sat_utr_singles' | 'sun_singles' | 'sun_doubles'

export interface Player {
  id: string
  name: string
  utr: number | null
  divisions: DivisionId[]
  color_ball_stage: 'red' | 'orange' | 'green' | null
  is_color_ball: boolean
  social_opt_in: boolean
  season_registration: boolean
  is_drop_in: boolean
  provisional_utr: boolean
  joined_week: number
  created_at: string
}

export interface Match {
  id: string
  week: number
  date: string
  division: Exclude<DivisionId, 'sat_color_ball'>
  is_doubles: boolean
  player1_id: string | null
  player1_name: string
  player1_utr: number
  player1_provisional: boolean
  player2_id: string | null
  player2_name: string
  player2_utr: number
  player2_provisional: boolean
  player3_id: string | null
  player3_name: string | null
  player3_utr: number | null
  player3_provisional: boolean
  player4_id: string | null
  player4_name: string | null
  player4_utr: number | null
  player4_provisional: boolean
  score: string
  winner_id: string
  winning_team: 1 | 2 | null
  created_at: string
}

export interface ColorBallAttendance {
  id: string
  player_id: string
  week: number
  attended: boolean
  completed_match: boolean
  matches_played: number
  created_at: string
}

export interface ColorBallBadge {
  id: string
  player_id: string
  badge_id: string
  awarded_week: number
  awarded_by: string
  created_at: string
}

export interface SeasonConfig {
  multipliers: Record<string, number>
  tiers: {
    name: string
    min: number
    max: number
    color: string
    badge: string
  }[]
  current_week: number
  total_weeks: number
  grand_finals_min_weeks: number
}

export interface WeeklyPointsResult {
  total: number
  raw: number
  multiplier: number
  matchPoints: number
  attendance: number
  streak: number
  breakdown: { matchId: string; points: number }[]
  played: boolean
}

