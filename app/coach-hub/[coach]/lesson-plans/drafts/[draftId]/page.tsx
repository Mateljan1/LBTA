import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import { getDraft } from '@/lib/lesson-plan-drafts-store'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import LessonPlanDetailView from '@/components/coach-hub-coach/LessonPlanDetailView'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string; draftId: string }>
}

export default async function PerCoachLessonPlanDraftDetailPage({
  params,
}: PageProps) {
  const { coach: rawSlug, draftId } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  const draft = await getDraft(draftId, Object.keys(REGISTRY))
  if (!draft) {
    notFound()
  }

  return (
    <CoachTodayShell coach={coach} activeTab="lesson-plans">
      <LessonPlanDetailView plan={draft} coachSlug={coach.slug} />
    </CoachTodayShell>
  )
}
