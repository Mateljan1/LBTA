import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import { getCoachSchedule } from '@/lib/coach-schedule-data'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import CoachWeekScheduleView from '@/components/coach-hub-coach/CoachWeekScheduleView'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string }>
}

export default async function PerCoachSchedulePage({ params }: PageProps) {
  const { coach: rawSlug } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  const schedule = getCoachSchedule(slug)

  return (
    <CoachTodayShell coach={coach} activeTab="schedule">
      <CoachWeekScheduleView
        schedule={schedule}
        coachName={coach.name}
        coachSlug={coach.slug}
      />
    </CoachTodayShell>
  )
}
