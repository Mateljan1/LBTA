import type { Metadata } from 'next'
import Link from 'next/link'
import pricingSupplemental from '@/data/pricing-supplemental.json'
import HorizonDivider from '@/components/ui/HorizonDivider'

const leaguePricing = pricingSupplemental.leagues

export const metadata: Metadata = {
  title: 'Leagues & Circuit | Laguna Beach Tennis Academy',
  description:
    'Compete in USTA Adult League Play or the UTR Match Play Series. Weekly matches, coached practice, and a pathway to meaningful competition.',
}

const leagues = [
  {
    name: 'USTA Adult League Play',
    href: '/programs/usta-adult-league',
    season: 'Spring & Summer 2026',
    desc: 'Organized team competition across Orange County. Weekly matches against OC clubs, plus coached practice every week with Andrew.',
    highlights: ['4 leagues by format and age', 'NTRP levels 2.5–5.0+', `From ${leaguePricing.perWeekApprox}/week per player`],
    color: 'from-brand-pacific-dusk to-brand-deep-water',
    accent: 'text-brand-victoria-cove',
  },
  {
    name: 'UTR Match Play Series',
    href: '/programs/utr-match-play',
    season: 'Season 1 — April–June 2026',
    desc: 'Structured, rated matchplay every Saturday in Laguna Beach. Five divisions from Color Ball juniors to advanced adults. UTR-rated results.',
    highlights: ['8 Saturdays, 5 divisions', 'Juniors and adults by level', `From ${leaguePricing.perSeason}/season`],
    color: 'from-brand-sunset-cliff to-brand-thousand-steps',
    accent: 'text-brand-sunset-cliff',
  },
]

export default function LeaguesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-water via-brand-pacific-dusk/80 to-brand-deep-water" />
        <div className="relative container-lbta section-lg text-center">
          <span className="text-eyebrow text-brand-victoria-cove/80 mb-6 block">
            Competitive Play
          </span>
          <h1 className="font-headline text-display-xl text-white mb-6 max-w-3xl mx-auto">
            Leagues & Circuit
          </h1>
          <p className="text-[1.1rem] font-sans font-light text-white/60 max-w-xl mx-auto leading-relaxed">
            From organized USTA team play to weekly UTR-rated matchplay — find
            your level of competition in Laguna Beach.
          </p>
        </div>
      </section>

      <HorizonDivider />

      {/* Two cards */}
      <section className="container-lbta section">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {leagues.map((league) => (
            <Link
              key={league.name}
              href={league.href}
              className="group flex flex-col rounded-lg overflow-hidden border border-brand-pacific-dusk/5 hover:border-brand-pacific-dusk/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated bg-white"
            >
              {/* Color header */}
              <div className={`h-3 bg-gradient-to-r ${league.color}`} />

              <div className="flex flex-col flex-1 p-8 md:p-10">
                <span className={`text-eyebrow ${league.accent} mb-3`}>
                  {league.season}
                </span>
                <h2 className="font-headline text-headline text-brand-pacific-dusk mb-4 group-hover:text-brand-sunset-cliff transition-colors">
                  {league.name}
                </h2>
                <p className="text-body text-brand-pacific-dusk/60 mb-6 leading-relaxed flex-1">
                  {league.desc}
                </p>

                <ul className="space-y-2 mb-8">
                  {league.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-[14px] font-sans font-light text-brand-pacific-dusk/70"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-victoria-cove/40 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center gap-2 text-[13px] font-sans font-semibold tracking-wider uppercase text-brand-sunset-cliff group-hover:gap-3 transition-all">
                  Learn More & Sign Up
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-sandstone">
        <div className="container-lbta section-sm text-center">
          <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-4">
            Not sure which league is right for you?
          </h3>
          <p className="text-body text-brand-pacific-dusk/60 max-w-lg mx-auto mb-8">
            Text or call Andrew for a free NTRP assessment — 30 minutes on
            court to find your level.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:9492410847" className="btn-primary">
              Call (949) 241-0847
            </a>
            <Link href="/book" className="btn-secondary">
              Book a Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
