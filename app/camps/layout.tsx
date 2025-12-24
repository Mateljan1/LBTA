import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tennis Camps & Junior Team Tennis 2026 | Laguna Beach Tennis Academy',
  description: 'Year-round tennis camps and USTA Junior Team Tennis in Laguna Beach. Holiday break camps, summer programs, and competitive league play for ages 5-17.',
  keywords: 'tennis camp Laguna Beach, junior tennis camp, kids tennis camp Orange County, summer tennis camp, JTT Orange County, USTA junior team tennis, spring break tennis camp, winter tennis camp',
  openGraph: {
    title: 'Tennis Camps & Junior Team Tennis 2026 | LBTA',
    description: 'Year-round tennis camps and USTA Junior Team Tennis in Laguna Beach. Holiday break camps, summer programs, and competitive league play.',
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
