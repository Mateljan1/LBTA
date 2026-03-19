import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Junior Tennis Programs | Ages 3-15 | LBTA',
  description:
    'Junior tennis development from Little Stars through Youth Development. Red ball, orange ball, green dot progression in Laguna Beach.',
  openGraph: {
    title: 'Junior Tennis Programs | Ages 3-15 | LBTA',
    description:
      'Junior tennis development from Little Stars through Youth Development. Red ball, orange ball, green dot progression in Laguna Beach.',
    type: 'website',
    images: [
      {
        url: '/legacy-working-assets/programs/juniors/juniors.webp',
        width: 1920,
        height: 1080,
        alt: 'Junior tennis programs at LBTA',
      },
    ],
  },
}

export default function JuniorProgramsPage() {
  redirect('/schedules#programs')
}
