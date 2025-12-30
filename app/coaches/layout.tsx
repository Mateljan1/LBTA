import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Coaches | Laguna Beach Tennis Academy',
  description: 'Meet the expert coaching team at LBTA. ATP/WTA tour experience, certified professionals, and personalized instruction for all levels.',
  keywords: 'tennis coaches Laguna Beach, ATP coach, WTA coach, certified tennis instructor, private tennis lessons',
  openGraph: {
    title: 'Our Coaches | Laguna Beach Tennis Academy',
    description: 'Meet the expert coaching team at LBTA. ATP/WTA tour experience and personalized instruction.',
    type: 'website',
    images: ['/images/coaches/andrew.webp'],
  },
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

