'use client'

import { useState, useCallback } from 'react'
import type { SeasonKey } from '@/lib/season-utils'
import {
  DAY_ORDER,
  LOCATION_KEYS,
  type ScheduleByLocationByDay,
} from '@/lib/calendar-schedule'

const SEASON_KEYS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall']
const SEASON_LABELS: Record<SeasonKey, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
}

const LOCATION_LABELS: Record<string, string> = {
  Moulton: 'Moulton Meadows Park',
  Alta: 'Alta Laguna Park',
  LBHS: 'Laguna Beach High School',
}

export type CalendarSeasonData = {
  scheduleByLocationByDay: ScheduleByLocationByDay
  seasonLabel: string
  seasonDates: string
}

interface ScheduleCalendarViewProps {
  /** Data for each season so switching season doesn't require refetch. */
  calendarBySeason: Record<SeasonKey, CalendarSeasonData>
  initialSeason: SeasonKey
  onSeasonChange?: (season: SeasonKey) => void
  /** When true, show season selector and location filter (for full calendar page). */
  showFilters?: boolean
  /** When true, wrap in print-only visible block and show Print CTA. */
  printable?: boolean
}

export default function ScheduleCalendarView({
  calendarBySeason,
  initialSeason,
  onSeasonChange,
  showFilters = true,
  printable = true,
}: ScheduleCalendarViewProps) {
  const [season, setSeason] = useState<SeasonKey>(initialSeason)
  const [locationFilter, setLocationFilter] = useState<string>('')

  const { scheduleByLocationByDay, seasonLabel, seasonDates } =
    calendarBySeason[season] ?? calendarBySeason.winter

  const handleSeason = useCallback(
    (key: SeasonKey) => {
      setSeason(key)
      onSeasonChange?.(key)
    },
    [onSeasonChange]
  )

  const locationsToShow =
    locationFilter && LOCATION_KEYS.includes(locationFilter)
      ? [locationFilter]
      : LOCATION_KEYS.filter((loc) => scheduleByLocationByDay[loc])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className={printable ? 'schedule-calendar-print' : ''}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title and season dates */}
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-2">
          Schedule by location
        </p>
        <h1 className="font-headline text-[28px] md:text-[40px] font-medium text-brand-pacific-dusk leading-tight mb-1">
          {seasonLabel} Schedule
        </h1>
        <p className="font-sans text-[15px] text-brand-pacific-dusk/70 mb-6">
          {seasonDates}
        </p>

        {showFilters && (
          <>
            {/* Season tabs */}
            <div
              role="tablist"
              aria-label="Season"
              className="flex flex-wrap gap-2 mb-4"
            >
              {SEASON_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={season === key}
                  tabIndex={season === key ? 0 : -1}
                  onClick={() => handleSeason(key)}
                  className={`
                    font-sans text-[13px] font-medium tracking-[0.05em] px-5 py-3 rounded-[2px]
                    transition-all duration-200 min-h-[48px]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2
                    ${season === key ? 'bg-black text-white' : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk'}
                  `}
                >
                  {SEASON_LABELS[key]}
                </button>
              ))}
            </div>

            {/* Location filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="font-sans text-[13px] text-brand-pacific-dusk/70 self-center mr-2">
                Location:
              </span>
              {['', ...LOCATION_KEYS].map((loc) => (
                <button
                  key={loc || 'all'}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  className={`
                    font-sans text-[13px] font-medium px-4 py-2 rounded-[2px] min-h-[48px]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2
                    ${locationFilter === loc ? 'bg-brand-pacific-dusk text-white' : 'bg-white border border-black/10 text-brand-pacific-dusk hover:border-black/20'}
                  `}
                >
                  {loc || 'All'}
                </button>
              ))}
            </div>
          </>
        )}

        {printable && showFilters && (
          <div className="mb-6 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-6 py-3 rounded-[2px] transition-all duration-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
            >
              Print / Save as PDF
            </button>
          </div>
        )}

        {/* By location → by day */}
        <div className="space-y-10">
          {locationsToShow.map((loc) => {
            const byDay = scheduleByLocationByDay[loc]
            if (!byDay) return null
            const locationName = LOCATION_LABELS[loc] ?? loc
            return (
              <section key={loc} className="break-inside-avoid">
                <div className="inline-block font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-white bg-brand-pacific-dusk px-4 py-2 rounded-[2px] mb-4">
                  {locationName}
                </div>
                <div className="space-y-6">
                  {DAY_ORDER.map((day) => {
                    const slots = byDay[day]
                    if (!slots?.length) return null
                    return (
                      <div key={day}>
                        <h3 className="font-headline text-[18px] md:text-[20px] font-medium text-brand-pacific-dusk mb-2">
                          {day}
                        </h3>
                        <ul className="space-y-2 list-none">
                          {slots.map((slot, i) => (
                            <li
                              key={`${slot.programId}-${slot.time}-${i}`}
                              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-[14px] text-brand-pacific-dusk/90 py-1.5 border-b border-black/[0.06] last:border-0"
                            >
                              <span className="font-medium text-brand-pacific-dusk">
                                {slot.time}
                              </span>
                              <span>
                                {slot.programName}
                                {slot.ages ? ` (${slot.ages})` : ''}
                              </span>
                              <span className="text-brand-pacific-dusk/60 text-[13px]">
                                {slot.duration}
                                {slot.coach ? ` · ${slot.coach}` : ''}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {printable && !showFilters && (
          <div className="mt-8 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-6 py-3 rounded-[2px] transition-all duration-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
            >
              Print / Save as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
