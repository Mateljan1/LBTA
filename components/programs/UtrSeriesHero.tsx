import Image from 'next/image'
import Link from 'next/link'
import UTRMatchPlayRegister from '@/app/programs/utr-match-play/UTRMatchPlayRegister'
import UtrDateStrip from '@/components/programs/UtrDateStrip'
import {
  formatUtrSeasonRangeDisplay,
  getUtrDivisionsForPage,
} from '@/lib/utr-match-play'

const HERO_IMAGE = '/images/programs/utr-match-play/utr-match-play-hero.webp'
const HERO_ALT =
  'Doubles players across the net during outdoor match play at Laguna Beach Tennis Academy'

export default function UtrSeriesHero() {
  const seasonRange = formatUtrSeasonRangeDisplay()
  const divisionCount = getUtrDivisionsForPage().length

  const colorBallRows = [
    { label: 'Red', dotClass: 'bg-red-500 shadow-[0_2px_6px_rgba(204,51,51,0.35)]', ages: '4–8' },
    {
      label: 'Orange',
      dotClass: 'bg-brand-sunset-cliff shadow-[0_2px_6px_rgba(232,131,74,0.35)]',
      ages: '7–10',
    },
    {
      label: 'Green',
      dotClass: 'bg-brand-tide-pool shadow-[0_2px_6px_rgba(45,158,62,0.25)]',
      ages: '10–14',
    },
  ]

  return (
    <>
      <section
        className="relative min-h-[520px] overflow-hidden md:min-h-[640px]"
        aria-labelledby="utr-series-hero-heading"
      >
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt={HERO_ALT}
            fill
            priority
            className="object-cover object-[50%_22%] sm:object-[50%_20%] lg:object-[50%_18%]"
            sizes="100vw"
            quality={95}
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(15,34,55,0.94)_0%,rgba(15,34,55,0.8)_45%,rgba(15,34,55,0.35)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute left-0 right-0 top-0 z-[5] h-1.5 bg-gradient-to-r from-brand-victoria-cove via-brand-sunset-cliff to-brand-thousand-steps"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[680px] px-6 py-14 md:px-10 md:py-20 lg:px-12 xl:max-w-[720px]">
          <p className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-brand-victoria-cove">
            Season 1 · Laguna Beach, CA
          </p>

          <h1
            id="utr-series-hero-heading"
            className="font-headline text-[clamp(2.25rem,6vw,3.6rem)] font-bold leading-[1.08] text-white"
          >
            <span className="block">Eight Weekends.</span>
            <span className="block">Rated Matches.</span>
            <span className="block text-brand-victoria-cove">Real Progress.</span>
          </h1>

          <p className="mt-6 max-w-xl font-sans text-[17px] font-light leading-relaxed text-white/70 md:text-[18px]">
            Structured matchplay by skill level — not age or gender — with same-day UTR submission, season
            points, weekly prizes, and a Grand Finals night on the coast.
          </p>

          <p className="mt-4 font-sans text-[13px] font-medium text-white/50 md:hidden">{seasonRange}</p>

          <div className="mt-8 flex flex-wrap gap-x-9 gap-y-5 md:mt-10">
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                8
              </p>
              <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Weekends
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                {divisionCount}
              </p>
              <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Divisions
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(1.35rem,3.5vw,1.85rem)] font-bold leading-tight text-white">
                Sat &amp; Sun
              </p>
              <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Two Days
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                UTR
              </p>
              <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Rated Play
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <UTRMatchPlayRegister variant="hero-teal" />
            <Link
              href="#schedule"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-[1.5px] border-white/25 bg-transparent px-7 font-sans text-[15px] font-bold text-white/80 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2237]/80"
            >
              Weekend schedule
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm md:mt-10 md:max-w-xl">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              Color Ball stages
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {colorBallRows.map((row) => (
                <li key={row.label} className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full ${row.dotClass}`}
                    aria-hidden="true"
                  />
                  <span className="font-sans text-[14px] font-bold text-white">{row.label}</span>
                  <span className="font-sans text-[13px] text-white/50">{row.ages}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/programs/leagues"
              className="inline-flex min-h-[48px] items-center font-sans text-[13px] font-medium text-brand-victoria-cove/95 underline underline-offset-4 transition-colors hover:text-white"
            >
              ← Leagues &amp; Match Play
            </Link>
            <Link
              href="#utr-and-color-ball"
              className="inline-flex min-h-[48px] items-center font-sans text-[13px] font-medium text-white/55 underline underline-offset-4 transition-colors hover:text-white"
            >
              How UTR &amp; Color Ball work
            </Link>
          </div>
        </div>
      </section>
      <UtrDateStrip />
    </>
  )
}
