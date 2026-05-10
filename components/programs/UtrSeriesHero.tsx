import Image from 'next/image'
import Link from 'next/link'
import UtrDateStrip from '@/components/programs/UtrDateStrip'
import {
  formatUtrSeasonRangeDisplay,
  UTR_DIVISION_STAT_COUNT,
  UTR_HERO_IMAGE_URL,
} from '@/lib/utr-match-play'

const HERO_ALT =
  'Golden hour at Laguna Beach Tennis Academy — outdoor courts for UTR match play'

export default function UtrSeriesHero() {
  const seasonRange = formatUtrSeasonRangeDisplay()

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
            src={UTR_HERO_IMAGE_URL}
            alt={HERO_ALT}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={80}
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(15,34,55,0.92)_0%,rgba(15,34,55,0.78)_45%,rgba(15,34,55,0.4)_100%)]"
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
            <span className="block">Real Matches.</span>
            <span className="block text-brand-victoria-cove">Real Fun.</span>
          </h1>

          <p className="mt-6 max-w-xl font-sans text-[17px] font-light leading-relaxed text-white/70 md:text-[18px]">
            Structured match play by skill level — not age or gender. Every match is UTR rated. Season
            points, weekly prizes, and a Grand Finals night on the coast. The whole point is to play more,
            play better, and actually enjoy the process.
          </p>

          <p className="mt-4 font-sans text-[14px] font-medium text-white/60">{seasonRange}</p>

          <div className="mt-8 flex flex-wrap gap-x-9 gap-y-5 md:mt-10">
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                8
              </p>
              <p className="mt-1 font-sans text-eyebrow font-bold uppercase text-white/60">
                Weekends
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                {UTR_DIVISION_STAT_COUNT}
              </p>
              <p className="mt-1 font-sans text-eyebrow font-bold uppercase text-white/60">
                Divisions
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(1.35rem,3.5vw,1.85rem)] font-bold leading-tight text-white">
                Sat &amp; Sun
              </p>
              <p className="mt-1 font-sans text-eyebrow font-bold uppercase text-white/60">
                Days
              </p>
            </div>
            <div>
              <p className="font-headline text-[clamp(2rem,5vw,2.65rem)] font-bold leading-none text-white">
                UTR
              </p>
              <p className="mt-1 font-sans text-eyebrow font-bold uppercase text-white/60">
                Rated Play
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="#divisions"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-victoria-cove px-7 font-sans text-[15px] font-bold text-white transition-opacity hover:opacity-[0.92] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Register for Season 1
            </Link>
            <Link
              href="#schedule"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-[1.5px] border-white/25 bg-transparent px-7 font-sans text-[15px] font-bold text-white/80 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Weekend schedule
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm md:mt-10 md:max-w-xl">
            <p className="font-sans text-eyebrow-sm font-bold uppercase text-white/45">
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
