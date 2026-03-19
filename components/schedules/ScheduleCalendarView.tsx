'use client'

import { useState, useCallback, useMemo } from 'react'
import type { SeasonKey } from '@/lib/season-utils'
import { SEASON_KEYS, SEASON_LABELS } from '@/lib/season-utils'
import {
  DAY_ORDER,
  LOCATION_KEYS,
  buildWeekGridForLocation,
  formatGridRowTime,
  type ScheduleByLocationByDay,
} from '@/lib/calendar-schedule'

const EMPTY_SCHEDULE: ScheduleByLocationByDay = {}

function getUsedRowRange(
  grid: ReturnType<typeof buildWeekGridForLocation>
): { min: number; max: number } | null {
  let minR = grid.length
  let maxR = -1
  grid.forEach((row, r) => {
    const hasContent = row.some((c) => c !== null && c !== 'covered')
    if (hasContent) {
      minR = Math.min(minR, r)
      maxR = Math.max(maxR, r)
    }
  })
  return maxR >= minR ? { min: minR, max: maxR } : null
}

const LOCATION_LABELS: Record<string, string> = {
  Moulton: 'Moulton Meadows Park',
  Alta: 'Alta Laguna Park',
  LBHS: 'Laguna Beach High School',
}

/** Shown when Alta has no sessions (e.g. resurfacing). Empty string = no note. */
const ALTA_EMPTY_NOTE = 'Courts closed for resurfacing March 16–27.'

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
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
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  const fallbackSeason =
    SEASON_KEYS.find((k) => calendarBySeason[k]) ?? initialSeason
  const seasonData =
    calendarBySeason[season] ?? calendarBySeason[fallbackSeason]
  const scheduleByLocationByDay =
    seasonData?.scheduleByLocationByDay ?? EMPTY_SCHEDULE
  const seasonLabel = seasonData?.seasonLabel ?? ''
  const seasonDates = seasonData?.seasonDates ?? ''

  const handleSeason = useCallback(
    (key: SeasonKey) => {
      setSeason(key)
      onSeasonChange?.(key)
    },
    [onSeasonChange]
  )

  const handleSeasonKeyDown = useCallback(
    (e: React.KeyboardEvent, numTabs: number) => {
      if (numTabs <= 0) return
      let nextKey: SeasonKey | null = null
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const i = SEASON_KEYS.indexOf(season)
        nextKey = SEASON_KEYS[i <= 0 ? numTabs - 1 : i - 1]
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const i = SEASON_KEYS.indexOf(season)
        nextKey = SEASON_KEYS[i >= numTabs - 1 ? 0 : i + 1]
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextKey = SEASON_KEYS[0]
      } else if (e.key === 'End') {
        e.preventDefault()
        nextKey = SEASON_KEYS[numTabs - 1]
      }
      if (nextKey != null) {
        setSeason(nextKey)
        onSeasonChange?.(nextKey)
      }
    },
    [season, onSeasonChange]
  )

  const locationsToShow = useMemo(
    () =>
      locationFilter && LOCATION_KEYS.includes(locationFilter)
        ? [locationFilter]
        : LOCATION_KEYS.filter((loc) => scheduleByLocationByDay[loc]),
    [locationFilter, scheduleByLocationByDay]
  )

  const gridsByLocation = useMemo(() => {
    const out: Record<string, ReturnType<typeof buildWeekGridForLocation>> = {}
    for (const loc of locationsToShow) {
      const byDay = scheduleByLocationByDay[loc]
      out[loc] = buildWeekGridForLocation(byDay ?? {})
    }
    return out
  }, [locationsToShow, scheduleByLocationByDay])

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
        <h1 className="font-headline text-[28px] md:text-[40px] font-medium text-brand-pacific-dusk leading-tight mb-2">
          {seasonLabel} Schedule
        </h1>
        <p className="font-sans text-[15px] md:text-[16px] text-brand-pacific-dusk/80 mb-8 md:mb-10">
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
                  id={`season-tab-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={season === key}
                  aria-controls="season-schedule-panel"
                  tabIndex={season === key ? 0 : -1}
                  onClick={() => handleSeason(key)}
                  onKeyDown={(e) => handleSeasonKeyDown(e, SEASON_KEYS.length)}
                  className={`
                    font-sans text-[13px] font-medium tracking-[0.05em] px-5 py-3 rounded-[2px]
                    transition-all duration-200 min-h-[48px]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2
                    ${season === key ? 'bg-black text-white' : 'bg-brand-sandstone/80 text-brand-pacific-dusk/80 hover:text-brand-pacific-dusk'}
                  `}
                >
                  {SEASON_LABELS[key]}
                </button>
              ))}
            </div>

            {/* Location + View filters */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[12px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.08em]">
                  Location
                </span>
                {['', ...LOCATION_KEYS].map((loc) => (
                  <button
                    key={loc || 'all'}
                    type="button"
                    aria-pressed={locationFilter === loc}
                    onClick={() => setLocationFilter(loc)}
                    className={`
                      font-sans text-[13px] font-medium px-4 py-2.5 rounded-[2px] min-h-[48px] transition-colors duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2
                      ${locationFilter === loc ? 'bg-brand-pacific-dusk text-white' : 'bg-white border border-black/10 text-brand-pacific-dusk hover:border-black/15'}
                    `}
                  >
                    {loc || 'All'}
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-black/10 hidden sm:block" aria-hidden />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[12px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.08em]">
                  View
                </span>
                <button
                  type="button"
                  aria-pressed={viewMode === 'calendar'}
                  onClick={() => setViewMode('calendar')}
                  className={`font-sans text-[13px] font-medium px-4 py-2.5 rounded-[2px] min-h-[48px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 ${viewMode === 'calendar' ? 'bg-black text-white' : 'bg-white border border-black/10 text-brand-pacific-dusk hover:border-black/15'}`}
                >
                  Calendar
                </button>
                <button
                  type="button"
                  aria-pressed={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  className={`font-sans text-[13px] font-medium px-4 py-2.5 rounded-[2px] min-h-[48px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white border border-black/10 text-brand-pacific-dusk hover:border-black/15'}`}
                >
                  List
                </button>
              </div>
            </div>
          </>
        )}

        {printable && (
          <div
            className={`no-print flex flex-wrap items-center gap-3 ${showFilters ? 'mb-6' : 'mt-8'}`}
          >
            <a
              href="/schedule-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-6 py-3 rounded-[2px] transition-all duration-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center bg-transparent text-black border border-black/20 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-6 py-3 rounded-[2px] transition-all duration-300 hover:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              Print / Save as PDF
            </button>
          </div>
        )}

        {/* Calendar grid view or list view — tabpanel for season tabs a11y */}
        <div
          id="season-schedule-panel"
          role="tabpanel"
          aria-labelledby={`season-tab-${season}`}
          className={showFilters ? '' : 'mt-0'}
        >
        {viewMode === 'calendar' ? (
          <div className="space-y-12 md:space-y-16 overflow-x-auto">
            {locationsToShow.map((loc) => {
              const grid = gridsByLocation[loc]
              if (!grid) return null
              const range = getUsedRowRange(grid)
              const rowsToShow = range
                ? grid.slice(range.min, range.max + 1)
                : []
              const locationName = LOCATION_LABELS[loc] ?? loc
              return (
                <section key={loc} className="break-inside-avoid">
                  <h2 className="font-headline text-[18px] md:text-[20px] font-medium text-brand-pacific-dusk mb-5">
                    {locationName}
                  </h2>
                  <div className="border border-black/[0.08] rounded-[2px] overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02)]">
                    <table className="w-full border-collapse font-sans min-w-[640px]" aria-label={`Weekly schedule for ${locationName}`}>
                      <thead>
                        <tr className="bg-brand-sandstone/50">
                          <th scope="col" className="text-left font-sans text-[11px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-[0.12em] py-4 pl-4 pr-3 w-[80px] border-b border-r border-black/[0.08]">
                            Time
                          </th>
                          {DAY_ORDER.map((day) => (
                            <th
                              key={day}
                              scope="col"
                              className="text-center font-sans text-[11px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-[0.12em] py-4 px-2 border-b border-black/[0.08] last:border-r-0"
                            >
                              {DAY_SHORT[day]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!range ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center font-sans text-[14px] text-brand-pacific-dusk/70">
                              <span className="block">No sessions this week</span>
                              {loc === 'Alta' && ALTA_EMPTY_NOTE ? (
                                <span className="block mt-2 text-[13px] text-brand-pacific-dusk/60">{ALTA_EMPTY_NOTE}</span>
                              ) : null}
                            </td>
                          </tr>
                        ) : (
                        rowsToShow.map((row, i) => {
                          const rowIndex = range.min + i
                          return (
                          <tr key={rowIndex} className="border-b border-black/[0.05] last:border-b-0 transition-colors duration-150 hover:bg-black/[0.01]">
                            <th scope="row" className="py-2 pl-4 pr-3 text-brand-pacific-dusk/70 text-[12px] font-medium align-top border-r border-black/[0.08] whitespace-nowrap text-left font-sans">
                              {formatGridRowTime(rowIndex)}
                            </th>
                            {DAY_ORDER.map((_, dayIndex) => {
                              const cell = row[dayIndex]
                              if (cell === 'covered') return null
                              if (cell === null) {
                                return (
                                  <td
                                    key={dayIndex}
                                    className="py-2 px-2 align-top border-black/[0.05] min-h-[48px]"
                                  />
                                )
                              }
                              const { slot, rowSpan } = cell
                              return (
                                <td
                                  key={dayIndex}
                                  rowSpan={rowSpan}
                                  className="p-2 align-top border-l border-black/[0.05] first:border-l-0"
                                >
                                  <div className="h-full min-h-[48px] bg-[var(--cove-mist)] border-l-[3px] border-brand-victoria-cove rounded-[2px] px-3 py-2.5 text-brand-pacific-dusk transition-shadow duration-200 hover:shadow-[0_1px_3px_rgba(46,139,139,0.08)]">
                                    <div className="font-sans font-medium text-[14px] leading-snug text-brand-pacific-dusk">
                                      {slot.programName}
                                      {slot.ages ? (
                                        <span className="text-brand-pacific-dusk/80 font-normal"> ({slot.ages})</span>
                                      ) : null}
                                    </div>
                                    <div className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-1 leading-snug">
                                      {slot.time} · {slot.duration}
                                      {slot.coach ? ` · ${slot.coach}` : ''}
                                    </div>
                                  </div>
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
                </section>
              )
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {locationsToShow.map((loc) => {
              const byDay = scheduleByLocationByDay[loc] ?? {}
              const locationName = LOCATION_LABELS[loc] ?? loc
              const hasAnySlots = DAY_ORDER.some((day) => (byDay[day]?.length ?? 0) > 0)
              return (
                <section key={loc} className="break-inside-avoid">
                  <h2 className="font-headline text-[18px] md:text-[20px] font-medium text-brand-pacific-dusk mb-5">
                    {locationName}
                  </h2>
                  <div className="space-y-6">
                    {!hasAnySlots ? (
                      <p className="font-sans text-[14px] text-brand-pacific-dusk/70 py-4">
                        No sessions at this location for this season.
                        {loc === 'Alta' && ALTA_EMPTY_NOTE ? ` ${ALTA_EMPTY_NOTE}` : ''}
                      </p>
                    ) : (
                    DAY_ORDER.map((day) => {
                      const slots = byDay[day]
                      if (!slots?.length) return null
                      return (
                        <div key={day}>
                          <h3 className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-[0.12em] mb-3">
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
                    })
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
