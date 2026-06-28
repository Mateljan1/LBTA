import type { SeasonKey } from '@/lib/season-utils'
import {
  getScheduleByLocationByDayWithLive,
  fetchLiveSchedule,
  getSeasonLabel,
  getSeasonDates,
} from '@/lib/calendar-schedule'
import { getCurrentSeason } from '@/lib/season-utils'
import ScheduleCalendarView from '@/components/schedules/ScheduleCalendarView'
import type { CalendarSeasonData } from '@/components/schedules/ScheduleCalendarView'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const SEASONS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall']

async function buildCalendarBySeason(): Promise<Record<SeasonKey, CalendarSeasonData>> {
  const live = await fetchLiveSchedule()
  const out = {} as Record<SeasonKey, CalendarSeasonData>
  for (const season of SEASONS) {
    out[season] = {
      scheduleByLocationByDay: getScheduleByLocationByDayWithLive(season, live),
      seasonLabel: getSeasonLabel(season),
      seasonDates: getSeasonDates(season),
    }
  }
  return out
}

export const metadata = {
  title: 'Schedule by Location',
  description:
    'View LBTA program schedule by location: Moulton Meadows Park, Alta Laguna Park, and Laguna Beach High School. Winter, Spring, Summer, Fall.',
  /** Thin variant view of /schedules — keep out of Google to avoid duplicate content. Users reach it via the calendar toggle on /schedules. */
  robots: { index: false, follow: false },
}

export default async function ScheduleCalendarPage({
  searchParams,
}: {
  searchParams?: Promise<{ season?: string }>
}) {
  const params = await searchParams
  const calendarBySeason = await buildCalendarBySeason()
  const seasonParam = params?.season
  const initialSeason: SeasonKey =
    seasonParam && SEASONS.includes(seasonParam as SeasonKey)
      ? (seasonParam as SeasonKey)
      : getCurrentSeason()

  return (
    <>
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
          <Breadcrumbs
            items={[
              { label: 'Schedule & Pricing', href: '/schedules' },
              { label: 'Schedule by location' },
            ]}
          />
        </div>
      </div>
      <main className="bg-brand-morning-light min-h-screen">
        <ScheduleCalendarView
          calendarBySeason={calendarBySeason}
          initialSeason={initialSeason}
          showFilters
          printable
        />
      </main>
    </>
  )
}
