import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UTR Tracker Admin',
  robots: { index: false, follow: false },
}

export default function UtrTrackerAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
