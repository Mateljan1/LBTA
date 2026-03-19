import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Programs — Cardio Tennis & LiveBall | LBTA',
  description: 'High-energy fitness tennis in Laguna Beach. Cardio Tennis, LiveBall Intermediate, and LiveBall Advanced. All levels welcome.',
  openGraph: {
    title: 'Fitness Programs — Cardio Tennis & LiveBall | LBTA',
    description: 'High-energy fitness tennis in Laguna Beach. Cardio Tennis, LiveBall Intermediate, and LiveBall Advanced. All levels welcome.',
    type: 'website',
    images: [{ url: '/legacy-working-assets/hero/fitness-hero/fitness-hero.webp', width: 1920, height: 1080, alt: 'LBTA fitness programs' }],
  },
}

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

