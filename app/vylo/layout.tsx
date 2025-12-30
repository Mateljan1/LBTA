import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VYLO Performance Institute | Private Tennis Development',
  description: 'A private development system for ten families who understand that high performance in tennis requires architecture, not just talent. Application only.',
  openGraph: {
    title: 'VYLO Performance Institute',
    description: 'Where ten families build champions.',
    type: 'website',
  },
}

export default function VYLOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {children}
    </>
  )
}

