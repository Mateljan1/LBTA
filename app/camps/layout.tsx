import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tennis Camps | Spring Break & Summer',
  description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
  openGraph: {
    title: 'Tennis Camps | Spring Break & Summer',
    description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
    url: 'https://lagunabeachtennisacademy.com/camps',
    siteName: 'Laguna Beach Tennis Academy',
    images: [{ url: '/images/camps/camp-action-4.webp', width: 2400, height: 1600, alt: 'Laguna Beach Tennis Academy tennis camps' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tennis Camps | Spring Break & Summer',
    description: 'Spring break and summer tennis camps in Laguna Beach for ages 5-17. Full-day and half-day options with professional coaching.',
    images: ['/images/camps/camp-action-4.webp'],
  },
}

export default function CampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
