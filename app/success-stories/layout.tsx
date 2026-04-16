import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/success-stories' },
  title: 'Success Stories & Testimonials',
  description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
  openGraph: {
    title: 'Success Stories & Testimonials',
    description: 'Player stories from LBTA. From junior development to ATP tour, see how our coaching philosophy creates lasting results.',
    type: 'website',
    images: [{ url: '/images/results/karue-fh-hero.webp', width: 1920, height: 1080, alt: 'LBTA success stories' }],
  },
}

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

