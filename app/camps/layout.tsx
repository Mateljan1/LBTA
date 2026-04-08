import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summer Tennis Camp 2026 - Ages 5-11 - Laguna Beach Tennis Academy',
  description:
    'Tennis, Splash Wars, field games, and weekly themes at Alta Laguna Park. Ages 5-11, Mon-Thu, June-August. Small groups, real coaching. Full-day $495/week, half-day $325/week.',
  openGraph: {
    title: 'Summer Tennis Camp 2026 - Ages 5-11 - Laguna Beach Tennis Academy',
    description:
      'Tennis, Splash Wars, field games, and weekly themes at Alta Laguna Park. Ages 5-11, Mon-Thu, June-August. Small groups, real coaching. Full-day $495/week, half-day $325/week.',
    url: 'https://lagunabeachtennisacademy.com/camps',
    siteName: 'Laguna Beach Tennis Academy',
    images: [
      {
        url: 'https://res.cloudinary.com/dv033eo0x/image/upload/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg',
        width: 1200,
        height: 851,
        alt: 'Laguna Beach Tennis Academy summer camps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summer Tennis Camp 2026 - Ages 5-11 - Laguna Beach Tennis Academy',
    description:
      'Tennis, Splash Wars, field games, and weekly themes at Alta Laguna Park. Ages 5-11, Mon-Thu, June-August. Small groups, real coaching. Full-day $495/week, half-day $325/week.',
    images: ['https://res.cloudinary.com/dv033eo0x/image/upload/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg'],
  },
}

export default function CampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
