import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LeagueEventSchema } from '@/app/schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import UTRMatchPlayRegister from './UTRMatchPlayRegister'
import UTRMatchPlayDivisions from './UTRMatchPlayDivisions'
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

const heroStats = [
  { label: 'Saturdays', value: '8' },
  { label: 'Divisions', value: '5' },
  { label: 'Rated play', value: 'UTR' },
]

export default function UTRMatchPlayPage() {
  return (
    <div className="overflow-x-hidden">
      <LeagueEventSchema
        name="UTR Match Play Series — Season 1"
        description={`Eight Saturdays of rated matchplay in Laguna Beach. Five divisions from Color Ball juniors to advanced adults. ${seasonLabel}`}
        startDate={startDate}
        endDate={endDate}
        location="Laguna Beach"
      />

      {/* Hero — full viewport, layered scrim, stats strip */}
      <section className="relative bg-brand-deep-water text-white min-h-[min(100vh,920px)] flex flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/legacy-working-assets/hero/match-play-hero/match-play-hero.webp"
            alt="Saturday match play on the courts at Laguna Beach Tennis Academy"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 42%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-water/90 via-brand-deep-water/75 to-brand-deep-water/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_70%_25%,rgba(46,139,139,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 container-lbta pt-28 pb-12 md:pt-32 md:pb-16 lg:pb-20">
          <Link
            href="/programs/leagues"
            className="inline-flex items-center gap-2 text-[12px] font-sans font-medium text-brand-victoria-cove/85 tracking-wider uppercase mb-8 hover:text-brand-victoria-cove transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Leagues &amp; Match Play
          </Link>

          <div className="max-w-4xl">
            <p className="text-eyebrow text-brand-sunset-cliff/90 mb-3 tracking-[0.2em]">{seasonLabel}</p>
            <div className="section-horizon mb-8 max-w-[140px]" aria-hidden="true" />
            <h1 className="font-headline text-display-xl text-white mb-6 max-w-[18ch] leading-[1.05]">
              Eight Saturdays. Rated matches. Real progress.
            </h1>
            <p className="text-[1.125rem] md:text-[1.2rem] font-sans font-light text-white/75 max-w-2xl leading-relaxed mb-10">
              Structured matchplay by skill level—not age or gender—with same-day UTR submission, season
              points, and a Grand Finals night on the coast.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 md:gap-6 mb-12">
            <UTRMatchPlayRegister variant="hero" />
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/30 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Book a Trial First
            </Link>
            <a
              href="#utr-and-color-ball"
              className="inline-flex items-center justify-center min-h-[48px] px-2 text-sm font-sans font-medium text-brand-victoria-cove/90 underline underline-offset-4 decoration-brand-victoria-cove/40 hover:text-white hover:decoration-white/90 transition-colors"
            >
              How UTR &amp; Color Ball work
            </a>
            <a
              href="#divisions"
              className="inline-flex items-center justify-center min-h-[48px] px-2 text-sm font-sans font-medium text-white/70 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/80 transition-colors sm:ml-1"
            >
              Divisions &amp; pricing
            </a>
          </div>

          <div
            className="flex flex-wrap gap-8 md:gap-14 pt-8 border-t border-white/15"
            aria-label="Series highlights"
          >
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-headline text-[clamp(2rem,5vw,3rem)] text-white leading-none tracking-tight">
                  {s.value}
                </span>
                <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-white/50">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season strip — high visibility */}
      <div className="relative bg-brand-sandstone border-y border-brand-pacific-dusk/8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-victoria-cove/35 to-transparent" aria-hidden="true" />
        <div className="container-lbta py-5 md:py-6">
          <p className="text-center text-[13px] md:text-sm font-sans font-medium tracking-[0.12em] uppercase text-brand-pacific-dusk/80">
            <span className="text-brand-sunset-cliff">Season 1</span>
            <span className="mx-3 text-brand-pacific-dusk/25" aria-hidden="true">
              |
            </span>
            {seasonLabel.split('·')[0]?.trim()}
            <span className="mx-3 text-brand-pacific-dusk/25" aria-hidden="true">
              |
            </span>
            Grand Finals June 13
          </p>
        </div>
      </div>

      <HorizonDivider animate />

      {/* UTR Sports + Color Ball — parent-friendly context */}
      <section
        id="utr-and-color-ball"
        className="container-lbta section-sm bg-white border-b border-brand-pacific-dusk/5 scroll-mt-28"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-display-sm md:text-[clamp(1.75rem,4vw,2.25rem)] text-brand-pacific-dusk mb-4 text-center md:text-left">
            What UTR is—and how Color Ball fits
          </h2>
          <div className="section-horizon mx-auto md:mx-0 mb-8" aria-hidden="true" />
          <div className="space-y-5 text-[15px] md:text-[16px] font-sans font-light text-brand-pacific-dusk/65 leading-relaxed">
            <p>
              <strong className="font-medium text-brand-pacific-dusk">UTR Sports (Universal Tennis)</strong>{' '}
              is the platform where match results are recorded and turned into ratings. For yellow-ball
              singles and doubles, your profile shows a{' '}
              <strong className="font-medium text-brand-pacific-dusk">numeric UTR Rating</strong> that
              updates as you compete.
            </p>
            <p>
              <strong className="font-medium text-brand-pacific-dusk">Color Ball players</strong>—red,
              orange, and green ball—use a separate system called{' '}
              <strong className="font-medium text-brand-pacific-dusk">Color Ball Rating (CBR)</strong>: stage
              levels (for example R1–R2, O1–O2, G1–G3) that match scaled courts and equipment. CBR is built
              for development; it is not the same display as an adult numeric UTR, and that is by design.
            </p>
            <p>
              Scaled tennis is serious, structured play. Our{' '}
              <strong className="font-medium text-brand-pacific-dusk">Color Ball division</strong> sits in
              the same Saturday series: real matchplay, same-day score submission to UTR Sports, and a clear
              place for juniors who are not on full yellow ball yet.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 pt-8 border-t border-brand-pacific-dusk/10">
            {[
              {
                label: 'Red ball',
                desc: 'Smaller space, softer ball—rally and point-start fundamentals.',
              },
              {
                label: 'Orange ball',
                desc: 'Mid-size courts—transitional footwork and longer exchanges.',
              },
              {
                label: 'Green ball',
                desc: 'Full singles width—bridge toward yellow ball when ready.',
              },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-eyebrow text-brand-victoria-cove mb-2 tracking-[0.12em]">{row.label}</p>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                  {row.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[14px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
            Unsure which division fits? Note it when you register—we confirm placement before the first
            Saturday. You can also{' '}
            <Link href="/book" className="text-brand-victoria-cove underline underline-offset-4 font-medium">
              book a trial
            </Link>{' '}
            and talk it through with our staff.
          </p>
        </div>
      </section>

      {/* Who it’s for — asymmetric stagger */}
      <section className="container-lbta section bg-brand-morning-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-6 md:mb-12 md:max-w-2xl mx-auto md:mx-0">
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Who it&apos;s for</h2>
            <div className="section-horizon mx-auto md:mx-0 mb-6" aria-hidden="true" />
            <p className="text-body text-brand-pacific-dusk/60 leading-relaxed">
              One series, five divisions. Pick the band that matches your game; we help with placement if
              you are between levels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Junior pathway — Color Ball on up',
                body: 'Red, orange, and green ball players have a dedicated Color Ball division: development-first matchplay with formats that fit scaled tennis. You are part of the same Saturday series—not an afterthought.',
              },
              {
                title: 'Club & improving adults',
                body: 'Intermediate bands where every match counts toward UTR and your confidence on court.',
              },
              {
                title: 'Advanced & doubles',
                body: 'Higher UTR bands and a dedicated doubles round-robin block, including evening play.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={[
                  'group relative bg-white border border-brand-pacific-dusk/8 rounded-lg p-8 md:p-9',
                  'shadow-[0_2px_24px_rgba(27,58,92,0.06)] transition-all duration-500',
                  'hover:border-brand-pacific-dusk/15 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(27,58,92,0.08)]',
                  i === 1 ? 'md:-translate-y-3 md:shadow-[0_8px_32px_rgba(27,58,92,0.07)]' : '',
                ].join(' ')}
              >
                <span
                  className="text-eyebrow text-brand-sunset-cliff/80 mb-4 block"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">{card.title}</h3>
                <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Every Saturday — timeline steps */}
      <section className="container-lbta section border-t border-brand-pacific-dusk/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Every Saturday</h2>
          <div className="section-horizon mb-6" aria-hidden="true" />
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mb-14 leading-relaxed">
            Show up, compete, and track your progress. Divisions are by level, not age or gender.
          </p>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative">
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
              <li key={item.step} className="relative">
                <div className="flex lg:flex-col lg:items-start gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-victoria-cove/35 bg-brand-morning-light font-headline text-lg text-brand-pacific-dusk shadow-sm"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">{item.title}</h3>
                    <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Divisions */}
      <section id="divisions" className="bg-brand-sandstone scroll-mt-28">
        <div className="container-lbta section">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Five divisions</h2>
            <div className="section-horizon mb-6" aria-hidden="true" />
            <p className="text-body text-brand-pacific-dusk/60 mb-4 max-w-2xl">
              Find your level. Season registration includes the full series; drop-in is available where
              listed for flexibility.
            </p>
            <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-10 max-w-2xl">
              New to UTR or raising a Color Ball player?{' '}
              <a
                href="#utr-and-color-ball"
                className="text-brand-victoria-cove font-medium underline underline-offset-4 decoration-brand-victoria-cove/40 hover:text-brand-pacific-dusk"
              >
                Read how Color Ball fits the UTR platform
              </a>
              .
            </p>

            <UTRMatchPlayDivisions divisions={divisions} />
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative bg-brand-morning-light">
        <div className="container-lbta section-sm">
          <blockquote className="section-quote max-w-3xl mx-auto">
            <p className="font-headline text-display-sm md:text-[clamp(1.75rem,4vw,2.25rem)] text-brand-pacific-dusk leading-snug">
              Matchplay is where training meets pressure—where your rating reflects what you actually
              play, not just what you practice.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Season Points & Grand Finals */}
      <section className="container-lbta section">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="rounded-2xl border border-brand-pacific-dusk/8 bg-white p-8 md:p-10 shadow-[0_4px_24px_rgba(27,58,92,0.04)]">
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2">Season points</h3>
              <div className="section-horizon mb-6" aria-hidden="true" />
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
                    className="flex items-center justify-between py-2.5 border-b border-brand-pacific-dusk/8 last:border-0"
                  >
                    <span className="text-[14px] font-sans font-light text-brand-pacific-dusk/60">
                      {item.label}
                    </span>
                    <span className="text-[14px] font-sans font-medium text-brand-sunset-cliff tabular-nums">
                      {item.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2">Grand Finals</h3>
                <div className="section-horizon mb-6" aria-hidden="true" />
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

              <div className="rounded-xl bg-brand-sandstone p-6 md:p-8 border border-brand-pacific-dusk/6">
                <h4 className="text-eyebrow text-brand-victoria-cove mb-4">Season tiers</h4>
                <div className="space-y-2.5">
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

          {/* Guest athlete — full-width feature */}
          <div className="grid md:grid-cols-[1.25fr_1fr] gap-12 md:gap-16 items-center">
            <div className="relative aspect-[3/4] w-full max-w-[min(100%,560px)] mx-auto md:max-w-none md:mx-0 overflow-hidden rounded-2xl border border-brand-pacific-dusk/8 bg-brand-sandstone shadow-[0_24px_80px_rgba(27,58,92,0.14)] ring-1 ring-black/[0.04]">
              <Image
                src="/images/programs/karue-sell-exhibition.webp"
                alt="Karue Sell hitting a forehand — exhibition guest for Grand Finals night"
                fill
                className="object-cover object-top"
                sizes="(max-width: 767px) min(100vw - 48px, 560px), 58vw"
                quality={95}
              />
            </div>
            <div className="space-y-5 text-center md:text-left">
              <span className="text-eyebrow text-brand-sunset-cliff tracking-[0.15em]" aria-hidden="true">
                Guest athlete
              </span>
              <h4 className="font-headline text-[clamp(2rem,5vw,3rem)] text-brand-pacific-dusk leading-tight">
                Karu&eacute; Sell
              </h4>
              <p className="text-[16px] md:text-[18px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                ATP #262 and UCLA All-American. Karu&eacute; joins the Season 1 finale as a featured
                exhibition player—bringing tour-level intensity to the court after your division finals
                and awards.
              </p>
              <p className="text-[15px] font-sans font-medium text-brand-victoria-cove">
                Exhibition doubles · June 13, 8:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NTRP → UTR Reference */}
      <section className="bg-white border-y border-brand-pacific-dusk/5">
        <div className="container-lbta section-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center">
              NTRP to UTR reference
            </h3>
            <div className="section-horizon mx-auto mb-8" aria-hidden="true" />
            <div className="overflow-x-auto rounded-xl border border-brand-pacific-dusk/8 shadow-[0_4px_24px_rgba(27,58,92,0.04)]">
              <table className="w-full text-[14px] font-sans">
                <thead>
                  <tr className="border-b border-brand-pacific-dusk/10 bg-brand-sandstone/80">
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/50">
                      NTRP
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/50">
                      UTR (men)
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/50">
                      UTR (women)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ntrpToUtr.map((row) => (
                    <tr key={row.ntrp} className="border-b border-brand-pacific-dusk/5 last:border-0">
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
          <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center">Venues</h3>
          <div className="section-horizon mx-auto mb-10" aria-hidden="true" />
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: 'Laguna Beach High School',
                address: '605 Park Ave, Laguna Beach',
                courts: '6 courts (4 lit)',
                divisions: 'UTR 3.0–5.0, UTR 5.0–7.0, Doubles',
                mapUrl: 'https://www.google.com/maps/search/?api=1&query=605+Park+Ave+Laguna+Beach+CA+92651',
              },
              {
                name: 'Alta Laguna Park',
                address: 'Alta Laguna Blvd, Laguna Beach',
                courts: '4 courts',
                divisions: 'Color Ball, UTR 2.0–4.0',
                mapUrl:
                  'https://www.google.com/maps/search/?api=1&query=Alta+Laguna+Park+Laguna+Beach+CA+92651',
              },
            ].map((v) => (
              <div
                key={v.name}
                className="group relative rounded-xl border border-brand-pacific-dusk/8 bg-brand-sandstone p-6 md:p-8 transition-all duration-300 hover:border-brand-victoria-cove/25 hover:shadow-[0_8px_32px_rgba(27,58,92,0.06)]"
              >
                <h4 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">{v.name}</h4>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-1">{v.address}</p>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-4">{v.courts}</p>
                <p className="text-[12px] font-sans font-medium text-brand-victoria-cove tracking-wide mb-4">
                  {v.divisions}
                </p>
                <a
                  href={v.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-sans font-medium text-brand-pacific-dusk underline underline-offset-4 decoration-brand-pacific-dusk/30 hover:text-brand-victoria-cove hover:decoration-brand-victoria-cove/70 transition-colors"
                >
                  Open in Google Maps (new tab)
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-morning-light border-t border-brand-pacific-dusk/5">
        <div className="container-lbta section-sm">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center">
              Common questions
            </h3>
            <div className="section-horizon mx-auto mb-10" aria-hidden="true" />
            <dl className="space-y-6">
              {[
                {
                  q: 'Do I need a UTR account?',
                  a: 'Yes. We submit results to Universal Tennis; you will need an active profile for rated play.',
                },
                {
                  q: 'What is Color Ball Rating—and is it different from a “UTR number”?',
                  a: 'Color Ball players use UTR Sports’ Color Ball Rating (CBR): stage levels for red, orange, and green ball that match scaled courts. It is separate from the numeric UTR Rating used for yellow-ball singles and doubles. Both are legitimate; CBR reflects where your child is in development.',
                },
                {
                  q: 'My child only plays red or orange ball. Is this series for them?',
                  a: 'Yes. Our Color Ball division is built for red, orange, and green ball juniors: structured Saturday matchplay with formats suited to scaled tennis, in the same series and community as the rest of the program.',
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
                <div
                  key={item.q}
                  className="rounded-lg border border-brand-pacific-dusk/8 bg-white p-6 shadow-[0_2px_16px_rgba(27,58,92,0.03)]"
                >
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
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(46,139,139,0.12),transparent_65%)] pointer-events-none" aria-hidden="true" />
        <div className="relative container-lbta section text-center">
          <h2 className="font-headline text-display text-white mb-4">Register for Season 1</h2>
          <div className="section-horizon mx-auto mb-8" aria-hidden="true" />
          <p className="text-[1.05rem] font-sans font-light text-white/65 max-w-lg mx-auto mb-10">
            Eight Saturdays of competitive, rated matchplay. Choose your division and secure your spot.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <UTRMatchPlayRegister variant="footer" />
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/30 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
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
