export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Laguna Beach Tennis Academy",
    "description": "Professional tennis training academy in Laguna Beach offering programs for ages 3 to professional, including junior development, adult programs, and high-performance training with ATP/WTA-trained coaches.",
    "url": "https://lagunabeachtennisacademy.com",
    "telephone": "+1-949-464-6645",
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
    "priceRange": "$120-$250",
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
        "price": "120",
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
        "price": "756",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Course",
      "name": "High Performance Pathway",
      "description": "Invitation-only training for advanced juniors (UTR 5-8) preparing for tournaments and collegiate play.",
      "provider": {
        "@type": "Organization",
        "name": "Laguna Beach Tennis Academy"
      },
      "offers": {
        "@type": "Offer",
        "price": "1437",
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
        "price": "546",
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
