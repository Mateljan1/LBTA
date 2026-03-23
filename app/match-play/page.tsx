import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Match Play | LBTA',
  description: 'Match play at Laguna Beach Tennis Academy. View our current programs and schedule.',
  keywords: 'tennis match play Laguna Beach, tennis programs, LBTA',
  openGraph: {
    title: 'Match Play | LBTA',
    description: 'Match play at Laguna Beach Tennis Academy. View our current programs and schedule.',
    type: 'website',
    images: [{ url: '/legacy-working-assets/hero/match-play-hero/match-play-hero.webp', width: 1920, height: 1080, alt: 'LBTA match play' }],
  },
}

export default function MatchPlayPage() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/legacy-working-assets/hero/match-play-hero/match-play-hero.webp"
          alt="UTR Match Play at LBTA"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 48%' }}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-brand-deep-water/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="max-w-[640px] mx-auto px-4 md:px-6 text-center relative z-10">
        <AnimatedSection>
          <p className="font-sans text-[11px] font-medium text-white/80 uppercase tracking-[0.2em] mb-4">
            Match Play
          </p>
          <h1 className="font-headline text-[32px] md:text-[44px] font-medium text-white leading-[1.15] mb-6">
            Not currently offered
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/90 leading-relaxed mb-10">
            Friday match play is not on the schedule at this time. View our current programs, group sessions, and leagues on the schedule page.
          </p>
          <Link
            href="/schedules"
            className="inline-flex items-center justify-center bg-white text-black font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            View schedule
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
