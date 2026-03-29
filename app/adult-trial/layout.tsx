import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adult Tennis Trial',
  description:
    'Book a free adult tennis trial at LBTA. Programs for all levels from true beginners to NTRP 4.0+. Laguna Beach, CA.',
  openGraph: {
    title: 'Adult Tennis Trial',
    description:
      'Book a free adult tennis trial at LBTA. Programs for all levels from true beginners to NTRP 4.0+. Laguna Beach, CA.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/adult-trial',
    images: [
      {
        url: '/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp',
        width: 1920,
        height: 1080,
        alt: 'Adult tennis trial at Laguna Beach Tennis Academy',
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
