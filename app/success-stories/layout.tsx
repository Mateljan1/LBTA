import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories | Laguna Beach Tennis Academy',
  description: 'Read inspiring success stories from LBTA players - from ATP tour professionals to adult beginners. See how our movement-first coaching transforms games.',
  keywords: 'tennis success stories, ATP player training, college tennis placement, tennis transformation, LBTA testimonials',
  openGraph: {
    title: 'Success Stories | Laguna Beach Tennis Academy',
    description: 'Read inspiring success stories from LBTA players - from ATP tour professionals to adult beginners.',
    type: 'website',
    images: ['/images/results/karue-training.webp'],
  },
}

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

