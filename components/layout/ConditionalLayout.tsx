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
  const isCoachHub = pathname?.startsWith('/coach-hub')
  const isPrint = pathname?.startsWith('/print')

  // Standalone landing pages render without LBTA header/footer
  if (isBeginnerLanding || isJuniorLanding || isCoachHub || isPrint) {
    return <>{children}</>
  }

  // All other pages get LBTA header/footer
  return (
    <>
      <SeasonBanner />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow max-md:pb-[calc(var(--lbta-sticky-cta-h,0px)+var(--lbta-program-bar-h,0px))]"
      >
        {children}
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
    </>
  )
}

