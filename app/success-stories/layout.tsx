import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories & Testimonials | Laguna Beach Tennis Academy',
  description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
  openGraph: {
    title: 'Success Stories & Testimonials | Laguna Beach Tennis Academy',
    description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

