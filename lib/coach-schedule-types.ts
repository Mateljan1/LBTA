/**
 * Per-coach weekly schedule types.
 * Source of truth: data/coach-hub/coach-schedules.json (keyed by coach display name).
 */

export type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

/** Display order — matches how coaches think about the week (weekdays first, then weekend). */
export const DAY_ORDER: DayName[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/** A single session entry as stored in coach-schedules.json. Field names match existing JSON shape — DO NOT rename without migrating data. */
export interface ScheduleEntry {
  /** Time range as a display string, e.g. "3:30–4:15 PM" */
  time: string
  /** Program name, e.g. "Little Tennis Stars", "Red Ball" */
  prog: string
  /** Internal stage code, e.g. "STG-03-04_LTS" */
  stage: string
  /** Variant code (A/B for alternate-week or per-court tracks) */
  code: string
  /** Duration in minutes */
  dur: number
  /** Location, e.g. "Moulton Meadows", "Alta", "LBHS" */
  loc: string
}

/** A coach's full week — Day → ordered list of sessions for that day. */
export type WeeklySchedule = Record<DayName, ScheduleEntry[]>

/** Top-level shape: coach display name → weekly schedule. */
export type CoachScheduleMap = Record<string, WeeklySchedule>
