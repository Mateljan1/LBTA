/**
 * Calendar view: schedule by location and day.
 * Single source: programs from lib/programs-data (same data as schedules page).
 */

import type { SeasonKey } from '@/lib/season-utils'
import { getAllSeasons } from '@/lib/season-utils'
import { formatLocation } from '@/lib/programs-data'
import {
  getWinter2026Programs,
  getFall2026Programs,
  getSpringProgramsForDisplay,
  getSummerProgramsForDisplay,
  getSpringSummer2026,
} from '@/lib/programs-data'

export const DAY_ORDER: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const LOCATION_KEYS: string[] = ['Moulton', 'Alta', 'LBHS']

export interface CalendarSlot {
  programId: string
  programName: string
  category: string
  ages: string
  time: string
  duration: string
  coach?: string
}

type ScheduleSlot = { day: string; time: string; coach?: string; location?: string }
type ProgramWithSchedule = {
  id: string
  program: string
  category: string
  ages: string
  location: string
  duration: string
  schedule: ScheduleSlot[]
}

/** Normalize slot to one of Moulton/Alta/LBHS. Uses slot.location when present; else infers from program location (e.g. "Saturday at LBHS") or formatLocation. */
export function normalizeSlotLocation(
  slot: { day: string; location?: string },
  programLocation: string
): string {
  if (slot.location) {
    const s = slot.location.toLowerCase()
    if (s.includes('moulton')) return 'Moulton'
    if (s.includes('alta')) return 'Alta'
    if (s.includes('lbhs') || s.includes('high school') || s.includes('lb high')) return 'LBHS'
  }
  const loc = programLocation.toLowerCase()
  if (loc.includes('saturday at lbhs') && slot.day === 'Saturday') return 'LBHS'
  if (loc.includes('sat') && slot.day === 'Saturday' && (loc.includes('lbhs') || loc.includes('high school'))) return 'LBHS'
  if (loc.includes('mon/wed') && (slot.day === 'Monday' || slot.day === 'Wednesday')) return 'Moulton'
  if (loc.includes('fri') && slot.day === 'Friday' && (loc.includes('lbhs') || loc.includes('high school'))) return 'LBHS'
  return formatLocation(programLocation)
}

/** Schedule grouped by location, then by day. Same programming as on the website. */
export type ScheduleByLocationByDay = Record<string, Record<string, CalendarSlot[]>>

function getProgramsForSeason(season: SeasonKey): ProgramWithSchedule[] {
  switch (season) {
    case 'winter':
      return getWinter2026Programs()
    case 'fall':
      return getFall2026Programs()
    case 'spring':
      return getSpringProgramsForDisplay()
    case 'summer':
      return getSummerProgramsForDisplay()
    default:
      return getWinter2026Programs()
  }
}

export function getScheduleByLocationByDay(season: SeasonKey): ScheduleByLocationByDay {
  const programs = getProgramsForSeason(season)
  const out: ScheduleByLocationByDay = {}

  for (const prog of programs) {
    for (const slot of prog.schedule) {
      const loc = normalizeSlotLocation(slot, prog.location)
      if (!LOCATION_KEYS.includes(loc)) continue
      if (!out[loc]) out[loc] = {}
      if (!out[loc][slot.day]) out[loc][slot.day] = []
      out[loc][slot.day].push({
        programId: prog.id,
        programName: prog.program,
        category: prog.category,
        ages: prog.ages,
        time: slot.time,
        duration: prog.duration,
        coach: slot.coach,
      })
    }
  }

  for (const loc of Object.keys(out)) {
    for (const day of Object.keys(out[loc])) {
      out[loc][day].sort((a, b) => a.time.localeCompare(b.time))
    }
  }

  return out
}

export function getSeasonLabel(season: SeasonKey): string {
  if (season === 'spring' || season === 'summer') {
    const ss = getSpringSummer2026()
    return season === 'spring' ? ss.spring.label : ss.summer.label
  }
  const seasons = getAllSeasons()
  const s = seasons[season]
  return s?.name ?? season
}

export function getSeasonDates(season: SeasonKey): string {
  if (season === 'spring' || season === 'summer') {
    const ss = getSpringSummer2026()
    return season === 'spring' ? ss.spring.dates : ss.summer.dates
  }
  const seasons = getAllSeasons()
  const s = seasons[season]
  return s?.dates ?? ''
}
