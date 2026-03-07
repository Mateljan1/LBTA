import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Adult Programs | Laguna Beach Tennis Academy',
  description:
    'Adult tennis progression at LBTA: beginner to advanced. Group classes, private coaching, USTA League, UTR Match Play, and connection to schedule and booking.',
}

const progression = [
  {
    stage: 'Beginner',
    ntrp: 'NTRP 1.0–2.5',
    description: 'New to tennis or returning after a long break. Build fundamentals, rally consistency, and basic match play.',
    href: '/schedules',
    cta: 'View beginner programs',
  },
  {
    stage: 'Intermediate',
    ntrp: 'NTRP 3.0–3.5',
    description: 'Consistent rally and developing serve. Strategy sessions, doubles tactics, and league preparation.',
    href: '/schedules',
    cta: 'View intermediate programs',
  },
  {
    stage: 'Advanced',
    ntrp: 'NTRP 4.0+',
    description: 'Competitive and tournament play. Advanced tactics, match analysis, and high-level coaching.',
    href: '/schedules',
    cta: 'View advanced programs',
  },
]

export default function AdultProgramsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-water via-brand-pacific-dusk/80 to-brand-deep-water" />
        <div className="relative container-lbta section-lg">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-[12px] font-sans font-medium text-brand-victoria-cove/70 tracking-wider uppercase mb-8 hover:text-brand-victoria-cove transition-colors"
          >
            <span>&larr;</span> Programs
          </Link>
          <span className="text-eyebrow text-brand-victoria-cove/80 mb-4 block">
            Beginner – Advanced
          </span>
          <h1 className="font-serif text-display-xl text-white mb-6 max-w-3xl">
            Adult Programs
          </h1>
          <p className="text-[1.1rem] font-sans font-light text-white/60 max-w-2xl leading-relaxed">
            Progression with purpose. From fundamentals to competitive match-play at every level — and a path into leagues and UTR.
          </p>
        </div>
      </section>

      <div className="horizon-line" />

      {/* Progression */}
      <section className="container-lbta section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-display text-brand-pacific-dusk mb-4">
            Your Path
          </h2>
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mb-12 leading-relaxed">
            We group adults by level so every session is appropriate. Start where you are; move up as your game grows.
          </p>

          <div className="grid gap-8">
            {progression.map((item) => (
              <div
                key={item.stage}
                className="bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 hover:border-brand-pacific-dusk/10 hover:shadow-soft transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <span className="text-eyebrow text-brand-sunset-cliff mb-2 block">
                      {item.ntrp}
                    </span>
                    <h3 className="font-serif text-headline text-brand-pacific-dusk mb-2">
                      {item.stage}
                    </h3>
                    <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="font-sans text-ui font-medium text-brand-sunset-cliff hover:text-brand-sunset-cliff/80 transition-colors shrink-0"
                  >
                    {item.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="horizon-line" />

      {/* Leagues & UTR */}
      <section className="bg-brand-morning-light">
        <div className="container-lbta section">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-display text-brand-pacific-dusk mb-4">
              Leagues & Circuit
            </h2>
            <p className="text-body text-brand-pacific-dusk/60 mb-8 leading-relaxed">
              Ready for competition? LBTA runs USTA Adult League teams and the UTR Match Play Series. Both connect you to rated play and a clear path forward.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <Link
                href="/programs/usta-adult-league"
                className="group block bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 hover:border-brand-pacific-dusk/10 hover:shadow-soft transition-all"
              >
                <span className="text-eyebrow text-brand-victoria-cove mb-3 block">
                  USTA
                </span>
                <h3 className="font-serif text-headline text-brand-pacific-dusk mb-2 group-hover:text-brand-deep-water transition-colors">
                  Adult League Play
                </h3>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 mb-4 leading-relaxed">
                  Team competition. Weekly matches across Orange County, plus coached practice with Andrew.
                </p>
                <span className="font-sans text-ui font-medium text-brand-sunset-cliff group-hover:text-brand-sunset-cliff/80 transition-colors">
                  Learn more →
                </span>
              </Link>

              <Link
                href="/programs/utr-match-play"
                className="group block bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 hover:border-brand-pacific-dusk/10 hover:shadow-soft transition-all"
              >
                <span className="text-eyebrow text-brand-sunset-cliff mb-3 block">
                  UTR
                </span>
                <h3 className="font-serif text-headline text-brand-pacific-dusk mb-2 group-hover:text-brand-deep-water transition-colors">
                  Match Play Series
                </h3>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 mb-4 leading-relaxed">
                  12 Saturdays of rated matchplay. Five divisions from Color Ball to advanced adults. Every result to UTR.
                </p>
                <span className="font-sans text-ui font-medium text-brand-sunset-cliff group-hover:text-brand-sunset-cliff/80 transition-colors">
                  Learn more →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule & Book CTA */}
      <section className="bg-brand-deep-water text-white">
        <div className="container-lbta section text-center">
          <h2 className="font-serif text-display text-white mb-4">
            Schedule & Trial
          </h2>
          <p className="text-[1.05rem] font-sans font-light text-white/50 max-w-lg mx-auto mb-8">
            View full schedule and pricing for all programs, or book a 30-minute trial to find your level and meet the team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/schedules" className="btn-primary">
              View Schedules
            </Link>
            <Link href="/book" className="btn-secondary border-white/20 text-white hover:border-white/50 hover:bg-white/5">
              Book a Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
