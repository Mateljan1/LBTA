import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summer Tennis Camps 2026 | Laguna Beach Tennis Academy',
  description: 'High-energy summer tennis camps for ages 6-16 in Laguna Beach. Learn, compete, and belong with expert coaching and structured skill development.',
  keywords: 'summer tennis camp Laguna Beach, junior tennis camp, kids tennis camp Orange County, tennis day camp',
  openGraph: {
    title: 'Summer Tennis Camps 2026 | Laguna Beach Tennis Academy',
    description: 'High-energy summer tennis camps for ages 6-16 in Laguna Beach.',
    type: 'website',
    images: ['/images/community/community-5.webp'],
  },
}

export default function CampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

