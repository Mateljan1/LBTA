import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Free Trial | Laguna Beach Tennis Academy',
  description:
    'Book a free trial lesson at LBTA. One conversation, honest guidance, and a path built around you. Laguna Beach, CA.',
  openGraph: {
    title: 'Book Your Free Trial | Laguna Beach Tennis Academy',
    description:
      'Book a free trial lesson at LBTA. One conversation, honest guidance, and a path built around you.',
    type: 'website',
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
