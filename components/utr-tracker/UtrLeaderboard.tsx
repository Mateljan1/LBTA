'use client'

import React from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleHelp,
  Flame,
  Medal,
  Minus,
  Target,
  Trophy,
} from 'lucide-react'
import type { Match, SeasonConfig } from '@/lib/utr-tracker-types'
import {
  calculateWeeklyDelta,
  calculateRankMovement,
  getAroundYouContext,
  getGrandFinalsRaceStatus,
  getMomentumSummary,
  calculateWeeklyPoints,
  getUpsetOfWeek,
} from '@/lib/utr-tracker-points'

type Standing = {
  playerId: string
  playerName: string
  totalPoints: number
  weeksPlayed: number
  wins: number
  losses: number
  winPct: number
  tier: SeasonConfig['tiers'][number] | null
  gfEligible: boolean
  rank: number
}

type DivisionKey = 'satSingles' | 'sunSingles' | 'sunDoubles'

interface DivisionData {
  standings: Standing[]
  matches: Match[]
}

interface Props {
  config: SeasonConfig
  satSingles: DivisionData
  sunSingles: DivisionData
  sunDoubles: DivisionData
}

const DIVISION_LABELS: { key: DivisionKey; label: string }[] = [
  { key: 'satSingles', label: 'Saturday UTR 2.0–5.0' },
  { key: 'sunSingles', label: 'Sunday Singles' },
  { key: 'sunDoubles', label: 'Sunday Doubles' },
]

function getCurrentStreak(playerId: string, matches: Match[]): number {
  const playedWeeks = Array.from(
    new Set(
      matches
        .filter(
          (m) =>
            m.player1_id === playerId ||
            m.player2_id === playerId ||
            m.player3_id === playerId ||
            m.player4_id === playerId
        )
        .map((m) => m.week)
    )
  ).sort((a, b) => b - a)

  if (playedWeeks.length === 0) return 0
  let streak = 1
  for (let i = 1; i < playedWeeks.length; i++) {
    if (playedWeeks[i - 1] - playedWeeks[i] === 1) streak += 1
    else break
  }
  return streak
}

function getTierProgress(
  totalPoints: number,
  tier: SeasonConfig['tiers'][number] | null,
  tiers: SeasonConfig['tiers']
) {
  if (!tier) return { progressPct: 0, pointsToNext: null as number | null }
  const ordered = [...tiers].sort((a, b) => a.min - b.min)
  const idx = ordered.findIndex(
    (candidate) =>
      candidate.name === tier.name &&
      candidate.min === tier.min &&
      candidate.max === tier.max
  )
  if (idx < 0 || idx === ordered.length - 1) {
    return { progressPct: 100, pointsToNext: null as number | null }
  }
  const nextTier = ordered[idx + 1]
  const span = Math.max(nextTier.min - tier.min, 1)
  const progressRaw = ((totalPoints - tier.min) / span) * 100
  const progressPct = Math.max(0, Math.min(100, Math.round(progressRaw)))
  const pointsToNext = Math.max(nextTier.min - totalPoints, 0)
  return { progressPct, pointsToNext }
}

function getRankAccent(rank: number): string {
  if (rank === 1) return 'bg-brand-thousand-steps/20 border-brand-thousand-steps/40'
  if (rank === 2) return 'bg-brand-pacific-dusk/10 border-brand-pacific-dusk/20'
  if (rank === 3) return 'bg-brand-victoria-cove/10 border-brand-victoria-cove/30'
  return 'bg-transparent border-transparent'
}

export default function UtrLeaderboard({
  config,
  satSingles,
  sunSingles,
  sunDoubles,
}: Props) {
  const [activeDivision, setActiveDivision] =
    React.useState<DivisionKey>('satSingles')
  const [expandedPlayerId, setExpandedPlayerId] = React.useState<string | null>(
    null
  )
  const [isWeeklyDeltaHelpOpen, setIsWeeklyDeltaHelpOpen] = React.useState(false)

  const divisionData: Record<DivisionKey, DivisionData> = {
    satSingles,
    sunSingles,
    sunDoubles,
  }
  const { standings, matches } = divisionData[activeDivision]

  const divisionIdByKey: Record<DivisionKey, Match['division']> = {
    satSingles: 'sat_utr_singles',
    sunSingles: 'sun_singles',
    sunDoubles: 'sun_doubles',
  }

  const upset = getUpsetOfWeek(
    config.current_week,
    divisionIdByKey[activeDivision],
    matches
  )
  const topThree = standings.slice(0, 3)
  const activePlayers = standings.filter((row) => row.weeksPlayed > 0).length
  const currentWeekMatches = matches.filter(
    (match) => match.week === config.current_week
  ).length
  const hottestStreak = standings.reduce((maxStreak, row) => {
    return Math.max(maxStreak, getCurrentStreak(row.playerId, matches))
  }, 0)
  const leaderGap =
    standings.length >= 2 ? standings[0].totalPoints - standings[1].totalPoints : 0
  const movementByPlayer = calculateRankMovement(
    standings,
    matches,
    config.multipliers,
    config.current_week,
    divisionIdByKey[activeDivision]
  )
  const momentumSummary = getMomentumSummary(
    standings,
    movementByPlayer,
    config.current_week,
    matches,
    config.multipliers
  )

  return (
    <section aria-labelledby="utr-leaderboard-heading">
      <div className="mb-6 text-center md:text-left">
        <p className="text-eyebrow text-brand-victoria-cove mb-2">Leaderboard</p>
        <h2
          id="utr-leaderboard-heading"
          className="font-headline text-headline text-brand-pacific-dusk"
        >
          Season standings
        </h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {DIVISION_LABELS.map((div) => (
          <button
            key={div.key}
            type="button"
            onClick={() => {
              setActiveDivision(div.key)
              setExpandedPlayerId(null)
            }}
            className={[
              'inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-sans font-medium tracking-[0.16em] uppercase min-h-[48px]',
              activeDivision === div.key
                ? 'border-brand-pacific-dusk bg-brand-pacific-dusk text-white'
                : 'border-brand-pacific-dusk/15 bg-white text-brand-pacific-dusk hover:border-brand-pacific-dusk/40',
            ].join(' ')}
          >
            {div.label}
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Active players
          </p>
          <p className="font-headline text-headline-sm text-brand-pacific-dusk">
            {activePlayers}
          </p>
        </div>
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
            <Medal className="h-3.5 w-3.5" aria-hidden="true" />
            Week {config.current_week} matches
          </p>
          <p className="font-headline text-headline-sm text-brand-pacific-dusk">
            {currentWeekMatches}
          </p>
        </div>
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Hottest streak
          </p>
          <p className="font-headline text-headline-sm text-brand-pacific-dusk">
            {hottestStreak} week{hottestStreak === 1 ? '' : 's'}
          </p>
        </div>
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            Leader gap
          </p>
          <p className="font-headline text-headline-sm text-brand-pacific-dusk">
            {leaderGap} pts
          </p>
        </div>
      </div>

      {topThree.length > 0 ? (
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {topThree.map((player) => (
            <article
              key={`top-${player.playerId}`}
              className={['rounded-xl border p-4', getRankAccent(player.rank)].join(
                ' '
              )}
            >
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
                Rank #{player.rank}
              </p>
              <h3 className="font-headline text-headline-sm text-brand-pacific-dusk">
                {player.playerName}
              </h3>
              <p className="text-[13px] text-brand-pacific-dusk/75">
                {player.totalPoints} pts · {player.wins}-{player.losses}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60 mb-1">
            Biggest climb this week
          </p>
          <p className="text-[13px] text-brand-pacific-dusk">
            {momentumSummary.biggestClimb
              ? `${momentumSummary.biggestClimb.playerName} (+${momentumSummary.biggestClimb.delta} rank${momentumSummary.biggestClimb.delta === 1 ? '' : 's'})`
              : 'No rank climbs yet this week'}
          </p>
        </div>
        <div className="rounded-xl border border-brand-pacific-dusk/10 bg-white p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-brand-pacific-dusk/60 mb-1">
            Biggest weekly gain
          </p>
          <p className="text-[13px] text-brand-pacific-dusk">
            {momentumSummary.biggestWeeklyGain
              ? `${momentumSummary.biggestWeeklyGain.playerName} (+${momentumSummary.biggestWeeklyGain.delta} pts vs last week)`
              : 'No positive gains vs last week yet'}
          </p>
        </div>
      </div>

      {upset ? (
        <div className="mb-4 rounded-xl border border-brand-thousand-steps/30 bg-brand-sandstone/60 p-3">
          <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
            Upset of the Week
          </p>
          <p className="font-sans text-sm text-brand-pacific-dusk">
            <span className="font-semibold">{upset.name}</span> beat{' '}
            <span className="font-semibold">{upset.loserName}</span> (
            {upset.diff.toFixed(2)} UTR gap) — {upset.score}
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-brand-pacific-dusk/10 bg-white shadow-[0_8px_24px_rgba(27,58,92,0.06)]">
        <table className="min-w-full text-left text-[13px] font-sans">
          <caption className="sr-only">
            UTR leaderboard standings with movement, weekly delta, and grand finals status.
          </caption>
          <thead className="bg-brand-sandstone/70 text-brand-pacific-dusk/70">
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2">Movement</th>
              <th className="px-3 py-2 text-right">
                <span className="relative inline-flex items-center gap-1">
                  This Week Δ
                  <button
                    type="button"
                    aria-label="What does This Week delta mean?"
                    aria-describedby="weekly-delta-tooltip"
                    aria-expanded={isWeeklyDeltaHelpOpen}
                    className="peer inline-flex rounded-sm text-brand-pacific-dusk/55 transition-colors hover:text-brand-pacific-dusk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sandstone/70"
                    onClick={() => setIsWeeklyDeltaHelpOpen((value) => !value)}
                    onBlur={() => setIsWeeklyDeltaHelpOpen(false)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setIsWeeklyDeltaHelpOpen(false)
                      }
                    }}
                  >
                    <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span
                    id="weekly-delta-tooltip"
                    role="tooltip"
                    className={[
                      'pointer-events-none absolute -top-2 right-0 z-20 w-52 -translate-y-full rounded-md border border-brand-pacific-dusk/15 bg-white px-2.5 py-2 text-left text-[11px] normal-case tracking-normal text-brand-pacific-dusk/85 shadow-[0_8px_20px_rgba(27,58,92,0.12)] transition-opacity duration-200',
                      isWeeklyDeltaHelpOpen
                        ? 'opacity-100'
                        : 'opacity-0 peer-hover:opacity-100 peer-focus-visible:opacity-100',
                    ].join(' ')}
                  >
                    Compares this week's points to last week's points for the same player.
                  </span>
                </span>
              </th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Progress</th>
              <th className="px-3 py-2 text-right">Pts</th>
              <th className="px-3 py-2 text-right">W‑L</th>
              <th className="px-3 py-2 text-right">Consec Wks</th>
              <th className="px-3 py-2 text-right">Weeks</th>
              <th className="px-3 py-2 text-right">GF</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const streak = getCurrentStreak(row.playerId, matches)
              const { progressPct, pointsToNext } = getTierProgress(
                row.totalPoints,
                row.tier,
                config.tiers
              )
              const weeklyDelta = calculateWeeklyDelta(
                row.playerId,
                config.current_week,
                matches,
                config.multipliers
              )
              const movement = movementByPlayer.get(row.playerId) ?? {
                trend: 'same' as const,
                delta: 0,
                previousRank: null,
              }
              const gfStatus = getGrandFinalsRaceStatus(
                row.weeksPlayed,
                config.grand_finals_min_weeks,
                config.total_weeks,
                config.current_week
              )
              const aroundYou = getAroundYouContext(standings, row.playerId)

              return (
                <React.Fragment key={row.playerId}>
                  <tr className="border-t border-brand-pacific-dusk/8">
                    <td className="px-3 py-2 text-brand-pacific-dusk/70">{row.rank}</td>
                    <td className="px-3 py-2 text-brand-pacific-dusk">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPlayerId(
                            expandedPlayerId === row.playerId ? null : row.playerId
                          )
                        }
                        aria-expanded={expandedPlayerId === row.playerId}
                        aria-controls={`utr-player-details-${row.playerId}`}
                        className="inline-flex items-center gap-2 rounded px-1 py-1 text-left hover:bg-brand-morning-light"
                      >
                        <span className="font-medium">{row.playerName}</span>
                        <span className="text-[11px] text-brand-pacific-dusk/50">
                          {expandedPlayerId === row.playerId ? 'Hide' : 'Details'}
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      {movement.trend === 'new' ? (
                        <span className="inline-flex items-center rounded-full bg-brand-victoria-cove/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-victoria-cove">
                          New
                        </span>
                      ) : movement.trend === 'up' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-tide-pool/15 px-2 py-1 text-[11px] font-semibold text-brand-tide-pool">
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />+{movement.delta}
                        </span>
                      ) : movement.trend === 'down' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-sunset-cliff/15 px-2 py-1 text-[11px] font-semibold text-brand-sunset-cliff">
                          <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />-{movement.delta}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-pacific-dusk/10 px-2 py-1 text-[11px] font-semibold text-brand-pacific-dusk/70">
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />0
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {config.current_week === 1 ? (
                        <span className="text-[11px] text-brand-pacific-dusk/50">—</span>
                      ) : weeklyDelta > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-brand-tide-pool/15 px-2 py-1 text-[11px] font-semibold text-brand-tide-pool">
                          +{weeklyDelta}
                        </span>
                      ) : weeklyDelta < 0 ? (
                        <span className="inline-flex items-center rounded-full bg-brand-sunset-cliff/15 px-2 py-1 text-[11px] font-semibold text-brand-sunset-cliff">
                          {weeklyDelta}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-brand-pacific-dusk/10 px-2 py-1 text-[11px] font-semibold text-brand-pacific-dusk/70">
                          0
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {row.tier ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-morning-light px-2 py-1 text-[11px] font-medium text-brand-pacific-dusk/80">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: row.tier.color }}
                            aria-hidden="true"
                          />
                          {row.tier.name}
                        </span>
                      ) : (
                        <span className="text-brand-pacific-dusk/40 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 min-w-[160px]">
                      <div className="h-2 rounded-full bg-brand-pacific-dusk/10">
                        <div
                          className="h-2 rounded-full bg-brand-victoria-cove"
                          style={{ width: `${progressPct}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-brand-pacific-dusk/60">
                        {pointsToNext == null
                          ? 'Top tier reached'
                          : `${pointsToNext} pts to next tier`}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-right text-[13px] font-extrabold text-brand-pacific-dusk">
                      {row.totalPoints}
                    </td>
                    <td className="px-3 py-2 text-right text-brand-pacific-dusk/80">
                      {row.wins}-{row.losses}
                    </td>
                    <td className="px-3 py-2 text-right text-brand-pacific-dusk/70">
                      <span className="inline-flex items-center gap-1">
                        {streak >= 3 ? (
                          <Flame
                            className="h-3.5 w-3.5 text-brand-sunset-cliff"
                            aria-hidden="true"
                          />
                        ) : null}
                        {streak}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-brand-pacific-dusk/70">
                      {row.weeksPlayed}/{config.total_weeks}
                    </td>
                    <td className="px-3 py-2 text-right text-brand-pacific-dusk/80">
                      {row.gfEligible ? (
                        <span className="inline-flex items-center rounded-full bg-brand-tide-pool/15 px-2 py-1 text-[11px] font-semibold text-brand-tide-pool">
                          Qualified
                        </span>
                      ) : gfStatus.trend === 'on-pace' ? (
                        <span className="inline-flex items-center rounded-full bg-brand-victoria-cove/15 px-2 py-1 text-[11px] font-semibold text-brand-victoria-cove">
                          {gfStatus.label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-brand-sunset-cliff/15 px-2 py-1 text-[11px] font-semibold text-brand-sunset-cliff">
                          {gfStatus.label}
                        </span>
                      )}
                    </td>
                  </tr>
                  {expandedPlayerId === row.playerId ? (
                    <tr
                      id={`utr-player-details-${row.playerId}`}
                      className="border-t border-brand-pacific-dusk/5 bg-brand-morning-light/35"
                    >
                      <td colSpan={11} className="px-3 py-3">
                        <div className="grid gap-2 md:grid-cols-3">
                          <div>
                            <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
                              Weekly breakdown
                            </p>
                            <ul className="space-y-1 text-[12px] text-brand-pacific-dusk/80">
                              {Array.from({ length: config.total_weeks }, (_, i) => i + 1).map(
                                (week) => {
                                  const result = calculateWeeklyPoints(
                                    row.playerId,
                                    week,
                                    matches,
                                    config.multipliers
                                  )
                                  return (
                                    <li key={`wk-${row.playerId}-${week}`}>
                                      Week {week}: {result.total} pts
                                      {result.played
                                        ? ` (match ${result.matchPoints} + attend ${result.attendance} + streak ${result.streak})`
                                        : ' (did not play)'}
                                    </li>
                                  )
                                }
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
                              Match history
                            </p>
                            <ul className="space-y-1 text-[12px] text-brand-pacific-dusk/80">
                              {matches
                                .filter(
                                  (match) =>
                                    match.player1_id === row.playerId ||
                                    match.player2_id === row.playerId ||
                                    match.player3_id === row.playerId ||
                                    match.player4_id === row.playerId
                                )
                                .map((match) => {
                                  const points = calculateWeeklyPoints(
                                    row.playerId,
                                    match.week,
                                    [match],
                                    { [String(match.week)]: 1 }
                                  ).matchPoints
                                  return (
                                    <li key={match.id}>
                                      Week {match.week}: {match.player1_name}
                                      {match.is_doubles && match.player3_name
                                        ? `/${match.player3_name}`
                                        : ''}{' '}
                                      vs {match.player2_name}
                                      {match.is_doubles && match.player4_name
                                        ? `/${match.player4_name}`
                                        : ''}{' '}
                                      — {match.score} ({points} pts)
                                    </li>
                                  )
                                })}
                            </ul>
                          </div>
                          <div>
                            <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
                              Around you
                            </p>
                            <div className="space-y-1 text-[12px] text-brand-pacific-dusk/80">
                              {aroundYou?.above ? (
                                <p className="break-words">
                                  #{aroundYou.above.rank} {aroundYou.above.playerName} ({aroundYou.above.totalPoints} pts)
                                  {' '}· +{aroundYou.above.gap} gap
                                </p>
                              ) : (
                                <p>Top spot in this division.</p>
                              )}
                              <p className="font-semibold text-brand-pacific-dusk break-words">
                                #{aroundYou?.current.rank ?? row.rank} {aroundYou?.current.playerName ?? row.playerName} ({aroundYou?.current.totalPoints ?? row.totalPoints} pts)
                              </p>
                              {aroundYou?.below ? (
                                <p className="break-words">
                                  #{aroundYou.below.rank} {aroundYou.below.playerName} ({aroundYou.below.totalPoints} pts)
                                  {' '}· {aroundYou.below.gap} pts behind you
                                </p>
                              ) : (
                                <p>No player currently below in standings.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              )
            })}
            {standings.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-brand-pacific-dusk/60">
                  No results yet for this division.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

