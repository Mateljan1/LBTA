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

/** Season label from JSON, e.g. "April 11 – June 13, 2026 · Grand Finals Night June 13" */
export function getUtrSeasonLabel(): string {
  return leagues().utr.seasonLabel ?? 'Season dates — see lagunabeachtennisacademy.com'
}

/** Structured dates for schema / meta (aligned with page). */
export function getUtrSeasonIsoRange(): { startDate: string; endDate: string } {
  return { startDate: '2026-04-11', endDate: '2026-06-13' }
}

/** Human duration for form prefill — must match JSON season. */
export function getUtrCircuitFormDuration(): string {
  const label = getUtrSeasonLabel()
  const main = label.split('·')[0]?.trim() ?? label
  return `8 Saturdays (${main})`
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
  }))
}

export function getNtrpToUtrReference() {
  return leagues().utr.ntrpToUtr
}

const UTR_SATURDAY_WEEKS = 8

/** Builds LuxuryYearModal payload for UTR Match Play Series. */
export function getUtrCircuitModalData(): UtrCircuitModalData {
  const { utr } = leagues()
  return {
    id: 'utr-match-play-series-s1',
    name: 'UTR Match Play Series — Season 1',
    dates: getUtrSeasonLabel(),
    weeks: UTR_SATURDAY_WEEKS,
    matchDay: 'Saturdays · times vary by division',
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
