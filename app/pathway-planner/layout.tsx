import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pathway Planner | Find Your Program',
  description: 'Answer a few questions and we\'ll recommend the perfect tennis program for your age, skill level, and goals at LBTA.',
  openGraph: {
    title: 'Pathway Planner | Find Your Program',
    description: 'Answer a few questions and we\'ll recommend the perfect tennis program for your age, skill level, and goals at LBTA.',
    type: 'website',
    images: [{ url: '/legacy-working-assets/hero/philosophy-hero/philosophy-hero.webp', width: 1920, height: 1080, alt: 'LBTA pathway planner' }],
  },
}

export default function PathwayPlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
