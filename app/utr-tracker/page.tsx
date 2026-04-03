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
    <div className="bg-brand-morning-light text-brand-pacific-dusk">
      <main className="container-lbta section-sm">
        <header className="mb-10 text-center md:text-left">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">Season tracker</p>
          <h1 className="font-headline text-display text-brand-pacific-dusk mb-3">UTR Match Play Series — Live Tracker</h1>
          <p className="text-body text-brand-pacific-dusk/75 max-w-2xl">
            Season points, tiers, and Color Ball passports for LBTA&apos;s UTR Match Play Series. Standings update as match
            results and attendance are entered by coaches.
          </p>
        </header>

        <section className="mb-12 grid gap-4 rounded-2xl border border-brand-pacific-dusk/10 bg-white p-5 md:grid-cols-3">
          <div>
            <h2 className="font-headline text-headline-sm mb-2">How points work</h2>
            <p className="text-body-sm text-brand-pacific-dusk/75">
              Weekly totals include match points, attendance points, streak bonus,
              and any week multiplier from season config.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-headline-sm mb-2">Grand Finals</h2>
            <p className="text-body-sm text-brand-pacific-dusk/75">
              GF eligibility is based on minimum weeks played. Track the GF column
              in each leaderboard to see current qualification status.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-headline-sm mb-2">Need schedule or registration?</h2>
            <p className="text-body-sm text-brand-pacific-dusk/75">
              For program details and current schedule, use the official pages:
              {' '}
              <Link className="underline decoration-brand-victoria-cove underline-offset-4" href="/programs/utr-match-play">UTR Match Play</Link>
              {' '}and{' '}
              <Link className="underline decoration-brand-victoria-cove underline-offset-4" href="/schedules">Schedules</Link>.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <UtrLeaderboard
            config={config}
            satSingles={{ standings: satSinglesStandings, matches: satSinglesMatches }}
            sunSingles={{ standings: sunSinglesStandings, matches: sunSinglesMatches }}
            sunDoubles={{ standings: sunDoublesStandings, matches: sunDoublesMatches }}
          />
        </section>

        <section>
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

