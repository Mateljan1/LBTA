import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LeagueEventSchema } from '@/app/schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import UTRMatchPlayRegister from './UTRMatchPlayRegister'
import {
  getNtrpToUtrReference,
  getUtrDivisionsForPage,
  getUtrSeasonIsoRange,
  getUtrSeasonLabel,
} from '@/lib/utr-match-play'

const seasonLabel = getUtrSeasonLabel()
const { startDate, endDate } = getUtrSeasonIsoRange()

export const metadata: Metadata = {
  title: 'UTR Match Play Series | Laguna Beach Tennis Academy',
  description: `LBTA UTR Match Play Series — Season 1. Eight Saturdays of rated matchplay in Laguna Beach. Five divisions from Color Ball juniors to advanced adults. ${seasonLabel.split('·')[0]?.trim() ?? seasonLabel}.`,
  openGraph: {
    title: 'UTR Match Play Series | Laguna Beach Tennis Academy',
    description: `Rated Saturday matchplay by level in Laguna Beach. ${seasonLabel.split('·')[0]?.trim() ?? seasonLabel}.`,
    type: 'website',
    images: [
      {
        url: '/legacy-working-assets/hero/match-play-hero/match-play-hero.webp',
        width: 1920,
        height: 1080,
        alt: 'UTR match play at LBTA',
      },
    ],
  },
}

const divisions = getUtrDivisionsForPage()
const ntrpToUtr = getNtrpToUtrReference()

export default function UTRMatchPlayPage() {
  return (
    <div>
      <LeagueEventSchema
        name="UTR Match Play Series — Season 1"
        description={`Eight Saturdays of rated matchplay in Laguna Beach. Five divisions from Color Ball juniors to advanced adults. ${seasonLabel}`}
        startDate={startDate}
        endDate={endDate}
        location="Laguna Beach"
      />
      {/* Hero */}
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/legacy-working-assets/hero/match-play-hero/match-play-hero.webp"
            alt="Saturday match play on the courts at Laguna Beach Tennis Academy"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 48%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-brand-deep-water/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <div className="relative container-lbta section-lg z-10">
          <Link
            href="/programs/leagues"
            className="inline-flex items-center gap-2 text-[12px] font-sans font-medium text-brand-victoria-cove/80 tracking-wider uppercase mb-8 hover:text-brand-victoria-cove transition-colors"
          >
            <span>&larr;</span> Leagues &amp; Match Play
          </Link>
          <span className="text-eyebrow text-brand-sunset-cliff/80 mb-4 block">{seasonLabel}</span>
          <h1 className="font-headline text-display-xl text-white mb-6 max-w-3xl">
            Eight Saturdays. Rated matches. Real progress.
          </h1>
          <p className="text-[1.1rem] font-sans font-light text-white/70 max-w-2xl leading-relaxed mb-10">
            Structured matchplay by skill level—not age or gender—with same-day UTR submission, season
            points, and a Grand Finals night on the coast.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <UTRMatchPlayRegister variant="hero" />
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Book a Trial First
            </Link>
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* Who it’s for */}
      <section className="container-lbta section bg-brand-morning-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-headline text-display text-brand-pacific-dusk mb-4 text-center">
            Who it&apos;s for
          </h2>
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mx-auto text-center mb-14 leading-relaxed">
            One series, five divisions. Pick the band that matches your game; we help with placement if
            you are between levels.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: 'Junior pathway',
                body: 'Color Ball through competitive junior bands—development-focused matchplay with clear formats.',
              },
              {
                title: 'Club & improving adults',
                body: 'Intermediate bands where every match counts toward UTR and your confidence on court.',
              },
              {
                title: 'Advanced & doubles',
                body: 'Higher UTR bands and a dedicated doubles round-robin block, including evening play.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white border border-brand-pacific-dusk/8 rounded-lg p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">{card.title}</h3>
                <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saturday Flow */}
      <section className="container-lbta section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Every Saturday</h2>
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mb-12 leading-relaxed">
            Show up, compete, and track your progress. Divisions are by level, not age or gender.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
            {[
              { step: '01', title: 'Check In', desc: 'Arrive and see the draw. Seeded by your rating.' },
              { step: '02', title: 'Play', desc: 'Competitive matches in your division. Best of 3 or pro sets.' },
              {
                step: '03',
                title: 'Results',
                desc: 'Scores submitted to UTR the same day. Rating updates follow Universal Tennis.',
              },
              { step: '04', title: 'Leaderboard', desc: 'Season standings refresh weekly. Track your climb.' },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-eyebrow text-brand-sunset-cliff mb-3 block">{item.step}</span>
                <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">{item.title}</h3>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="bg-brand-sandstone">
        <div className="container-lbta section">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Five divisions</h2>
            <p className="text-body text-brand-pacific-dusk/60 mb-12 max-w-2xl">
              Find your level. Season registration includes the full series; drop-in is available where
              listed for flexibility.
            </p>

            <div className="grid gap-4">
              {divisions.map((d) => (
                <div
                  key={d.name}
                  className="bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:shadow-soft transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-headline text-brand-pacific-dusk mb-1">{d.name}</h3>
                    <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50">{d.level}</p>
                    {d.note ? (
                      <p className="text-[13px] font-sans font-light text-brand-pacific-dusk/45 mt-2">{d.note}</p>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px] font-sans text-brand-pacific-dusk/60 md:text-right">
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Venue</span>
                      <span className="font-light">{d.venue}</span>
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Format</span>
                      <span className="font-light">{d.format}</span>
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Time</span>
                      <span className="font-light">{d.time}</span>
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Season</span>
                      <span className="font-medium text-brand-pacific-dusk">{d.price}</span>
                      {d.dropIn != null ? (
                        <span className="block text-[12px] font-light text-brand-pacific-dusk/50 mt-1">
                          Drop-in ${d.dropIn}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Season Points & Grand Finals */}
      <section className="container-lbta section">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6">Season points</h3>
            <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/55 mb-6 leading-relaxed">
              Two leaderboard tracks: UTR (national, skill-based) and Season Points (local, effort-based —
              points only go up).
            </p>
            <div className="space-y-3">
              {[
                { label: 'Show up and compete', pts: '+10' },
                { label: 'Win a match', pts: '+15' },
                { label: 'Upset (UTR diff ≥ 0.5)', pts: '+25' },
                { label: 'Complete all weekly matches', pts: '+10' },
                { label: '3-week attendance streak', pts: '+20' },
                { label: 'UTR improves from prior week', pts: '+10' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-brand-pacific-dusk/5"
                >
                  <span className="text-[14px] font-sans font-light text-brand-pacific-dusk/60">
                    {item.label}
                  </span>
                  <span className="text-[14px] font-sans font-medium text-brand-sunset-cliff">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6">Grand Finals</h3>
              <p className="text-eyebrow text-brand-sunset-cliff mb-4">June 13, 2026</p>
              <div className="space-y-4 text-[15px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                <p>
                  <strong className="font-medium text-brand-pacific-dusk">4:00 PM</strong> — Division finals
                  across all five divisions.
                </p>
                <p>
                  <strong className="font-medium text-brand-pacific-dusk">6:00 PM</strong> — Food trucks,
                  social hour, Season 2 registration opens.
                </p>
                <p>
                  <strong className="font-medium text-brand-pacific-dusk">7:00 PM</strong> — Awards ceremony,
                  grand raffle.
                </p>
                <p>
                  <strong className="font-medium text-brand-pacific-dusk">8:00 PM</strong> — Exhibition:
                  Season Champion plays doubles with Karu&eacute; Sell (ATP #262, UCLA All-American).
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto sm:mx-0 overflow-hidden rounded-lg border border-brand-pacific-dusk/10 bg-brand-sandstone shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <Image
                  src="/images/programs/karue-sell-exhibition.webp"
                  alt="Karue Sell hitting a forehand — exhibition guest for Grand Finals night"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div>
                <h4 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">Guest athlete</h4>
                <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                  Karu&eacute; Sell joins the evening as a featured exhibition player—bringing tour-level
                  intensity to the Season 1 finale after your division finals and awards.
                </p>
              </div>
            </div>

            <div className="bg-brand-sandstone rounded-lg p-6">
              <h4 className="text-eyebrow text-brand-victoria-cove mb-3">Season tiers</h4>
              <div className="space-y-2">
                {[
                  { tier: 'Legend', req: 'Grand Finals Top 3' },
                  { tier: 'Champion', req: '450+ points' },
                  { tier: 'Advanced', req: '250–449 points' },
                  { tier: 'Contender', req: '100–249 points' },
                  { tier: 'Challenger', req: '0–99 points' },
                ].map((t) => (
                  <div key={t.tier} className="flex items-center justify-between text-[13px] font-sans">
                    <span className="font-medium text-brand-pacific-dusk">{t.tier}</span>
                    <span className="font-light text-brand-pacific-dusk/50">{t.req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NTRP → UTR Reference */}
      <section className="bg-white border-y border-brand-pacific-dusk/5">
        <div className="container-lbta section-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6 text-center">
              NTRP to UTR reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] font-sans">
                <thead>
                  <tr className="border-b border-brand-pacific-dusk/10">
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      NTRP
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      UTR (men)
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      UTR (women)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ntrpToUtr.map((row) => (
                    <tr key={row.ntrp} className="border-b border-brand-pacific-dusk/5">
                      <td className="py-3 px-4 font-medium text-brand-pacific-dusk">{row.ntrp}</td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/60">{row.men}</td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/60">{row.women}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="container-lbta section-sm">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-8 text-center">Venues</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: 'Laguna Beach High School',
                address: '605 Park Ave, Laguna Beach',
                courts: '6 courts (4 lit)',
                divisions: 'UTR 3.0–5.0, UTR 5.0–7.0, Doubles',
              },
              {
                name: 'Alta Laguna Park',
                address: 'Alta Laguna Blvd, Laguna Beach',
                courts: '4 courts',
                divisions: 'Color Ball, UTR 2.0–4.0',
              },
            ].map((v) => (
              <div key={v.name} className="bg-brand-sandstone rounded-lg p-6">
                <h4 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">{v.name}</h4>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-1">{v.address}</p>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-3">{v.courts}</p>
                <p className="text-[12px] font-sans font-medium text-brand-victoria-cove tracking-wide">
                  {v.divisions}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-morning-light border-t border-brand-pacific-dusk/5">
        <div className="container-lbta section-sm">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-8 text-center">
              Common questions
            </h3>
            <dl className="space-y-6">
              {[
                {
                  q: 'Do I need a UTR account?',
                  a: 'Yes. We submit results to Universal Tennis; you will need an active profile for rated play.',
                },
                {
                  q: 'What if I am between two divisions?',
                  a: 'Register for your preferred band and note it in your form—we confirm placement before the first Saturday.',
                },
                {
                  q: 'Can I try one session before committing?',
                  a: 'Drop-in pricing is listed by division where available, subject to space.',
                },
              ].map((item) => (
                <div key={item.q}>
                  <dt className="font-headline text-[18px] text-brand-pacific-dusk mb-2">{item.q}</dt>
                  <dd className="text-[15px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="bg-brand-deep-water text-white">
        <div className="container-lbta section text-center">
          <h2 className="font-headline text-display text-white mb-4">Register for Season 1</h2>
          <p className="text-[1.05rem] font-sans font-light text-white/60 max-w-lg mx-auto mb-8">
            Eight Saturdays of competitive, rated matchplay. Choose your division and secure your spot.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <UTRMatchPlayRegister variant="footer" />
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Book a Trial First
            </Link>
          </div>
          <p className="text-[13px] font-sans font-light text-white/55 mb-4">
            <a
              href="mailto:info@lagunabeachtennisacademy.com?subject=UTR%20Match%20Play%20Series%20—%20Question"
              className="text-brand-victoria-cove/90 underline underline-offset-4 hover:text-white transition-colors"
            >
              Email us
            </a>{' '}
            with questions before you register.
          </p>
          <p className="text-[13px] font-sans font-light text-white/50">
            Presented by Laguna Beach Tennis Academy &amp; Fit4Tennis
          </p>
        </div>
      </section>
    </div>
  )
}
