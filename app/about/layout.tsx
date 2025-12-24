import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Laguna Beach Tennis Academy',
  description: 'Meet founder Andrew Mateljan and learn about LBTA\'s movement-first coaching philosophy. 25+ years of tennis excellence in Laguna Beach, California.',
  keywords: 'Andrew Mateljan, Laguna Beach tennis coach, tennis academy founder, movement-first coaching, tennis philosophy',
  openGraph: {
    title: 'About Us | Laguna Beach Tennis Academy',
    description: 'Meet founder Andrew Mateljan and learn about LBTA\'s movement-first coaching philosophy.',
    type: 'website',
    images: ['/images/founder/andrew-portrait.webp'],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

