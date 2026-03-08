import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'High Performance Tennis Academy | LBTA',
  description:
    'Tournament-caliber training for UTR 5+ juniors. Technical refinement, tactical patterns, conditioning, and mental performance.',
  openGraph: {
    title: 'High Performance Tennis Academy | LBTA',
    description:
      'Tournament-caliber training for UTR 5+ juniors. Technical refinement, tactical patterns, conditioning, and mental performance.',
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

export default function HighPerformancePage() {
  redirect('/schedules#programs')
}
