import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Junior Tennis Trial Lesson | Ages 3-18 | Free | Laguna Beach Tennis Academy',
  description: 'Give your child world-class tennis training with ATP/WTA coaching. Ages 3-18, all skill levels. Small groups, video analysis, college recruitment support. 20+ D1 placements. Official City of Laguna Beach partner. Free trial lesson.',
  keywords: 'junior tennis lessons Laguna Beach, kids tennis lessons, youth tennis program, tennis for children, ATP coaching juniors, college tennis recruitment, D1 tennis placement',
  openGraph: {
    title: 'Junior Tennis Trial Lesson - Free (Ages 3-18)',
    description: '🎾 Give your child the gift of world-class tennis training. ATP/WTA coaching for ages 3-18, from first steps to college recruitment. 20+ D1 placements.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/junior-trial',
    images: [
      {
        url: '/og-junior-trial.jpg',
        width: 1200,
        height: 630,
        alt: 'LBTA Junior Tennis Trial Lesson',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Junior Tennis Trial Lesson - Free (Ages 3-18)',
    description: 'World-class ATP/WTA coaching for ages 3-18. 20+ D1 placements. Free trial lesson included.',
  },
}

export default function JuniorTrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
