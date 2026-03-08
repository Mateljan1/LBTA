import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adult Tennis Trial | Laguna Beach Tennis Academy',
  description:
    'Book a free adult tennis trial at LBTA. Programs for all levels from true beginners to NTRP 4.0+. Laguna Beach, CA.',
  openGraph: {
    title: 'Adult Tennis Trial | Laguna Beach Tennis Academy',
    description:
      'Book a free adult tennis trial at LBTA. Programs for all levels from true beginners to NTRP 4.0+. Laguna Beach, CA.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/adult-trial',
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

export default function AdultTrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
