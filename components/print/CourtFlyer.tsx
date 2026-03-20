import Image from 'next/image'
import type { FlyerCoach } from '@/lib/flyer-data'
import {
  type CalendarSlot,
  type ScheduleByLocationByDay,
  buildWeekGridForLocation,
  formatGridRowTime,
  getUsedRowRange,
  playerGuidanceFromAges,
  DAY_ORDER,
} from '@/lib/calendar-schedule'
import { ConcurrentScheduleCellBody } from '@/components/schedules/ConcurrentScheduleCellBody'
import type { PrivateRateRow } from '@/lib/programs-data'
import type { CourtFlyerPricingRow, CourtFlyerYouthUtrDetail } from '@/lib/flyer-pricing'
import type { YouthDevelopmentUtrTier } from '@/lib/programs-data'
import {
  FLYER_CONTACT,
  FLYER_CITY_REGISTRATION_QR_PATH,
  FLYER_COURTS,
  FLYER_USTA_NOTE,
  FLYER_ACADEMY_ADDRESS,
  FLYER_OTHER_LOCATIONS_NOTE,
} from '@/lib/flyer-config'
import {
  COURT_FLYER_LOGO_ROW_PX,
  COURT_FLYER_MAX_WIDTH_CLASS,
} from '@/lib/court-flyer-print'

function isConcurrentScheduleCell(slot: Pick<CalendarSlot, 'programName' | 'concurrentSessions'>): boolean {
  return (
    (slot.concurrentSessions != null && slot.concurrentSessions.length > 1) ||
    slot.programName.includes('\n')
  )
}

/** Color-code schedule cells — higher contrast for print; neutral frame when multiple programs share the block. */
function scheduleCellBgClass(slot: Pick<CalendarSlot, 'programName' | 'concurrentSessions'>): string {
  if (isConcurrentScheduleCell(slot)) {
    return 'bg-white shadow-[inset_0_0_0_1px_rgba(27,58,92,0.22)]'
  }
  const programName = slot.programName
  const n = (programName || '').toLowerCase()
  if (n.includes('little') || n.includes('stars')) return 'bg-brand-sandstone'
  if (n.includes('red ball')) return 'bg-lbta-red/45'
  if (n.includes('orange ball')) return 'bg-brand-sunset-cliff/45'
  if (n.includes('green dot') || n.includes('utr green')) return 'bg-brand-tide-pool/40'
  if (n.includes('yellow') || n.includes('yellow ball')) return 'bg-brand-thousand-steps/40'
  if (n.includes('youth') || n.includes('development')) return 'bg-brand-victoria-cove/40'
  if (n.includes('high performance')) return 'bg-brand-pacific-dusk/18'
  if (n.includes('liveball')) return 'bg-brand-victoria-cove/38'
  if (n.includes('cardio')) return 'bg-brand-sunset-cliff/38'
  if (n.includes('adult') || n.includes('intermediate') || n.includes('advanced') || n.includes('beginner'))
    return 'bg-brand-pacific-dusk/12'
  return 'bg-brand-sandstone/70'
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
  adultProgrammingPricing: CourtFlyerPricingRow[]
  monthlyAdultPricing: CourtFlyerPricingRow[]
  camps: CampItem[]
  discountLine: string
  /** Youth Development UTR tiers — from `data/spring-summer-2026.json` (youth-development.utrPlacementBands). */
  youthDevelopmentUtrDetail?: CourtFlyerYouthUtrDetail | null
  /** When set, only this location's schedule is shown; use with otherLocationsNote. */
  locationFilter?: 'Moulton' | 'LBHS' | 'Alta'
  /** Shown when locationFilter is set: where to find classes at other locations. */
  otherLocationsNote?: string
}

export default function CourtFlyer({
  coaches,
  privateRates,
  scheduleByLocation,
  seasonLabel,
  seasonDates,
  weeks,
  juniorPricing,
  adultProgrammingPricing,
  monthlyAdultPricing,
  camps,
  discountLine,
  youthDevelopmentUtrDetail,
  locationFilter,
  otherLocationsNote,
}: CourtFlyerProps) {
  const locationLabels: Record<string, string> = {
    Alta: 'Alta Laguna Park',
    LBHS: 'Laguna Beach High School',
    Moulton: 'Moulton Meadows Park',
  }
  const locationOrder = locationFilter ? [locationFilter] : (['Alta', 'LBHS', 'Moulton'] as const)

  return (
    <div
      className={`court-flyer-print bg-brand-morning-light text-brand-pacific-dusk font-sans min-h-0 w-full ${COURT_FLYER_MAX_WIDTH_CLASS} mx-auto px-4 sm:px-6 [print-color-adjust:exact]`}
    >
      {/*
        LBTA wordmark: use LBTAblktext.png + invert on dark strip (LBTAwhttext.png is not in repo; missing asset showed as broken tiny icon).
      */}
      {/* Fence-sign header: banner + hero + scan CTA */}
      <div className="flyer-logo-strip flex flex-nowrap items-center justify-center gap-6 sm:gap-8 py-3.5 px-6 sm:px-8 bg-brand-deep-water overflow-visible [print-color-adjust:exact]">
        <Image
          src="/logos/LBTAblktext.png"
          alt="Laguna Beach Tennis Academy"
          width={460}
          height={96}
          sizes="(max-width: 640px) 85vw, 300px"
          quality={95}
          style={{ height: COURT_FLYER_LOGO_ROW_PX, width: 'auto', maxWidth: 300, minWidth: 180 }}
          className="flyer-lbta-wordmark object-contain object-center brightness-0 invert opacity-[0.95] [print-color-adjust:exact] shrink-0"
          priority
        />
        <p className="flyer-strip-tagline text-white text-sm sm:text-base font-bold tracking-wider uppercase text-center max-w-[18rem] leading-tight shrink-0">
          Official City of Laguna Beach Partner · Certified Coaching
        </p>
        <div
          className="flyer-city-seal-wrap flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 bg-brand-deep-water"
          style={{ width: 72, height: 72 }}
        >
          <Image
            src="/logos/city-laguna-beach.png"
            alt="City of Laguna Beach"
            width={58}
            height={58}
            style={{ width: 58, height: 58 }}
            className="flyer-city-seal object-contain object-center"
          />
        </div>
      </div>

      <header className="py-5 px-6 sm:px-8 border-b border-brand-pacific-dusk/12">
        <div className="flyer-hero text-center">
          <p className="flyer-hero-title font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-deep-water tracking-tight uppercase max-w-2xl mx-auto leading-tight">
            Free Trial — Try Any Group Class
          </p>
          <div className="section-horizon mx-auto mt-4 opacity-85" aria-hidden="true" />
          <p className="flyer-hero-sub font-headline text-lg sm:text-xl font-semibold text-brand-pacific-dusk mt-3 uppercase tracking-wide">
            Certified City of Laguna Beach Coaching Team
          </p>
        </div>
        <div className="flyer-register-box mt-6 max-w-xl mx-auto rounded-md border-2 border-brand-pacific-dusk/20 bg-white px-5 py-4 shadow-sm [print-color-adjust:exact]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-5 sm:gap-6">
            <div className="flex justify-center shrink-0">
              <a
                href={FLYER_CONTACT.cityClassesRegistrationUrl}
                className="inline-block rounded-md ring-2 ring-brand-pacific-dusk/20 bg-white p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open City of Laguna Beach recreation class registration (QR code destination)"
              >
                <Image
                  src={FLYER_CITY_REGISTRATION_QR_PATH}
                  alt="QR code: City of Laguna Beach recreation classes and registration"
                  width={128}
                  height={128}
                  className="block w-[128px] h-[128px] [print-color-adjust:exact]"
                  sizes="128px"
                  quality={95}
                />
              </a>
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <p className="scan-title text-lg sm:text-xl font-extrabold text-brand-deep-water tracking-wider uppercase">
                Scan to register
              </p>
              <p className="text-base font-semibold text-brand-pacific-dusk mt-2">Group classes · City Recreation</p>
              <p className="text-sm mt-1 text-brand-pacific-dusk/90 leading-snug">
                Register online before your first session.
              </p>
              <a
                href={FLYER_CONTACT.registerUrl}
                className="flyer-register-btn inline-flex items-center justify-center mt-3 min-h-[44px] px-5 py-2 rounded-[2px] bg-black text-white text-xs font-sans font-semibold tracking-[0.1em] uppercase no-underline hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                City registration — Rec1 catalog
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Coaches */}
      <section className="py-6 px-6">
        <h2 className="font-headline text-xl font-semibold text-brand-deep-water">Your Certified Coaching Team</h2>
        <div className="section-horizon mt-2 mb-4 opacity-70" aria-hidden="true" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {coaches.map((c) => (
            <div key={c.slug} className="break-inside-avoid flex flex-col items-center">
              <div className="flyer-coach-photo relative w-full max-w-[140px] mx-auto overflow-hidden rounded-sm bg-brand-sandstone" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={c.imagePath}
                  alt={c.name}
                  fill
                  className="object-cover object-top"
                  sizes="140px"
                />
              </div>
              <p className="font-headline font-semibold text-brand-deep-water mt-2">{c.name}</p>
              <p className="text-xs font-medium text-brand-pacific-dusk/90">{c.flyerTitle}</p>
              <p className="text-xs text-brand-pacific-dusk/80 mt-1 leading-snug">{c.flyerBio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Private lessons table — fixed column widths + row color-coding for readability */}
      <section className="py-5 px-6">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">Private Lessons</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-brand-pacific-dusk/25 bg-brand-sandstone/40">
                <th className="text-left py-2.5 pr-2 font-semibold text-brand-deep-water">Coach</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">60 min</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">90 min</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">10-pack</th>
                <th className="text-right py-2.5 px-2 font-semibold text-brand-deep-water">20-pack</th>
              </tr>
            </thead>
            <tbody>
              {privateRates.map((r, i) => (
                <tr
                  key={r.coach}
                  className={`border-b border-brand-pacific-dusk/10 ${
                    i % 4 === 0 ? 'bg-brand-pacific-dusk/[0.06]' :
                    i % 4 === 1 ? 'bg-brand-sandstone/60' :
                    i % 4 === 2 ? 'bg-brand-victoria-cove/10' : 'bg-brand-sandstone/50'
                  }`}
                >
                  <td className="py-2.5 pr-2">{r.coach}</td>
                  <td className="text-right px-2 tabular-nums">${r.rate_60}</td>
                  <td className="text-right px-2 tabular-nums">${r.rate_90}</td>
                  <td className="text-right px-2 tabular-nums">{r.pack_10 != null ? `$${r.pack_10}` : '—'}</td>
                  <td className="text-right px-2 tabular-nums">{r.pack_20 != null ? `$${r.pack_20}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA block — solid left accent (no white gap), clear hierarchy */}
      <section className="py-5 px-6 bg-brand-sunset-cliff/10 my-0 border-l-4 border-brand-victoria-cove">
        <p className="font-headline font-semibold text-brand-deep-water text-base mb-2">What to do</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <span><strong className="text-brand-deep-water">LBTA</strong> — FREE TRIAL & QUESTIONS {FLYER_CONTACT.phoneTrial}</span>
          <span><strong className="text-brand-deep-water">City of Laguna Beach</strong> — REGISTER {FLYER_CONTACT.phoneRegister}</span>
          <span><strong className="text-brand-deep-water">EMAIL</strong> {FLYER_CONTACT.email}</span>
        </div>
        <p className="text-sm mt-4 text-brand-deep-water font-medium">
          <a href={FLYER_CONTACT.registerUrl} className="text-brand-victoria-cove underline underline-offset-2 font-semibold" target="_blank" rel="noopener noreferrer">
            Register online — City Recreation (Rec1)
          </a>
        </p>
        <p className="text-sm mt-3 text-brand-pacific-dusk/90">{FLYER_ACADEMY_ADDRESS}</p>
      </section>

      {/* Reserved courts */}
      <section className="py-5 px-6 bg-brand-sandstone/40">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">LBTA Reserved Courts</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <ul className="text-sm space-y-1">
          {FLYER_COURTS.map((court) => (
            <li key={court.name}>
              <strong>{court.name}</strong> {court.courts} · {court.address}
            </li>
          ))}
          <li><strong>USTA League</strong> {FLYER_USTA_NOTE}</li>
        </ul>
      </section>

      {/* Schedule by location */}
      <section className="py-6 px-6">
        <div className="flyer-schedule-intro break-inside-avoid">
          <h2 className="font-headline text-lg font-semibold text-brand-deep-water">
            Schedules, Pricing & Registration · {seasonLabel} · {seasonDates}
          </h2>
          <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
          <p className="text-sm mb-3">
            <a href={FLYER_CONTACT.siteUrl} className="text-brand-victoria-cove underline">{FLYER_CONTACT.siteUrl.replace('https://', '')}</a>
            {' · Movement. Craft. Community.'}
          </p>
          <p className="text-[11px] text-brand-deep-water mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-medium" aria-label="Schedule color legend">
            <span className="font-semibold text-brand-deep-water">Legend:</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-[2px] bg-lbta-red/45 border-2 border-brand-pacific-dusk/35 shrink-0" aria-hidden /> Junior (Red/Orange/Green)</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-[2px] bg-brand-victoria-cove/40 border-2 border-brand-pacific-dusk/35 shrink-0" aria-hidden /> Youth development</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-[2px] bg-brand-victoria-cove/38 border-2 border-brand-pacific-dusk/35 shrink-0" aria-hidden /> LiveBall</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-[2px] bg-brand-pacific-dusk/14 border-2 border-brand-pacific-dusk/35 shrink-0" aria-hidden /> Adult programming</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-[2px] bg-brand-sunset-cliff/38 border-2 border-brand-pacific-dusk/35 shrink-0" aria-hidden /> Cardio</span>
            <span className="inline-flex items-center gap-2 w-full sm:w-auto sm:ml-1 text-[10px] text-brand-pacific-dusk font-normal"><span className="inline-block w-4 h-4 rounded-[2px] bg-white border-2 border-brand-pacific-dusk/35 shrink-0 shadow-[inset_0_0_0_1px_rgba(27,58,92,0.12)]" aria-hidden /> One box = one class (time, name, level or ages in cell)</span>
          </p>
          {otherLocationsNote ? (
            <p className="text-xs text-brand-pacific-dusk/90 italic mb-2">{otherLocationsNote}</p>
          ) : null}
        </div>
        {locationOrder.map((loc) => {
          const byDay = scheduleByLocation[loc]
          if (!byDay) return null
          const courtLabelByLoc: Record<string, string> = {
            Moulton: FLYER_COURTS[0].courts,
            Alta: FLYER_COURTS[1].courts,
            LBHS: FLYER_COURTS[2].courts,
          }
          const courtLabel = courtLabelByLoc[loc] ?? 'Courts 1 & 2'
          const grid = buildWeekGridForLocation(byDay)
          const range = getUsedRowRange(grid)
          const rowsToShow = range ? grid.slice(range.min, range.max + 1) : []
          return (
            <div key={loc} className="flyer-schedule-loc mb-4 break-inside-avoid">
              <h3 className="font-headline font-semibold text-brand-deep-water text-sm uppercase mb-1">
                {locationLabels[loc] ?? loc} — {courtLabel}
              </h3>
              <p className="text-xs text-brand-pacific-dusk/90 mb-2">Group classes at this location</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-brand-pacific-dusk/20" aria-label={`Weekly schedule for ${locationLabels[loc] ?? loc}`}>
                  <thead>
                    <tr className="border-b-2 border-brand-pacific-dusk/30 bg-brand-sandstone/50">
                      <th scope="col" className="text-left py-2 pr-2 pl-2 w-[4.5rem] font-semibold text-brand-deep-water text-xs">Time</th>
                      {DAY_ORDER.map((d) => (
                        <th key={d} scope="col" className="text-center py-2 px-1 font-semibold text-brand-deep-water border-l border-brand-pacific-dusk/15 text-xs">{d.slice(0, 3)}</th>
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
                            <th scope="row" className="py-1.5 pl-2 pr-1.5 whitespace-nowrap text-left text-[11px] font-semibold text-brand-deep-water bg-brand-sandstone/30 border-r border-brand-pacific-dusk/10">
                              {formatGridRowTime(rowIndex)}
                            </th>
                            {DAY_ORDER.map((_, dayIndex) => {
                              const cell = row[dayIndex]
                              if (cell === 'covered') return null
                              if (cell === null) {
                                return <td key={dayIndex} className="py-1.5 px-1 border-l border-brand-pacific-dusk/10 align-top min-h-[28px]" />
                              }
                              const { slot, rowSpan } = cell
                              const concurrent = isConcurrentScheduleCell(slot)
                              const structured =
                                concurrent &&
                                slot.concurrentSessions &&
                                slot.concurrentSessions.length > 1
                              const display =
                                !concurrent && slot.programName.length > 36
                                  ? slot.programName.slice(0, 34) + '…'
                                  : slot.programName
                              const bgClass = scheduleCellBgClass(slot)
                              const levelLine = playerGuidanceFromAges(slot.ages)
                              return (
                                <td
                                  key={dayIndex}
                                  rowSpan={rowSpan}
                                  className={`py-2 ${structured ? 'pl-0' : 'pl-2'} pr-2 border-l border-brand-pacific-dusk/15 align-top ${bgClass}`}
                                >
                                  {structured ? (
                                    <ConcurrentScheduleCellBody
                                      sessions={slot.concurrentSessions!}
                                      blockTime={slot.time}
                                      variant="flyer"
                                    />
                                  ) : (
                                    <>
                                      <span
                                        className={`block text-[11px] font-semibold text-brand-deep-water leading-snug${concurrent ? ' whitespace-pre-line' : ''}`}
                                      >
                                        {display}
                                      </span>
                                      {!concurrent ? (
                                        <>
                                          {levelLine ? (
                                            <span className="block text-[9px] font-medium text-brand-pacific-dusk/90 mt-0.5 leading-snug">
                                              {levelLine}
                                            </span>
                                          ) : null}
                                          <span className="block text-[10px] font-medium text-brand-pacific-dusk mt-1 tabular-nums">
                                            {slot.time}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="block text-[10px] font-medium text-brand-pacific-dusk mt-1 tabular-nums">
                                            {slot.time}
                                          </span>
                                      )}
                                    </>
                                  )}
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
      <section className="py-5 px-6 bg-brand-sandstone/30">
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
      <section className="py-6 px-6">
        <h2 className="font-headline text-lg font-semibold text-brand-deep-water">Program Pricing</h2>
        <div className="section-horizon mt-2 mb-3 opacity-70" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-brand-deep-water mt-3 mb-1.5">Junior & Competitive</h3>
        {youthDevelopmentUtrDetail ? (
          <div
            className="break-inside-avoid rounded-sm border border-brand-pacific-dusk/15 bg-brand-sandstone/40 px-3 py-2.5 mt-2 mb-3"
            role="region"
            aria-label="Youth Development UTR placement"
          >
            <p className="text-xs font-semibold text-brand-deep-water font-headline">Youth Development — UTR placement</p>
            <p className="text-[11px] mt-1.5 text-brand-pacific-dusk/90 leading-snug">{youthDevelopmentUtrDetail.intro}</p>
            <ul className="mt-2 space-y-2 text-[11px] text-brand-pacific-dusk/90 leading-snug list-none p-0 m-0">
              {youthDevelopmentUtrDetail.tiers.map((t: YouthDevelopmentUtrTier) => (
                <li key={t.label}>
                  <span className="font-semibold text-brand-deep-water">{t.label}</span>
                  <span className="text-brand-pacific-dusk/85"> · {t.utrRange}</span>
                  <span className="block mt-0.5 text-brand-pacific-dusk/90">{t.focus}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] mt-2 text-brand-pacific-dusk/90 leading-snug">{youthDevelopmentUtrDetail.structure}</p>
            <p className="text-[11px] mt-1.5 text-brand-pacific-dusk/90 leading-snug">{youthDevelopmentUtrDetail.advancement}</p>
            {youthDevelopmentUtrDetail.pricingNote ? (
              <p className="text-[10px] mt-2 text-brand-pacific-dusk/75 leading-snug">{youthDevelopmentUtrDetail.pricingNote}</p>
            ) : null}
          </div>
        ) : null}
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
        <h3 className="text-sm font-semibold text-brand-deep-water mt-3 mb-1.5">Adult programming</h3>
        <p className="text-xs text-brand-pacific-dusk/85 mb-1.5">Session-based group classes (per season).</p>
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
            {adultProgrammingPricing.map((r) => (
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
        <h3 className="text-sm font-semibold text-brand-deep-water mt-4 mb-1.5">Monthly classes for adults</h3>
        <p className="text-xs text-brand-pacific-dusk/85 mb-1.5">Per-month membership; columns show once- or twice-weekly options.</p>
        <table className="w-full text-sm border-collapse" aria-label="Monthly adult class pricing">
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
            {monthlyAdultPricing.map((r) => (
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
      <footer className="py-5 px-6 border-t border-brand-pacific-dusk/20 bg-brand-deep-water text-white/90 text-center text-sm">
        <div className="flex justify-center pb-3 mb-3 border-b border-white/10">
          <Image
            src="/logos/LBTAblktext.png"
            alt=""
            width={220}
            height={56}
            sizes="220px"
            quality={95}
            className="h-10 w-auto max-w-[220px] object-contain object-center brightness-0 invert opacity-95 [print-color-adjust:exact]"
            aria-hidden
          />
        </div>
        <p><strong className="text-white">REGISTER</strong> {FLYER_CONTACT.phoneRegister}</p>
        <p className="mt-2">
          <a href={FLYER_CONTACT.registerUrl} className="text-brand-victoria-cove underline underline-offset-2 text-sm" target="_blank" rel="noopener noreferrer">
            City online registration
          </a>
        </p>
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
