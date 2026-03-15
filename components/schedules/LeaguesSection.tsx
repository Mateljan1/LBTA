'use client'

import LeagueRow from './LeagueRow'
import type { LeaguesData } from './SchedulesPageClient'

function handleInquiry() {
  window.location.href = '/contact'
}

interface LeaguesSectionProps {
  leagues: LeaguesData
}

export default function LeaguesSection({ leagues }: LeaguesSectionProps) {
  const { usta, utr } = leagues

  return (
    <section id="leagues" className="scroll-mt-28 bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <h2 className="sr-only">Leagues & Competitive Play</h2>

        {/* USTA Leagues */}
        <div id="usta-leagues" className="mb-16 md:mb-20">
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
            USTA LEAGUE TENNIS
          </p>
          <h3 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
            Join an LBTA Team
          </h3>
          <div className="section-horizon mb-8 opacity-90" aria-hidden="true" />
          <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/60 max-w-[700px] mb-10">
            Weekly team matches against Orange County clubs, plus a 2-hour coached
            practice session with Andrew Mateljan every week. Season cost of ${leagues.usta.totalSeasonCost.toLocaleString()} split across the roster.
          </p>

          <div className="bg-white border border-black/[0.06] rounded-lg overflow-hidden">
            {usta.leagues.map((league, i) => (
              <LeagueRow
                key={league.id}
                name={league.name}
                season={league.season}
                weeks={league.weeks}
                format={league.format}
                levels={league.levels}
                price={league.pricing12}
                weeklyApprox={league.weeklyApprox}
                deadline={league.deadline}
                onAction={handleInquiry}
                actionLabel="Inquire"
              />
            ))}
          </div>

          <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mt-4">
            {`USTA membership ($${leagues.usta.ustaMembershipAnnual}/year) required separately.`}
          </p>
        </div>

        {/* UTR Circuit */}
        <div id="utr-circuit">
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
            UTR CIRCUIT · SEASON 1
          </p>
          <h3 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
            Saturday Matchplay Series
          </h3>
          <div className="section-horizon mb-8 opacity-90" aria-hidden="true" />
          <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/60 max-w-[700px] mb-3">
            8 Saturdays of UTR-rated competitive play. Every match
            counts toward your Universal Tennis Rating. Five divisions from Color Ball
            juniors through advanced adults.
          </p>
          {utr.seasonLabel && (
            <p className="font-sans text-[14px] font-medium text-brand-pacific-dusk/70 mb-10">
              {utr.seasonLabel}
            </p>
          )}

          <div className="bg-white border border-black/[0.06] rounded-lg overflow-hidden">
            {utr.divisions.map((div, i) => (
              <LeagueRow
                key={div.name}
                name={div.name}
                format={div.format}
                levels={div.level}
                price={div.price}
                time={div.time}
                venue={div.venue}
                onAction={handleInquiry}
                actionLabel="Register"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
