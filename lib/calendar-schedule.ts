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

/** Canonical location keys; order is alphabetical by full name (Alta Laguna Park, Laguna Beach High School, Moulton Meadows Park). */
export const LOCATION_KEYS: string[] = ['Alta', 'LBHS', 'Moulton']

/** One row inside a merged “concurrent courts” grid cell (overlapping sessions). */
export interface ConcurrentSessionRow {
  time: string
  programName: string
  category: string
  programId: string
  /** From program JSON `ages`: NTRP/UTR band, junior ages, or “All levels”. */
  ages: string
}

/**
 * Scannable line for schedules — NTRP/UTR/age so players pick the right class.
 * Program JSON stores this on `ages` even when the value is a level band (not only literal ages).
 */
export function playerGuidanceFromAges(ages: string | undefined | null): string | null {
  const raw = ages?.trim()
  if (!raw) return null
  const lower = raw.toLowerCase()
  if (
    lower.includes('ntrp') ||
    lower.includes('utr') ||
    lower.includes('all levels') ||
    lower.includes('level-based')
  ) {
    return raw
  }
  // Compact junior age bands only: "3-4", "5-6", "9-11+"
  if (/^\d{1,2}-\d{1,2}\+?$/.test(raw)) {
    return `Ages ${raw.replace(/-/g, '–')}`
  }
  return raw
}

export interface CalendarSlot {
  programId: string
  programName: string
  category: string
  ages: string
  time: string
  duration: string
  coach?: string
  /** Present when this cell was merged from overlapping sessions; drives two-column / tinted rows. */
  concurrentSessions?: ConcurrentSessionRow[]
}

/** Split concurrent rows for Saturday-style layout (Juniors | Adults/LiveBall) vs Friday youth. */
export function partitionConcurrentSessions(rows: ConcurrentSessionRow[]): {
  juniors: ConcurrentSessionRow[]
  adultsColumn: ConcurrentSessionRow[]
  youthColumn: ConcurrentSessionRow[]
} {
  const juniors = rows.filter((r) => r.category === 'Junior')
  const adultsColumn = rows.filter((r) => r.category === 'Adult' || r.category === 'Fitness')
  const youthColumn = rows.filter((r) => r.category === 'Youth')
  return { juniors, adultsColumn, youthColumn }
}

export type ConcurrentRowKind =
  | 'hp'
  | 'utr_green'
  | 'youth_dev'
  | 'liveball'
  | 'adult'
  | 'j_stars'
  | 'j_red'
  | 'j_orange'
  | 'j_green'
  | 'youth'
  | 'default'

export function concurrentRowKind(programName: string, category: string): ConcurrentRowKind {
  const n = programName.toLowerCase()
  if (n.includes('high performance')) return 'hp'
  if (n.includes('utr green')) return 'utr_green'
  if (n.includes('youth development')) return 'youth_dev'
  if (n.includes('liveball')) return 'liveball'
  if (category === 'Fitness') return 'liveball'
  if (category === 'Adult') return 'adult'
  if (n.includes('little') || n.includes('stars')) return 'j_stars'
  if (n.includes('red ball')) return 'j_red'
  if (n.includes('orange ball')) return 'j_orange'
  if (n.includes('green dot')) return 'j_green'
  if (category === 'Junior') return 'j_red'
  if (category === 'Youth') return 'youth'
  return 'default'
}

const CONCURRENT_ROW_TW: Record<ConcurrentRowKind, string> = {
  hp: 'border-l-[3px] border-brand-pacific-dusk pl-2 py-1 rounded-r-sm bg-brand-pacific-dusk/[0.14]',
  utr_green: 'border-l-[3px] border-brand-tide-pool pl-2 py-1 rounded-r-sm bg-brand-tide-pool/18',
  youth_dev: 'border-l-[3px] border-brand-victoria-cove pl-2 py-1 rounded-r-sm bg-brand-victoria-cove/18',
  liveball: 'border-l-[3px] border-brand-victoria-cove pl-2 py-1 rounded-r-sm bg-brand-victoria-cove/20',
  adult: 'border-l-[3px] border-brand-pacific-dusk pl-2 py-1 rounded-r-sm bg-brand-pacific-dusk/14',
  j_stars: 'border-l-[3px] border-lbta-red pl-2 py-1 rounded-r-sm bg-lbta-red/14',
  j_red: 'border-l-[3px] border-lbta-red pl-2 py-1 rounded-r-sm bg-lbta-red/18',
  j_orange: 'border-l-[3px] border-brand-sunset-cliff pl-2 py-1 rounded-r-sm bg-brand-sunset-cliff/22',
  j_green: 'border-l-[3px] border-brand-tide-pool pl-2 py-1 rounded-r-sm bg-brand-tide-pool/18',
  youth: 'border-l-[3px] border-brand-victoria-cove pl-2 py-1 rounded-r-sm bg-brand-victoria-cove/14',
  default: 'border-l-[3px] border-brand-pacific-dusk/45 pl-2 py-1 rounded-r-sm bg-brand-sandstone/80',
}

export function concurrentSessionRowTw(programName: string, category: string): string {
  return CONCURRENT_ROW_TW[concurrentRowKind(programName, category)]
}

/** Stable sort for columns in concurrent cells (by session start time). */
export function sortConcurrentSessionsByStart(rows: ConcurrentSessionRow[]): ConcurrentSessionRow[] {
  return [...rows].sort((a, b) => {
    const pa = parseTimeRangeToMinutes(a.time)
    const pb = parseTimeRangeToMinutes(b.time)
    const sa = pa?.start ?? 99999
    const sb = pb?.start ?? 99999
    return sa - sb || a.programName.localeCompare(b.programName)
  })
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
        // coach intentionally omitted — public schedule shows class/time only.
        // Coach assignment stays backend-only (front desk notes).
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

// ── Slice 3 · LIVE desk schedule sync (ONE schedule everywhere) ──────────────
// The LBTA Front Desk owns WHEN/WHO/WHERE. The website keeps its rich program
// metadata (category/ages/duration) and overlays the live day/time/coach/location
// from the desk's public API. Falls back to the static map if the desk is unreachable.

export interface DeskClass {
  id?: string
  name?: string
  program: string
  day: string
  time: string
  location?: string
  coach?: string
  season?: string
}

const DESK_API_BASE =
  process.env.NEXT_PUBLIC_DESK_API_BASE || 'https://saska-messaging-cloud.vercel.app'

/** Fetch the live desk schedule (server-side, no CORS; cached 5 min). [] on any failure. */
export async function fetchLiveSchedule(): Promise<DeskClass[]> {
  try {
    const res = await fetch(`${DESK_API_BASE}/api/public-schedule`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.classes) ? (data.classes as DeskClass[]) : []
  } catch {
    return []
  }
}

function normProgramName(s: string | undefined | null): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function seasonMatches(seasonKey: SeasonKey, deskSeason: string | undefined): boolean {
  return (deskSeason || '').toLowerCase().includes(seasonKey)
}

function durationFromTime(time: string): string {
  const p = parseTimeRangeToMinutes(time)
  if (!p) return ''
  const mins = p.end - p.start
  return mins % 60 === 0 ? `${mins / 60} hr` : `${mins} min`
}

function inferCategory(programName: string): string {
  const n = programName.toLowerCase()
  if (n.includes('adult')) return 'Adult'
  if (n.includes('liveball') || n.includes('cardio') || n.includes('fitness')) return 'Fitness'
  if (n.includes('youth')) return 'Youth'
  return 'Junior'
}

/**
 * One synced schedule: when the live desk has classes for this season, build the calendar
 * straight from the desk (authoritative day/time/coach/location), enriching category/ages/duration
 * from the website's static program metadata by normalized name. Falls back to the fully static map
 * when the desk feed is empty (fetch failed or no live classes this season) so the page never breaks.
 */
export function getScheduleByLocationByDayWithLive(
  season: SeasonKey,
  liveClasses: DeskClass[]
): ScheduleByLocationByDay {
  const live = (liveClasses || []).filter(
    (c) => c && c.program && c.day && c.time && seasonMatches(season, c.season)
  )
  if (live.length === 0) return getScheduleByLocationByDay(season)

  const meta: Record<string, { programId: string; category: string; ages: string; duration: string }> = {}
  for (const prog of getProgramsForSeason(season)) {
    meta[normProgramName(prog.program)] = {
      programId: prog.id,
      category: prog.category,
      ages: prog.ages,
      duration: prog.duration,
    }
  }

  const out: ScheduleByLocationByDay = {}
  for (const c of live) {
    const loc = normalizeSlotLocation({ day: c.day, location: c.location }, c.location || '')
    if (!LOCATION_KEYS.includes(loc)) continue
    const m = meta[normProgramName(c.program)]
    const slot: CalendarSlot = {
      programId: m?.programId || normProgramName(c.program).replace(/\s+/g, '-'),
      programName: c.program,
      category: m?.category || inferCategory(c.program),
      ages: m?.ages || '',
      time: c.time,
      duration: m?.duration || durationFromTime(c.time),
      coach: c.coach,
    }
    if (!out[loc]) out[loc] = {}
    if (!out[loc][c.day]) out[loc][c.day] = []
    out[loc][c.day].push(slot)
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

/** Format minutes-from-midnight as "9:00 AM" / "12:30 PM" for merged grid labels. */
export function formatMinutesAsTimeLabel(mins: number): string {
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

/** Format an interval as "9:00 AM–10:30 AM" (full labels on both ends). */
export function formatMinutesRangeLabel(start: number, end: number): string {
  return `${formatMinutesAsTimeLabel(start)}–${formatMinutesAsTimeLabel(end)}`
}

/**
 * Merge overlapping same-day slots into one grid cell. Multi-program groups use one line each:
 * `9:00–9:45 AM — Little Tennis Stars` (sorted by start) so times stay visible on congested days.
 */
export function mergeOverlappingCalendarSlots(slots: CalendarSlot[]): CalendarSlot[] {
  type Item = { slot: CalendarSlot; start: number; end: number }
  const items: Item[] = []
  for (const slot of slots) {
    const p = parseTimeRangeToMinutes(slot.time)
    if (p) items.push({ slot, start: p.start, end: p.end })
  }
  items.sort((a, b) => a.start - b.start || b.end - a.end)

  const merged: CalendarSlot[] = []
  let i = 0
  while (i < items.length) {
    const group: Item[] = []
    let start = items[i].start
    let end = items[i].end
    group.push(items[i])
    i += 1
    while (i < items.length && items[i].start < end) {
      end = Math.max(end, items[i].end)
      group.push(items[i])
      i += 1
    }

    if (group.length === 1) {
      merged.push(group[0].slot)
      continue
    }

    group.sort((a, b) => a.start - b.start || a.end - b.end || a.slot.programName.localeCompare(b.slot.programName))
    const concurrentSessions: ConcurrentSessionRow[] = group.map((g) => ({
      time: g.slot.time,
      programName: g.slot.programName,
      category: g.slot.category,
      programId: g.slot.programId,
      ages: g.slot.ages ?? '',
    }))
    const lines = concurrentSessions.map((r) => `${r.time} — ${r.programName}`)
    merged.push({
      ...group[0].slot,
      programName: lines.join('\n'),
      time: formatMinutesRangeLabel(start, end),
      concurrentSessions,
    })
  }
  return merged
}

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
 * Overlapping slots: merged into one cell with multi-line programName and a union time range.
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
    const mergedSlots = mergeOverlappingCalendarSlots(slots)
    const dayIdx = dayIndexByDay[day]
    for (const slot of mergedSlots) {
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

/** Return the range of grid rows that have content (for trimming empty top/bottom). */
export function getUsedRowRange(
  grid: GridCell[][]
): { min: number; max: number } | null {
  let minR = grid.length
  let maxR = -1
  grid.forEach((row, r) => {
    const hasContent = row.some((c) => c !== null && c !== 'covered')
    if (hasContent) {
      minR = Math.min(minR, r)
      maxR = Math.max(maxR, r)
    }
  })
  return maxR >= minR ? { min: minR, max: maxR } : null
}
