import { getTeamCoachesForGrid } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoachCard from './CoachCard'

export default function CoachingTeamSection() {
  const teamCoaches = getTeamCoachesForGrid()

  return (
    <section className="bg-brand-sandstone py-20 md:py-28 scroll-mt-28" id="team">
      <div className="max-w-[1140px] lg:max-w-[1180px] mx-auto px-6 md:px-10 lg:px-12">
        <AnimatedSection className="mb-12 md:mb-16">
          <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-3">
            Coaching Team
          </p>
          <h2 className="font-headline text-[28px] md:text-[40px] font-medium text-brand-pacific-dusk tracking-[-0.02em]">
            Meet the Team
          </h2>
          <div className="section-horizon mt-3 mb-2 opacity-90" aria-hidden="true" />
          <p className="font-sans text-[15px] text-brand-pacific-dusk/70 max-w-[540px] leading-relaxed">
            Decades of combined experience. One philosophy: movement first, then craft—and a community that stays.
          </p>
          <p className="mt-4 font-sans text-[13px] md:text-[14px] text-brand-pacific-dusk/55 max-w-[540px] leading-relaxed border-l-2 border-brand-victoria-cove/35 pl-4">
            Same philosophy as above. Private sessions with the coach who fits your goals.
          </p>
        </AnimatedSection>

        {/* 2×2 from md+: Robert & Peter, then Michelle & Allison (see getTeamCoachesForGrid) */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-8 md:gap-y-10 xl:gap-x-10">
          {teamCoaches.map((coach, index) => (
            <AnimatedSection
              key={coach.slug ?? `order-${coach.order}-${index}`}
              delay={100 + index * 50}
              className="flex h-full w-full"
            >
              <CoachCard coach={coach} variant="compact" compactStacked />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
