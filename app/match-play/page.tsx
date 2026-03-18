import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Match Play | LBTA',
  description: 'Match play at Laguna Beach Tennis Academy. View our current programs and schedule.',
  keywords: 'tennis match play Laguna Beach, tennis programs, LBTA',
}

export default function MatchPlayPage() {
  return (
    <section className="relative bg-white pt-32 pb-24 min-h-[60vh]">
      <div className="max-w-[640px] mx-auto px-4 md:px-6 text-center">
        <AnimatedSection>
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-4">
            Match Play
          </p>
          <h1 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.15] mb-6">
            Not currently offered
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/80 leading-relaxed mb-10">
            Friday match play is not on the schedule at this time. View our current programs, group sessions, and leagues on the schedule page.
          </p>
          <Link
            href="/schedules"
            className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            View schedule
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
