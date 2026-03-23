import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About Laguna Beach Tennis Academy | Movement. Craft. Community.',
  },
  description:
    'Founded by Andrew Mateljan — movement-first tennis in Laguna Beach. Official City of Laguna Beach partner since 2020.',
  openGraph: {
    title: 'About Laguna Beach Tennis Academy | Movement. Craft. Community.',
    description:
      'Founded by Andrew Mateljan — movement-first tennis in Laguna Beach. Official City of Laguna Beach partner since 2020.',
    type: 'website',
    images: [{ url: '/images/about/about-hero.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

