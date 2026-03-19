/**
 * Court flyer program pricing — single source for /print/court-flyer and standalone PDF.
 * Uses flattened pricing from getSpringProgramsForDisplay / getSummerProgramsForDisplay
 * (same as schedules; handles monthly { 1x, 2x } via springSummerToProgram).
 */

import {
  formatLocation,
  getSpringProgramsForDisplay,
  getSummerProgramsForDisplay,
  type ProgramForDisplay,
} from '@/lib/programs-data'
import { FLYER_LOCATION_DISPLAY } from '@/lib/flyer-config'

export interface CourtFlyerPricingRow {
  name: string
  duration: string
  price_1x: string
  price_2x: string | null
  dropIn: string
  location: string
}

/** Format one program row for flyer tables (1x/wk, 2x/wk, drop-in). */
export function formatProgramPricingForFlyerRow(pricing: Record<string, number>): {
  price_1x: string
  price_2x: string | null
  dropIn: string
} {
  const monthly = typeof pricing.monthly === 'number' ? pricing.monthly : null
  const dropIn = typeof pricing.drop_in === 'number' ? pricing.drop_in : null
  const p1x = typeof pricing['1x'] === 'number' ? pricing['1x'] : monthly
  const p2x = typeof pricing['2x'] === 'number' ? pricing['2x'] : null
  return {
    price_1x: p1x != null ? (monthly != null ? `$${p1x}/mo` : `$${p1x}`) : '—',
    price_2x: p2x != null ? (monthly != null ? `$${p2x}/mo` : `$${p2x}`) : null,
    dropIn: dropIn != null ? `$${dropIn}` : 'N/A',
  }
}

function programToPricingRow(p: ProgramForDisplay): CourtFlyerPricingRow {
  const { price_1x, price_2x, dropIn } = formatProgramPricingForFlyerRow(p.pricing)
  const locKey = formatLocation(p.location)
  return {
    name: p.program,
    duration: p.duration,
    price_1x,
    price_2x,
    dropIn,
    location: FLYER_LOCATION_DISPLAY[locKey] ?? p.location,
  }
}

const JUNIOR_CATEGORIES = ['Junior', 'Youth']
const ADULT_CATEGORIES = ['Adult', 'Fitness']

/** Junior/Youth and Adult/Fitness rows for court flyer (spring or summer season). */
export function getCourtFlyerProgramPricingRows(season: 'spring' | 'summer'): {
  juniorPricing: CourtFlyerPricingRow[]
  adultPricing: CourtFlyerPricingRow[]
} {
  const programs =
    season === 'spring' ? getSpringProgramsForDisplay() : getSummerProgramsForDisplay()
  return {
    juniorPricing: programs
      .filter((p) => JUNIOR_CATEGORIES.includes(p.category))
      .map(programToPricingRow),
    adultPricing: programs
      .filter((p) => ADULT_CATEGORIES.includes(p.category))
      .map(programToPricingRow),
  }
}
