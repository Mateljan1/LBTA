import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import { getFramework } from '@/lib/lesson-plan-data'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import LessonFrameworkView from '@/components/coach-hub-coach/LessonFrameworkView'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string }>
}

export default async function PerCoachFrameworkPage({ params }: PageProps) {
  const { coach: rawSlug } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  const framework = getFramework()

  return (
    <CoachTodayShell coach={coach} activeTab="lesson-plans">
      <LessonFrameworkView framework={framework} coachSlug={coach.slug} />
    </CoachTodayShell>
  )
}
