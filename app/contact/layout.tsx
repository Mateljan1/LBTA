import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Laguna Beach Tennis Academy',
  description: 'Get in touch with Laguna Beach Tennis Academy. Call (949) 534-0457 or visit us at Moulton Meadows Park, 1098 Balboa Ave, Laguna Beach, CA 92651.',
  openGraph: {
    title: 'Contact Us | Laguna Beach Tennis Academy',
    description: 'Get in touch with Laguna Beach Tennis Academy. Call (949) 534-0457 or visit us at Moulton Meadows Park, 1098 Balboa Ave, Laguna Beach, CA 92651.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

