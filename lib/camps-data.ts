/**
 * Camps page data from year2026.json (single source of truth).
 * Adds season and week arrays for summer/swim-tennis using prices from data.
 */
import year2026Data from '@/data/year2026.json'

const year2026 = year2026Data as {
  year: number
  campWeekDefaults?: { threeDayFullSummer: number; threeDayHalfSummer: number; threeDayFullSwimTennis: number }
  camps: unknown[]
}
if (!year2026.campWeekDefaults) {
  throw new Error('data/year2026.json must define campWeekDefaults (threeDayFullSummer, threeDayHalfSummer, threeDayFullSwimTennis)')
}
const CAMP_WEEK_DEFAULTS = year2026.campWeekDefaults

export interface CampWeek {
  week: number
  dates: string
  label: string
  days: number
  price: number
  halfDay?: number
}

interface YearCamp {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  threeDayFullPrice?: number
  threeDayHalfPrice?: number
  description: string
  includes?: string[]
  coaches?: string[]
  featured?: boolean
  safetyNote?: string
}

export interface CampWithWeeks extends YearCamp {
  season: string
  weeks?: CampWeek[]
}

const SEASON_BY_ID: Record<string, string> = {
  'swim-tennis': 'summer',
  'ski-week': 'winter',
  'spring-break': 'spring',
  summer: 'summer',
  'back-to-school': 'summer',
  thanksgiving: 'fall',
  'winter-break': 'winter',
}

// Week date ranges for summer 2026 (from year2026 seasons.summer)
const SUMMER_WEEK_DATES: { dates: string; label: string; days: number }[] = [
  { dates: 'June 15–19', label: 'Week 1', days: 5 },
  { dates: 'June 22–26', label: 'Week 2', days: 5 },
  { dates: 'June 29 – July 3', label: 'Week 3', days: 5 },
  { dates: 'July 7–11', label: 'Week 4', days: 5 },
  { dates: 'July 14–18', label: 'Week 5', days: 5 },
  { dates: 'July 21–25', label: 'Week 6', days: 5 },
  { dates: 'July 28 – August 1', label: 'Week 7', days: 5 },
  { dates: 'August 4–8', label: 'Week 8', days: 5 },
  { dates: 'August 11–15', label: 'Week 9', days: 5 },
  { dates: 'August 17–19', label: 'Back-to-School (3 days)', days: 3 },
]

const SWIM_TENNIS_WEEK_DATES: { dates: string; label: string; days: number }[] = [
  { dates: 'June 16–19', label: 'Week 1', days: 4 },
  { dates: 'June 23–26', label: 'Week 2', days: 4 },
  { dates: 'June 30 – July 3', label: 'Week 3', days: 4 },
  { dates: 'July 7–10', label: 'Week 4', days: 4 },
  { dates: 'July 14–17', label: 'Week 5', days: 4 },
  { dates: 'July 21–24', label: 'Week 6', days: 4 },
  { dates: 'July 28–31', label: 'Week 7', days: 4 },
  { dates: 'August 4–7', label: 'Week 8', days: 4 },
  { dates: 'August 11–14', label: 'Week 9', days: 4 },
  { dates: 'August 17–19', label: 'Back-to-School (3 days)', days: 3 },
]

function buildSummerWeeks(camp: YearCamp): CampWeek[] {
  const price = camp.price
  const halfDay = camp.halfDay
  const threeDayFull = camp.threeDayFullPrice ?? CAMP_WEEK_DEFAULTS.threeDayFullSummer
  const threeDayHalf = camp.threeDayHalfPrice ?? CAMP_WEEK_DEFAULTS.threeDayHalfSummer
  return SUMMER_WEEK_DATES.map((w, i) => ({
    week: i + 1,
    dates: w.dates,
    label: w.label,
    days: w.days,
    price: w.days === 3 ? threeDayFull : price,
    halfDay: w.days === 3 ? threeDayHalf : halfDay,
  }))
}

function buildSwimTennisWeeks(camp: YearCamp): CampWeek[] {
  const price = camp.price
  const threeDayFull = camp.threeDayFullPrice ?? CAMP_WEEK_DEFAULTS.threeDayFullSwimTennis
  return SWIM_TENNIS_WEEK_DATES.map((w, i) => ({
    week: i + 1,
    dates: w.dates,
    label: w.label,
    days: w.days,
    price: w.days === 3 ? threeDayFull : price,
  }))
}

export function getCampsFromYear2026(): CampWithWeeks[] {
  const list = (year2026.camps as YearCamp[]).map((c) => {
    const season = SEASON_BY_ID[c.id] ?? 'summer'
    const camp: CampWithWeeks = { ...c, season }
    if (c.id === 'summer') camp.weeks = buildSummerWeeks(c)
    if (c.id === 'swim-tennis') camp.weeks = buildSwimTennisWeeks(c)
    return camp
  })
  return list
}
