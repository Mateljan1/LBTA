import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coach Today · LBTA',
  robots: { index: false, follow: false, nocache: true },
}

export default function PerCoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
