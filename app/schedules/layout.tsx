import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schedule & Pricing | Laguna Beach Tennis Academy',
  description:
    'View all LBTA programs, schedules, and pricing. Winter, Spring, Summer, and Fall sessions. Register online.',
  openGraph: {
    title: 'Schedule & Pricing | Laguna Beach Tennis Academy',
    description:
      'View all LBTA programs, schedules, and pricing. Winter, Spring, Summer, and Fall sessions. Register online.',
    url: 'https://lagunabeachtennisacademy.com/schedules',
    siteName: 'Laguna Beach Tennis Academy',
    type: 'website',
    images: [
      {
        url: '/images/hero/laguna-horizon.webp',
        width: 1920,
        height: 1080,
        alt: 'Laguna Beach Tennis Academy',
      },
    ],
  },
}

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
