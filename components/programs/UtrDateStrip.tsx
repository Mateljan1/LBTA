import {
  formatUtrGrandFinalsShort,
  formatUtrSeasonRangeDisplay,
  getUtrGrandFinalsIso,
  getUtrGrandFinalsVenueShort,
  getUtrSaturdayVenueShort,
  getUtrSundayVenueShort,
} from '@/lib/utr-match-play'

/**
 * Navy bar under hero: season range, Saturday venue, Sunday venue, Grand Finals — all from leagues JSON.
 */
export default function UtrDateStrip() {
  const seasonRange = formatUtrSeasonRangeDisplay()
  const satVenue = getUtrSaturdayVenueShort()
  const sunVenue = getUtrSundayVenueShort()
  const gfShort = formatUtrGrandFinalsShort(getUtrGrandFinalsIso())
  const gfVenue = getUtrGrandFinalsVenueShort()

  return (
    <div
      className="border-b border-white/10 bg-brand-deep-water px-4 py-4 md:px-8 lg:px-12"
      aria-label="Season dates and venues"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-3 lg:gap-x-12">
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-1 sm:text-center">
          <span className="font-sans text-eyebrow font-bold uppercase text-white/50">
            Season
          </span>
          <span className="font-sans text-[15px] font-bold text-white">{seasonRange}</span>
        </div>
        <div className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-1 sm:text-center">
          <span className="font-sans text-eyebrow font-bold uppercase text-white/50">
            Saturdays
          </span>
          <span className="font-sans text-[15px] font-bold text-brand-victoria-cove">{satVenue}</span>
        </div>
        <div className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-1 sm:text-center">
          <span className="font-sans text-eyebrow font-bold uppercase text-white/50">
            Sundays
          </span>
          <span className="font-sans text-[15px] font-bold text-brand-sunset-cliff">{sunVenue}</span>
        </div>
        <div className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-1 sm:text-center">
          <span className="font-sans text-eyebrow font-bold uppercase text-white/50">
            Grand Finals
          </span>
          <span className="font-sans text-[15px] font-bold text-brand-thousand-steps" title={gfVenue}>
            {gfShort}
          </span>
        </div>
      </div>
    </div>
  )
}
