/**
 * Court flyer contact and CTA config. Single place for phone, email, register URL.
 * Source: .cursorrules Part 20 (Emergency Contacts) and draft flyer.
 */

export const FLYER_CONTACT = {
  phoneTrial: '(949) 534-0457',
  phoneRegister: '(949) 497-3311',
  email: 'support@lagunabeachtennisacademy.com',
  registerUrl: 'https://secure.rec1.com/CA/city-of-laguna-beach/catalog',
  siteUrl: 'https://lagunabeachtennisacademy.com',
} as const

export const FLYER_COURTS = [
  { name: 'Moulton Meadows Park', courts: 'Court 2', address: 'Balboa Ave & Capistrano Ave' },
  { name: 'Alta Laguna Park', courts: 'Courts 1 & 2', address: '3300 Alta Laguna Dr' },
  { name: 'Laguna Beach High School', courts: 'Courts 1 & 2', address: '670 Park Ave' },
] as const

export const FLYER_USTA_NOTE = 'Sat 1-3PM: Courts 1-3 USTA League'

/** Academy address for flyer and print. */
export const FLYER_ACADEMY_ADDRESS = '1098 Balboa Ave, Laguna Beach, CA 92651'
