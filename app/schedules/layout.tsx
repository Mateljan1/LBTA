import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 Schedule & Pricing | Laguna Beach Tennis Academy',
  description: 'View the complete 2026 tennis program schedule, pricing, camps, and Junior Team Tennis seasons. Register for classes year-round.',
  keywords: 'tennis schedule Laguna Beach, tennis class times, tennis pricing, JTT registration, tennis camp schedule',
  openGraph: {
    title: '2026 Schedule & Pricing | Laguna Beach Tennis Academy',
    description: 'View the complete 2026 tennis program schedule, pricing, camps, and Junior Team Tennis seasons.',
    type: 'website',
    images: ['/images/programs/schedules-hero.webp'],
  },
}

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

