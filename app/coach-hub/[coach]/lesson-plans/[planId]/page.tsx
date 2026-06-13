import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import { getPlanById } from '@/lib/lesson-plan-data'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import LessonPlanDetailView from '@/components/coach-hub-coach/LessonPlanDetailView'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string; planId: string }>
}

export default async function PerCoachLessonPlanDetailPage({
  params,
}: PageProps) {
  const { coach: rawSlug, planId } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  const plan = getPlanById(planId)
  if (!plan) {
    notFound()
  }

  return (
    <CoachTodayShell coach={coach} activeTab="lesson-plans">
      <LessonPlanDetailView plan={plan} coachSlug={coach.slug} />
    </CoachTodayShell>
  )
}
