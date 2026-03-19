/**
 * Court flyer contact and CTA config. Single place for phone, email, register URL.
 * Source: .cursorrules Part 20 (Emergency Contacts) and draft flyer.
 */

export const FLYER_CONTACT = {
  phoneTrial: '(949) 534-0457',
  phoneRegister: '(949) 497-3311',
  email: 'support@lagunabeachtennisacademy.com',
  /** City of Laguna Beach Recreation — online catalog (Tennis programs filter). */
  registerUrl:
    'https://secure.rec1.com/CA/city-of-laguna-beach/catalog/index/aad62bdd38b6f9ef18d0b329cea980a0?filter=c2VhcmNoPSZjYXRlZ29yeSU1QjIwMjgzJTVEPTE=',
  siteUrl: 'https://lagunabeachtennisacademy.com',
} as const

export const FLYER_COURTS = [
  { name: 'Moulton Meadows Park', courts: 'Court 2', address: 'Balboa Ave & Capistrano Ave' },
  { name: 'Alta Laguna Park', courts: 'Courts 1 & 2', address: '3300 Alta Laguna Dr' },
  { name: 'Laguna Beach High School', courts: 'Courts 5 & 6', address: '670 Park Ave' },
] as const

export const FLYER_USTA_NOTE = 'Sat 1-3PM: Courts 1-3 USTA League'

/** Academy address for flyer and print. */
export const FLYER_ACADEMY_ADDRESS = '1098 Balboa Ave, Laguna Beach, CA 92651'

/**
 * Spring group-class early bird (season starts first Monday in April).
 * Used on court flyer + PDF; keep in sync with `data/site-stats.json` discounts.discountLine when copy changes.
 */
export const COURT_FLYER_DISCOUNT_LINE =
  '$50 off early bird — register by March 28, 2026 · 10% second child · 5% multi-program · 10% full year' as const

/** Short location keys → full venue names (court flyer + PDF). */
export const FLYER_LOCATION_DISPLAY: Record<string, string> = {
  Moulton: 'Moulton Meadows Park',
  Alta: 'Alta Laguna Park',
  LBHS: 'Laguna Beach High School',
}
