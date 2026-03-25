import liveball from '@/data/liveball.json'

export interface LiveBallBlock {
  label: string
  title: string
  detail: string
}

export interface LiveBallTestimonial {
  quote: string
  author: string
  role: string
  replaceBeforePublish: string
}

export interface LiveBallContent {
  lastReviewed: string
  outcomeLine: string
  sessionObjective: string
  howItWorks: string[]
  firstBall: { title: string; intro: string; bullets: string[] }
  sessionStructure: {
    title: string
    subtitle: string
    blocks: LiveBallBlock[]
  }
  testimonial: LiveBallTestimonial
  culture: { communication: string; safety: string }
}

export function getLiveBallContent(): LiveBallContent {
  return liveball as LiveBallContent
}
