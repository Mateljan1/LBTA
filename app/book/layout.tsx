import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/book' },
  title: 'Book Your Free Trial',
  description:
    'Book a free trial lesson at LBTA. One conversation, honest guidance, and a path built around you.',
  openGraph: {
    title: 'Book Your Free Trial',
    description:
      'Book a free trial lesson at LBTA. One conversation, honest guidance, and a path built around you.',
    type: 'website',
    images: [
      {
        url: '/images/book/book-hero.webp',
        width: 1920,
        height: 1080,
        alt: 'Book your trial at Laguna Beach Tennis Academy',
      },
    ],
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
