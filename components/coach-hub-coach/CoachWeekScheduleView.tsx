import type {
  WeeklySchedule,
  ScheduleEntry,
  DayName,
} from '@/lib/coach-schedule-types'
import {
  countTotalSessions,
  hasAnySessions,
  activeDays,
} from '@/lib/coach-schedule-data'

interface Props {
  schedule: WeeklySchedule | null
  coachName: string
  /** Coach slug — shown in the empty state instructions */
  coachSlug: string
}

export default function CoachWeekScheduleView({
  schedule,
  coachName,
  coachSlug,
}: Props) {
  if (!schedule || !hasAnySessions(schedule)) {
    return <EmptyState coachName={coachName} coachSlug={coachSlug} />
  }

  const days = activeDays(schedule)
  const totalSessions = countTotalSessions(schedule)
  const totalHours = sumHours(schedule)

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 pb-24">
      <Header
        coachName={coachName}
        totalSessions={totalSessions}
        totalHours={totalHours}
        activeDayCount={days.length}
      />

      <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => (
          <DayCard key={day} day={day} entries={schedule[day]} />
        ))}
      </div>
    </div>
  )
}

function Header({
  coachName,
  totalSessions,
  totalHours,
  activeDayCount,
}: {
  coachName: string
  totalSessions: number
  totalHours: number
  activeDayCount: number
}) {
  return (
    <header className="pt-4 pb-7 mb-6 border-b border-black/8">
      <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
        Weekly schedule
      </p>
      <h1 className="font-headline font-light text-brand-deep-water leading-[1.05] tracking-[-0.02em] text-[clamp(28px,6vw,42px)] mb-3">
        {coachName} — week at a glance
      </h1>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-pacific-dusk/80">
        <span>
          <strong className="font-semibold text-brand-deep-water">
            {totalSessions}
          </strong>{' '}
          {totalSessions === 1 ? 'session' : 'sessions'}
        </span>
        <span>
          <strong className="font-semibold text-brand-deep-water">
            {formatHours(totalHours)}
          </strong>{' '}
          on court
        </span>
        <span>
          <strong className="font-semibold text-brand-deep-water">
            {activeDayCount}
          </strong>{' '}
          {activeDayCount === 1 ? 'day' : 'days'}
        </span>
      </div>
    </header>
  )
}

function DayCard({ day, entries }: { day: DayName; entries: ScheduleEntry[] }) {
  const dayHours = entries.reduce((sum, e) => sum + e.dur, 0)

  return (
    <section className="bg-white rounded-[14px] border border-black/6 shadow-[0_1px_0_rgba(27,58,92,0.04),0_8px_24px_-8px_rgba(27,58,92,0.06)] overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-black/6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-headline font-normal text-[22px] leading-tight text-brand-deep-water tracking-[-0.01em]">
            {day}
          </h2>
          <span className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 tabular-nums">
            {entries.length} · {formatHours(dayHours)}
          </span>
        </div>
      </div>
      <ul className="divide-y divide-black/6">
        {entries.map((e, i) => (
          <SessionRow key={`${day}-${i}-${e.time}`} entry={e} />
        ))}
      </ul>
    </section>
  )
}

function SessionRow({ entry }: { entry: ScheduleEntry }) {
  return (
    <li className="px-5 py-4">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="font-sans font-semibold text-[13px] tracking-wide text-brand-victoria-cove tabular-nums">
          {entry.time}
        </span>
        <span className="font-sans text-[11px] text-brand-pacific-dusk/55 font-medium tabular-nums whitespace-nowrap">
          {entry.dur} min
        </span>
      </div>
      <p className="font-headline font-normal text-[18px] leading-[1.25] text-brand-deep-water mb-1.5">
        {entry.prog}
      </p>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-brand-pacific-dusk/65">
        <span>{entry.loc}</span>
        {entry.code ? (
          <>
            <span className="text-brand-pacific-dusk/30">·</span>
            <span className="font-mono text-eyebrow-sm">{entry.code}</span>
          </>
        ) : null}
      </div>
    </li>
  )
}

function EmptyState({
  coachName,
  coachSlug,
}: {
  coachName: string
  coachSlug: string
}) {
  return (
    <div className="max-w-[640px] mx-auto px-6 py-16">
      <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
        Weekly schedule
      </p>
      <h1 className="font-headline font-light text-brand-deep-water leading-tight tracking-[-0.02em] text-[clamp(28px,6vw,40px)] mb-4">
        No sessions on the schedule yet.
      </h1>
      <p className="text-base text-brand-pacific-dusk/75 mb-6 leading-relaxed">
        Add weekly sessions for <strong>{coachName}</strong> in the source data
        file, then redeploy and they&rsquo;ll appear here automatically.
      </p>
      <div className="bg-brand-sandstone rounded-[10px] p-5 text-sm">
        <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mb-2">
          Edit
        </p>
        <code className="font-mono text-xs text-brand-deep-water break-all">
          data/coach-hub/coach-schedules.json
        </code>
        <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mt-4 mb-2">
          Under key
        </p>
        <code className="font-mono text-xs text-brand-deep-water">
          &quot;{coachName}&quot;
        </code>
        <p className="font-sans text-xs text-brand-pacific-dusk/60 mt-4">
          Slug: <span className="font-mono">{coachSlug}</span>
        </p>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

function sumHours(schedule: WeeklySchedule): number {
  let total = 0
  for (const day of Object.values(schedule) as ScheduleEntry[][]) {
    for (const entry of day) {
      total += entry.dur
    }
  }
  return total
}

function formatHours(minutes: number): string {
  if (minutes === 0) return '0h'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
