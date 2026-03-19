import { getLeadCoach, getProgramCoaches } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoachCard from './CoachCard'

export default function CoachingTeamSection() {
  const leadCoach = getLeadCoach()
  const programCoaches = getProgramCoaches()

  return (
    <section className="bg-brand-sandstone py-20 md:py-28 scroll-mt-28" id="team">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-12">
        <AnimatedSection className="mb-12 md:mb-16">
          <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-3">
            Coaching Team
          </p>
          <h2 className="font-headline text-[28px] md:text-[40px] font-medium text-brand-pacific-dusk tracking-[-0.02em]">
            Meet the Team
          </h2>
          <div className="section-horizon mt-3 mb-2 opacity-90" aria-hidden="true" />
          <p className="font-sans text-[15px] text-brand-pacific-dusk/70 max-w-[520px] leading-relaxed">
            Decades of combined experience. One philosophy: movement first, then craft—and a community that stays.
          </p>
        </AnimatedSection>

        {leadCoach && (
          <AnimatedSection delay={100} className="mb-12 md:mb-16">
            <CoachCard coach={leadCoach} variant="featured" />
          </AnimatedSection>
        )}

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">
          {programCoaches.map((coach, index) => (
            <AnimatedSection key={coach.slug ?? `order-${coach.order}`} delay={150 + index * 50} className="h-full">
              <CoachCard coach={coach} variant="grid" />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
