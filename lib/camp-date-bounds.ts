/**
 * ISO date bounds for camp drop-in day pickers (type="date" min/max).
 * Aligned with data/year2026.json and lib/camps-data week builders.
 */
import type { CampWeek } from '@/lib/camps-data'

/** Summer camp (full day) weeks 1–9: Mon–Fri; week 10: Back-to-School 3 days */
const SUMMER_WEEK_BOUNDS: Record<number, { min: string; max: string }> = {
  1: { min: '2026-06-15', max: '2026-06-19' },
  2: { min: '2026-06-22', max: '2026-06-26' },
  3: { min: '2026-06-29', max: '2026-07-03' },
  4: { min: '2026-07-07', max: '2026-07-11' },
  5: { min: '2026-07-14', max: '2026-07-18' },
  6: { min: '2026-07-21', max: '2026-07-25' },
  7: { min: '2026-07-28', max: '2026-08-01' },
  8: { min: '2026-08-04', max: '2026-08-08' },
  9: { min: '2026-08-11', max: '2026-08-15' },
  10: { min: '2026-08-17', max: '2026-08-19' },
}

/** Swim & Tennis / Mon–Thu weeks (4-day rows) */
const SWIM_WEEK_BOUNDS: Record<number, { min: string; max: string }> = {
  1: { min: '2026-06-16', max: '2026-06-19' },
  2: { min: '2026-06-23', max: '2026-06-26' },
  3: { min: '2026-06-30', max: '2026-07-03' },
  4: { min: '2026-07-07', max: '2026-07-10' },
  5: { min: '2026-07-14', max: '2026-07-17' },
  6: { min: '2026-07-21', max: '2026-07-24' },
  7: { min: '2026-07-28', max: '2026-07-31' },
  8: { min: '2026-08-04', max: '2026-08-07' },
  9: { min: '2026-08-11', max: '2026-08-14' },
  10: { min: '2026-08-17', max: '2026-08-19' },
}

const FIXED_CAMP_BOUNDS: Record<string, { min: string; max: string }> = {
  'spring-break': { min: '2026-03-30', max: '2026-04-02' },
  'ski-week': { min: '2026-02-16', max: '2026-02-20' },
  thanksgiving: { min: '2026-11-23', max: '2026-11-25' },
  'back-to-school': { min: '2026-08-17', max: '2026-08-19' },
}

/**
 * Returns min/max ISO dates for a half-day drop-in calendar picker.
 * When a week is selected (summer / swim), bounds match that camp week.
 */
export function getCampDropInDateBounds(
  campId: string,
  week: CampWeek | null | undefined
): { min: string; max: string } | null {
  if (week && (campId === 'summer' || campId === 'swim-tennis')) {
    const map = campId === 'summer' ? SUMMER_WEEK_BOUNDS : SWIM_WEEK_BOUNDS
    return map[week.week] ?? null
  }
  return FIXED_CAMP_BOUNDS[campId] ?? null
}
