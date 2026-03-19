/**
 * UTR Circuit registration modal pricing is derived from data/leagues-2026.json
 * (utr.divisions[].price) so it stays aligned with Schedules / leagues pages.
 * Do not duplicate a flat dollar amount in pricing-supplemental.json for this program.
 */

import rawLeagues from '@/data/leagues-2026.json'
import { parseLeagues } from '@/lib/schedule-schemas'

function parsePriceToNumber(price: string): number | null {
  const n = parseInt(String(price).replace(/[$,]/g, '').trim(), 10)
  return Number.isFinite(n) ? n : null
}

/** Display string for LuxuryYearModal / form prefill (division-based season). */
export function getUtrCircuitModalPricingSummary(): string {
  const { utr } = parseLeagues(rawLeagues)
  const amounts = utr.divisions
    .map((d) => parsePriceToNumber(d.price))
    .filter((n): n is number => n !== null)
  if (amounts.length === 0) return 'Contact for pricing'
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)
  if (min === max) return `$${min.toLocaleString('en-US')}`
  return `$${min.toLocaleString('en-US')}–$${max.toLocaleString('en-US')} by division`
}
