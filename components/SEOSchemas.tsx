import Script from 'next/script'

// FAQ Schema for /faq page
export const faqItems = [
  {
    question: "What ages do you accept at LBTA?",
    answer: "We welcome players from age 3 through adult. Our Little Stars program starts at age 3, and we have programs for every level through advanced adult players."
  },
  {
    question: "Do I need my own equipment?",
    answer: "No, we provide rackets for beginners and young players. As players progress, we help families select appropriate equipment."
  },
  {
    question: "What is your coaching philosophy?",
    answer: "We focus on Movement, Discipline, and Belonging. Our movement-first approach builds proper technique through biomechanics and footwork fundamentals before adding complexity."
  },
  {
    question: "How are groups organized?",
    answer: "Groups are organized by age, skill level, and ball type (Red, Orange, Green, Yellow). We keep groups small—typically 4-6 players—for maximum individual attention."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We offer a 30-day money-back guarantee on all seasonal programs. For individual sessions, please cancel 24 hours in advance for a full credit."
  },
  {
    question: "Do you offer private lessons?",
    answer: "Yes, private lessons are available with all our coaches. Rates range from $100-250 per hour depending on the coach. Contact us to schedule."
  },
  {
    question: "Where are your courts located?",
    answer: "We train at three locations in Laguna Beach: Moulton Meadows Park, Alta Laguna Park, and Laguna Beach High School courts."
  },
  {
    question: "Do you offer scholarships?",
    answer: "Yes, we award over $25,000 annually in scholarships to families demonstrating financial need and commitment. Scholarships cover 25-50% of tuition."
  }
]

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Review/Rating Schema
export function ReviewSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Laguna Beach Tennis Academy",
    "@id": "https://lagunabeachtennisacademy.com",
    "image": "https://lagunabeachtennisacademy.com/images/hero/laguna-horizon.webp",
    "telephone": "+1-949-464-6645",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Moulton Meadows Park, 1098 Balboa Ave",
      "addressLocality": "Laguna Beach",
      "addressRegion": "CA",
      "postalCode": "92651",
      "addressCountry": "US"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "47",
      "reviewCount": "47"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mary S."
        },
        "datePublished": "2024-11-15",
        "reviewBody": "Andrew and his team have transformed my daughter's game. She's gone from struggling with basics to winning her first tournament in just 8 months. The structure and discipline they teach extends beyond tennis.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "David R."
        },
        "datePublished": "2024-10-22",
        "reviewBody": "At 45, I thought it was too late to learn tennis properly. LBTA proved me wrong. In 18 months, I went from complete beginner to USTA 4.0. The coaching methodology is world-class.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Jennifer L."
        },
        "datePublished": "2024-09-10",
        "reviewBody": "Both my kids train here and the improvement has been remarkable. Coach Kevin's attention to detail and positive reinforcement makes every session productive. Highly recommend for families.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ],
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  }

  return (
    <Script
      id="review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Sports Organization Schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "Laguna Beach Tennis Academy",
    "alternateName": "LBTA",
    "url": "https://lagunabeachtennisacademy.com",
    "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png",
    "description": "Premier tennis academy in Laguna Beach, California offering junior development, adult programs, and high-performance training with ATP/WTA certified coaches.",
    "sport": "Tennis",
    "foundingDate": "2018",
    "founder": {
      "@type": "Person",
      "name": "Andrew Mateljan",
      "jobTitle": "Founder & Director"
    },
    "employee": [
      {
        "@type": "Person",
        "name": "Kevin Jackson",
        "jobTitle": "Head Coach & Performance Director"
      },
      {
        "@type": "Person",
        "name": "Michelle Bevins",
        "jobTitle": "Youth Director"
      },
      {
        "@type": "Person",
        "name": "Savriyan Danilov",
        "jobTitle": "High Performance Coach"
      },
      {
        "@type": "Person",
        "name": "Andy Wu",
        "jobTitle": "Program Coach"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/lagunabeachtennisacademy",
      "https://www.facebook.com/lagunabeachtennisacademy"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "ATP/WTA Tour Coach Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "USTA Certified"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "PTR Certified"
      }
    ]
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
