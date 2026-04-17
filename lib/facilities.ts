/**
 * Public facility facts — single source for /contact anchors, footer links, and LocalBusiness JSON-LD.
 */

export const SITE_ORIGIN = 'https://lagunabeachtennisacademy.com' as const

export type PublicFacility = {
  /** Hash fragment on /contact (e.g. lbhs → /contact#lbhs) */
  anchor: string
  /** Card title */
  heading: string
  /** schema.org name */
  schemaName: string
  schemaDescription: string
  /** PostalAddress.streetAddress */
  streetLine: string
  courtLabel: string
  programsLine: string
  parkingLine?: string
  openingHours: string
  /** Full address string for map search */
  mapQuery: string
}

export const PUBLIC_FACILITIES: readonly PublicFacility[] = [
  {
    anchor: 'lbhs',
    heading: 'Laguna Beach High School',
    schemaName: 'Laguna Beach Tennis Academy — LBHS Courts',
    schemaDescription:
      'Primary facility with 6 courts at Laguna Beach High School. Home to High Performance, Youth Development, Adult, and LiveBall programs.',
    streetLine: '625 Park Ave',
    courtLabel: '6 lighted hard courts',
    programsLine:
      'High Performance, youth development, adult programs, LiveBall, and league play — see schedule for session times.',
    parkingLine: 'Use visitor parking near the tennis courts; follow campus signage on program days.',
    openingHours: 'Mo-Su 07:00-21:00',
    mapQuery: '625 Park Ave, Laguna Beach, CA 92651',
  },
  {
    anchor: 'moulton-meadows',
    heading: 'Moulton Meadows Park',
    schemaName: 'Laguna Beach Tennis Academy — Moulton Meadows',
    schemaDescription:
      '4-court facility at Moulton Meadows Park. Home to Little Tennis Stars, Red Ball, Orange Ball, Adult Beginner, and LiveBall Intermediate.',
    streetLine: '1098 Balboa Ave',
    courtLabel: '4 hard courts',
    programsLine:
      'Little Stars, Red and Orange ball pathways, adult beginner, and intermediate LiveBall — see schedule.',
    parkingLine: 'City park lot; arrive a few minutes early on busy session blocks.',
    openingHours: 'Mo-Su 07:00-21:00',
    mapQuery: '1098 Balboa Ave, Laguna Beach, CA 92651',
  },
  {
    anchor: 'alta-laguna',
    heading: 'Alta Laguna Park',
    schemaName: 'Laguna Beach Tennis Academy — Alta Laguna',
    schemaDescription:
      '2-court facility at Alta Laguna Park. Home to Saturday juniors, youth development blocks, summer camps, and UTR Match Play.',
    streetLine: '3300 Alta Laguna Blvd',
    courtLabel: '2 outdoor hard courts',
    programsLine:
      'Saturday juniors, camp blocks, and UTR Match Play — confirm venue for your program on the schedule.',
    parkingLine: 'Park in the lot adjacent to the courts; follow City of Laguna Beach park rules.',
    openingHours: 'Mo-Sa 07:00-21:00',
    mapQuery: '3300 Alta Laguna Blvd, Laguna Beach, CA 92651',
  },
] as const

export function facilityContactUrl(anchor: string): string {
  return `${SITE_ORIGIN}/contact#${anchor}`
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
