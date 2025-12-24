import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Junior Team Tennis (JTT) Spring 2026 | Laguna Beach Tennis Academy',
  description: 'Join LBTA Junior Team Tennis for Spring 2026. 15 weeks of competitive USTA league play with structured training, weekend matches, and team development. Ages 10U through 18U. Movement. Discipline. Belonging.',
  keywords: 'junior team tennis, JTT, USTA tennis, youth tennis league, competitive tennis Orange County, Laguna Beach tennis, kids tennis team',
  openGraph: {
    title: 'Junior Team Tennis Spring 2026 | Laguna Beach Tennis Academy',
    description: 'Competitive team-based tennis for juniors. Weekly practices and Sunday matches against academies across Southern California.',
    url: 'https://lagunabeachtennisacademy.com/jtt',
    siteName: 'Laguna Beach Tennis Academy',
    images: [
      {
        url: 'https://lagunabeachtennisacademy.com/images/community/community-3.webp',
        width: 1200,
        height: 630,
        alt: 'Junior Team Tennis at Laguna Beach Tennis Academy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function JTTLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

