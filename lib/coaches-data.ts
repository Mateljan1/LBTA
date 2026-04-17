/**
 * Single source of truth for coach data.
 * All coach content and schema are derived from data/coaches.json.
 */

import coachesData from '@/data/coaches.json'

const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://lagunabeachtennisacademy.com'

/** Bump when coach headshots are updated so browsers and CDN fetch new images. */
export const COACH_IMAGE_VERSION = 13

/** Coach image URL with cache-bust query param. Use for all coach headshot src. */
export function coachImageSrc(path: string): string {
  return `${path}?v=${COACH_IMAGE_VERSION}`
}

export type CoachRole = 'founder' | 'lead' | 'program'

export interface Coach {
  slug: string | null
  name: string
  title: string
  /** Optional: when true, coach is excluded from all public listings + schema. Direct links to their page still resolve so pausing is reversible without data loss. */
  hidden?: boolean
  hiddenReason?: string
  specialization: string
  bio: string
  quote: string
  quoteExtended?: string
  credentials: string[]
  image: string
  imagePosition: string
  availability?: string
  role: CoachRole
  order: number
  schemaDescription: string
}

const coachesList: Coach[] = (coachesData as { coaches: Coach[] }).coaches

/** Coaches visible on the public site (excludes any with hidden: true). */
function getVisibleCoaches(): Coach[] {
  return coachesList.filter((c) => !c.hidden)
}

/** All visible coaches in display order (founder, lead, then program). */
export function getCoaches(): Coach[] {
  return [...getVisibleCoaches()].sort((a, b) => a.order - b.order)
}

/** Founder only (Andrew). */
export function getFounder(): Coach | undefined {
  return getVisibleCoaches().find((c) => c.role === 'founder')
}

/** Lead coach only (Robert). */
export function getLeadCoach(): Coach | undefined {
  return getVisibleCoaches().find((c) => c.role === 'lead')
}

/** Program coaches (Peter, Allison, etc.) in order. */
export function getProgramCoaches(): Coach[] {
  return getVisibleCoaches()
    .filter((c) => c.role === 'program')
    .sort((a, b) => a.order - b.order)
}

/** All visible coaches except the founder (for team grid below founder block). */
export function getTeamCoaches(): Coach[] {
  return getCoaches().filter((c) => c.role !== 'founder')
}

/**
 * Meet the Team grid order: Robert, Peter, Allison. Paused coaches are filtered
 * out automatically via getTeamCoaches() (which uses the visible-only list).
 * Explicit slugs keep layout stable if `order` in JSON changes.
 */
const TEAM_GRID_SLUGS = ['robert-lebuhn', 'peter-defrantz', 'michelle-mateljan', 'allison-cronk'] as const

export function getTeamCoachesForGrid(): Coach[] {
  const team = getTeamCoaches() // already filters hidden
  const bySlug = new Map(team.map((c) => [c.slug, c]))
  return TEAM_GRID_SLUGS.map((slug) => bySlug.get(slug)).filter((c): c is Coach => Boolean(c))
}

/**
 * Single coach by slug — intentionally does NOT filter hidden coaches, so paused
 * coach pages remain reachable by direct link (for reactivation without data loss).
 */
export function getCoachBySlug(slug: string): Coach | undefined {
  return coachesList.find((c) => c.slug === slug)
}

/** JSON-LD ItemList schema for the coaches page. Includes url for each coach. */
export function getCoachesForSchema(): {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    jobTitle: string
    description: string
    image?: string
    url?: string
    worksFor: { '@type': string; name: string }
  }>
} {
  const list = getCoaches()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((coach, index) => {
      const imageUrl =
        coach.image && coach.image.trim()
          ? coach.image.startsWith('http')
            ? coach.image
            : `${SITE_URL}${coachImageSrc(coach.image)}`
          : ''
      return {
        '@type': 'Person',
        position: index + 1,
        name: coach.name,
        jobTitle: coach.title,
        description: coach.schemaDescription ?? coach.bio ?? '',
        ...(imageUrl && { image: imageUrl }),
        ...(coach.slug && { url: `${SITE_URL}/coaches/${coach.slug}` }),
        worksFor: {
          '@type': 'SportsOrganization',
          name: 'Laguna Beach Tennis Academy',
        },
      }
    }),
  }
}
