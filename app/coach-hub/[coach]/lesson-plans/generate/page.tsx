import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import LessonPlanGeneratorForm from '@/components/coach-hub-coach/LessonPlanGeneratorForm'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string }>
}

export default async function PerCoachLessonPlanGeneratePage({
  params,
}: PageProps) {
  const { coach: rawSlug } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  return (
    <CoachTodayShell coach={coach} activeTab="lesson-plans">
      <LessonPlanGeneratorForm coachSlug={coach.slug} />
    </CoachTodayShell>
  )
}
