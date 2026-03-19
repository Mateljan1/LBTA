import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Coaches | Laguna Beach Tennis Academy',
  description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
  openGraph: {
    title: 'Our Coaches | Laguna Beach Tennis Academy',
    description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
    type: 'website',
    images: [{ url: '/legacy-working-assets/hero/adult-group-hero/adult-group-hero.webp', width: 1920, height: 1080, alt: 'LBTA coaches' }],
  },
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

