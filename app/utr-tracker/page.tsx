import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getSeasonConfig,
  getDivisionMatches,
  getPlayersForDivision,
  getAllColorBallAttendance,
  getAllColorBallBadges,
} from '@/lib/utr-tracker-supabase'
import { calculateStandings } from '@/lib/utr-tracker-points'
import { calculateAutoBadges } from '@/lib/utr-tracker-color-ball'
import UtrLeaderboard from '@/components/utr-tracker/UtrLeaderboard'
import ColorBallPassportGrid from '@/components/utr-tracker/ColorBallPassportGrid'

export const metadata: Metadata = {
  title: 'UTR Match Play Tracker',
  description:
    'Live standings and Color Ball passports for the LBTA UTR Match Play Series — points, tiers, and badges updated as match results are entered.',
}

export default async function UtrTrackerPage() {
  const [config, satSinglesMatches, sunSinglesMatches, sunDoublesMatches, satSinglesPlayers, sunSinglesPlayers, sunDoublesPlayers, colorBallPlayers, attendance, badges] =
    await Promise.all([
      getSeasonConfig(),
      getDivisionMatches('sat_utr_singles'),
      getDivisionMatches('sun_singles'),
      getDivisionMatches('sun_doubles'),
      getPlayersForDivision('sat_utr_singles'),
      getPlayersForDivision('sun_singles'),
      getPlayersForDivision('sun_doubles'),
      getPlayersForDivision('sat_color_ball'),
      getAllColorBallAttendance(),
      getAllColorBallBadges(),
    ])

  if (!config) {
    return (
      <div className="container-lbta section text-center">
        <h1 className="font-headline text-display text-brand-pacific-dusk mb-4">UTR Match Play Tracker</h1>
        <p className="text-body text-brand-pacific-dusk/70">Tracker is not configured yet. Season settings are missing.</p>
      </div>
    )
  }

  const satSinglesStandings = calculateStandings('sat_utr_singles', satSinglesMatches, satSinglesPlayers, config)
  const sunSinglesStandings = calculateStandings('sun_singles', sunSinglesMatches, sunSinglesPlayers, config)
  const sunDoublesStandings = calculateStandings('sun_doubles', sunDoublesMatches, sunDoublesPlayers, config)

  const colorBallAutoBadgesByPlayer = new Map<string, string[]>()
  for (const row of attendance) {
    if (!colorBallAutoBadgesByPlayer.has(row.player_id)) {
      colorBallAutoBadgesByPlayer.set(
        row.player_id,
        calculateAutoBadges(
          row.player_id,
          attendance.filter((a) => a.player_id === row.player_id),
        ),
      )
    }
  }

  return (
    <div className="utr-cinematic-shell">
      <main className="utr-cinematic-main container-lbta section-sm">
        <header className="utr-cinematic-hero mb-10 p-6 md:p-8">
          <p className="text-eyebrow text-brand-thousand-steps mb-2">Season tracker</p>
          <h1 className="font-headline text-display text-white mb-3">UTR Match Play Series — Live Tracker</h1>
          <p className="text-body text-white/75 max-w-3xl">
            Season points, tiers, and Color Ball passports for LBTA&apos;s UTR Match Play Series. Standings update as match
            results and attendance are entered by coaches.
          </p>
        </header>

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          <article className="utr-cinematic-card p-4">
            <h2 className="font-headline text-headline-sm text-white mb-2">
              <span className="utr-cinematic-step">1</span>
              How points work
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70">
              Weekly totals include match points, attendance points, streak bonus, and any week multiplier from season
              config.
            </p>
          </article>
          <article className="utr-cinematic-card p-4">
            <h2 className="font-headline text-headline-sm text-white mb-2">
              <span className="utr-cinematic-step">2</span>
              Grand Finals
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70">
              GF eligibility is based on minimum weeks played. Track the GF column in each leaderboard to see current
              qualification status.
            </p>
          </article>
          <article className="utr-cinematic-card p-4">
            <h2 className="font-headline text-headline-sm text-white mb-2">
              <span className="utr-cinematic-step">3</span>
              Need schedule or registration?
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70">
              For program details and current schedule, use the official pages:{' '}
              <Link className="underline decoration-brand-thousand-steps underline-offset-4 text-white" href="/programs/utr-match-play">
                UTR Match Play
              </Link>{' '}
              and{' '}
              <Link className="underline decoration-brand-thousand-steps underline-offset-4 text-white" href="/schedules">
                Schedules
              </Link>.
            </p>
          </article>
        </section>

        <section className="utr-cinematic-panel mb-14 p-5 md:p-6">
          <UtrLeaderboard
            config={config}
            satSingles={{ standings: satSinglesStandings, matches: satSinglesMatches }}
            sunSingles={{ standings: sunSinglesStandings, matches: sunSinglesMatches }}
            sunDoubles={{ standings: sunDoublesStandings, matches: sunDoublesMatches }}
          />
        </section>

        <section className="utr-cinematic-panel p-5 md:p-6">
          <ColorBallPassportGrid
            players={colorBallPlayers}
            attendance={attendance}
            badges={badges}
            autoBadgesByPlayer={colorBallAutoBadgesByPlayer}
          />
        </section>
      </main>
    </div>
  )
}

