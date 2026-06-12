/**
 * Per-coach schedule lookup — slug → WeeklySchedule.
 *
 * Static import (not fs.readFile) so Next.js can trace the dependency and not
 * bundle the entire data/ tree into the serverless function. See today's compound
 * learning: dynamic-fs-read-in-nextjs-server-component-bloats-bundle.
 *
 * The JSON is keyed by coach DISPLAY NAME (e.g. "Allison Cronk"). The lookup
 * here translates from URL slug ("allison") to display name via coaches.json.
 */

import scheduleJson from '@/data/coach-hub/coach-schedules.json'
import coachesJson from '@/data/coach-hub/coaches.json'
import type {
  CoachScheduleMap,
  WeeklySchedule,
  DayName,
} from './coach-schedule-types'
import { DAY_ORDER } from './coach-schedule-types'
import type { CoachRegistry } from './coach-today-types'

const SCHEDULES = scheduleJson as unknown as CoachScheduleMap
const REGISTRY = coachesJson as unknown as CoachRegistry

/**
 * Build a normalized week for a given slug. Returns null if coach unknown.
 * Even if the JSON omits some days, we return all 7 days (empty arrays) so
 * the renderer can decide whether to hide empty days or show "No sessions".
 */
export function getCoachSchedule(slug: string): WeeklySchedule | null {
  const coach = REGISTRY[slug]
  if (!coach) return null

  const entry = SCHEDULES[coach.name]
  // Build a normalized week; missing days become empty arrays.
  const normalized = DAY_ORDER.reduce<WeeklySchedule>(
    (acc, day) => {
      acc[day] = entry?.[day] ?? []
      return acc
    },
    {} as WeeklySchedule
  )
  return normalized
}

/** True if the coach has at least one session in any day of the week. */
export function hasAnySessions(schedule: WeeklySchedule): boolean {
  return (Object.values(schedule) as Array<unknown[]>).some(
    (sessions) => sessions.length > 0
  )
}

/** Total sessions across all days. */
export function countTotalSessions(schedule: WeeklySchedule): number {
  return (Object.values(schedule) as Array<unknown[]>).reduce(
    (sum, sessions) => sum + sessions.length,
    0
  )
}

/** Days that have at least one session, in display order. */
export function activeDays(schedule: WeeklySchedule): DayName[] {
  return DAY_ORDER.filter((day) => schedule[day].length > 0)
}

export { DAY_ORDER }
