import type {
  ColorBallAttendance,
  ColorBallBadge,
  Match,
  Player,
  SeasonConfig,
  DivisionId,
} from './utr-tracker-types'
import { getClient as getSupabaseClient } from './leads-store'

function mapPlayer(row: any): Player {
  return {
    id: row.id,
    name: row.name,
    utr: row.utr,
    divisions: row.divisions ?? [],
    color_ball_stage: row.color_ball_stage,
    is_color_ball: row.is_color_ball,
    social_opt_in: row.social_opt_in,
    season_registration: row.season_registration,
    is_drop_in: row.is_drop_in,
    provisional_utr: row.provisional_utr,
    joined_week: row.joined_week,
    created_at: row.created_at,
  }
}

function mapMatch(row: any): Match {
  return {
    id: row.id,
    week: row.week,
    date: row.date,
    division: row.division,
    is_doubles: row.is_doubles,
    player1_id: row.player1_id,
    player1_name: row.player1_name,
    player1_utr: row.player1_utr,
    player1_provisional: row.player1_provisional,
    player2_id: row.player2_id,
    player2_name: row.player2_name,
    player2_utr: row.player2_utr,
    player2_provisional: row.player2_provisional,
    player3_id: row.player3_id,
    player3_name: row.player3_name,
    player3_utr: row.player3_utr,
    player3_provisional: row.player3_provisional,
    player4_id: row.player4_id,
    player4_name: row.player4_name,
    player4_utr: row.player4_utr,
    player4_provisional: row.player4_provisional,
    score: row.score,
    winner_id: row.winner_id,
    winning_team: row.winning_team,
    created_at: row.created_at,
  }
}

function mapAttendance(row: any): ColorBallAttendance {
  return {
    id: row.id,
    player_id: row.player_id,
    week: row.week,
    attended: row.attended,
    completed_match: row.completed_match,
    matches_played: row.matches_played,
    created_at: row.created_at,
  }
}

function mapBadge(row: any): ColorBallBadge {
  return {
    id: row.id,
    player_id: row.player_id,
    badge_id: row.badge_id,
    awarded_week: row.awarded_week,
    awarded_by: row.awarded_by,
    created_at: row.created_at,
  }
}

export async function getSeasonConfig(): Promise<SeasonConfig | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('season_config')
    .select('key,value')

  if (error) {
    console.error('[utr-tracker] season_config query failed:', error.message)
    return null
  }

  const map = new Map<string, any>()
  for (const row of data ?? []) {
    map.set(row.key, row.value)
  }

  const multipliers = (map.get('multipliers') ?? {}) as Record<string, number>
  const tiers = (map.get('tiers') ?? []) as SeasonConfig['tiers']
  const current_week = Number(map.get('current_week') ?? 1)
  const total_weeks = Number(map.get('total_weeks') ?? 8)
  const grand_finals_min_weeks = Number(
    map.get('grand_finals_min_weeks') ?? 5
  )

  return {
    multipliers,
    tiers,
    current_week,
    total_weeks,
    grand_finals_min_weeks,
  }
}

export async function getPlayersForDivision(
  division: DivisionId
): Promise<Player[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .contains('divisions', [division])

  if (error) {
    console.error('[utr-tracker] players query failed:', error.message)
    return []
  }

  return (data ?? []).map(mapPlayer)
}

export async function getDivisionMatches(
  division: Exclude<DivisionId, 'sat_color_ball'>
): Promise<Match[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('division', division)
    .order('week', { ascending: true })
    .order('date', { ascending: true })

  if (error) {
    console.error('[utr-tracker] matches query failed:', error.message)
    return []
  }

  return (data ?? []).map(mapMatch)
}

export async function getAllColorBallAttendance(): Promise<
  ColorBallAttendance[]
> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('color_ball_attendance')
    .select('*')
    .order('week', { ascending: true })

  if (error) {
    console.error(
      '[utr-tracker] color_ball_attendance query failed:',
      error.message
    )
    return []
  }

  return (data ?? []).map(mapAttendance)
}

export async function getAllColorBallBadges(): Promise<ColorBallBadge[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('color_ball_badges')
    .select('*')

  if (error) {
    console.error(
      '[utr-tracker] color_ball_badges query failed:',
      error.message
    )
    return []
  }

  return (data ?? []).map(mapBadge)
}

export async function getAllPlayers(): Promise<Player[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('[utr-tracker] players list query failed:', error.message)
    return []
  }

  return (data ?? []).map(mapPlayer)
}

export async function upsertPlayers(
  rows: Array<{
    id?: string
    name: string
    utr?: number | null
    divisions: string[]
    color_ball_stage?: 'red' | 'orange' | 'green' | null
    is_color_ball?: boolean
    social_opt_in?: boolean
    season_registration?: boolean
    is_drop_in?: boolean
    provisional_utr?: boolean
    joined_week?: number
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured.' }

  const { error } = await supabase.rpc('upsert_players_batch', {
    p_players: rows,
  })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertMatches(
  rows: Array<{
    week: number
    date: string
    division: 'sat_utr_singles' | 'sun_singles' | 'sun_doubles'
    is_doubles: boolean
    player1_id: string | null
    player1_name: string
    player1_utr: number
    player1_provisional: boolean
    player2_id: string | null
    player2_name: string
    player2_utr: number
    player2_provisional: boolean
    player3_id?: string | null
    player3_name?: string | null
    player3_utr?: number | null
    player3_provisional?: boolean
    player4_id?: string | null
    player4_name?: string | null
    player4_utr?: number | null
    player4_provisional?: boolean
    score: string
    winner_id: string
    winning_team?: 1 | 2 | null
  }>,
  mode: 'append' | 'replace_week_division_date' = 'append'
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured.' }

  if (rows.length === 0) return { success: true }

  if (mode === 'replace_week_division_date') {
    const first = rows[0]
    const mixedScope = rows.some(
      (row) =>
        row.week !== first.week ||
        row.division !== first.division ||
        row.date !== first.date
    )
    if (mixedScope) {
      return {
        success: false,
        error:
          'Replace mode requires all matches to share the same week, division, and date.',
      }
    }

    const rpcResult = await supabase.rpc('replace_utr_matches_scope', {
      p_week: first.week,
      p_division: first.division,
      p_date: first.date,
      p_rows: rows,
    })

    if (rpcResult.error) {
      // Backward compatible fallback until the atomic migration is applied.
      const missingFunction =
        rpcResult.error.message.includes('replace_utr_matches_scope') &&
        rpcResult.error.message.includes('does not exist')
      if (!missingFunction) {
        return { success: false, error: rpcResult.error.message }
      }

      const { error: deleteError } = await supabase
        .from('matches')
        .delete()
        .eq('week', first.week)
        .eq('division', first.division)
        .eq('date', first.date)
      if (deleteError) {
        return { success: false, error: deleteError.message }
      }

      const { error: insertError } = await supabase.from('matches').insert(rows)
      if (insertError) {
        return { success: false, error: insertError.message }
      }
      return { success: true }
    }

    return { success: true }
  }

  const { error } = await supabase.from('matches').insert(rows)
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function upsertColorBallAttendance(
  rows: Array<{
    player_id: string
    week: number
    attended: boolean
    completed_match: boolean
    matches_played: number
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured.' }

  const { error } = await supabase
    .from('color_ball_attendance')
    .upsert(rows, { onConflict: 'player_id,week' })

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function replaceCoachBadgesForWeek(
  week: number,
  entries: Array<{ player_id: string; badge_id: string }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured.' }

  const { error: deleteError } = await supabase
    .from('color_ball_badges')
    .delete()
    .eq('awarded_week', week)
    .eq('awarded_by', 'coach')

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  if (entries.length > 0) {
    const rows = entries.map((entry) => ({
      player_id: entry.player_id,
      badge_id: entry.badge_id,
      awarded_week: week,
      awarded_by: 'coach',
    }))
    const { error: insertError } = await supabase
      .from('color_ball_badges')
      .upsert(rows, { onConflict: 'player_id,badge_id' })
    if (insertError) {
      return { success: false, error: insertError.message }
    }
  }

  return { success: true }
}

export async function upsertColorBallWeekAtomic(
  week: number,
  entries: Array<{
    player_id: string
    attended: boolean
    completed_match: boolean
    matches_played: number
    coach_badges: string[]
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured.' }

  const { error } = await supabase.rpc('upsert_color_ball_week', {
    p_week: week,
    p_entries: entries,
  })

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

