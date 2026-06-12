import year2026Data from '@/data/year2026.json'

export type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall'
export type ExtendedSeasonKey = SeasonKey | 'fall2025'

/** Season shape for client/schedule UI (optional fields match JSON). */
export type SeasonDataForDisplay = {
  name: string
  dates: string
  weeks: number
  registrationOpen?: string
  earlyBirdDeadline?: string
  earlyBirdDiscount?: number
  status?: string
  multiplier?: number
  skipDates?: string[]
}

interface SeasonData {
  name: string
  dates: string
  weeks: number
  registrationOpen: string
  earlyBirdDeadline: string
  earlyBirdDiscount: number
  status?: string // advisory only; runtime derives from dates
  multiplier: number
  skipDates?: string[]
}

interface ActiveSeason {
  key: SeasonKey
  name: string
  dates: string
  weeks: number
  status: string
}

interface SeasonCTA {
  headline: string
  subline: string
  showEarlyBird: boolean
  earlyBirdDeadline: string | null
  earlyBirdDiscount: number
}

const SEASON_ORDER: SeasonKey[] = ['winter', 'spring', 'summer', 'fall']

/** Season keys in display order (for tabs, filters). */
export const SEASON_KEYS: SeasonKey[] = [...SEASON_ORDER]

/** Short labels for calendar/schedule UI. */
export const SEASON_LABELS: Record<SeasonKey, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
}

function parseSeasonEndDate(dates: string): Date {
  const parts = dates.split('–')
  if (parts.length < 2) return new Date(dates.trim())
  const endPart = parts[1].trim().replace(/,?\s*\d{4}$/, '')
  const yearMatch = dates.match(/\d{4}/)
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear()
  return new Date(`${endPart}, ${year}`)
}

function parseSeasonStartDate(dates: string): Date {
  const parts = dates.split('–')
  const startPart = parts[0].trim()
  const yearMatch = dates.match(/\d{4}/)
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear()
  return new Date(`${startPart}, ${year}`)
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

/**
 * Derives season status from calendar dates rather than the hand-edited JSON field.
 *
 * Rules (in priority order):
 *   today > end                         → 'complete'
 *   start ≤ today ≤ end                 → 'active'
 *   registrationOpen ≤ today < start    → 'registration_open'
 *   today < registrationOpen            → 'coming_soon'
 */
export function deriveSeasonStatus(season: Pick<SeasonData, 'dates' | 'registrationOpen'>, now: Date = new Date()): string {
  const start = parseSeasonStartDate(season.dates)
  const end = parseSeasonEndDate(season.dates)
  const regOpen = parseDate(season.registrationOpen)

  if (now > end) return 'complete'
  if (now >= start) return 'active'
  if (now >= regOpen) return 'registration_open'
  return 'coming_soon'
}

/**
 * Returns the current season based on today's date and the season date ranges.
 * If between seasons, returns the next upcoming season.
 */
export function getCurrentSeason(now: Date = new Date()): SeasonKey {
  const seasons = year2026Data.seasons as Record<string, SeasonData>

  for (const key of SEASON_ORDER) {
    const season = seasons[key]
    if (!season) continue
    const start = parseSeasonStartDate(season.dates)
    const end = parseSeasonEndDate(season.dates)
    if (now >= start && now <= end) return key
  }

  for (const key of SEASON_ORDER) {
    const season = seasons[key]
    if (!season) continue
    const start = parseSeasonStartDate(season.dates)
    if (now < start) return key
  }

  return 'winter'
}

/**
 * Returns the most relevant season for display — prioritizes seasons with
 * open registration, then falls back to the current season.
 */
export function getActiveSeason(now: Date = new Date()): ActiveSeason {
  const seasons = year2026Data.seasons as Record<string, SeasonData>
  const currentKey = getCurrentSeason(now)

  for (const key of SEASON_ORDER) {
    const season = seasons[key]
    if (!season) continue
    const status = deriveSeasonStatus(season, now)
    if (status === 'registration_open') {
      return {
        key: key as SeasonKey,
        name: season.name,
        dates: season.dates,
        weeks: season.weeks,
        status,
      }
    }
  }

  const current = seasons[currentKey]
  return {
    key: currentKey,
    name: current.name,
    dates: current.dates,
    weeks: current.weeks,
    status: deriveSeasonStatus(current, now),
  }
}

/**
 * Returns CTA messaging appropriate for the current moment in the season cycle.
 */
export function getSeasonCTA(now: Date = new Date()): SeasonCTA {
  const seasons = year2026Data.seasons as Record<string, SeasonData>

  for (const key of SEASON_ORDER) {
    const season = seasons[key]
    if (!season) continue
    const status = deriveSeasonStatus(season, now)
    if (status !== 'registration_open' && status !== 'active') continue

    const earlyBirdEnd = parseDate(season.earlyBirdDeadline)
    const isEarlyBird = now < earlyBirdEnd
    const startDate = parseSeasonStartDate(season.dates)
    const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    if (status === 'registration_open') {
      return {
        headline: `${season.name} Registration Open`,
        subline: isEarlyBird
          ? `Starts ${startFormatted}. Early bird pricing available through ${earlyBirdEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`
          : `Starts ${startFormatted}. Register now to secure your spot.`,
        showEarlyBird: isEarlyBird,
        earlyBirdDeadline: isEarlyBird ? season.earlyBirdDeadline : null,
        earlyBirdDiscount: season.earlyBirdDiscount,
      }
    }

    if (status === 'active') {
      const nextKey = SEASON_ORDER[SEASON_ORDER.indexOf(key as SeasonKey) + 1]
      const nextSeason = nextKey ? seasons[nextKey] : null
      if (nextSeason) {
        const nextStatus = deriveSeasonStatus(nextSeason, now)
        if (nextStatus === 'registration_open' || nextStatus === 'coming_soon') {
          const nextStart = parseSeasonStartDate(nextSeason.dates)
          const nextFormatted = nextStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
          return {
            headline: `${nextSeason.name} Registration Open`,
            subline: `Starts ${nextFormatted}. Register now to secure your spot.`,
            showEarlyBird: false,
            earlyBirdDeadline: null,
            earlyBirdDiscount: 0,
          }
        }
      }

      return {
        headline: `${season.name} In Progress`,
        subline: 'Drop-in sessions and mid-season enrollment available.',
        showEarlyBird: false,
        earlyBirdDeadline: null,
        earlyBirdDiscount: 0,
      }
    }
  }

  return {
    headline: 'Registration Open',
    subline: 'View schedules and pricing for all programs.',
    showEarlyBird: false,
    earlyBirdDeadline: null,
    earlyBirdDiscount: 0,
  }
}

/**
 * Returns all season data keyed by season name, for components that need raw access.
 */
export function getAllSeasons(): Record<SeasonKey, SeasonData> {
  return year2026Data.seasons as Record<SeasonKey, SeasonData>
}
