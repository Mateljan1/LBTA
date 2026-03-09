import Script from 'next/script'
import year2026 from '@/data/year2026.json'
import privateRates from '@/data/private-rates.json'
import faqData from '@/data/faq.json'
import siteStats from '@/data/site-stats.json'

const rates = privateRates.map((r: { rate_60: number }) => r.rate_60)
const privateMin = rates.length ? Math.min(...rates) : 100
const privateMax = rates.length ? Math.max(...rates) : 250
const { awardedAnnually, coverage } = year2026.scholarships

// FAQ Schema for /faq page — single source from data/faq.json; private + scholarship answers dynamic
const faqList = faqData as Array<{ id: string; question: string; answer: string }>
export const faqItems = [
  ...faqList.map((item) => {
    if (item.id === 'private') {
      return { question: item.question, answer: `Yes, private lessons are available with all our coaches. Rates range from $${privateMin}-${privateMax} per hour depending on the coach. Contact us to schedule.` }
    }
    return { question: item.question, answer: item.answer }
  }),
  {
    question: 'Do you offer scholarships?',
    answer: `Yes, we award over $${awardedAnnually.toLocaleString()} annually in scholarships to families demonstrating financial need and commitment. Scholarships cover ${coverage} of tuition.`
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
    "telephone": "+1-949-534-0457",
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
      "ratingValue": siteStats.trustStats.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": siteStats.trustStats.reviewCount,
      "reviewCount": siteStats.trustStats.reviewCount
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
        "reviewBody": "At 45, I thought it was too late to learn tennis properly. LBTA proved me wrong. In 18 months, I went from complete beginner to USTA 4.0. The coaching methodology is exceptional.",
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
        "reviewBody": "Both my kids train here and the improvement has been remarkable. The coaches' attention to detail and positive reinforcement makes every session productive. Highly recommend for families.",
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
