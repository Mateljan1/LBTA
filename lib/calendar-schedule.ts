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

/** Grid config for week calendar: 30-min slots from 7 AM to 9 PM. */
export const GRID_START_MINUTES = 7 * 60
export const GRID_END_MINUTES = 21 * 60
export const GRID_SLOT_MINUTES = 30

/**
 * Parse a time range string like "3:30–4:15 PM" or "11:45 AM–12:45 PM" to minutes from midnight.
 * Supports "3:30–5:00 PM" (start inherits PM from end). Invalid ranges (start >= end) return null.
 */
export function parseTimeRangeToMinutes(timeStr: string): { start: number; end: number } | null {
  const range = timeStr.trim().split(/[–\-]\s*/)
  if (range.length < 2) return null
  const startStr = range[0].trim()
  const endStr = range[1].trim()
  let start = parseTimeToMinutes(startStr)
  let end = parseTimeToMinutes(endStr)
  if (end == null) return null
  if (start == null) {
    const ampmMatch = endStr.match(/\s*(AM|PM)$/i)
    if (ampmMatch) start = parseTimeToMinutes(startStr + ' ' + ampmMatch[1])
  }
  if (start == null || end == null) return null
  if (end <= start) return null
  return { start, end }
}

function parseTimeToMinutes(s: string): number | null {
  const match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!match) return null
  let h = parseInt(match[1], 10)
  const m = match[2] ? parseInt(match[2], 10) : 0
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

export interface GridCellSlot {
  slot: CalendarSlot
  rowSpan: number
}

export type GridCell = GridCellSlot | 'covered' | null

/**
 * For a given location's by-day schedule, build a week grid: dayIndex 0..6 (Mon..Sun), rowIndex 0..N (30-min slots).
 * Cell is null (empty), 'covered' (part of a rowSpan from above), or { slot, rowSpan }.
 * Overlapping slots: first slot wins; later slots for the same cell are skipped (no UI indication).
 */
export function buildWeekGridForLocation(
  byDay: Record<string, CalendarSlot[]>
): GridCell[][] {
  const totalRows = (GRID_END_MINUTES - GRID_START_MINUTES) / GRID_SLOT_MINUTES
  const dayIndexByDay: Record<string, number> = {}
  DAY_ORDER.forEach((d, i) => { dayIndexByDay[d] = i })

  const grid: GridCell[][] = []
  for (let r = 0; r < totalRows; r++) {
    grid[r] = []
    for (let d = 0; d < 7; d++) grid[r][d] = null
  }

  for (const day of DAY_ORDER) {
    const slots = byDay[day]
    if (!slots?.length) continue
    const dayIdx = dayIndexByDay[day]
    for (const slot of slots) {
      const parsed = parseTimeRangeToMinutes(slot.time)
      if (!parsed) continue
      const rowIndex = Math.floor((parsed.start - GRID_START_MINUTES) / GRID_SLOT_MINUTES)
      const durationSlots = Math.min(
        totalRows - rowIndex,
        Math.max(1, Math.ceil((parsed.end - parsed.start) / GRID_SLOT_MINUTES))
      )
      if (rowIndex < 0 || rowIndex >= totalRows) continue
      if (grid[rowIndex][dayIdx] !== null && grid[rowIndex][dayIdx] !== 'covered') continue
      grid[rowIndex][dayIdx] = { slot, rowSpan: durationSlots }
      for (let s = 1; s < durationSlots; s++) {
        const r = rowIndex + s
        if (r < totalRows) grid[r][dayIdx] = 'covered'
      }
    }
  }

  return grid
}

/** Format grid row time (e.g. 8:00 AM) for display. */
export function formatGridRowTime(rowIndex: number): string {
  const minutes = GRID_START_MINUTES + rowIndex * GRID_SLOT_MINUTES
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `12:${m.toString().padStart(2, '0')} AM`
  if (h < 12) return `${h}:${m.toString().padStart(2, '0')} AM`
  if (h === 12) return `12:${m.toString().padStart(2, '0')} PM`
  return `${h - 12}:${m.toString().padStart(2, '0')} PM`
}
