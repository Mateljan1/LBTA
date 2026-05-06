'use client'

export interface ProgramFilters {
  playerType: 'all' | 'junior' | 'development' | 'adult' | 'openCourt'
  level: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'competitive'
  day: 'all' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
}

interface SchedulesProgramFinderProps {
  filters: ProgramFilters
  resultCount: number
  onChange: (next: ProgramFilters) => void
  onReset: () => void
}

const PLAYER_TYPE_OPTIONS: Array<{ value: ProgramFilters['playerType']; label: string }> = [
  { value: 'all', label: 'All programs' },
  { value: 'junior', label: 'Kids (3-11)' },
  { value: 'development', label: 'Junior Development (9-17)' },
  { value: 'adult', label: 'Adults' },
  { value: 'openCourt', label: 'Open Court (Drop-In)' },
]

const LEVEL_OPTIONS: Array<{ value: ProgramFilters['level']; label: string }> = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'competitive', label: 'Competitive' },
]

const DAY_OPTIONS: Array<{ value: ProgramFilters['day']; label: string }> = [
  { value: 'all', label: 'Any day' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
]

const isFiltered = (filters: ProgramFilters) =>
  filters.playerType !== 'all' || filters.level !== 'all' || filters.day !== 'all'

export default function SchedulesProgramFinder({
  filters,
  resultCount,
  onChange,
  onReset,
}: SchedulesProgramFinderProps) {
  const selectClassName =
    'min-h-[48px] rounded-[2px] border border-black/10 bg-white px-3 py-2 font-sans text-[14px] text-brand-pacific-dusk focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2'

  const active = isFiltered(filters)

  return (
    <div id="program-finder" className="scroll-mt-28 rounded-lg border border-black/[0.06] bg-brand-morning-light/60 px-4 py-4 md:px-5 md:py-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <p className="font-sans text-[12px] font-medium text-brand-pacific-dusk/50 tracking-wide">
          Filter by age, level, or day
        </p>
        {active && (
          <p aria-live="polite" aria-atomic="true" className="rounded-full bg-white px-3 py-1.5 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/70">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/60">
          Age group
          <select
            value={filters.playerType}
            onChange={(event) => onChange({ ...filters, playerType: event.target.value as ProgramFilters['playerType'] })}
            className={selectClassName}
          >
            {PLAYER_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/60">
          Level
          <select
            value={filters.level}
            onChange={(event) => onChange({ ...filters, level: event.target.value as ProgramFilters['level'] })}
            className={selectClassName}
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/60">
          Day
          <select
            value={filters.day}
            onChange={(event) => onChange({ ...filters, day: event.target.value as ProgramFilters['day'] })}
            className={selectClassName}
          >
            {DAY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {active && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-black/10 bg-white px-5 py-2.5 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/70 transition-all duration-300 hover:border-brand-victoria-cove hover:text-brand-pacific-dusk focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
