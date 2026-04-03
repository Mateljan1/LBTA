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

