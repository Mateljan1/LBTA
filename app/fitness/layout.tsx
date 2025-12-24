import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cardio Tennis & LiveBall Fitness | Laguna Beach Tennis Academy',
  description: 'High-energy cardio tennis and LiveBall fitness classes in Laguna Beach. Fun, social tennis workouts for all skill levels.',
  keywords: 'cardio tennis Laguna Beach, LiveBall tennis, tennis fitness class, social tennis Orange County',
  openGraph: {
    title: 'Cardio Tennis & LiveBall Fitness | Laguna Beach Tennis Academy',
    description: 'High-energy cardio tennis and LiveBall fitness classes in Laguna Beach.',
    type: 'website',
    images: ['/images/programs/fitness.webp'],
  },
}

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

