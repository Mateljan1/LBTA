import Image from 'next/image'
import type { FlyerCoach } from '@/lib/flyer-data'
import {
  type ScheduleByLocationByDay,
  buildWeekGridForLocation,
  formatGridRowTime,
  getUsedRowRange,
  DAY_ORDER,
} from '@/lib/calendar-schedule'
import type { PrivateRateRow } from '@/lib/programs-data'
import type { CourtFlyerPricingRow } from '@/lib/flyer-pricing'
import { FLYER_CONTACT, FLYER_COURTS, FLYER_USTA_NOTE, FLYER_ACADEMY_ADDRESS } from '@/lib/flyer-config'
import { COURT_FLYER_MAX_WIDTH_CLASS } from '@/lib/court-flyer-print'

/** Color-code schedule cells by program type — strong tints for quick scanning and print clarity. */
function scheduleCellBgClass(programName: string): string {
  const n = (programName || '').toLowerCase()
  if (n.includes('little') || n.includes('stars')) return 'bg-brand-sandstone'
  if (n.includes('red ball')) return 'bg-lbta-red/30'
  if (n.includes('orange ball')) return 'bg-brand-sunset-cliff/35'
  if (n.includes('green dot') || n.includes('utr green')) return 'bg-brand-tide-pool/35'
  if (n.includes('yellow') || n.includes('yellow ball')) return 'bg-brand-thousand-steps/30'
  if (n.includes('youth') || n.includes('development')) return 'bg-brand-victoria-cove/30'
  if (n.includes('high performance')) return 'bg-brand-pacific-dusk/25'
  if (n.includes('liveball')) return 'bg-brand-victoria-cove/28'
  if (n.includes('cardio')) return 'bg-brand-sunset-cliff/28'
  if (n.includes('adult') || n.includes('intermediate') || n.includes('advanced') || n.includes('beginner')) return 'bg-brand-pacific-dusk/22'
  return 'bg-brand-sandstone/60'
}

interface CampItem {
  label: string
  dates: string
  ages: string
  price: string
  location: string
}

interface CourtFlyerProps {
  coaches: FlyerCoach[]
  privateRates: PrivateRateRow[]
  scheduleByLocation: ScheduleByLocationByDay
  seasonLabel: string
  seasonDates: string
  weeks: number
  juniorPricing: CourtFlyerPricingRow[]
  adultPricing: CourtFlyerPricingRow[]
  camps: CampItem[]
  discountLine: string
}

export default function CourtFlyer({
  coaches,
  privateRates,
  scheduleByLocation,
  seasonLabel,
  seasonDates,
  weeks,
  juniorPricing,
  adultPricing,
  camps,
  discountLine,
}: CourtFlyerProps) {
  const locationLabels: Record<string, string> = {
    Alta: 'Alta Laguna Park',
    LBHS: 'Laguna Beach High School',
    Moulton: 'Moulton Meadows Park',
  }
  const locationOrder = ['Alta', 'LBHS', 'Moulton'] as const

  return (
    <div
      className={`court-flyer-print bg-brand-morning-light text-brand-pacific-dusk font-sans min-h-0 w-full ${COURT_FLYER_MAX_WIDTH_CLASS} mx-auto px-4 sm:px-6 [print-color-adjust:exact]`}
    >
      {/*
        No min-h-screen: avoids a tall empty canvas on PDF/print (Ledger + fixed format = huge blank band).
        Wordmark: match Header ratio (w-auto, object-contain) — do not lock mismatched width×height.
      */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 py-5 px-6 bg-brand-deep-water">
        <div className="flex items-center justify-center">
          <Image
            src="/logos/LBTAwhttext.png"
            alt="Laguna Beach Tennis Academy"
            width={280}
            height={72}
            sizes="(max-width: 640px) 240px, 280px"
            quality={95}
            className="h-11 sm:h-[52px] w-auto max-w-[min(85vw,300px)] object-contain object-center flex-shrink-0"
            priority
          />
        </div>
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 bg-brand-deep-water">
          <Image
            src="/logos/city-laguna-beach.png"
            alt="City of Laguna Beach"
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-contain object-center"
          />
        </div>
      </div>

      {/* Header — single hero line, supporting copy, CTA (no clip: padding + wrap) */}
      <header className="py-8 px-6 sm:px-8 border-b border-brand-pacific-dusk/12">
        <h1 className="font-headline text-2xl md:text-3xl font-semibold text-brand-deep-water tracking-tight uppercase text-center max-w-2xl mx-auto px-1">
          Certified City of Laguna Beach Coaching Team
        </h1>
        <div className="section-horizon mx-auto mt-3 opacity-80" aria-hidden="true" />
        <p className="text-center text-sm mt-4 text-brand-pacific-dusk/90">
          Only LBTA coaches are authorized to teach at City of Laguna Beach tennis courts.
        </p>
        <p className="text-center font-bold mt-4 text-brand-deep-water text-base tracking-wide">FREE TRIAL — Try Any Group Class</p>
      </header>

      {/* Coaches */}
      <section className="py-8 px-6">
        <h2 className="font-headline text-xl font-semibold text-brand-deep-water">Your Certified Coaching Team</h2>
        <div className="section-horizon mt-2 mb-5 opacity-70" aria-hidden="true" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coaches.map((c) => (
            <div key={c.slug} className="break-inside-avoid flex flex-col items-center">
              <div className="relative w-full max-w-[160px] mx-auto overflow-hidden rounded-sm bg-brand-sandstone" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={c.imagePath}
                  alt={c.name}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                />
              </div>
              <p className="font-headline font-semibold text-brand-deep-water mt-2">{c.name}</p>
              <p className="text-xs font-medium text-brand-pacific-dusk/90">{c.flyerTitle}</p>
              <p className="text-xs text-brand-pacific-dusk/80 mt-1 leading-snug">{c.flyerBio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Private lessons table */}
      <section className="py-6 px-6">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">Private Lessons</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-pacific-dusk/25 bg-brand-sandstone/40">
                <th className="text-left py-2.5 pr-4 font-semibold text-brand-deep-water">Coach</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">60 min</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">90 min</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">10-pack</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">20-pack</th>
              </tr>
            </thead>
            <tbody>
              {privateRates.map((r) => (
                <tr key={r.coach} className="border-b border-brand-pacific-dusk/10">
                  <td className="py-2.5 pr-4">{r.coach}</td>
                  <td className="text-right px-2">${r.rate_60}</td>
                  <td className="text-right px-2">${r.rate_90}</td>
                  <td className="text-right px-2">${r.pack_10 ?? '—'}</td>
                  <td className="text-right px-2">${r.pack_20 ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA block — Brand Guide accent: gradient left border, clear hierarchy */}
      <section className="section-quote py-6 px-6 bg-brand-sunset-cliff/10 my-0">
        <p className="font-headline font-semibold text-brand-deep-water text-lg mb-3">What to do</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <span><strong className="text-brand-deep-water">FREE TRIAL</strong> {FLYER_CONTACT.phoneTrial}</span>
          <span><strong className="text-brand-deep-water">REGISTER</strong> {FLYER_CONTACT.phoneRegister}</span>
          <span><strong className="text-brand-deep-water">EMAIL</strong> {FLYER_CONTACT.email}</span>
        </div>
        <p className="text-sm mt-3 text-brand-pacific-dusk/90">{FLYER_ACADEMY_ADDRESS}</p>
      </section>

      {/* Reserved courts */}
      <section className="py-6 px-6 bg-brand-sandstone/40">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">LBTA Reserved Courts</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <ul className="text-sm space-y-1">
          {FLYER_COURTS.map((court) => (
            <li key={court.name}>
              <strong>{court.name}</strong> {court.courts} · {court.address}
            </li>
          ))}
        </ul>
        <p className="text-xs mt-2 text-brand-pacific-dusk/80">{FLYER_USTA_NOTE}</p>
      </section>

      {/* Schedule by location */}
      <section className="py-8 px-6">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">
          Schedules, Pricing & Registration · {seasonLabel} · {seasonDates}
        </h2>
        <div className="section-horizon mt-2 mb-4 opacity-70" aria-hidden="true" />
        <p className="text-sm mb-4">
          <a href={FLYER_CONTACT.siteUrl} className="text-brand-victoria-cove underline">{FLYER_CONTACT.siteUrl.replace('https://', '')}</a>
          {' · Movement. Craft. Community.'}
        </p>
        <p className="text-[11px] text-brand-pacific-dusk/90 mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5" aria-label="Schedule color legend">
          <span className="font-semibold text-brand-deep-water">Legend:</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-lbta-red/30 border border-brand-pacific-dusk/20" aria-hidden /> Junior (Red/Orange/Green)</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-brand-victoria-cove/30 border border-brand-pacific-dusk/20" aria-hidden /> Youth · LiveBall</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-brand-pacific-dusk/22 border border-brand-pacific-dusk/20" aria-hidden /> Adult</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-brand-sunset-cliff/28 border border-brand-pacific-dusk/20" aria-hidden /> Cardio</span>
        </p>
        {locationOrder.map((loc) => {
          const byDay = scheduleByLocation[loc]
          if (!byDay) return null
          const courtLabel = loc === 'Moulton' ? 'Court 2' : loc === 'LBHS' ? 'Courts 5 & 6' : 'Courts 1 & 2'
          const grid = buildWeekGridForLocation(byDay)
          const range = getUsedRowRange(grid)
          const rowsToShow = range ? grid.slice(range.min, range.max + 1) : []
          return (
            <div key={loc} className="mb-6 break-inside-avoid">
              <h3 className="font-headline font-semibold text-brand-deep-water text-sm uppercase mb-1">
                {locationLabels[loc] ?? loc} — {courtLabel}
              </h3>
              <p className="text-xs text-brand-pacific-dusk/90 mb-2">Group classes at this location</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-brand-pacific-dusk/20" aria-label={`Weekly schedule for ${locationLabels[loc] ?? loc}`}>
                  <thead>
                    <tr className="border-b-2 border-brand-pacific-dusk/30 bg-brand-sandstone/50">
                      <th scope="col" className="text-left py-2.5 pr-3 pl-3 w-24 font-semibold text-brand-deep-water">Time</th>
                      {DAY_ORDER.map((d) => (
                        <th key={d} scope="col" className="text-center py-2.5 px-2 font-semibold text-brand-deep-water border-l border-brand-pacific-dusk/15">{d.slice(0, 3)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!range ? (
                      <tr>
                        <td colSpan={8} className="py-4 text-center text-brand-pacific-dusk/70">No sessions this week</td>
                      </tr>
                    ) : (
                      rowsToShow.map((row, i) => {
                        const rowIndex = range.min + i
                        return (
                          <tr key={rowIndex} className="border-b border-brand-pacific-dusk/12">
                            <th scope="row" className="py-2 pl-3 pr-2 whitespace-nowrap text-left text-[12px] font-semibold text-brand-deep-water bg-brand-sandstone/30 border-r border-brand-pacific-dusk/10">
                              {formatGridRowTime(rowIndex)}
                            </th>
                            {DAY_ORDER.map((_, dayIndex) => {
                              const cell = row[dayIndex]
                              if (cell === 'covered') return null
                              if (cell === null) {
                                return <td key={dayIndex} className="py-2 px-2 border-l border-brand-pacific-dusk/10 align-top min-h-[32px]" />
                              }
                              const { slot, rowSpan } = cell
                              const display = slot.programName.length > 32 ? slot.programName.slice(0, 30) + '…' : slot.programName
                              const bgClass = scheduleCellBgClass(slot.programName)
                              return (
                                <td
                                  key={dayIndex}
                                  rowSpan={rowSpan}
                                  className={`py-2 pl-3 pr-2 border-l border-brand-pacific-dusk/10 align-top ${bgClass}`}
                                >
                                  <span className="font-medium text-brand-deep-water leading-snug">{display}</span>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>

      {/* Camps */}
      <section className="py-6 px-6 bg-brand-sandstone/30">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">Camps</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <ul className="text-sm space-y-2">
          {camps.map((c) => (
            <li key={c.label}>
              <strong>{c.label}</strong> {c.dates} · Ages {c.ages} · {c.price}
              {c.location ? <span className="text-brand-pacific-dusk/90"> · {c.location}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Program pricing */}
      <section className="py-8 px-6">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">Program Pricing</h2>
        <div className="section-horizon mt-2 mb-4 opacity-70" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-brand-deep-water mt-4 mb-2">Junior & Competitive</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-brand-pacific-dusk/25 bg-brand-sandstone/40">
              <th className="text-left py-2 pr-2 font-semibold text-brand-deep-water">Program</th>
              <th className="text-left py-2 px-2 w-24 font-semibold text-brand-deep-water">Location</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">1x/wk</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">2x/wk</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">Drop-in</th>
            </tr>
          </thead>
          <tbody>
            {juniorPricing.map((r) => (
              <tr key={r.name} className="border-b border-brand-pacific-dusk/10">
                <td className="py-2 pr-2">{r.name} · {r.duration}</td>
                <td className="py-2 px-2 text-brand-pacific-dusk/90">{r.location}</td>
                <td className="text-right px-2">{r.price_1x}</td>
                <td className="text-right px-2">{r.price_2x ?? '—'}</td>
                <td className="text-right px-2">{r.dropIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-sm font-semibold text-brand-deep-water mt-4 mb-2">Adult & Fitness</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-brand-pacific-dusk/25 bg-brand-sandstone/40">
              <th className="text-left py-2 pr-2 font-semibold text-brand-deep-water">Program</th>
              <th className="text-left py-2 px-2 w-24 font-semibold text-brand-deep-water">Location</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">1x/wk</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">2x/wk</th>
              <th className="text-right py-2 px-2 font-semibold text-brand-deep-water">Drop-in</th>
            </tr>
          </thead>
          <tbody>
            {adultPricing.map((r) => (
              <tr key={r.name} className="border-b border-brand-pacific-dusk/10">
                <td className="py-2 pr-2">{r.name} · {r.duration}</td>
                <td className="py-2 px-2 text-brand-pacific-dusk/90">{r.location}</td>
                <td className="text-right px-2">{r.price_1x}</td>
                <td className="text-right px-2">{r.price_2x ?? '—'}</td>
                <td className="text-right px-2">{r.dropIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-3 text-brand-pacific-dusk/80">{discountLine}</p>
      </section>

      {/* Footer — wordmark repeats brand mark (PDF/print often crops top; footer carries identity) */}
      <footer className="py-8 px-6 border-t border-brand-pacific-dusk/20 bg-brand-deep-water text-white/90 text-center text-sm">
        <div className="flex justify-center pb-4 mb-4 border-b border-white/10">
          <Image
            src="/logos/LBTAwhttext.png"
            alt=""
            width={220}
            height={56}
            sizes="220px"
            quality={95}
            className="h-9 sm:h-10 w-auto max-w-[220px] object-contain object-center opacity-95"
            aria-hidden
          />
        </div>
        <p><strong className="text-white">REGISTER</strong> {FLYER_CONTACT.phoneRegister}</p>
        <p className="mt-1"><strong className="text-white">FREE TRIAL & QUESTIONS</strong> {FLYER_CONTACT.phoneTrial}</p>
        <p className="mt-1">{FLYER_CONTACT.email}</p>
        <p className="mt-1">{FLYER_ACADEMY_ADDRESS}</p>
        <p className="mt-2">
          <a href={FLYER_CONTACT.siteUrl} className="text-brand-victoria-cove underline underline-offset-2">{FLYER_CONTACT.siteUrl.replace('https://', '')}</a>
        </p>
        <p className="font-headline text-white mt-2">Movement. Craft. Community.</p>
        <div className="section-horizon mx-auto mt-3 mb-1 opacity-90" aria-hidden="true" />
        <p className="text-xs uppercase mt-2 text-white/80">Official City Partner</p>
        <p className="font-headline font-semibold text-white">Laguna Beach Tennis Academy</p>
        <p className="text-xs mt-1 text-white/80">{seasonLabel} · {seasonDates} · {weeks} Weeks</p>
      </footer>
    </div>
  )
}
