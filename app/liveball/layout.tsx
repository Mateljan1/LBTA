import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'LiveBall — Coach-Fed Doubles',
  description:
    'How LBTA runs LiveBall: coach-fed doubles, Champions and Challengers, first-ball rules, and a 90-minute session built in six blocks. Movement, craft, community.',
  openGraph: {
    title: 'LiveBall — Coach-Fed Doubles',
    description:
      'Coach-fed doubles with constant action—learn how rotations, scoring, and session blocks work before you book.',
    images: [{ url: '/images/liveball/hero-doubles.webp', width: 1920, height: 1440, alt: 'LiveBall doubles at LBTA' }],
  },
}

export default function LiveBallLayout({ children }: { children: ReactNode }) {
  return children
}
