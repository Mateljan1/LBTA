'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import BackToTop from '@/components/ui/BackToTop'

/**
 * `seasonBanner` is rendered by the (server) `app/layout.tsx` and passed
 * through here as a slot. SeasonBanner needs server-side cookie access to
 * avoid CLS (audit C-4 fix), and a client component cannot import a server
 * component — only render one passed as a prop. ConditionalLayout still
 * decides *whether* to show it based on pathname.
 */
export default function ConditionalLayout({
  children,
  seasonBanner,
}: {
  children: React.ReactNode
  seasonBanner?: React.ReactNode
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
      {seasonBanner}
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
    </>
  )
}

