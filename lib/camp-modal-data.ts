/**
 * Shared camp registration payload for LuxuryYearModal (/camps + /schedules).
 */
import type { CampWeek, CampWithWeeks } from '@/lib/camps-data'

export interface CampRegistrationData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  /** Half-day drop-in rate from year data — never derived from week bundle ÷ days */
  dropInRate?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
  weeks?: CampWeek[]
  selectedWeek?: CampWeek
}

export function buildCampModalRegistration(
  camp: CampWithWeeks,
  selectedWeek?: CampWeek
): CampRegistrationData {
  const w = selectedWeek
  return {
    id: camp.id,
    name: w ? `${camp.name} — ${w.label}` : camp.name,
    dates: w ? w.dates : camp.dates,
    days: w ? `${w.days} days` : camp.days,
    hours: camp.hours,
    ages: camp.ages,
    location: camp.location,
    price: w ? w.price : camp.price,
    perDay: camp.perDay,
    dropInRate: camp.perDay,
    halfDay: w?.halfDay ?? camp.halfDay,
    description: camp.description,
    includes: camp.includes,
    safetyNote: camp.safetyNote,
    featured: camp.featured,
    season: camp.season,
    coaches: camp.coaches,
    weeks: camp.weeks,
    selectedWeek: w,
  }
}
