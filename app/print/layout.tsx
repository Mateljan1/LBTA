import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LBTA Court Flyer — Spring 2026',
  description: 'Laguna Beach Tennis Academy court flyer. Schedules, pricing, coaching team.',
  robots: 'noindex, nofollow',
}

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
