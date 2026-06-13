/**
 * Lesson Plan Library data lookup.
 *
 * Static imports (today's `dynamic-fs-read-bloats-bundle` learning) so Next.js
 * traces dependencies properly and doesn't bundle the full data/ tree.
 */

import plansJson from '@/data/coach-hub/lesson-plans/plans.json'
import frameworkJson from '@/data/coach-hub/lesson-plans/framework.json'
import type {
  LessonPlan,
  LessonFramework,
  ProgramFamily,
} from './lesson-plan-types'

const PLANS = plansJson as unknown as LessonPlan[]
const FRAMEWORK = frameworkJson as unknown as LessonFramework

export function getAllPlans(): LessonPlan[] {
  return PLANS
}

export function getPlanById(id: string): LessonPlan | null {
  return PLANS.find((p) => p.id === id) ?? null
}

export function getPlansForProgram(program: ProgramFamily): LessonPlan[] {
  return PLANS.filter((p) => p.program === program)
}

export function getFramework(): LessonFramework {
  return FRAMEWORK
}

/** All program families that actually have at least one plan — for filter chips. */
export function getActiveProgramFamilies(): ProgramFamily[] {
  const seen = new Set<ProgramFamily>()
  for (const plan of PLANS) seen.add(plan.program)
  return Array.from(seen)
}
