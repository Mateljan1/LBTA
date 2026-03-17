import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coach Hub | LBTA',
  robots: { index: false, follow: false },
}

export default function CoachHubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
