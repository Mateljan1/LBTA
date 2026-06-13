import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import {
  getAllPlans,
  getActiveProgramFamilies,
} from '@/lib/lesson-plan-data'
import { listAllDrafts } from '@/lib/lesson-plan-drafts-store'
import type { ProgramFamily } from '@/lib/lesson-plan-types'
import { PROGRAM_FAMILIES } from '@/lib/lesson-plan-types'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import LessonPlanLibraryView from '@/components/coach-hub-coach/LessonPlanLibraryView'

const REGISTRY = coachesJson as unknown as CoachRegistry
const KNOWN_PROGRAMS = new Set<string>(PROGRAM_FAMILIES.map((f) => f.id))

interface PageProps {
  params: Promise<{ coach: string }>
  searchParams: Promise<{ program?: string }>
}

export default async function PerCoachLessonPlansPage({
  params,
  searchParams,
}: PageProps) {
  const { coach: rawSlug } = await params
  const { program: rawProgram } = await searchParams
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  const allPlans = getAllPlans()
  const drafts = await listAllDrafts(Object.keys(REGISTRY))
  // Filter chips show ALL program families that have at least one plan or draft —
  // so a coach who generated a Cardio Tennis draft can filter to view it even
  // though no curated cardio plan exists.
  const curatedFamilies = getActiveProgramFamilies()
  const activeFamilies = Array.from(
    new Set([...curatedFamilies, ...drafts.map((d) => d.program)])
  )

  // Validate ?program= query string against known program families.
  const activeProgram: ProgramFamily | null =
    rawProgram && KNOWN_PROGRAMS.has(rawProgram)
      ? (rawProgram as ProgramFamily)
      : null

  return (
    <CoachTodayShell coach={coach} activeTab="lesson-plans">
      <LessonPlanLibraryView
        allPlans={allPlans}
        drafts={drafts}
        activeProgram={activeProgram}
        activeFamilies={activeFamilies}
        coachSlug={coach.slug}
      />
    </CoachTodayShell>
  )
}
