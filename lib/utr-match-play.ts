/**
 * UTR Match Play Series — page + modal payload from data/leagues-2026.json (utr block).
 * Single source for dates, divisions, and registration modal data.
 */

import rawLeagues from '@/data/leagues-2026.json'
import { parseLeagues, type LeaguesData } from '@/lib/schedule-schemas'

/** Modal contract (matches LuxuryYearModal UTRCircuitData). */
export interface UtrCircuitModalData {
  id: string
  name: string
  dates: string
  weeks: number
  matchDay: string
  divisions: { age: string; price: number }[]
  includes: string[]
}

function parsePriceToNumber(price: string): number {
  const n = parseInt(String(price).replace(/[$,]/g, '').trim(), 10)
  return Number.isFinite(n) ? n : 0
}

let cached: LeaguesData | null = null

function leagues(): LeaguesData {
  if (!cached) cached = parseLeagues(rawLeagues)
  return cached
}

/** Season label from JSON, e.g. "April 11 – June 6, 2026 · Grand Finals June 6" */
export function getUtrSeasonLabel(): string {
  return leagues().utr.seasonLabel ?? 'Season dates — see lagunabeachtennisacademy.com'
}

/** Eight regular-season Saturdays if JSON omits the list (weekly from first Saturday). */
function fallbackRegularSaturdays(): string[] {
  const out: string[] = []
  const start = new Date('2026-04-11T12:00:00')
  for (let i = 0; i < 8; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i * 7)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

/** ISO dates (YYYY-MM-DD) for each regular Saturday matchplay. Weekend reference pricing is per division when the academy confirms space (not self-serve online). */
export function getUtrRegularSeasonSaturdays(): string[] {
  const list = leagues().utr.regularSeasonSaturdays
  if (list && list.length > 0) return list
  return fallbackRegularSaturdays()
}

/** ISO dates for each regular-season Sunday — from JSON or Saturday + 1 day. */
export function getUtrRegularSeasonSundays(): string[] {
  const list = leagues().utr.regularSeasonSundays
  if (list && list.length > 0) return list
  return getUtrRegularSeasonSaturdays().map((iso) => {
    const d = new Date(`${iso}T12:00:00`)
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })
}

export function getUtrGrandFinalsIso(): string {
  return leagues().utr.grandFinalsDate ?? '2026-06-06'
}

export function getUtrSaturdayVenueShort(): string {
  return leagues().utr.saturdayVenueShort ?? 'Alta Laguna Park'
}

export function getUtrSundayVenueShort(): string {
  return leagues().utr.sundayVenueShort ?? 'Laguna Beach HS'
}

export function getUtrGrandFinalsVenueShort(): string {
  return leagues().utr.grandFinalsVenueShort ?? 'Laguna Beach High School'
}

/** Structured dates for schema / meta (first Saturday → Grand Finals). */
export function getUtrSeasonIsoRange(): { startDate: string; endDate: string } {
  const saturdays = getUtrRegularSeasonSaturdays()
  return {
    startDate: saturdays[0] ?? '2026-04-11',
    endDate: getUtrGrandFinalsIso(),
  }
}

export function formatUtrSessionDateLong(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/** Schedule cells, e.g. "April 11" */
export function formatUtrSessionDateMonthDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(d)
}

/** Compact Grand Finals date for pills, e.g. "June 6, 2026" — from ISO in leagues data. */
export function formatUtrGrandFinalsShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/** Season range for hero, e.g. "April 11 – June 6, 2026" — from JSON dates only. */
export function formatUtrSeasonRangeDisplay(): string {
  const { startDate, endDate } = getUtrSeasonIsoRange()
  const s = new Date(`${startDate}T12:00:00`)
  const e = new Date(`${endDate}T12:00:00`)
  const start = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(s)
  const end = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(e)
  return `${start} – ${end}`
}

/**
 * Marketing badge for current week of the 8 Saturday blocks (Season 1).
 * Before first Saturday → WEEK 1 OF 8; during calendar week of a Saturday → that week; after last → WEEK 8 OF 8.
 */
export function getUtrWeekBadgeLabel(): string {
  const saturdays = getUtrRegularSeasonSaturdays()
  if (saturdays.length === 0) return 'SEASON 1'
  const now = new Date()
  const first = new Date(`${saturdays[0]}T00:00:00`)
  if (now < first) return 'WEEK 1 OF 8'

  for (let i = 0; i < saturdays.length; i++) {
    const start = new Date(`${saturdays[i]}T00:00:00`)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    if (now >= start && now <= end) return `WEEK ${i + 1} OF 8`
  }

  const lastStart = new Date(`${saturdays[saturdays.length - 1]}T00:00:00`)
  if (now > lastStart) return 'WEEK 8 OF 8'
  return 'WEEK 1 OF 8'
}


/** Labels for drop-in date pickers on division cards (regular-season dates only). */
export function getUtrDropInDateOptions(
  matchDay?: 'Saturday' | 'Sunday'
): { iso: string; label: string }[] {
  const isos =
    matchDay === 'Sunday' ? getUtrRegularSeasonSundays() : getUtrRegularSeasonSaturdays()
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return isos.map((iso) => ({
    iso,
    label: fmt.format(new Date(`${iso}T12:00:00`)),
  }))
}

/** Human duration for form prefill — must match JSON season. */
export function getUtrCircuitFormDuration(): string {
  const label = getUtrSeasonLabel()
  const main = label.split('·')[0]?.trim() ?? label
  return `8 weekends (${main})`
}

export interface UtrDivisionCard {
  name: string
  level: string
  format: string
  note?: string
  price: string
  dropIn?: number
  time: string
  venue: string
  image?: string
  imageAlt?: string
  imageObjectPosition?: string
  matchDay?: 'Saturday' | 'Sunday'
  ctaStyle?: 'teal' | 'sunset'
}

export function getUtrDivisionsForPage(): UtrDivisionCard[] {
  return leagues().utr.divisions.map((d) => ({
    name: d.name,
    level: d.level,
    format: d.format,
    note: d.note,
    price: d.price,
    dropIn: d.drop_in,
    time: d.time,
    venue: d.venue,
    image: d.image,
    imageAlt: d.imageAlt,
    imageObjectPosition: d.imageObjectPosition,
    matchDay: d.match_day,
    ctaStyle: d.cta_style,
  }))
}

export function getNtrpToUtrReference() {
  return leagues().utr.ntrpToUtr
}

const UTR_SEASON_WEEKENDS = 8

/** Builds LuxuryYearModal payload for UTR Match Play Series. */
export function getUtrCircuitModalData(): UtrCircuitModalData {
  const { utr } = leagues()
  return {
    id: 'utr-match-play-series-s1',
    name: 'UTR Match Play Series — Season 1',
    dates: getUtrSeasonLabel(),
    weeks: UTR_SEASON_WEEKENDS,
    matchDay: 'Saturdays & Sundays · times vary by division',
    divisions: utr.divisions.map((d) => ({
      age: d.name,
      price: parsePriceToNumber(d.price),
    })),
    includes: [
      'Rated matchplay with same-day UTR submission',
      'Season points and Grand Finals night',
      'Division placement by skill level',
    ],
  }
}
