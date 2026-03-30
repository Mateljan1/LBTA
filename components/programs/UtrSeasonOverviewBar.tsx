import {
  formatUtrGrandFinalsShort,
  formatUtrSeasonRangeDisplay,
  getUtrGrandFinalsIso,
  getUtrSaturdayVenueShort,
  getUtrSundayVenueShort,
} from '@/lib/utr-match-play'

/**
 * Light strip above the week-at-a-glance banner — season dates and venues at a scan.
 */
export default function UtrSeasonOverviewBar() {
  const season = formatUtrSeasonRangeDisplay()
  const sat = getUtrSaturdayVenueShort()
  const sun = getUtrSundayVenueShort()
  const gf = formatUtrGrandFinalsShort(getUtrGrandFinalsIso())

  const rows = [
    { label: 'Season', value: season },
    { label: 'Saturdays', value: sat },
    { label: 'Sundays', value: sun },
    { label: 'Grand Finals', value: gf },
  ]

  return (
    <section
      aria-label="Season overview"
      className="border-b border-brand-pacific-dusk/[0.08] bg-brand-sandstone/45"
    >
      <div className="container-lbta py-5 md:py-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 md:gap-8">
          {rows.map((row) => (
            <div key={row.label}>
              <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-pacific-dusk/45">
                {row.label}
              </p>
              <p className="mt-1 font-sans text-[13px] font-medium leading-snug text-brand-pacific-dusk md:text-[14px]">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
