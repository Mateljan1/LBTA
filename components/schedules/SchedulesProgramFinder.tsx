'use client'

export interface ProgramFilters {
  playerType: 'all' | 'junior' | 'youth' | 'adult' | 'fitness'
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
  { value: 'all', label: 'All players' },
  { value: 'junior', label: 'Juniors (ages 3-11)' },
  { value: 'youth', label: 'Youth / HP (11-18)' },
  { value: 'adult', label: 'Adult' },
  { value: 'fitness', label: 'Fitness & community' },
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

export default function SchedulesProgramFinder({
  filters,
  resultCount,
  onChange,
  onReset,
}: SchedulesProgramFinderProps) {
  const selectClassName =
    'min-h-[48px] rounded-[2px] border border-black/10 bg-white px-3 py-2 font-sans text-[14px] text-brand-pacific-dusk focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2'

  return (
    <section id="program-finder" className="scroll-mt-32 rounded-lg border border-black/[0.08] bg-brand-morning-light p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/60">
            QUICK FINDER
          </p>
          <h3 className="font-headline text-[28px] leading-[1.05] text-brand-pacific-dusk md:text-[34px]">
            Find Your Best-Fit Program
          </h3>
        </div>
        <p className="rounded-full bg-white px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-brand-pacific-dusk">
          {resultCount} {resultCount === 1 ? 'option' : 'options'} shown
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/70">
          Player type
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

        <label className="flex flex-col gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/70">
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

        <label className="flex flex-col gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/70">
          Day preference
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-black/10 bg-white px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.1px] text-brand-pacific-dusk transition-all duration-300 hover:border-brand-victoria-cove hover:bg-brand-sandstone/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
        >
          Reset Filters
        </button>
      </div>
    </section>
  )
}
