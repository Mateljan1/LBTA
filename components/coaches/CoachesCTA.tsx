import Link from 'next/link'
import DarkSection from '@/components/ui/DarkSection'

export default function CoachesCTA() {
  return (
    <DarkSection className="py-20 md:py-28 scroll-mt-28" id="book">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-sandstone mb-6 tracking-[-0.02em]">
          Train With Us
        </h2>
        <p className="font-sans text-[16px] text-white/85 mb-10 leading-[1.7] max-w-[500px] mx-auto">
          Experience coaching that develops more than your game. Book a trial session to meet our team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-[2px] hover:bg-brand-sandstone hover:-translate-y-0.5 transition-all min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            Book Trial Session
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center border border-white/40 text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-[2px] hover:bg-white/10 transition-all min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            View Programs
          </Link>
        </div>
      </div>
    </DarkSection>
  )
}
