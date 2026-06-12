/**
 * Canonical public-facing contact/app values.
 * Keep every parent-facing surface aligned to this source.
 */
export const LBTA_PUBLIC_CONTACT = {
  phoneE164: '+19495340457',
  phoneDisplay: '(949) 534-0457',
  phoneDial: '9495340457',
  email: 'support@lagunabeachtennisacademy.com',
  address: {
    street: '1098 Balboa Ave',
    city: 'Laguna Beach',
    region: 'CA',
    postalCode: '92651',
    country: 'US',
  },
} as const

export const LBTA_APP_LINKS = {
  ios: 'https://apps.apple.com/us/app/lbta/id6746348933',
  android: 'https://play.google.com/store/apps/details?id=com.court.laguna',
} as const

export type ListingNetwork = 'google-business-profile' | 'yelp' | 'apple-business-connect' | 'bing-places'

export const LBTA_LISTING_GOVERNANCE = {
  canonicalNetworks: [
    'google-business-profile',
    'yelp',
    'apple-business-connect',
    'bing-places',
  ] as readonly ListingNetwork[],
  canonicalNap: {
    name: 'Laguna Beach Tennis Academy',
    phone: LBTA_PUBLIC_CONTACT.phoneDisplay,
    email: LBTA_PUBLIC_CONTACT.email,
    addressLine: `${LBTA_PUBLIC_CONTACT.address.street}, ${LBTA_PUBLIC_CONTACT.address.city}, ${LBTA_PUBLIC_CONTACT.address.region} ${LBTA_PUBLIC_CONTACT.address.postalCode}`,
  },
} as const
