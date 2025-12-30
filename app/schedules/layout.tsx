import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 Schedule & Pricing | Programs & Registration | Laguna Beach Tennis Academy',
  description: 'View the complete 2026 tennis program schedule, pricing, camps, and Junior Team Tennis seasons. Winter, Spring, Summer, Fall sessions. Register online.',
  keywords: 'tennis schedule Laguna Beach, tennis class times, tennis pricing, JTT registration, tennis camp schedule, tennis lessons cost',
  openGraph: {
    title: '2026 Schedule & Pricing | Laguna Beach Tennis Academy',
    description: 'Complete 2026 tennis program schedule with pricing. Junior, adult, and high-performance programs. Register online today.',
    url: 'https://lagunabeachtennisacademy.com/schedules',
    siteName: 'Laguna Beach Tennis Academy',
    images: [
      {
        url: 'https://lagunabeachtennisacademy.com/images/programs/schedules-hero.webp',
        width: 1200,
        height: 630,
        alt: 'Tennis training at Laguna Beach Tennis Academy at sunset',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 Schedule & Pricing | Laguna Beach Tennis Academy',
    description: 'Complete 2026 tennis program schedule with pricing. Register online today.',
    images: ['https://lagunabeachtennisacademy.com/images/programs/schedules-hero.webp'],
  },
}

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
