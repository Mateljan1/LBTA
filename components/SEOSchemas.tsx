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
