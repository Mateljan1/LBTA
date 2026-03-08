/**
 * Single source of truth for programs and pricing.
 * All program/pricing data is derived from data/winter2026.json, data/spring-summer-2026.json (and related data files).
 */

import winter2026Data from '@/data/winter2026.json'
import springSummer2026Data from '@/data/spring-summer-2026.json'
import privateRatesData from '@/data/private-rates.json'

export interface WinterProgram {
  id: string
  category: string
  program: string
  ages: string
  location: string
  duration: string
  schedule: Array<{ day: string; time: string; coach: string; note?: string; location?: string }>
  pricing: Record<string, number>
  description: string
}

export interface ProgramsOverviewCard {
  eyebrow: string
  title: string
  description: string
  href: string
  fromPrice: number
}

export interface PricingRowJunior {
  name: string
  duration: string
  ages: string
  billing: string
  price_1x: string
  price_2x: string | null
  dropIn: string
  location: string
}

export interface PricingRowAdult {
  name: string
  duration: string
  level: string
  billing: string
  price_1x: string
  price_2x: string | null
  dropIn: string
  location: string
}

export interface PrivateRateRow {
  coach: string
  specialty: string
  rate_60: number
  rate_90: number
  pack_10?: number
  pack_20?: number
  note?: string
}

/** Spring/Summer program: pricing may be monthly or season-specific (spring/summer). */
export interface SpringSummerProgram {
  id: string
  category: string
  program: string
  ages: string
  location: string
  duration: string
  schedule: Array<{ day: string; time: string; coach: string; note?: string; location?: string }>
  pricing: Record<string, unknown> // { monthly?: { 1x, 2x }; spring?: { 1x, 2x, ... }; summer?: { 1x, 2x, ... }; drop_in? }
  description: string
  pricingNote?: string
  matchPlay?: { monthly?: number; drop_in?: number }
}

const winter2026 = winter2026Data as unknown as {
  season: string
  dates: string
  programs: WinterProgram[]
}

const springSummer2026 = springSummer2026Data as unknown as {
  season: string
  spring: { label: string; dates: string; weeks: number; skipDates: string[] }
  summer: { label: string; dates: string; weeks: number; skipDates: string[] }
  discounts: Array<{ label: string; percent: number; description: string }>
  camps: {
    springBreak: { label: string; dates: string; options: Array<{ name: string; ages: string; location?: string; pricePerWeek: number }>; coach: string }
    summer: { label: string; dates: string; options: Array<{ name: string; ages: string; hours?: string; location?: string; pricePerWeek: number }>; coach: string }
  }
  programs: SpringSummerProgram[]
}

const privateRates = privateRatesData as PrivateRateRow[]

/** Fallbacks for overview "from" price when category is not in winter2026 (Camps/Leagues are separate offerings). */
const CAMPS_FROM_PRICE_FALLBACK = 120
const LEAGUES_FROM_PRICE_FALLBACK = 25

/** Minimum price from a program's pricing object. */
function minPriceFromPricing(pricing: Record<string, number>): number {
  const values = Object.values(pricing).filter((v): v is number => typeof v === 'number')
  return values.length ? Math.min(...values) : 0
}

function formatLocation(loc: string): string {
  if (loc.includes('Moulton')) return 'Moulton'
  if (loc.includes('Alta')) return 'Alta'
  if (loc.includes('LBHS') || loc.includes('High School')) return 'LBHS'
  return loc
}

/** Get all Winter 2026 programs (single source for schedules/pricing page). */
export function getWinter2026Programs(): WinterProgram[] {
  return winter2026.programs
}

/** Get Spring & Summer 2026 data (programs, camps, discounts, season meta). Use for Spring/Summer tabs on schedules page. */
export function getSpringSummer2026(): typeof springSummer2026 {
  return springSummer2026
}

/** Get Spring 2026 programs (same list as summer; pricing differs by season). */
export function getSpringPrograms(): SpringSummerProgram[] {
  return springSummer2026.programs
}

/** Get Summer 2026 programs (same list as spring; pricing differs by season). */
export function getSummerPrograms(): SpringSummerProgram[] {
  return springSummer2026.programs
}

/** Program shape used by ProgramCard / schedules page (flat pricing). */
export interface ProgramForDisplay {
  id: string
  category: string
  program: string
  ages: string
  location: string
  duration: string
  schedule: Array<{ day: string; time: string; coach?: string; note?: string; location?: string }>
  pricing: Record<string, number>
  description: string
  coach?: string
}

/**
 * Normalize Spring/Summer program to ProgramCard Program shape by flattening
 * pricing for the given season (spring → pricing.spring or pricing.monthly, same for summer).
 */
export function springSummerToProgram(
  p: SpringSummerProgram,
  season: 'spring' | 'summer'
): ProgramForDisplay {
  const raw = p.pricing as Record<string, unknown>
  const seasonPrices = raw[season] as Record<string, number> | undefined
  const monthlyPrices = raw.monthly as Record<string, number> | undefined
  const dropIn = raw.drop_in as number | undefined
  const source = seasonPrices ?? monthlyPrices ?? {}
  const pricing: Record<string, number> = { ...source }
  if (typeof dropIn === 'number') pricing.drop_in = dropIn
  return {
    id: p.id,
    category: p.category,
    program: p.program,
    ages: p.ages,
    location: p.location,
    duration: p.duration,
    schedule: p.schedule,
    pricing,
    description: p.description,
  }
}

/** Get Spring 2026 programs as ProgramForDisplay[] (for schedules page Programs tab). */
export function getSpringProgramsForDisplay(): ProgramForDisplay[] {
  return springSummer2026.programs.map((p) => springSummerToProgram(p, 'spring'))
}

/** Get Summer 2026 programs as ProgramForDisplay[] (for schedules page Programs tab). */
export function getSummerProgramsForDisplay(): ProgramForDisplay[] {
  return springSummer2026.programs.map((p) => springSummerToProgram(p, 'summer'))
}

/** Get programs overview cards with fromPrice derived from winter2026 (no hardcoded prices). */
export function getProgramsOverview(): ProgramsOverviewCard[] {
  const programs = winter2026.programs

  const juniorPrices = programs.filter(p => p.category === 'Junior').flatMap(p => Object.values(p.pricing))
  const youthPrices = programs.filter(p => p.category === 'Youth').flatMap(p => Object.values(p.pricing))
  const adultPrices = programs.filter(p => p.category === 'Adult').flatMap(p => Object.values(p.pricing))
  const fitnessPrices = programs.filter(p => p.category === 'Fitness').flatMap(p => Object.values(p.pricing))
  const hpProgram = programs.find(p => p.id === 'high-performance')

  const fromJunior = juniorPrices.length ? Math.min(...juniorPrices) : 25
  const fromYouth = youthPrices.length ? Math.min(...youthPrices) : 55
  const fromHP = hpProgram ? minPriceFromPricing(hpProgram.pricing) : 58
  const fromAdult = adultPrices.length ? Math.min(...adultPrices) : 31
  const fromFitness = fitnessPrices.length ? Math.min(...fitnessPrices) : 50

  return [
    { eyebrow: 'Ages 3–11', title: 'Junior Development', description: 'Where it begins. Build coordination, rhythm, and love for the game from Little Stars through Green Dot.', href: '/schedules', fromPrice: fromJunior },
    { eyebrow: 'Ages 11–18', title: 'Youth Development', description: 'Full-court training for growing competitors. Technical precision, tactical awareness, and structured match play.', href: '/schedules', fromPrice: fromYouth },
    { eyebrow: 'UTR 5–8, College Bound', title: 'High Performance', description: 'Invitation-only training for advanced juniors preparing for tournaments and collegiate play.', href: '/schedules', fromPrice: fromHP },
    { eyebrow: 'Beginner – Advanced', title: 'Adult Programs', description: 'Progression with purpose. From fundamentals to competitive match-play at every level.', href: '/schedules', fromPrice: fromAdult },
    { eyebrow: 'Seasonal & Holiday', title: 'Camps', description: 'Swim & tennis, holiday breaks, and intensive sessions for juniors and youth.', href: '/camps', fromPrice: CAMPS_FROM_PRICE_FALLBACK },
    { eyebrow: 'Cardio / LiveBall', title: 'Fitness & Community', description: 'High-energy sessions combining fitness, competition, and community. All levels welcome.', href: '/fitness', fromPrice: fromFitness },
    { eyebrow: 'USTA & UTR', title: 'Leagues & Circuit', description: 'USTA Adult League, UTR Match Play Series, and competitive circuit opportunities.', href: '/programs/leagues', fromPrice: LEAGUES_FROM_PRICE_FALLBACK },
  ]
}

/** Winter 2026 junior programs as pricing table rows (single source). */
export function getPricingJuniors(): PricingRowJunior[] {
  return winter2026.programs
    .filter(p => p.category === 'Junior')
    .map(p => {
      const billing = p.pricing.monthly != null ? 'Monthly' : 'Quarterly'
      const price1x = p.pricing.monthly != null ? `$${p.pricing.monthly}/mo` : p.pricing['1x'] != null ? `$${p.pricing['1x']}.00` : ''
      const price2x = p.pricing['2x'] != null ? `$${p.pricing['2x']}.00` : null
      const dropIn = p.pricing.drop_in != null ? `$${p.pricing.drop_in}` : ''
      return {
        name: p.program,
        duration: p.duration,
        ages: p.ages,
        billing,
        price_1x: price1x,
        price_2x: price2x,
        dropIn,
        location: formatLocation(p.location),
      }
    })
}

/** Winter 2026 youth programs as pricing table rows (single source). */
export function getPricingYouth(): PricingRowJunior[] {
  return winter2026.programs
    .filter(p => p.category === 'Youth')
    .map(p => {
      const billing = 'Quarterly'
      const price1x = p.pricing['1x'] != null ? `$${p.pricing['1x']}.00` : ''
      const price2x = p.pricing['2x'] != null ? `$${p.pricing['2x']}.00` : null
      const dropIn = p.pricing.drop_in != null ? `$${p.pricing.drop_in}` : ''
      return {
        name: p.program,
        duration: p.duration,
        ages: p.ages,
        billing,
        price_1x: price1x,
        price_2x: price2x,
        dropIn,
        location: formatLocation(p.location),
      }
    })
}

/** Winter 2026 adult programs as pricing table rows (single source). */
export function getPricingAdults(): PricingRowAdult[] {
  return winter2026.programs
    .filter(p => p.category === 'Adult')
    .map(p => {
      const billing = 'Quarterly'
      const price1x = p.pricing['1x'] != null ? `$${p.pricing['1x']}.00` : ''
      const price2x = p.pricing['2x'] != null ? `$${p.pricing['2x']}.00` : null
      const dropIn = p.pricing.drop_in != null ? `$${p.pricing.drop_in}` : ''
      return {
        name: p.program,
        duration: p.duration,
        level: p.ages,
        billing,
        price_1x: price1x,
        price_2x: price2x,
        dropIn,
        location: formatLocation(p.location),
      }
    })
}

/** Winter 2026 Cardio/LiveBall (Fitness) programs as pricing table rows (single source). */
export function getPricingCardioLiveball(): PricingRowAdult[] {
  return winter2026.programs
    .filter(p => p.category === 'Fitness')
    .map(p => {
      const billing = p.pricing.monthly != null ? 'Monthly' : 'Quarterly'
      const price1x = p.pricing.monthly != null ? `$${p.pricing.monthly}/mo` : p.pricing['1x'] != null ? `$${p.pricing['1x']}.00` : ''
      const dropIn = p.pricing.drop_in != null ? `$${p.pricing.drop_in}` : ''
      return {
        name: p.program,
        duration: p.duration,
        level: p.ages,
        billing,
        price_1x: price1x,
        price_2x: null,
        dropIn,
        location: formatLocation(p.location),
      }
    })
}

/** Private lesson rates from data/private-rates.json (single source). */
export function getPrivateRates(): PrivateRateRow[] {
  return privateRates
}

/** Fitness classes derived from Winter 2026 Fitness programs (single source). */
export function getFitnessClasses(): Array<{ name: string; day: string; time: string; location: string; price: string }> {
  const fitness = winter2026.programs.filter(p => p.category === 'Fitness')
  return fitness.flatMap(p => {
    const priceStr = p.pricing.monthly != null ? `$${p.pricing.monthly}/mo` : p.pricing.drop_in != null ? `$${p.pricing.drop_in}/drop-in` : ''
    return p.schedule.map(s => ({
      name: p.program,
      day: s.day,
      time: s.time,
      location: (s as { location?: string }).location || p.location,
      price: priceStr || (p.pricing.drop_in != null ? `$${p.pricing.drop_in}` : ''),
    }))
  })
}

/** Trial program options for booking modal and book page (single source). Values match API/PROGRAM_TAGS. */
export interface TrialProgramOption {
  value: string
  label: string
  ages: string
}

export function getTrialProgramOptions(): TrialProgramOption[] {
  const fromWinter = winter2026.programs
    .filter(p =>
      ['little-stars', 'red-ball', 'orange-ball', 'green-dot', 'youth-development', 'high-performance',
        'adult-beginner-1', 'adult-beginner-2', 'adult-intermediate', 'adult-advanced', 'cardio-tennis'].includes(p.id)
    )
    .map(p => {
      const value = p.id === 'little-stars' ? 'little-tennis-stars' : p.id === 'adult-beginner-1' || p.id === 'adult-beginner-2' ? 'adult-beginner' : p.id
      const label = p.id === 'adult-beginner-2' ? 'Adult Beginner (Bridge)' : p.program
      return { value, label, ages: p.ages }
    })
  const uniq = fromWinter.filter((o, i, a) => a.findIndex(x => x.value === o.value) === i)
  const ordered: TrialProgramOption[] = []
  const order = ['little-tennis-stars', 'red-ball', 'orange-ball', 'green-dot', 'youth-development', 'high-performance', 'adult-beginner', 'adult-intermediate', 'adult-advanced', 'cardio-tennis']
  for (const v of order) {
    const found = uniq.find(o => o.value === v)
    if (found) ordered.push(found)
  }
  ordered.push(
    { value: 'private-lessons', label: 'Private Lessons', ages: 'All Ages' },
    { value: 'not-sure', label: 'Not Sure - Help Me Choose', ages: '' }
  )
  return ordered
}
