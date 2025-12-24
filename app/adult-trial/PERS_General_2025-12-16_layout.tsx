import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adult Tennis Trial Lesson | Free | Laguna Beach Tennis Academy',
  description: 'Start or elevate your tennis journey with ATP/WTA coaching. All skill levels welcome - beginner to advanced. Flexible scheduling for busy professionals. Official City of Laguna Beach partner. Free trial lesson.',
  keywords: 'adult tennis lessons Laguna Beach, tennis trial lesson adults, ATP coaching adults, beginner tennis lessons adults, adult tennis training, professional tennis lessons',
  openGraph: {
    title: 'Adult Tennis Trial Lesson - Free',
    description: '🎾 Start or elevate your tennis journey with ATP/WTA-level coaching. Whether you\'re a complete beginner or returning player, we\'ll meet you where you are.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/adult-trial',
    images: [
      {
        url: '/og-adult-trial.jpg',
        width: 1200,
        height: 630,
        alt: 'LBTA Adult Tennis Trial Lesson',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adult Tennis Trial Lesson - Free',
    description: 'Professional ATP/WTA coaching for all skill levels. Free trial lesson included.',
  },
}

export default function AdultTrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
