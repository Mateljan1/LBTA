import pricingSupplemental from '@/data/pricing-supplemental.json'

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
 * LBHS: 6 courts (primary facility — HP, Youth Development, Adult, LiveBall)
 * Moulton Meadows: 4 courts (Little Tennis Stars, Red/Orange Ball, beginner)
 * Alta Laguna: 2 courts (Saturday juniors, Youth Development, summer camps)
 */
export function LocalBusinessArraySchema() {
  const locations = [
    {
      '@id': 'https://lagunabeachtennisacademy.com/#lbhs',
      name: 'Laguna Beach Tennis Academy — LBHS Courts',
      description:
        'Primary facility with 6 courts at Laguna Beach High School. Home to High Performance, Youth Development, Adult, and LiveBall programs.',
      streetAddress: '625 Park Ave',
      openingHours: 'Mo-Su 07:00-21:00',
    },
    {
      '@id': 'https://lagunabeachtennisacademy.com/#moulton',
      name: 'Laguna Beach Tennis Academy — Moulton Meadows',
      description:
        '4-court facility at Moulton Meadows Park. Home to Little Tennis Stars, Red Ball, Orange Ball, Adult Beginner, and LiveBall Intermediate.',
      streetAddress: '1098 Balboa Ave',
      openingHours: 'Mo-Su 07:00-21:00',
    },
    {
      '@id': 'https://lagunabeachtennisacademy.com/#altalaguna',
      name: 'Laguna Beach Tennis Academy — Alta Laguna',
      description:
        '2-court facility at Alta Laguna Park. Home to Saturday juniors, Youth Development, and Summer Tennis Camps.',
      streetAddress: 'Alta Laguna Park',
      openingHours: 'Mo-Sa 07:00-21:00',
    },
  ]

  const schema = locations.map((loc) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': loc['@id'],
    name: loc.name,
    description: loc.description,
    url: 'https://lagunabeachtennisacademy.com',
    telephone: '+1-949-534-0457',
    email: 'support@lagunabeachtennisacademy.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.streetAddress,
      addressLocality: 'Laguna Beach',
      addressRegion: 'CA',
      postalCode: '92651',
      addressCountry: 'US',
    },
    openingHours: loc.openingHours,
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
