import type { Metadata } from 'next'
import Link from 'next/link'
import leagues2026 from '@/data/leagues-2026.json'
import pricingData from '@/data/pricing-supplemental.json'
import { LeagueEventSchema } from '@/app/schema'

const usta = pricingData.ustaAdultLeague

export const metadata: Metadata = {
  title: 'USTA Adult League Play | Laguna Beach Tennis Academy',
  description:
    'Join an LBTA team for USTA Spring & Summer 2026 league play. 4 leagues, weekly matches across Orange County, coached practice with Andrew Mateljan.',
}

const leagues = leagues2026.usta.leagues
const ntrpGuide = leagues2026.usta.ntrpGuide

export default function USTAAdultLeaguePage() {
  return (
    <div>
      <LeagueEventSchema
        name="USTA Adult League Play — Spring & Summer 2026"
        description="Join an LBTA team for USTA Spring & Summer 2026 league play. 4 leagues, weekly matches across Orange County, coached practice with Andrew Mateljan."
        startDate="2026-04-17"
        endDate="2026-09-06"
        location="Orange County"
      />
      {/* Hero */}
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-water via-brand-pacific-dusk/80 to-brand-deep-water" />
        <div className="relative container-lbta section-lg">
          <Link
            href="/programs/leagues"
            className="inline-flex items-center gap-2 text-[12px] font-sans font-medium text-brand-victoria-cove/70 tracking-wider uppercase mb-8 hover:text-brand-victoria-cove transition-colors"
          >
            <span>&larr;</span> Leagues & Circuit
          </Link>
          <span className="text-eyebrow text-brand-victoria-cove/80 mb-4 block">
            Spring & Summer 2026 — Orange County
          </span>
          <h1 className="font-serif text-display-xl text-white mb-6 max-w-3xl">
            USTA Adult League Play
          </h1>
          <p className="text-[1.1rem] font-sans font-light text-white/60 max-w-2xl leading-relaxed">
            We&apos;re forming LBTA teams. Weekly matches against OC clubs, plus
            coached practice every week with Andrew.
          </p>
        </div>
      </section>

      <div className="horizon-line" />

      {/* How it works */}
      <section className="container-lbta section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-display text-brand-pacific-dusk mb-4">
            How It Works
          </h2>
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mb-12 leading-relaxed">
            USTA leagues are organized team competition. Players join a team of
            12–14 at their skill level. Each week, the team plays another Orange
            County club. Results are tracked nationally through USTA.
          </p>

          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '01',
                title: 'Lineup',
                desc: 'Andrew sets the weekly lineup and sends it by text. You know your match, partner, and venue a few days ahead.',
              },
              {
                step: '02',
                title: 'Play',
                desc: 'Arrive at the host club, warm up, play singles or doubles — typically 60 to 90 minutes.',
              },
              {
                step: '03',
                title: 'Results',
                desc: 'Win the majority of lines to win the match. Results reported to USTA and tracked nationally.',
              },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-eyebrow text-brand-sunset-cliff mb-3 block">
                  {item.step}
                </span>
                <h3 className="font-serif text-headline-sm text-brand-pacific-dusk mb-2">
                  {item.title}
                </h3>
                <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-brand-sandstone rounded-lg p-8 md:p-10">
            <h3 className="text-eyebrow text-brand-victoria-cove mb-4">
              Every League Includes
            </h3>
            <ul className="grid sm:grid-cols-3 gap-4">
              {[
                'Weekly team matches at your level',
                '2-hour coached practice with Andrew',
                'Scheduling, lineups, and captain coordination',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[15px] font-sans font-light text-brand-pacific-dusk/70"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-victoria-cove flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* League cards */}
      <section className="bg-brand-morning-light">
        <div className="container-lbta section">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-display text-brand-pacific-dusk mb-4">
              Choose Your League
            </h2>
            <p className="text-body text-brand-pacific-dusk/60 mb-12">
              Total season cost: ${usta.totalSeasonCost.toLocaleString()} split across your roster. USTA
              membership (${usta.ustaMembership}/{usta.ustaMembershipPeriod}) required separately.
            </p>

            <div className="grid gap-6">
              {leagues.map((league) => (
                <div
                  key={league.id}
                  className="bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 hover:border-brand-pacific-dusk/10 hover:shadow-soft transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-eyebrow text-brand-sunset-cliff">
                          League {league.id}
                        </span>
                        <span className="text-[12px] font-sans text-brand-pacific-dusk/40">
                          Roster due {league.deadline}
                        </span>
                      </div>
                      <h3 className="font-serif text-headline text-brand-pacific-dusk">
                        {league.name}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-sans font-light text-brand-pacific-dusk/40">
                        {league.weeklyApprox}
                      </p>
                      <p className="text-[15px] font-sans font-medium text-brand-pacific-dusk">
                        {league.pricing12}/player (12) &middot;{' '}
                        {league.pricing14}/player (14)
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-[14px] font-sans font-light text-brand-pacific-dusk/60">
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-1">
                        Season
                      </span>
                      {league.season} ({league.weeks})
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-1">
                        Format
                      </span>
                      {league.format}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-1">
                        NTRP Levels
                      </span>
                      {league.levels}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NTRP Guide */}
      <section className="container-lbta section-sm">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-display-sm text-brand-pacific-dusk mb-8">
            NTRP Quick Guide
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ntrpGuide.map((item) => (
              <div
                key={item.level}
                className="bg-white rounded-lg p-5 border border-brand-pacific-dusk/5"
              >
                <span className="text-[20px] font-serif font-medium text-brand-sunset-cliff block mb-2">
                  {item.level}
                </span>
                <p className="text-[13px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="bg-brand-deep-water text-white">
        <div className="container-lbta section text-center">
          <h2 className="font-serif text-display text-white mb-4">
            Join an LBTA Team
          </h2>
          <p className="text-[1.05rem] font-sans font-light text-white/50 max-w-lg mx-auto mb-4">
            Reply with your league number (1–4) and NTRP level, or just say
            &ldquo;I&apos;m interested.&rdquo;
          </p>
          <p className="text-[14px] font-sans font-light text-white/35 mb-8">
            Free NTRP assessment available — 30 minutes on court with Andrew.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="sms:9492410847"
              className="btn-primary"
            >
              Text (949) 241-0847
            </a>
            <a
              href="mailto:andrew@lagunabeachtennisacademy.com"
              className="btn-secondary border-white/20 text-white hover:border-white/50 hover:bg-white/5"
            >
              Email Andrew
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
