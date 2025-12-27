import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tennis Camps 2026 | Summer & Holiday Programs | Laguna Beach Tennis Academy',
  description: 'Year-round tennis camps in Laguna Beach. Swim & Tennis summer camps, holiday break programs, and intensive training for ages 5-14. Register now for 2026.',
  keywords: 'tennis camp Laguna Beach, junior tennis camp, kids tennis camp Orange County, summer tennis camp, swim tennis camp, spring break tennis camp, winter tennis camp',
  openGraph: {
    title: 'Tennis Camps 2026 | Laguna Beach Tennis Academy',
    description: 'Year-round tennis camps in Laguna Beach. Swim & Tennis summer camps, holiday break programs, and intensive training for ages 5-14.',
    url: 'https://lagunabeachtennisacademy.com/camps',
    siteName: 'Laguna Beach Tennis Academy',
    images: [
      {
        url: 'https://lagunabeachtennisacademy.com/images/community/community-3.webp',
        width: 1200,
        height: 630,
        alt: 'Kids playing tennis at Laguna Beach Tennis Academy summer camp',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tennis Camps 2026 | Laguna Beach Tennis Academy',
    description: 'Year-round tennis camps in Laguna Beach for ages 5-14.',
    images: ['https://lagunabeachtennisacademy.com/images/community/community-3.webp'],
  },
}

export default function CampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
