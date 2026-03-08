import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply for Tennis Scholarship | Laguna Beach Tennis Academy',
  description:
    'Apply for LBTA\'s tennis scholarship program. Over $25,000 awarded annually to families demonstrating need and commitment.',
  openGraph: {
    title: 'Apply for Tennis Scholarship | Laguna Beach Tennis Academy',
    description:
      'Apply for LBTA\'s tennis scholarship program. Over $25,000 awarded annually to families demonstrating need and commitment.',
    type: 'website',
    images: [
      {
        url: '/images/hero/laguna-horizon.webp',
        width: 1920,
        height: 1080,
        alt: 'Laguna Beach Tennis Academy',
      },
    ],
  },
}

export default function ApplyScholarshipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
