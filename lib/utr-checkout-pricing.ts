/**
 * Server-only UTR season checkout amounts from leagues JSON (never trust client price).
 */

import rawLeagues from '@/data/leagues-2026.json'
import { parseLeagues } from '@/lib/schedule-schemas'

let cached: ReturnType<typeof parseLeagues> | null = null

function leagues() {
  if (!cached) cached = parseLeagues(rawLeagues)
  return cached
}

function parsePriceToNumber(price: string): number {
  const n = parseInt(String(price).replace(/[$,]/g, '').trim(), 10)
  return Number.isFinite(n) ? n : 0
}

export function getAllowedUtrDivisionNames(): string[] {
  return leagues().utr.divisions.map((d) => d.name)
}

/**
 * Resolve full-season USD amount in cents for Stripe from division name.
 * Returns null if division is not in catalog.
 */
export function resolveUtrDivisionAmountCents(divisionName: string): number | null {
  const trimmed = divisionName.trim()
  const div = leagues().utr.divisions.find((d) => d.name === trimmed)
  if (!div) return null
  const dollars = parsePriceToNumber(div.price)
  if (dollars <= 0) return null
  return Math.round(dollars * 100)
}
