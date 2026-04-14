/**
 * Single source of truth for programs and pricing.
 * All program/pricing data is derived from data/winter2026.json, data/spring-summer-2026.json (and related data files).
 */

import winter2026Data from '@/data/winter2026.json'
import springSummer2026Data from '@/data/spring-summer-2026.json'
import fall2026Data from '@/data/fall2026.json'
import privateRatesData from '@/data/private-rates.json'
import pricingSupplementalData from '@/data/pricing-supplemental.json'
import { getCurrentSeason, type SeasonKey } from '@/lib/season-utils'
import { PROGRAM_IMAGES } from '@/lib/program-images'

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
  pricingNote?: string
  matchPlay?: { monthly?: number; drop_in?: number }
}

export interface ProgramsOverviewCard {
  eyebrow: string
  title: string
  description: string
  href: string
  fromPrice: number
  /** Optional hero image path (under /images/programs/) for program card. */
  image?: string
  /** CSS object-position for object-cover (faces / full-body tuning). */
  objectPosition?: string
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

/** One UTR tier in Youth Development placement (from youth-development.utrPlacementBands.tiers). */
export interface YouthDevelopmentUtrTier {
  label: string
  utrRange: string
  focus: string
}

/** Youth Development UTR placement bands (from data/spring-summer-2026.json youth-development.utrPlacementBands). */
export interface YouthDevelopmentUtrPlacementBands {
  intro: string
  tiers: YouthDevelopmentUtrTier[]
  structure: string
  advancement: string
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
  /** Youth Development only: UTR band breakdown for flyer/schedules. */
  utrPlacementBands?: YouthDevelopmentUtrPlacementBands
}

const winter2026 = winter2026Data as unknown as {
  season: string
  dates: string
  programs: WinterProgram[]
}

const fall2026 = fall2026Data as unknown as {
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
    springBreak: {
      label: string
      dates: string
      options: Array<{
        name: string
        ages: string
        location?: string
        pricePerWeek: number
        perDay?: number
        hours?: string
      }>
      coach: string
    }
    summer: { label: string; dates: string; options: Array<{ name: string; ages: string; hours?: string; location?: string; pricePerWeek: number }>; coach: string }
  }
  programs: SpringSummerProgram[]
}

const privateRates = privateRatesData as PrivateRateRow[]

const overviewFallbacks = (pricingSupplementalData as { programsOverviewFallbacks?: Record<string, number> }).programsOverviewFallbacks ?? {}
const fallbackDefault = overviewFallbacks.default ?? 25
/** Fallbacks for overview "from" price when category is not in winter2026 (Camps/Leagues are separate offerings). */
const CAMPS_FROM_PRICE_FALLBACK = overviewFallbacks.camps ?? fallbackDefault
const LEAGUES_FROM_PRICE_FALLBACK = overviewFallbacks.leagues ?? fallbackDefault

/** Minimum price from a program's pricing object. */
function minPriceFromPricing(pricing: Record<string, number>): number {
  const values = Object.values(pricing).filter((v): v is number => typeof v === 'number')
  return values.length ? Math.min(...values) : 0
}

/** Normalize location string to Moulton / Alta / LBHS (used by schedules and calendar). */
export function formatLocation(loc: string): string {
  if (loc.includes('Moulton')) return 'Moulton'
  if (loc.includes('Alta')) return 'Alta'
  if (loc.includes('LBHS') || loc.includes('High School')) return 'LBHS'
  return loc
}

/** Get all Winter 2026 programs (single source for schedules/pricing page). */
export function getWinter2026Programs(): WinterProgram[] {
  return winter2026.programs
}

/** Get Fall 2026 programs (schedules page Fall tab). */
export function getFall2026Programs(): WinterProgram[] {
  return fall2026.programs
}

/** Get Spring & Summer 2026 data (programs, camps, discounts, season meta). Use for Spring/Summer tabs on schedules page. */
export function getSpringSummer2026(): typeof springSummer2026 {
  return springSummer2026
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
  pricingNote?: string
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
  const monthlyRaw = raw.monthly
  const dropIn = raw.drop_in as number | undefined
  const pricing: Record<string, number> = {}

  if (seasonPrices) {
    Object.assign(pricing, seasonPrices)
  } else if (typeof monthlyRaw === 'number') {
    pricing.monthly = monthlyRaw
  } else if (monthlyRaw && typeof monthlyRaw === 'object') {
    const monthlyObj = monthlyRaw as Record<string, number>
    Object.assign(pricing, monthlyObj)
    const base = monthlyObj['1x'] ?? Math.min(...Object.values(monthlyObj).filter((v): v is number => typeof v === 'number'))
    if (typeof base === 'number' && isFinite(base)) pricing.monthly = base
  }

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
    pricingNote: p.pricingNote,
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

  const fromJunior = juniorPrices.length ? Math.min(...juniorPrices) : (overviewFallbacks.junior ?? fallbackDefault)
  const fromYouth = youthPrices.length ? Math.min(...youthPrices) : (overviewFallbacks.youth ?? fallbackDefault)
  const fromHP = hpProgram ? minPriceFromPricing(hpProgram.pricing) : (overviewFallbacks.highPerformance ?? fallbackDefault)
  const fromAdult = adultPrices.length ? Math.min(...adultPrices) : (overviewFallbacks.adult ?? fallbackDefault)
  const fromFitness = fitnessPrices.length ? Math.min(...fitnessPrices) : (overviewFallbacks.fitness ?? fallbackDefault)

  return [
    {
      eyebrow: 'Ages 3–11',
      title: 'Junior Development',
      description: 'Where it begins. Build coordination, rhythm, and love for the game from Little Stars through Green Dot.',
      href: '/schedules',
      fromPrice: fromJunior,
      image: PROGRAM_IMAGES['little-tennis-stars'].src,
      objectPosition: PROGRAM_IMAGES['little-tennis-stars'].objectPosition,
    },
    {
      eyebrow: 'Ages 11–18',
      title: 'Junior Development',
      description: 'Two tiers by UTR — Tier 1 (UTR 1–4) and Tier 2 (UTR 4–7). Full-court training for growing competitors.',
      href: '/schedules',
      fromPrice: fromYouth,
      image: PROGRAM_IMAGES['player-development'].src,
      objectPosition: PROGRAM_IMAGES['player-development'].objectPosition,
    },
    {
      eyebrow: 'UTR 8+, College Bound',
      title: 'High Performance',
      description: 'UTR 8+ required. Selective training for advanced juniors preparing for tournaments and collegiate play.',
      href: '/schedules',
      fromPrice: fromHP,
      image: PROGRAM_IMAGES['high-performance'].src,
      objectPosition: PROGRAM_IMAGES['high-performance'].objectPosition,
    },
    {
      eyebrow: 'Beginner – Advanced',
      title: 'Adult Programs',
      description: 'Progression with purpose. From fundamentals to competitive match-play at every level.',
      href: '/schedules',
      fromPrice: fromAdult,
      image: PROGRAM_IMAGES['adult-intermediate'].src,
      objectPosition: PROGRAM_IMAGES['adult-intermediate'].objectPosition,
    },
    {
      eyebrow: 'Seasonal & Holiday',
      title: 'Camps',
      description: 'Tennis & Adventure, holiday breaks, and intensive sessions for juniors and youth.',
      href: '/camps',
      fromPrice: CAMPS_FROM_PRICE_FALLBACK,
      image: PROGRAM_IMAGES['camps'].src,
      objectPosition: PROGRAM_IMAGES['camps'].objectPosition,
    },
    {
      eyebrow: 'Cardio / LiveBall',
      title: 'Fitness & Community',
      description: 'High-energy sessions combining fitness, competition, and community. All levels welcome.',
      href: '/fitness',
      fromPrice: fromFitness,
      image: PROGRAM_IMAGES['liveball'].src,
      objectPosition: PROGRAM_IMAGES['liveball'].objectPosition,
    },
    {
      eyebrow: 'USTA & UTR',
      title: 'Leagues & Match Play',
      description: 'USTA Adult League teams and the UTR Match Play Series — league play vs. rated Saturday matchplay.',
      href: '/programs/leagues',
      fromPrice: LEAGUES_FROM_PRICE_FALLBACK,
      image: PROGRAM_IMAGES['leagues'].src,
      objectPosition: PROGRAM_IMAGES['leagues'].objectPosition,
    },
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

const LIVE_BALL_IDS: string[] = ['liveball', 'liveball-intermediate', 'liveball-advanced']

function isLiveBallProgramId(id: string): boolean {
  return LIVE_BALL_IDS.includes(id)
}

/** Schedule row shape (Winter uses required coach; Spring/Summer display may omit). */
export type LiveBallScheduleRow = {
  day: string
  time: string
  coach?: string
  note?: string
  location?: string
}

/** LiveBall rows for /liveball — same program ids and fields as the schedules page for the active season. */
export interface LiveBallProgramForPage {
  id: string
  program: string
  ages: string
  duration: string
  location: string
  schedule: LiveBallScheduleRow[]
  monthlyLabel: string
  dropInLabel: string
  description: string
}

export interface LiveBallSeasonSnapshot {
  seasonKey: SeasonKey
  seasonTitle: string
  seasonDates: string
  programs: LiveBallProgramForPage[]
}

function formatMonthlyDropIn(pricing: Record<string, number>): { monthly: string; dropIn: string } {
  const m = pricing.monthly
  const d = pricing.drop_in
  return {
    monthly: m != null ? `$${m}/mo` : '—',
    dropIn: d != null ? `$${d}` : '—',
  }
}

function winterProgramToLiveBallRow(p: WinterProgram): LiveBallProgramForPage {
  const { monthly, dropIn } = formatMonthlyDropIn(p.pricing)
  return {
    id: p.id,
    program: p.program,
    ages: p.ages,
    duration: p.duration,
    location: p.location,
    schedule: p.schedule,
    monthlyLabel: monthly,
    dropInLabel: dropIn,
    description: p.description,
  }
}

function programForDisplayToLiveBallRow(p: ProgramForDisplay): LiveBallProgramForPage {
  const { monthly, dropIn } = formatMonthlyDropIn(p.pricing)
  return {
    id: p.id,
    program: p.program,
    ages: p.ages,
    duration: p.duration,
    location: p.location,
    schedule: p.schedule,
    monthlyLabel: monthly,
    dropInLabel: dropIn,
    description: p.description,
  }
}

/**
 * LiveBall Intermediate + Advanced for the **current** season tab (Winter / Spring / Summer / Fall),
 * matching data/winter2026.json, data/spring-summer-2026.json, or data/fall2026.json.
 */
export function getLiveBallSeasonSnapshot(): LiveBallSeasonSnapshot {
  const key = getCurrentSeason()
  const order = (a: { id: string }, b: { id: string }) =>
    LIVE_BALL_IDS.indexOf(a.id) - LIVE_BALL_IDS.indexOf(b.id)

  if (key === 'winter') {
    const programs = winter2026.programs.filter(p => isLiveBallProgramId(p.id)).sort(order)
    return {
      seasonKey: key,
      seasonTitle: winter2026.season,
      seasonDates: winter2026.dates,
      programs: programs.map(winterProgramToLiveBallRow),
    }
  }

  if (key === 'fall') {
    const programs = fall2026.programs.filter(p => isLiveBallProgramId(p.id)).sort(order)
    return {
      seasonKey: key,
      seasonTitle: fall2026.season,
      seasonDates: fall2026.dates,
      programs: programs.map(winterProgramToLiveBallRow),
    }
  }

  if (key === 'spring') {
    const meta = springSummer2026.spring
    const programs = getSpringProgramsForDisplay().filter(p => isLiveBallProgramId(p.id)).sort(order)
    return {
      seasonKey: key,
      seasonTitle: `${meta.label} 2026`,
      seasonDates: meta.dates,
      programs: programs.map(programForDisplayToLiveBallRow),
    }
  }

  const meta = springSummer2026.summer
  const programs = getSummerProgramsForDisplay().filter(p => isLiveBallProgramId(p.id)).sort(order)
  return {
    seasonKey: 'summer',
    seasonTitle: `${meta.label} 2026`,
    seasonDates: meta.dates,
    programs: programs.map(programForDisplayToLiveBallRow),
  }
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
      const label = p.program
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
