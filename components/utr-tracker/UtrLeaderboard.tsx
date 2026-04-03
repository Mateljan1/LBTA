'use client'

import React from 'react'
import type { Match, SeasonConfig } from '@/lib/utr-tracker-types'
import { calculateWeeklyPoints, getUpsetOfWeek } from '@/lib/utr-tracker-points'

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

export default function UtrLeaderboard({ config, satSingles, sunSingles, sunDoubles }: Props) {
  const [activeDivision, setActiveDivision] = React.useState<DivisionKey>('satSingles')
  const [expandedPlayerId, setExpandedPlayerId] = React.useState<string | null>(null)

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

  return (
    <section aria-labelledby="utr-leaderboard-heading">
      <div className="mb-6 text-center md:text-left">
        <p className="text-eyebrow text-brand-victoria-cove mb-2">Leaderboard</p>
        <h2 id="utr-leaderboard-heading" className="font-headline text-headline text-brand-pacific-dusk">
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

      {upset ? (
        <div className="mb-4 rounded-xl border border-brand-thousand-steps/30 bg-brand-sandstone/60 p-3">
          <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
            Upset of the Week
          </p>
          <p className="font-sans text-sm text-brand-pacific-dusk">
            <span className="font-semibold">{upset.name}</span> beat{' '}
            <span className="font-semibold">{upset.loserName}</span> ({upset.diff.toFixed(2)} UTR gap) — {upset.score}
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-brand-pacific-dusk/10 bg-white shadow-[0_8px_24px_rgba(27,58,92,0.06)]">
        <table className="min-w-full text-left text-[13px] font-sans">
          <thead className="bg-brand-sandstone/70 text-brand-pacific-dusk/70">
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2 text-right">Pts</th>
              <th className="px-3 py-2 text-right">W‑L</th>
              <th className="px-3 py-2 text-right">Consec Wks</th>
              <th className="px-3 py-2 text-right">Weeks</th>
              <th className="px-3 py-2 text-right">GF</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
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
                      className="inline-flex items-center gap-2 rounded px-1 py-1 text-left hover:bg-brand-morning-light"
                    >
                      <span className="font-medium">{row.playerName}</span>
                      <span className="text-[11px] text-brand-pacific-dusk/50">
                        {expandedPlayerId === row.playerId ? 'Hide' : 'Details'}
                      </span>
                    </button>
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
                  <td className="px-3 py-2 text-right text-[13px] font-extrabold text-brand-pacific-dusk">
                    {row.totalPoints}
                  </td>
                  <td className="px-3 py-2 text-right text-brand-pacific-dusk/80">
                    {row.wins}-{row.losses}
                  </td>
                  <td className="px-3 py-2 text-right text-brand-pacific-dusk/70">
                    {getCurrentStreak(row.playerId, matches)}
                  </td>
                  <td className="px-3 py-2 text-right text-brand-pacific-dusk/70">
                    {row.weeksPlayed}/{config.total_weeks}
                  </td>
                  <td className="px-3 py-2 text-right text-brand-pacific-dusk/80">
                    {row.gfEligible ? '✓' : ''}
                  </td>
                </tr>
                {expandedPlayerId === row.playerId ? (
                  <tr className="border-t border-brand-pacific-dusk/5 bg-brand-morning-light/35">
                    <td colSpan={8} className="px-3 py-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="font-sans text-xs uppercase tracking-[0.16em] text-brand-pacific-dusk/70 mb-1">
                            Weekly breakdown
                          </p>
                          <ul className="space-y-1 text-[12px] text-brand-pacific-dusk/80">
                            {Array.from({ length: config.total_weeks }, (_, i) => i + 1).map((week) => {
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
                            })}
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
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
            {standings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-brand-pacific-dusk/60">
                  No results yet for this division.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

