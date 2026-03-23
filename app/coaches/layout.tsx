import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Coaches | Laguna Beach Tennis Academy',
  description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
  openGraph: {
    title: 'Our Coaches | Laguna Beach Tennis Academy',
    description: 'Meet the coaching team at LBTA. ATP/WTA certified professionals with decades of experience developing players from junior foundations to professional tour.',
    type: 'website',
    images: [{ url: '/images/contact/contact-hero.webp', width: 1958, height: 1317, alt: 'Laguna Beach Tennis Academy courts and coaching' }],
  },
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

