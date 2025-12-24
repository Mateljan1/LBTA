import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Laguna Beach Tennis Academy',
  description: 'Get in touch with Laguna Beach Tennis Academy. Book a trial lesson, ask questions, or visit us at Moulton Meadows Park.',
  keywords: 'contact Laguna Beach tennis, tennis lessons inquiry, book tennis lesson, tennis academy phone',
  openGraph: {
    title: 'Contact Us | Laguna Beach Tennis Academy',
    description: 'Get in touch with Laguna Beach Tennis Academy. Book a trial lesson or ask questions.',
    type: 'website',
    images: ['/images/community/community-1.webp'],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

