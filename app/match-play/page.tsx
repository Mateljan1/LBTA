import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Friday Match Play',
  description:
    'Friday match play is not currently on the calendar at Laguna Beach Tennis Academy. Explore UTR Match Play, leagues, and the full schedule.',
  keywords: 'tennis match play Laguna Beach, UTR match play, tennis programs, LBTA',
  openGraph: {
    title: 'Friday Match Play',
    description:
      'Friday match play is not currently offered. See UTR Match Play, leagues, and schedules at LBTA.',
    type: 'website',
    images: [
      {
        url: '/images/programs/utr-match-play/utr-match-play-hero.webp',
        width: 1920,
        height: 1080,
        alt: 'Rated match play at Laguna Beach Tennis Academy',
      },
    ],
  },
}

export default function MatchPlayPage() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/programs/utr-match-play/utr-match-play-hero.webp"
          alt="Outdoor match play at Laguna Beach Tennis Academy"
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
          <p className="font-sans text-[16px] md:text-[18px] text-white/90 leading-relaxed mb-6">
            Friday match play is not on the schedule at this time. For rated Saturday play, see UTR Match Play. For team competition, see leagues — or open the full schedule for programs and pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link
              href="/programs/utr-match-play"
              className="inline-flex items-center justify-center bg-white text-black font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              UTR Match Play
            </Link>
            <Link
              href="/schedules"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Schedule &amp; pricing
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
