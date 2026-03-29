import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Coaches',
  description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
  openGraph: {
    title: 'Our Coaches',
    description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
    type: 'website',
    images: [{ url: '/images/facility/hero-ocean-view-tennis-courts-sunset.webp', width: 1920, height: 1080, alt: 'Coastal tennis courts at sunset — LBTA' }],
  },
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

