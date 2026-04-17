import pricingSupplemental from '@/data/pricing-supplemental.json'
import { PUBLIC_FACILITIES, facilityContactUrl } from '@/lib/facilities'

const schemaPricing = pricingSupplemental.schema

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": "https://lagunabeachtennisacademy.com/#organization",
    "name": "Laguna Beach Tennis Academy",
    "description": "Professional tennis training academy in Laguna Beach offering programs for ages 3 to professional, including junior development, adult programs, and high-performance training with ATP/WTA-trained coaches.",
    "url": "https://lagunabeachtennisacademy.com",
    "telephone": "+1-949-534-0457",
    "email": "support@lagunabeachtennisacademy.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1098 Balboa Ave",
      "addressLocality": "Laguna Beach",
      "addressRegion": "CA",
      "postalCode": "92651",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.5427",
      "longitude": "-117.7854"
    },
    "openingHours": "Mo-Su 07:00-21:00",
    "priceRange": schemaPricing.priceRange,
    "founder": {
      "@type": "Person",
      "name": "Andrew Mateljan",
      "jobTitle": "Director & Head Coach",
      "description": "ATP/WTA Tour Coach with 20+ years experience and 20+ Division I placements"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function CourseSchema() {
  const courses = [
    {
      "@type": "Course",
      "name": "Junior Tennis Development (Ages 3-11)",
      "description": "Progressive tennis training from Little Tennis Stars through Green Dot, building coordination, rhythm, and love for the game.",
      "provider": {
        "@type": "Organization",
        "name": "Laguna Beach Tennis Academy"
      },
      "offers": {
        "@type": "Offer",
        "price": String(schemaPricing.courses.juniorDevelopment),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Course",
      "name": "Youth Development (Ages 11-18)",
      "description": "Full-court training focused on technical precision, tactical awareness, and structured match play for competitive juniors.",
      "provider": {
        "@type": "Organization",
        "name": "Laguna Beach Tennis Academy"
      },
      "offers": {
        "@type": "Offer",
        "price": String(schemaPricing.courses.youthDevelopment),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Course",
      "name": "High Performance Pathway",
      "description": "Invitation-only training for advanced juniors (UTR 8+) preparing for tournaments and collegiate play.",
      "provider": {
        "@type": "Organization",
        "name": "Laguna Beach Tennis Academy"
      },
      "offers": {
        "@type": "Offer",
        "price": String(schemaPricing.courses.highPerformance),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Course",
      "name": "Adult Tennis Programs",
      "description": "Progressive tennis training from beginner fundamentals to advanced competitive match-play for adults of all skill levels.",
      "provider": {
        "@type": "Organization",
        "name": "Laguna Beach Tennis Academy"
      },
      "offers": {
        "@type": "Offer",
        "price": String(schemaPricing.courses.adultPrograms),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(courses) }}
    />
  )
}

/**
 * Multi-location LocalBusiness schema — signals that LBTA operates across
 * three public courts in Laguna Beach, so Google can associate local-pack
 * queries with each facility. Each location inherits from the main
 * Organization node via parentOrganization @id reference.
 *
 * Facility copy and addresses are sourced from `lib/facilities.ts` (same as
 * /contact anchors) so `url` / `@id` deep-link to on-page facility cards.
 */
export function LocalBusinessArraySchema() {
  const schema = PUBLIC_FACILITIES.map((f) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': facilityContactUrl(f.anchor),
    name: f.schemaName,
    description: f.schemaDescription,
    url: facilityContactUrl(f.anchor),
    telephone: '+1-949-534-0457',
    email: 'support@lagunabeachtennisacademy.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: f.streetLine,
      addressLocality: 'Laguna Beach',
      addressRegion: 'CA',
      postalCode: '92651',
      addressCountry: 'US',
    },
    openingHours: f.openingHours,
    parentOrganization: { '@id': 'https://lagunabeachtennisacademy.com/#organization' },
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Per-coach Person schema — E-E-A-T signal for Google and IP inventory for
 * due diligence. Renders one JSON-LD block with name, jobTitle, url, employer,
 * credentials, and expertise areas. Descriptions contain credentials only —
 * never names of students, families, or current players.
 */
export function PersonSchema({
  name,
  jobTitle,
  slug,
  description,
  knowsAbout,
  credentials,
}: {
  name: string
  jobTitle: string
  slug: string
  description: string
  knowsAbout?: string[]
  credentials?: string[]
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url: `https://lagunabeachtennisacademy.com/coaches/${slug}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Laguna Beach Tennis Academy',
      url: 'https://lagunabeachtennisacademy.com',
    },
    description,
  }
  if (knowsAbout?.length) schema.knowsAbout = knowsAbout
  if (credentials?.length) {
    schema.hasCredential = credentials.map((cred) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: cred,
    }))
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LeagueEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
}: {
  name: string
  description: string
  startDate: string
  endDate: string
  location?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    organizer: {
      '@type': 'Organization',
      name: 'Laguna Beach Tennis Academy',
      url: 'https://lagunabeachtennisacademy.com',
    },
    ...(location && {
      location: {
        '@type': 'Place',
        name: location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Laguna Beach',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
      },
    }),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Article JSON-LD for journal posts (`/blog/[slug]`). */
export function BlogArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified: string
  authorName: string
}) {
  const url = `https://lagunabeachtennisacademy.com/blog/${slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Laguna Beach Tennis Academy',
      url: 'https://lagunabeachtennisacademy.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lagunabeachtennisacademy.com/logos/LBTAblktext.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
