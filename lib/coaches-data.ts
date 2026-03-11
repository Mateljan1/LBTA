/**
 * Single source of truth for coach data.
 * All coach content and schema are derived from data/coaches.json.
 */

import coachesData from '@/data/coaches.json'

const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://lagunabeachtennisacademy.com'

export type CoachRole = 'founder' | 'lead' | 'program'

export interface Coach {
  slug: string | null
  name: string
  title: string
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

/** All coaches in display order (founder, lead, then program). */
export function getCoaches(): Coach[] {
  return [...coachesList].sort((a, b) => a.order - b.order)
}

/** Founder only (Andrew). */
export function getFounder(): Coach | undefined {
  return coachesList.find((c) => c.role === 'founder')
}

/** Lead coach only (Robert). */
export function getLeadCoach(): Coach | undefined {
  return coachesList.find((c) => c.role === 'lead')
}

/** Program coaches (Peter, Allison, etc.) in order. */
export function getProgramCoaches(): Coach[] {
  return coachesList.filter((c) => c.role === 'program').sort((a, b) => a.order - b.order)
}

/** Single coach by slug; returns undefined if slug is null or not found. */
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
            : `${SITE_URL}${coach.image}`
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
