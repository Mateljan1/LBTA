'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import WinterCountdown from '@/components/ui/WinterCountdown'
import BackToTop from '@/components/ui/BackToTop'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isVYLO = pathname?.startsWith('/vylo')

  if (isVYLO) {
    // VYLO pages render without LBTA header/footer
    return <>{children}</>
  }

  // All other pages get LBTA header/footer
  return (
    <>
      <WinterCountdown />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

