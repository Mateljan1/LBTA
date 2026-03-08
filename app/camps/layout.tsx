import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tennis Camps | Spring Break & Summer | Laguna Beach Tennis Academy',
  description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
  openGraph: {
    title: 'Tennis Camps | Spring Break & Summer | Laguna Beach Tennis Academy',
    description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
    url: 'https://lagunabeachtennisacademy.com/camps',
    siteName: 'Laguna Beach Tennis Academy',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tennis Camps | Spring Break & Summer | Laguna Beach Tennis Academy',
    description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
    images: ['/images/hero/laguna-horizon.webp'],
  },
}

export default function CampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
