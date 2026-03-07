'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import SeasonBanner from '@/components/ui/SeasonBanner'
import BackToTop from '@/components/ui/BackToTop'
import ChatWidget from '@/components/ChatWidget'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isBeginnerLanding = pathname?.startsWith('/beginner-program')
  const isJuniorLanding = pathname?.startsWith('/junior-trial')

  // Standalone landing pages render without LBTA header/footer
  if (isBeginnerLanding || isJuniorLanding) {
    return <>{children}</>
  }

  // All other pages get LBTA header/footer
  return (
    <>
      <SeasonBanner />
      <Header />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
    </>
  )
}

