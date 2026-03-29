import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LeagueEventSchema } from '@/app/schema'
import UtrSeriesHero from '@/components/programs/UtrSeriesHero'
import HorizonDivider from '@/components/ui/HorizonDivider'
import UTRMatchPlayRegister from './UTRMatchPlayRegister'
import UTRMatchPlayDivisions from './UTRMatchPlayDivisions'
import UtrDropInSchedule from './UtrDropInSchedule'
import {
  formatUtrGrandFinalsShort,
  formatUtrSessionDateLong,
  getNtrpToUtrReference,
  getUtrDivisionsForPage,
  getUtrGrandFinalsIso,
  getUtrGrandFinalsVenueShort,
  getUtrRegularSeasonSaturdays,
  getUtrRegularSeasonSundays,
  getUtrSaturdayVenueShort,
  getUtrSeasonIsoRange,
  getUtrSeasonLabel,
  getUtrSundayVenueShort,
} from '@/lib/utr-match-play'

const seasonLabel = getUtrSeasonLabel()
const { startDate, endDate } = getUtrSeasonIsoRange()
const utrRegularSaturdays = getUtrRegularSeasonSaturdays()
const utrRegularSundays = getUtrRegularSeasonSundays()
const utrGrandFinalsIso = getUtrGrandFinalsIso()
const utrGrandFinalsVenue = getUtrGrandFinalsVenueShort()
const satVenueShort = getUtrSaturdayVenueShort()
const sunVenueShort = getUtrSundayVenueShort()
const grandFinalsDisplay = formatUtrGrandFinalsShort(utrGrandFinalsIso)
const grandFinalsLong = formatUtrSessionDateLong(utrGrandFinalsIso)

/** Local WebP — reliable in prod; Cloudinary email paths were 404ing in Image optimizer. */
const VENUE_ALTA_IMAGE = '/images/about/court-alta-laguna.webp'
const VENUE_LBHS_IMAGE = '/images/about/court-lbhs.webp'

export const metadata: Metadata = {
  // Segment title only — root layout template adds " | Laguna Beach Tennis Academy"
  title: 'UTR Match Play Series',
  description: `LBTA UTR Match Play Series — Season 1. Eight weekends of rated matchplay in Laguna Beach. Four divisions from Color Ball juniors to advanced singles and doubles. ${seasonLabel.split('·')[0]?.trim() ?? seasonLabel}.`,
  openGraph: {
    title: 'UTR Match Play Series',
    description: `Rated weekend matchplay by level in Laguna Beach. ${seasonLabel.split('·')[0]?.trim() ?? seasonLabel}.`,
    type: 'website',
    images: [
      {
        url: '/images/programs/utr-match-play/utr-match-play-hero.webp',
        width: 1920,
        height: 1080,
        alt: 'Doubles players across the net during outdoor match play at Laguna Beach Tennis Academy',
      },
    ],
  },
}

const divisions = getUtrDivisionsForPage()
const ntrpToUtr = getNtrpToUtrReference()

export default function UTRMatchPlayPage() {
  return (
    <div className="overflow-x-hidden bg-brand-morning-light text-brand-pacific-dusk">
      <LeagueEventSchema
        name="UTR Match Play Series — Season 1"
        description={`Eight weekends of rated matchplay in Laguna Beach. Four divisions from Color Ball juniors to advanced singles and doubles. ${seasonLabel}`}
        startDate={startDate}
        endDate={endDate}
        location="Laguna Beach"
      />

      <UtrSeriesHero />

      {/* Divisions — light editorial cards */}
      <section id="divisions" className="scroll-mt-28 border-b border-brand-pacific-dusk/[0.08] bg-white">
        <div className="container-lbta section">
          <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-victoria-cove">
            Four divisions — by level, not age
          </p>
          <h2 className="font-headline text-display-sm md:text-[clamp(2rem,4vw,2.5rem)] text-brand-pacific-dusk mt-2 mb-3 leading-tight">
            Find your level
          </h2>
          <div className="section-horizon mb-6 max-w-[120px] opacity-90" aria-hidden="true" />
          <p className="text-body text-brand-pacific-dusk/75 mb-10 max-w-2xl">
            Start with a weekend drop-in: pick your division, choose a date on the card, and request a
            drop-in—we confirm space after you reach out (not instant checkout). Full season registration
            covers all eight weekends plus Grand Finals. Divisions are by skill band—juniors and adults enroll
            where they fit. See the{' '}
            <a
              href="#schedule"
              className="font-medium text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/35 hover:text-brand-pacific-dusk"
            >
              schedule
            </a>{' '}
            or{' '}
            <a
              href="/contact"
              className="font-medium text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/35 hover:text-brand-pacific-dusk"
            >
              contact us
            </a>{' '}
            for questions.
          </p>
          <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 mb-10 max-w-2xl">
            New to UTR or raising a Color Ball player?{' '}
            <a
              href="#utr-and-color-ball"
              className="font-medium text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/35 hover:text-brand-pacific-dusk"
            >
              Read how Color Ball fits the UTR platform
            </a>
            .
          </p>
          <UTRMatchPlayDivisions divisions={divisions} variant="light" />
        </div>
      </section>

      {/* Weekend schedule */}
      <section id="schedule" className="scroll-mt-28 border-b border-brand-pacific-dusk/[0.08] bg-brand-morning-light">
        <div className="container-lbta section-sm md:pb-24 md:pt-20">
          <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-victoria-cove">
            Season 1 schedule
          </p>
          <h2 className="font-headline text-display-sm md:text-[clamp(1.85rem,4vw,2.35rem)] text-brand-pacific-dusk mt-2 mb-3 leading-tight">
            Eight weekends, two venues
          </h2>
          <div className="section-horizon mb-6 max-w-[120px] opacity-90" aria-hidden="true" />
          <p className="text-[16px] md:text-[17px] font-sans font-light leading-relaxed text-brand-pacific-dusk/70 max-w-2xl mb-10">
            Saturdays at {satVenueShort} (Color Ball + UTR 2.0–5.0 Singles). Sundays at {sunVenueShort} (UTR
            3.0–7.0 Singles + Doubles). Use the division cards above to pick a date and request a drop-in, or
            register for the full season—there is no day-of online signup.
          </p>
          <div className="mx-auto max-w-5xl">
            <UtrDropInSchedule
              saturdays={utrRegularSaturdays}
              sundays={utrRegularSundays}
              grandFinalsIso={utrGrandFinalsIso}
              grandFinalsVenue={utrGrandFinalsVenue}
              saturdayVenueLabel={satVenueShort}
              sundayVenueLabel={sunVenueShort}
              variant="light"
            />
          </div>
        </div>
      </section>

      <HorizonDivider animate />

      {/* UTR Sports + Color Ball — parent-friendly context */}
      <section
        id="utr-and-color-ball"
        className="container-lbta section-sm border-b border-brand-pacific-dusk/[0.08] bg-white scroll-mt-28"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-display-sm md:text-[clamp(1.75rem,4vw,2.25rem)] text-brand-pacific-dusk mb-4 text-center md:text-left">
            What UTR is—and how Color Ball fits
          </h2>
          <div className="section-horizon mx-auto md:mx-0 mb-8 opacity-90" aria-hidden="true" />
          <div className="space-y-5 text-[15px] md:text-[16px] font-sans font-light text-brand-pacific-dusk/75 leading-relaxed">
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
              the same weekend series: real matchplay, same-day score submission to UTR Sports, and a clear
              place for juniors who are not on full yellow ball yet.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 pt-8 border-t border-brand-pacific-dusk/[0.1]">
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
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/65 leading-relaxed">
                  {row.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[14px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
            Unsure which division fits? Note it when you register—we confirm placement before the first
            weekend. We do not offer separate trial sessions for this series. For a single weekend, reference
            pricing is listed per division—arrange through the academy (no day-of online signup).{' '}
            <Link href="/contact" className="text-brand-victoria-cove underline underline-offset-4 font-medium hover:text-brand-pacific-dusk transition-colors">
              Contact us
            </Link>{' '}
            with questions.
          </p>
        </div>
      </section>

      {/* Who it’s for */}
      <section className="container-lbta section border-b border-brand-pacific-dusk/[0.08] bg-brand-sandstone/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-6 md:mb-12 md:max-w-2xl mx-auto md:mx-0">
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Who it&apos;s for</h2>
            <div className="section-horizon mx-auto md:mx-0 mb-6 opacity-90" aria-hidden="true" />
            <p className="text-body text-brand-pacific-dusk/75 leading-relaxed">
              One series, four divisions. Pick the band that matches your game; we help with placement if you
              are between levels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Junior pathway — Color Ball on up',
                body: 'Red, orange, and green ball players have a dedicated Color Ball division: development-first matchplay with formats that fit scaled tennis.',
              },
              {
                title: 'Club & improving adults',
                body: 'Intermediate bands where every match counts toward UTR and your confidence on court.',
              },
              {
                title: 'Advanced & doubles',
                body: 'Higher UTR singles bands and a dedicated doubles block at Laguna Beach High School.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={[
                  'group relative rounded-xl border border-brand-pacific-dusk/[0.08] bg-white p-8 md:p-9',
                  'shadow-[0_8px_32px_rgba(27,58,92,0.06)] transition-all duration-500',
                  'hover:border-brand-victoria-cove/25 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(27,58,92,0.1)]',
                  i === 1 ? 'md:-translate-y-3' : '',
                ].join(' ')}
              >
                <span
                  className="text-eyebrow text-brand-sunset-cliff/90 mb-4 block"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">{card.title}</h3>
                <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/65 leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Every weekend — timeline steps */}
      <section className="container-lbta section border-b border-brand-pacific-dusk/[0.08] bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">Every weekend</h2>
          <div className="section-horizon mb-6 opacity-90" aria-hidden="true" />
          <p className="text-body text-brand-pacific-dusk/70 max-w-2xl mb-14 leading-relaxed">
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
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-victoria-cove/35 bg-brand-morning-light font-headline text-lg text-brand-pacific-dusk shadow-[0_0_20px_rgba(46,139,139,0.12)]"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">{item.title}</h3>
                    <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative border-b border-brand-pacific-dusk/[0.08] bg-brand-morning-light">
        <div className="container-lbta section-sm">
          <blockquote className="section-quote max-w-3xl mx-auto my-0">
            <p className="font-headline text-display-sm md:text-[clamp(1.75rem,4vw,2.25rem)] text-brand-pacific-dusk leading-snug">
              Matchplay is where training meets pressure—where your rating reflects what you actually play,
              not just what you practice.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Season points & tiers — light */}
      <section className="container-lbta section border-b border-brand-pacific-dusk/[0.08] bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-victoria-cove">
            Season points &amp; tiers
          </p>
          <h2 className="font-headline text-display-sm md:text-[clamp(2rem,4vw,2.5rem)] text-brand-pacific-dusk mt-2 mb-3">
            Every match earns points. Points only go up.
          </h2>
          <div className="section-horizon mb-8 max-w-[120px] opacity-90" aria-hidden="true" />
          <p className="text-body text-brand-pacific-dusk/70 max-w-2xl mb-12">
            Two tracks: UTR (national, skill-based) and Season Points (local, effort-based). You do not have to
            win to climb.
          </p>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <table className="w-full border-collapse font-sans">
                <tbody>
                  {[
                    { label: 'Show up and compete', pts: '+10' },
                    { label: 'Win a match', pts: '+15' },
                    { label: 'Upset (UTR diff ≥ 0.5)', pts: '+25' },
                    { label: 'Complete all weekly matches', pts: '+10' },
                    { label: '3-week attendance streak', pts: '+20' },
                    { label: 'UTR improves from prior week', pts: '+10' },
                  ].map((item) => (
                    <tr key={item.label} className="border-b border-brand-pacific-dusk/[0.08]">
                      <td className="py-3 pr-4 text-[15px] font-light text-brand-pacific-dusk/85">
                        {item.label}
                      </td>
                      <td className="py-3 text-right text-[16px] font-extrabold tabular-nums text-brand-victoria-cove">
                        {item.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.15em] text-brand-pacific-dusk/45 mb-4">
                Season tiers
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  { tier: 'Legend', swatch: 'bg-brand-thousand-steps', req: 'Grand Finals Top 3' },
                  { tier: 'Champion', swatch: 'bg-brand-victoria-cove', req: '450+ points' },
                  { tier: 'Advanced', swatch: 'bg-[#4A7FB5]', req: '250–449 points' },
                  { tier: 'Contender', swatch: 'bg-brand-pacific-dusk/40', req: '100–249 points' },
                  { tier: 'Challenger', swatch: 'bg-brand-pacific-dusk/20', req: '0–99 points' },
                ].map((t) => (
                  <div
                    key={t.tier}
                    className="flex items-center gap-3.5 rounded-lg border border-brand-pacific-dusk/[0.08] bg-white px-4 py-3.5"
                  >
                    <span className={`h-4 w-4 shrink-0 rounded ${t.swatch}`} aria-hidden="true" />
                    <span className="font-sans text-[17px] font-bold text-brand-pacific-dusk">{t.tier}</span>
                    <span className="ml-auto font-sans text-[14px] text-brand-pacific-dusk/60">{t.req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grand Finals — dark */}
      <section
        id="grand-finals"
        className="scroll-mt-28 border-b border-white/[0.06] bg-brand-deep-water py-16 md:py-20"
      >
        <div className="container-lbta max-w-5xl mx-auto">
          <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-thousand-steps">
            Grand Finals
          </p>
          <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] text-white mt-2 mb-2">Season 1 finale</h2>
          <p className="font-sans text-[18px] font-bold text-brand-thousand-steps mb-10">
            {grandFinalsLong} · {utrGrandFinalsVenue}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              { t: '4:00 PM', e: 'Division finals', d: 'All four divisions compete' },
              { t: '6:00 PM', e: 'Social hour', d: 'Food trucks · Season 2 reg opens' },
              { t: '7:00 PM', e: 'Awards & raffle', d: 'Champions crowned · Raffle drawn' },
              { t: '8:00 PM', e: 'Pro exhibition', d: 'Doubles under the lights' },
            ].map((row) => (
              <div
                key={row.t}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-5 md:px-6"
              >
                <p className="font-sans text-[22px] font-extrabold text-brand-sunset-cliff mb-2">{row.t}</p>
                <p className="font-sans text-[19px] font-bold text-white mb-1">{row.e}</p>
                <p className="font-sans text-[14px] text-white/50 leading-snug">{row.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
            <div className="relative aspect-[3/4] w-full max-w-[min(100%,480px)] mx-auto md:mx-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1424]">
              <Image
                src="/images/programs/karue-sell-exhibition.webp"
                alt="Karue Sell hitting a forehand — exhibition guest for Grand Finals night"
                fill
                className="object-cover object-top"
                sizes="(max-width: 767px) min(100vw - 48px, 480px), 45vw"
                quality={95}
              />
            </div>
            <div className="space-y-5 text-center md:text-left">
              <span className="text-eyebrow text-brand-sunset-cliff tracking-[0.15em]" aria-hidden="true">
                Guest athlete
              </span>
              <h4 className="font-headline text-[clamp(2rem,5vw,3rem)] text-white leading-tight">
                Karu&eacute; Sell
              </h4>
              <p className="text-[16px] md:text-[18px] font-sans font-light text-white/65 leading-relaxed">
                ATP #262 and UCLA All-American. Karu&eacute; joins the Season 1 finale as a featured
                exhibition player after division finals and awards.
              </p>
              <p className="text-[15px] font-sans font-medium text-brand-victoria-cove">
                Exhibition doubles · {grandFinalsDisplay}, 8:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NTRP → UTR Reference */}
      <section className="border-y border-brand-pacific-dusk/[0.08] bg-brand-morning-light">
        <div className="container-lbta section-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center">
              NTRP to UTR reference
            </h3>
            <div className="section-horizon mx-auto mb-8 opacity-90" aria-hidden="true" />
            <div className="overflow-x-auto rounded-xl border border-brand-pacific-dusk/10 bg-white shadow-[0_8px_32px_rgba(27,58,92,0.06)]">
              <table className="w-full text-[14px] font-sans">
                <thead>
                  <tr className="border-b border-brand-pacific-dusk/10 bg-brand-sandstone/60">
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/55">
                      NTRP
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/55">
                      UTR (men)
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/55">
                      UTR (women)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ntrpToUtr.map((row) => (
                    <tr key={row.ntrp} className="border-b border-brand-pacific-dusk/[0.06] last:border-0">
                      <td className="py-3 px-4 font-medium text-brand-pacific-dusk">{row.ntrp}</td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/85">{row.men}</td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/85">{row.women}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="container-lbta section-sm border-b border-brand-pacific-dusk/[0.08] bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-victoria-cove text-center">
            Venues
          </p>
          <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center mt-2">
            Two locations, one series
          </h3>
          <div className="section-horizon mx-auto mb-6 opacity-90" aria-hidden="true" />
          <p className="text-center text-body text-brand-pacific-dusk/70 max-w-2xl mx-auto mb-10">
            Juniors and adults compete by level—not by age alone. Saturdays at Alta Laguna Park; Sundays at
            Laguna Beach High School. Same series; divisions span Color Ball through advanced singles and
            doubles.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: 'Alta Laguna Park',
                address: 'Alta Laguna Blvd, Laguna Beach',
                courts: '4 courts',
                days: `Saturdays: Color Ball + UTR 2.0–5.0 Singles`,
                image: VENUE_ALTA_IMAGE,
                imageAlt:
                  'Outdoor tennis courts at Alta Laguna Park — match play for juniors and adults by division',
                mapUrl:
                  'https://www.google.com/maps/search/?api=1&query=Alta+Laguna+Park+Laguna+Beach+CA+92651',
              },
              {
                name: 'Laguna Beach High School',
                address: '605 Park Ave, Laguna Beach',
                courts: '6 courts (4 lit)',
                days: `Sundays: UTR 3.0–7.0 Singles + Doubles · Grand Finals: ${grandFinalsDisplay}`,
                image: VENUE_LBHS_IMAGE,
                imageAlt:
                  'Outdoor tennis courts at Laguna Beach High School — match play for juniors and adults by division',
                mapUrl: 'https://www.google.com/maps/search/?api=1&query=605+Park+Ave+Laguna+Beach+CA+92651',
              },
            ].map((v) => (
              <article
                key={v.name}
                className="overflow-hidden rounded-2xl border border-brand-pacific-dusk/[0.08] bg-white shadow-[0_8px_28px_rgba(27,58,92,0.06)] transition-shadow hover:shadow-[0_12px_36px_rgba(27,58,92,0.1)]"
              >
                <div className="relative h-[200px] w-full">
                  <Image
                    src={v.image}
                    alt={v.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={90}
                  />
                </div>
                <div className="p-6 md:p-7">
                  <h4 className="font-headline text-headline-sm text-brand-pacific-dusk mb-1">{v.name}</h4>
                  <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/60 mb-2">
                    {v.address} · {v.courts}
                  </p>
                  <p className="text-[14px] font-sans font-medium text-brand-victoria-cove leading-snug">
                    {v.days}
                  </p>
                  <a
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-[13px] font-sans font-medium text-brand-pacific-dusk underline underline-offset-4 decoration-brand-pacific-dusk/30 hover:text-brand-victoria-cove"
                  >
                    Open in Google Maps (new tab)
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-brand-pacific-dusk/[0.08] bg-brand-morning-light">
        <div className="container-lbta section-sm">
          <div className="max-w-2xl mx-auto">
            <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-victoria-cove text-center">
              Common questions
            </p>
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-2 text-center mt-2">
              Before you register
            </h3>
            <div className="section-horizon mx-auto mb-10 opacity-90" aria-hidden="true" />
            <dl className="space-y-0 divide-y divide-brand-pacific-dusk/[0.12]">
              {[
                {
                  q: 'Do I need a UTR account?',
                  a: 'Yes. We submit results to UTR Sports — you need an active profile for rated play.',
                },
                {
                  q: 'Do I have to play both Saturday and Sunday?',
                  a: 'No. Saturday and Sunday are separate divisions at separate venues. Register for whichever fits — or both.',
                },
                {
                  q: 'My child only plays red or orange ball. Is this for them?',
                  a: 'Yes. The Color Ball division runs every Saturday with formats built for scaled tennis. Same series, same community.',
                },
                {
                  q: 'What if I am between two divisions?',
                  a: 'Note it when you register — we confirm placement before the first weekend.',
                },
                {
                  q: 'Can I try one session first?',
                  a: 'We do not offer same-day or self-serve online signup for a single session. If you want to try one weekend, contact us—when space allows, we align you with the weekend reference rate for your division.',
                },
                {
                  q: 'Is this only for juniors?',
                  a: 'No. Divisions are by level, not age. Adults and juniors enroll in the band that fits—Color Ball is scaled tennis for younger pathways; UTR singles and doubles bands include adults.',
                },
              ].map((item) => (
                <div key={item.q} className="py-6 first:pt-0">
                  <dt className="font-headline text-[18px] text-brand-pacific-dusk mb-2">{item.q}</dt>
                  <dd className="text-[15px] font-sans font-light text-brand-pacific-dusk/70 leading-relaxed">
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
            Eight weekends of competitive, rated matchplay. Choose your division.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <UTRMatchPlayRegister variant="footer" />
            <Link
              href="#schedule"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/30 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Weekend schedule
            </Link>
          </div>
          <p className="text-[13px] font-sans font-light text-white/55 mb-4">
            <a
              href="mailto:info@lagunabeachtennisacademy.com?subject=UTR%20Match%20Play%20Series%20—%20Question"
              className="text-brand-victoria-cove/90 underline underline-offset-4 hover:text-white transition-colors"
            >
              info@lagunabeachtennisacademy.com
            </a>
            {' · '}
            <a
              href="https://lagunabeachtennisacademy.com"
              className="text-brand-victoria-cove/90 underline underline-offset-4 hover:text-white transition-colors"
            >
              lagunabeachtennisacademy.com
            </a>
          </p>
          <p className="text-[12px] font-sans font-light text-white/50">
            Presented by Laguna Beach Tennis Academy &amp; Fit4Tennis
          </p>
        </div>
      </section>
    </div>
  )
}
