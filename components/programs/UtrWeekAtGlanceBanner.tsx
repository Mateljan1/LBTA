import Link from 'next/link'
import {
  formatUtrSessionDateMonthDay,
  formatUtrWeekendPairShort,
  getUtrDivisionsForPage,
  getUtrGrandFinalsIso,
  getUtrSeasonWeekNumber,
} from '@/lib/utr-match-play'

const COLOR_BALL_ROWS = [
  { label: 'Red Ball', dot: 'bg-[#e54b4b]', ages: 'Ages 4–8' },
  { label: 'Orange Ball', dot: 'bg-[#f5a623]', ages: 'Ages 7–10' },
  { label: 'Green Ball', dot: 'bg-[#4caf50]', ages: 'Ages 10–14' },
]

/**
 * Dark “week at a glance” strip: Color Ball, UTR divisions, prizes — data-driven from leagues JSON.
 * Placed after the series hero; complements light division cards below.
 */
export default function UtrWeekAtGlanceBanner() {
  const weekNum = getUtrSeasonWeekNumber()
  const weekendLine = formatUtrWeekendPairShort(weekNum)
  const divisions = getUtrDivisionsForPage()
  const satSingles = divisions[1]
  const sunSingles = divisions[2]
  const sunDoubles = divisions[3]
  const gfIso = getUtrGrandFinalsIso()
  const gfMonthDay = formatUtrSessionDateMonthDay(gfIso)

  return (
    <section
      aria-labelledby="utr-week-glance-heading"
      className="relative border-b border-white/[0.06] bg-brand-deep-water"
    >
      <div className="pointer-events-none absolute -right-20 top-[-120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,131,74,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-[60px] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(46,139,139,0.06)_0%,transparent_70%)]" />

      <div className="relative z-[1] mx-auto max-w-[1440px] px-6 py-10 md:px-12 md:py-11">
        <div className="mb-8 flex flex-col justify-between gap-6 md:mb-9 md:flex-row md:items-start">
          <div className="max-w-[min(100%,65%)]">
            <p className="mb-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-brand-victoria-cove px-3.5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              <span>
                Week {weekNum} of 8 <span className="ml-3 font-normal text-white/50">Season 1</span>
              </span>
            </p>
            <h2
              id="utr-week-glance-heading"
              className="font-headline text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1] tracking-[-0.02em] text-brand-sandstone"
            >
              <span className="block">UTR Match Play</span>
              <span className="block text-brand-sunset-cliff">Series</span>
            </h2>
            <p className="mt-3 max-w-[500px] font-sans text-[14px] font-light leading-relaxed text-brand-sandstone/70">
              Good matches. Good people. Your UTR moves after every one. Players paired by skill — not age,
              not gender.
            </p>
          </div>
          <div className="text-left md:pt-2 md:text-right">
            <p className="font-headline text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight text-brand-sunset-cliff">
              {weekendLine}
            </p>
            <p className="mt-1 font-sans text-[13px] text-brand-sandstone/50">Laguna Beach, CA</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr_0.9fr]">
          {/* Color Ball */}
          <div className="rounded-xl border border-brand-sandstone/[0.08] bg-brand-pacific-dusk/55 p-5 backdrop-blur-md">
            <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-sandstone/50">
              Color Ball — Saturday
            </p>
            <ul className="space-y-0">
              {COLOR_BALL_ROWS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between border-b border-brand-sandstone/[0.04] py-2 last:border-b-0"
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.dot}`} aria-hidden />
                    <span className="font-sans text-[14px] font-medium text-brand-sandstone">{row.label}</span>
                  </span>
                  <span className="font-sans text-[11px] text-brand-sandstone/50">{row.ages}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3.5 rounded-md border border-brand-victoria-cove/20 bg-brand-victoria-cove/10 px-3 py-2.5 font-sans text-[11px] leading-relaxed text-brand-sandstone/70">
              <strong className="font-semibold text-brand-victoria-cove">Coach on court</strong> for every match.
              Underhand serves and drop feeds welcome. If they can rally, they can play.
            </div>
          </div>

          {/* UTR divisions */}
          <div className="rounded-xl border border-brand-sandstone/[0.08] bg-brand-pacific-dusk/[0.55] p-5 backdrop-blur-md">
            <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-victoria-cove">
              UTR divisions
            </p>
            {satSingles && (
              <div className="flex flex-col gap-0 border-b border-brand-sandstone/[0.04] py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-victoria-cove" aria-hidden />
                  <span className="font-sans text-[14px] font-medium text-brand-sandstone">{satSingles.name}</span>
                </div>
                <div className="mt-1 flex shrink-0 items-center gap-4 sm:mt-0">
                  <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-brand-sandstone/50">
                    Saturday
                  </span>
                  <span className="min-w-[6.25rem] text-right font-sans text-[12px] font-medium text-brand-sandstone/80">
                    {satSingles.time}
                  </span>
                </div>
              </div>
            )}
            {sunSingles && (
              <div className="flex flex-col gap-0 border-b border-brand-sandstone/[0.04] py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-victoria-cove" aria-hidden />
                  <div>
                    <div className="font-sans text-[14px] font-medium text-brand-sandstone">{sunSingles.name}</div>
                    <div className="font-sans text-[11px] text-brand-sandstone/50">Level-based — paired by skill</div>
                  </div>
                </div>
                <div className="mt-1 flex shrink-0 items-center gap-4 sm:mt-0">
                  <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-brand-sandstone/50">
                    Sunday
                  </span>
                  <span className="min-w-[6.25rem] text-right font-sans text-[12px] font-medium text-brand-sandstone/80">
                    {sunSingles.time}
                  </span>
                </div>
              </div>
            )}
            {sunDoubles && (
              <div className="flex flex-col gap-0 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-sunset-cliff" aria-hidden />
                  <div>
                    <div className="font-sans text-[14px] font-medium text-brand-sandstone">{sunDoubles.name}</div>
                    <div className="font-sans text-[11px] text-brand-sandstone/50">Solo? We&apos;ll pair you.</div>
                  </div>
                </div>
                <div className="mt-1 flex shrink-0 items-center gap-4 sm:mt-0">
                  <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-brand-sandstone/50">
                    Sunday
                  </span>
                  <span className="min-w-[6.25rem] text-right font-sans text-[12px] font-medium text-brand-sandstone/80">
                    {sunDoubles.time}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Prizes */}
          <div className="rounded-xl border border-brand-sandstone/[0.08] bg-brand-pacific-dusk/[0.55] p-5 backdrop-blur-md">
            <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-sunset-cliff">
              Prizes &amp; season points
            </p>
            <ul className="space-y-1.5">
              {[
                'Weekly division prizes',
                'Season champion awards',
                'Grand Finals party & raffle',
                'UTR ratings update weekly',
              ].map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="text-brand-sandstone/45" aria-hidden>
                    —
                  </span>
                  <span className="font-sans text-[13px] leading-snug text-brand-sandstone/75">{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                { label: 'Legend', className: 'border-brand-sunset-cliff/35 text-brand-sunset-cliff' },
                { label: 'Champion', className: 'border-brand-thousand-steps/30 text-brand-thousand-steps' },
                { label: 'Advanced', className: 'border-brand-victoria-cove/35 text-brand-victoria-cove' },
                { label: 'Contender', className: 'border-brand-sandstone/15 text-brand-sandstone/50' },
              ].map((t) => (
                <span
                  key={t.label}
                  className={`rounded border px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.05em] ${t.className}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-sunset-cliff/20 bg-gradient-to-r from-brand-sunset-cliff/15 to-brand-sunset-cliff/[0.04] px-4 py-3 md:gap-3">
            <span className="text-brand-thousand-steps" aria-hidden>
              ★
            </span>
            <p className="font-sans text-[14px] font-semibold text-brand-sandstone">
              Grand Finals · {gfMonthDay}
              <span className="ml-1 font-normal text-brand-sandstone/50">
                · Karué Sell exhibition (ATP #262 · UCLA All-American)
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-full border border-brand-sandstone/15 px-3.5 py-1.5 font-sans text-[11px] font-medium text-brand-sandstone/75">
              By level, not age
            </span>
            <span className="rounded-full border border-brand-sunset-cliff/40 px-3.5 py-1.5 font-sans text-[11px] font-medium text-brand-sunset-cliff">
              Drop-in welcome
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 md:flex-row md:flex-wrap md:justify-between md:gap-6">
          <div className="flex min-h-[48px] flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-sandstone/45">
              Season
            </span>
            <Link
              href="/programs/utr-match-play#divisions"
              className="font-sans text-[12px] text-brand-victoria-cove underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Division cards &amp; full season registration
            </Link>
          </div>
          <div className="flex min-h-[48px] flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-sandstone/45">
              Drop-in
            </span>
            <Link
              href="#divisions"
              className="font-sans text-[12px] text-brand-sandstone/75 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Pick a date on the division cards — we confirm space after you reach out
            </Link>
          </div>
          <div className="flex min-h-[48px] flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-sandstone/45">
              Questions
            </span>
            <a
              href="mailto:support@lagunabeachtennisacademy.com"
              className="font-sans text-[12px] text-brand-victoria-cove underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              support@lagunabeachtennisacademy.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
