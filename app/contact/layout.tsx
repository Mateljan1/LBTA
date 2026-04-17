import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact Us',
  description: 'Reach Laguna Beach Tennis Academy at (949) 534-0457. Three locations: LBHS, Moulton Meadows, and Alta Laguna Park. We respond within 24 hours.',
  openGraph: {
    title: 'Contact Us',
    description: 'Reach Laguna Beach Tennis Academy at (949) 534-0457. Three locations: LBHS, Moulton Meadows, and Alta Laguna Park. We respond within 24 hours.',
    type: 'website',
    images: [{ url: '/images/facility/coaching-private-tennis-lesson-drill.webp', width: 1920, height: 1080, alt: 'On-court coaching at Laguna Beach Tennis Academy' }],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

