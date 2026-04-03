'use client'

import type { ColorBallAttendance, ColorBallBadge, Player } from '@/lib/utr-tracker-types'

interface Props {
  players: Player[]
  attendance: ColorBallAttendance[]
  badges: ColorBallBadge[]
  autoBadgesByPlayer: Map<string, string[]>
}

export default function ColorBallPassportGrid({
  players,
  attendance,
  badges,
  autoBadgesByPlayer,
}: Props) {
  const playerIds = Array.from(
    new Set([
      ...players.filter((player) => player.is_color_ball).map((player) => player.id),
      ...attendance.map((a) => a.player_id),
    ])
  ).sort()
  const playersById = new Map(players.map((player) => [player.id, player]))

  return (
    <section aria-labelledby="color-ball-passport-heading" className="mt-12">
      <div className="mb-6 text-center md:text-left">
        <p className="text-eyebrow text-brand-victoria-cove mb-2">Color Ball</p>
        <h2 id="color-ball-passport-heading" className="font-headline text-headline text-brand-pacific-dusk">
          Color Ball passports
        </h2>
        <p className="mt-2 text-[14px] font-sans font-light text-brand-pacific-dusk/75 max-w-2xl">
          Badge collection for red, orange, and green ball players. This grid is not a ranked leaderboard — it&apos;s a
          visual passport of attendance and coach recognition.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {playerIds.map((playerId) => {
          const playerAttendance = attendance.filter((a) => a.player_id === playerId)
          const playerBadges = badges.filter((b) => b.player_id === playerId)
          const autoBadges = autoBadgesByPlayer.get(playerId) ?? []
          const totalBadges = autoBadges.length + playerBadges.length

          return (
            <article
              key={playerId}
              className="rounded-2xl border border-brand-pacific-dusk/10 bg-white p-4 shadow-[0_8px_24px_rgba(27,58,92,0.05)]"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 className="font-headline text-[18px] text-brand-pacific-dusk">
                  {playersById.get(playerId)?.name ?? 'Player'}
                </h3>
                <span className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-brand-pacific-dusk/60">
                  {totalBadges} badges
                </span>
              </div>
              <p className="mb-2 text-[12px] font-sans text-brand-pacific-dusk/65">
                Stage: {playersById.get(playerId)?.color_ball_stage ?? 'n/a'}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[32px]">
                {autoBadges.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center justify-center rounded-full bg-brand-morning-light px-2 py-1 text-[11px] font-medium text-brand-pacific-dusk/80"
                  >
                    {id}
                  </span>
                ))}
                {playerBadges.map((b) => (
                  <span
                    key={b.badge_id}
                    className="inline-flex items-center justify-center rounded-full bg-brand-sandstone px-2 py-1 text-[11px] font-medium text-brand-pacific-dusk/80"
                  >
                    {b.badge_id}
                  </span>
                ))}
                {totalBadges === 0 && (
                  <span className="text-[12px] font-sans font-light text-brand-pacific-dusk/50">
                    Badges will appear here as the season runs.
                  </span>
                )}
              </div>
              <p className="text-[12px] font-sans font-light text-brand-pacific-dusk/60">
                Weeks attended: {playerAttendance.length}
              </p>
            </article>
          )
        })}
        {playerIds.length === 0 && (
          <p className="text-center text-brand-pacific-dusk/60 col-span-full">
            No Color Ball attendance recorded yet.
          </p>
        )}
      </div>
    </section>
  )
}

