import type { Match, SeasonConfig, WeeklyPointsResult } from './utr-tracker-types'

function isCloseLoss(scoreString: string): boolean {
  const sets = scoreString.trim().split(/\s+/)
  for (const set of sets) {
    if (set.includes('(')) return true
    const m = set.match(/^(\d+)-(\d+)$/)
    if (m) {
      const a = parseInt(m[1], 10)
      const b = parseInt(m[2], 10)
      const winner = Math.max(a, b)
      const loser = Math.min(a, b)
      if (winner - loser <= 2 && loser >= 5) return true
      if (winner === 8 && loser >= 6) return true
      if (winner >= 10 && loser >= 8) return true
    }
  }
  return false
}

export function calculateMatchPoints(match: Match, playerId: string): number {
  if (match.is_doubles) {
    const team1UTR = match.player1_utr + (match.player3_utr ?? 0)
    const team2UTR = match.player2_utr + (match.player4_utr ?? 0)
    const playerTeam =
      playerId === match.player1_id || playerId === match.player3_id ? 1 : 2
    const isWinner = match.winning_team === playerTeam
    const playerTeamUTR = playerTeam === 1 ? team1UTR : team2UTR
    const opponentTeamUTR = playerTeam === 1 ? team2UTR : team1UTR
    const utrGap = opponentTeamUTR - playerTeamUTR

    if (isWinner) {
      if (utrGap >= 1.0) return 12
      if (utrGap >= -1.0) return 10
      return 8
    }
    return isCloseLoss(match.score) ? 5 : 3
  }

  const isWinner = match.winner_id === playerId
  const isPlayer1 = match.player1_id === playerId
  const playerUTR = isPlayer1 ? match.player1_utr : match.player2_utr
  const opponentUTR = isPlayer1 ? match.player2_utr : match.player1_utr
  const isProvisional = match.player1_provisional || match.player2_provisional

  if (isProvisional) {
    if (isWinner) return 10
    return isCloseLoss(match.score) ? 5 : 3
  }

  const utrGap = opponentUTR - playerUTR
  if (isWinner) {
    if (utrGap >= 1.0) return 12
    if (utrGap >= -1.0) return 10
    return 8
  }
  return isCloseLoss(match.score) ? 5 : 3
}

export function calculateWeeklyPoints(
  playerId: string,
  week: number,
  matches: Match[],
  multipliers: Record<string, number>
): WeeklyPointsResult {
  const weekMatches = matches.filter(
    (m) =>
      m.week === week &&
      (m.player1_id === playerId ||
        m.player2_id === playerId ||
        m.player3_id === playerId ||
        m.player4_id === playerId)
  )
  if (weekMatches.length === 0) {
    return {
      total: 0,
      raw: 0,
      multiplier: multipliers[String(week)] ?? 1,
      matchPoints: 0,
      attendance: 0,
      streak: 0,
      breakdown: [],
      played: false,
    }
  }

  let matchPoints = 0
  const breakdown: { matchId: string; points: number }[] = []
  for (const match of weekMatches) {
    const pts = calculateMatchPoints(match, playerId)
    matchPoints += pts
    breakdown.push({ matchId: match.id, points: pts })
  }

  const attendance = 3
  const playedLastWeek =
    week > 1 &&
    matches.some(
      (m) =>
        m.week === week - 1 &&
        (m.player1_id === playerId ||
          m.player2_id === playerId ||
          m.player3_id === playerId ||
          m.player4_id === playerId)
    )
  const streak = playedLastWeek ? 2 : 0

  const raw = matchPoints + attendance + streak
  const multiplier = multipliers[String(week)] ?? 1
  const total = Math.ceil(raw * multiplier)

  return {
    total,
    raw,
    multiplier,
    matchPoints,
    attendance,
    streak,
    breakdown,
    played: true,
  }
}

export function getUpsetOfWeek(
  week: number,
  division: Match['division'],
  matches: Match[]
) {
  const divMatches = matches.filter(
    (m) => m.week === week && m.division === division && !m.is_doubles
  )
  let best: {
    id: string
    name: string
    utr: number
    diff: number
    matchId: string
    score: string
    loserName: string
  } | null = null
  let bestDiff = 0

  for (const m of divMatches) {
    const winner =
      m.winner_id === m.player1_id
        ? { id: m.player1_id!, name: m.player1_name, utr: m.player1_utr }
        : { id: m.player2_id!, name: m.player2_name, utr: m.player2_utr }
    const loser =
      m.winner_id === m.player1_id
        ? { id: m.player2_id!, name: m.player2_name, utr: m.player2_utr }
        : { id: m.player1_id!, name: m.player1_name, utr: m.player1_utr }
    const diff = loser.utr - winner.utr
    if (diff > bestDiff) {
      bestDiff = diff
      best = {
        ...winner,
        diff,
        matchId: m.id,
        score: m.score,
        loserName: loser.name,
      }
    }
  }
  return best
}

export function calculateStandings(
  division: Match['division'],
  matches: Match[],
  players: { id: string; name: string; divisions: string[] }[],
  config: SeasonConfig
) {
  const { multipliers, tiers, total_weeks, grand_finals_min_weeks } = config
  const divPlayers = players.filter((p) => p.divisions.includes(division))

  const standings = divPlayers.map((player) => {
    let totalPoints = 0
    let weeksPlayed = 0
    let wins = 0
    let losses = 0

    for (let wk = 1; wk <= total_weeks; wk++) {
      const result = calculateWeeklyPoints(player.id, wk, matches, multipliers)
      if (result.played) {
        weeksPlayed++
        totalPoints += result.total
        const upset = getUpsetOfWeek(wk, division, matches)
        if (upset && upset.id === player.id) {
          totalPoints += Math.ceil(5 * (multipliers[String(wk)] ?? 1))
        }
      }
      matches
        .filter(
          (m) =>
            m.week === wk &&
            m.division === division &&
            (m.player1_id === player.id ||
              m.player2_id === player.id ||
              m.player3_id === player.id ||
              m.player4_id === player.id)
        )
        .forEach((m) => {
          if (m.is_doubles) {
            const playerTeam =
              player.id === m.player1_id || player.id === m.player3_id ? 1 : 2
            if (m.winning_team != null && m.winning_team === playerTeam) wins++
            else losses++
            return
          }
          if (m.winner_id === player.id) wins++
          else losses++
        })
    }

    const tier =
      tiers.find((t) => totalPoints >= t.min && totalPoints <= t.max) ?? null

    return {
      playerId: player.id,
      playerName: player.name,
      totalPoints,
      weeksPlayed,
      wins,
      losses,
      winPct: wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0,
      tier,
      gfEligible: weeksPlayed >= grand_finals_min_weeks,
      rank: 0,
    }
  })

  return standings
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((s, i) => ({ ...s, rank: i + 1 }))
}

type MovementInputRow = {
  playerId: string
  playerName: string
  weeksPlayed: number
  rank: number
}

export type RankMovement = {
  trend: 'up' | 'down' | 'same' | 'new'
  delta: number
  previousRank: number | null
}

export type LeaderboardSnapshotRow = {
  playerId: string
  playerName: string
  totalPoints: number
  weeksPlayed: number
  rank: number
}

export type AroundYouContext = {
  above:
    | { playerId: string; playerName: string; rank: number; totalPoints: number; gap: number }
    | null
  current: { playerId: string; playerName: string; rank: number; totalPoints: number }
  below:
    | { playerId: string; playerName: string; rank: number; totalPoints: number; gap: number }
    | null
}

export type GfRaceStatus = {
  trend: 'qualified' | 'on-pace' | 'behind'
  weeksRemaining: number
  weeksNeeded: number
  label: string
}

export type MomentumSummary = {
  biggestClimb: { playerId: string; playerName: string; delta: number } | null
  biggestWeeklyGain: { playerId: string; playerName: string; delta: number } | null
}

export function calculateRankMovement(
  standings: MovementInputRow[],
  matches: Match[],
  multipliers: Record<string, number>,
  currentWeek: number,
  division: Match['division']
): Map<string, RankMovement> {
  const movement = new Map<string, RankMovement>()
  if (currentWeek <= 1) {
    standings.forEach((row) => {
      movement.set(row.playerId, { trend: 'same', delta: 0, previousRank: null })
    })
    return movement
  }

  const previousRows = standings.map((row) => {
    let previousPoints = 0
    let previousWeeksPlayed = 0

    for (let week = 1; week < currentWeek; week++) {
      const weekly = calculateWeeklyPoints(row.playerId, week, matches, multipliers)
      if (weekly.played) {
        previousWeeksPlayed += 1
        previousPoints += weekly.total
        const upset = getUpsetOfWeek(week, division, matches)
        if (upset && upset.id === row.playerId) {
          previousPoints += Math.ceil(5 * (multipliers[String(week)] ?? 1))
        }
      }
    }

    return {
      playerId: row.playerId,
      playerName: row.playerName,
      previousPoints,
      previousWeeksPlayed,
    }
  })

  const previousRankMap = new Map<string, number>()
  previousRows
    .filter((row) => row.previousWeeksPlayed > 0)
    .sort((a, b) => {
      if (b.previousPoints !== a.previousPoints) {
        return b.previousPoints - a.previousPoints
      }
      if (b.previousWeeksPlayed !== a.previousWeeksPlayed) {
        return b.previousWeeksPlayed - a.previousWeeksPlayed
      }
      return a.playerName.localeCompare(b.playerName)
    })
    .forEach((row, idx) => {
      previousRankMap.set(row.playerId, idx + 1)
    })

  standings.forEach((row) => {
    const previousRank = previousRankMap.get(row.playerId) ?? null
    if (row.weeksPlayed > 0 && previousRank == null) {
      movement.set(row.playerId, { trend: 'new', delta: 0, previousRank: null })
      return
    }
    if (previousRank == null) {
      movement.set(row.playerId, { trend: 'same', delta: 0, previousRank: null })
      return
    }

    const delta = previousRank - row.rank
    if (delta > 0) {
      movement.set(row.playerId, { trend: 'up', delta, previousRank })
      return
    }
    if (delta < 0) {
      movement.set(row.playerId, {
        trend: 'down',
        delta: Math.abs(delta),
        previousRank,
      })
      return
    }
    movement.set(row.playerId, { trend: 'same', delta: 0, previousRank })
  })

  return movement
}

export function calculateWeeklyDelta(
  playerId: string,
  currentWeek: number,
  matches: Match[],
  multipliers: Record<string, number>
): number {
  const currentPoints = calculateWeeklyPoints(
    playerId,
    currentWeek,
    matches,
    multipliers
  ).total
  const previousPoints =
    currentWeek > 1
      ? calculateWeeklyPoints(playerId, currentWeek - 1, matches, multipliers).total
      : 0
  return currentPoints - previousPoints
}

export function getAroundYouContext(
  standings: LeaderboardSnapshotRow[],
  playerId: string
): AroundYouContext | null {
  const index = standings.findIndex((row) => row.playerId === playerId)
  if (index === -1) return null
  const current = standings[index]
  const above = index > 0 ? standings[index - 1] : null
  const below = index < standings.length - 1 ? standings[index + 1] : null

  return {
    above: above
      ? {
          playerId: above.playerId,
          playerName: above.playerName,
          rank: above.rank,
          totalPoints: above.totalPoints,
          gap: above.totalPoints - current.totalPoints,
        }
      : null,
    current: {
      playerId: current.playerId,
      playerName: current.playerName,
      rank: current.rank,
      totalPoints: current.totalPoints,
    },
    below: below
      ? {
          playerId: below.playerId,
          playerName: below.playerName,
          rank: below.rank,
          totalPoints: below.totalPoints,
          gap: current.totalPoints - below.totalPoints,
        }
      : null,
  }
}

export function getGrandFinalsRaceStatus(
  weeksPlayed: number,
  grandFinalsMinWeeks: number,
  totalWeeks: number,
  currentWeek: number
): GfRaceStatus {
  const weeksRemaining = Math.max(totalWeeks - currentWeek, 0)
  const weeksNeeded = Math.max(grandFinalsMinWeeks - weeksPlayed, 0)
  if (weeksNeeded <= 0) {
    return {
      trend: 'qualified',
      weeksRemaining,
      weeksNeeded: 0,
      label: 'Qualified',
    }
  }
  if (weeksNeeded <= weeksRemaining) {
    return {
      trend: 'on-pace',
      weeksRemaining,
      weeksNeeded,
      label: `${weeksNeeded} wk${weeksNeeded === 1 ? '' : 's'} needed`,
    }
  }
  return {
    trend: 'behind',
    weeksRemaining,
    weeksNeeded,
    label: `${weeksNeeded - weeksRemaining} wk behind pace`,
  }
}

export function getMomentumSummary(
  standings: LeaderboardSnapshotRow[],
  movementByPlayer: Map<string, RankMovement>,
  currentWeek: number,
  matches: Match[],
  multipliers: Record<string, number>
): MomentumSummary {
  let biggestClimb: MomentumSummary['biggestClimb'] = null
  let biggestWeeklyGain: MomentumSummary['biggestWeeklyGain'] = null

  for (const row of standings) {
    const movement = movementByPlayer.get(row.playerId)
    if (movement?.trend === 'up') {
      if (!biggestClimb || movement.delta > biggestClimb.delta) {
        biggestClimb = {
          playerId: row.playerId,
          playerName: row.playerName,
          delta: movement.delta,
        }
      }
    }

    const weeklyDelta = calculateWeeklyDelta(
      row.playerId,
      currentWeek,
      matches,
      multipliers
    )
    if (weeklyDelta > 0) {
      if (!biggestWeeklyGain || weeklyDelta > biggestWeeklyGain.delta) {
        biggestWeeklyGain = {
          playerId: row.playerId,
          playerName: row.playerName,
          delta: weeklyDelta,
        }
      }
    }
  }

  return { biggestClimb, biggestWeeklyGain }
}

