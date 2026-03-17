/**
 * Coach Hub helpers: week, assessment mode, block times.
 * Mirrors HTML getWk(), getAssessMode(), getTm().
 */

import type { SeasonsMap } from './coach-hub-types'

const BLOCK_LABELS = ['Warm-up', 'Tech', 'Tact', 'Live', 'Conditioning', 'Wrap'] as const

const TEMPLATE_MINUTES: Record<string, number[]> = {
  'TMP-45_LTS': [5, 10, 10, 10, 7, 3],
  'TMP-60_YOUTH_STD': [10, 15, 20, 0, 10, 5],
  'TMP-60_ADULT_BEGINNER': [8, 12, 12, 18, 8, 2],
  'TMP-90_GREEN_YELLOW': [12, 18, 18, 22, 15, 5],
  'TMP-90_ADULT_INT': [10, 15, 20, 25, 15, 5],
  'TMP-120_YOUTH_DEV': [12, 25, 25, 25, 25, 8],
  'TMP-120_HP': [15, 20, 25, 25, 28, 7],
  'TMP-120_ADULT_ADV': [12, 20, 25, 28, 28, 7],
}

const DEFAULT_45 = [5, 10, 10, 10, 7, 3]
const DEFAULT_60 = [10, 15, 20, 0, 10, 5]
const DEFAULT_90 = [12, 18, 18, 22, 15, 5]
const DEFAULT_120 = [12, 25, 25, 25, 25, 8]

export function getBlockLabels(): readonly string[] {
  return BLOCK_LABELS
}

export function getWk(seasons: SeasonsMap, seasonKey: string): number {
  const ss = seasons[seasonKey]
  if (!ss?.start) return 1
  const start = new Date(ss.start).getTime()
  const now = Date.now()
  const week = Math.floor((now - start) / (7 * 864e5)) + 1
  return Math.max(1, Math.min(12, week))
}

export function getAssessMode(
  week: number,
  assessmentCalendar: Record<string, { mode: string; coach_action: string }> | undefined
): { mode: string; cls: string; action: string } {
  if (!assessmentCalendar) {
    return { mode: 'Continuous KPI', cls: 'assess-continuous', action: 'Track KPIs within drills.' }
  }
  if (week === 1) {
    const w = assessmentCalendar['1']
    return { mode: w?.mode ?? 'Baseline Intake', cls: 'assess-baseline', action: w?.coach_action ?? '' }
  }
  if (week >= 10 && week <= 11) {
    const key = week === 10 ? '10' : '11'
    const w = assessmentCalendar[key]
    return { mode: w?.mode ?? 'Pressure/Match', cls: 'assess-pressure', action: w?.coach_action ?? '' }
  }
  if (week === 12) {
    const w = assessmentCalendar['12']
    return { mode: w?.mode ?? 'Testing + Report', cls: 'assess-testing', action: w?.coach_action ?? '' }
  }
  const w = assessmentCalendar['2-9']
  return { mode: w?.mode ?? 'Continuous KPI', cls: 'assess-continuous', action: w?.coach_action ?? '' }
}

export function getTm(templateId: string | undefined, durationMin: number): number[] {
  if (templateId && TEMPLATE_MINUTES[templateId]) return TEMPLATE_MINUTES[templateId]
  if (durationMin <= 45) return DEFAULT_45
  if (durationMin <= 60) return DEFAULT_60
  if (durationMin <= 90) return DEFAULT_90
  return DEFAULT_120
}

export function getTodayDayName(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}
