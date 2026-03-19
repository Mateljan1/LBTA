import type { Metadata } from 'next'

/**
 * Court-flyer-only shell: no site chrome (ConditionalLayout), padding for screen preview,
 * neutral background. Print rules target `.court-flyer-print` inside this tree.
 */
export const metadata: Metadata = {
  title: 'LBTA Court Flyer — Print & PDF',
  description:
    'Laguna Beach Tennis Academy court flyer: schedules, pricing, coaching team. Optimized for print, Save as PDF, and fence-distance reading.',
  robots: 'noindex, nofollow',
}

export default function CourtFlyerPrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="court-flyer-page-shell min-h-0 bg-brand-morning-light pb-8 sm:pb-10">
      {children}
    </div>
  )
}
