import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VYLO Performance Institute | Apply Now - Founding Cohort January 2026',
  description: 'We do not train tennis players. We build pros who can win under lights. Pressure. Capacity. Results. Roster capped. Entry earned. Apply for the VYLO Founding Cohort.',
  openGraph: {
    title: 'VYLO Performance Institute | Founding Cohort January 2026',
    description: 'Ten athletes. Ten positions. One trajectory. Apply now for the VYLO Founding Cohort in Laguna Beach, California.',
    type: 'website',
    images: [
      {
        url: '/photos/KarueFH2.webp', // Using the existing hero image
        width: 1200,
        height: 630,
        alt: 'VYLO Performance Institute - Elite Tennis Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYLO Performance Institute | Apply Now',
    description: 'We build pros who can win under lights. Apply for the Founding Cohort.',
    images: ['/photos/KarueFH2.webp'],
  },
  robots: {
    index: false, // Don't index this page in search engines (Facebook ads only)
    follow: false,
  },
}

export default function VYLOApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {children}
    </>
  )
}
