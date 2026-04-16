import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/programs/high-performance' },
  title: 'High Performance Tennis Academy',
  description:
    'The highest level of training at LBTA. Tournament-caliber training for UTR 8+ juniors. Technical refinement, tactical patterns, conditioning, and mental performance.',
  openGraph: {
    title: 'High Performance Tennis Academy',
    description:
      'The highest level of training at LBTA. Tournament-caliber training for UTR 8+ juniors. Technical refinement, tactical patterns, conditioning, and mental performance.',
    type: 'website',
    images: [
      {
        url: '/legacy-working-assets/programs/high-performance/high-performance.webp',
        width: 1920,
        height: 1080,
        alt: 'High performance tennis at LBTA',
      },
    ],
  },
}

export default function HighPerformancePage() {
  redirect('/schedules#programs')
}
