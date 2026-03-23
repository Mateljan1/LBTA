import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories & Testimonials | Laguna Beach Tennis Academy',
  description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
  openGraph: {
    title: 'Success Stories & Testimonials | Laguna Beach Tennis Academy',
    description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
    type: 'website',
    images: [{ url: '/images/results/karue-home-carousel-2026.webp', width: 682, height: 1024, alt: 'LBTA success stories' }],
  },
}

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

