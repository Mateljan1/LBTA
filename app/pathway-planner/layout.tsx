import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pathway Planner | Find Your Program | Laguna Beach Tennis Academy',
  description: 'Answer a few questions and we\'ll recommend the perfect tennis program for your age, skill level, and goals at LBTA.',
  openGraph: {
    title: 'Pathway Planner | Find Your Program | Laguna Beach Tennis Academy',
    description: 'Answer a few questions and we\'ll recommend the perfect tennis program for your age, skill level, and goals at LBTA.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function PathwayPlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
