import { getLeadCoach, getProgramCoaches } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoachCard from './CoachCard'

export default function CoachingTeamSection() {
  const leadCoach = getLeadCoach()
  const programCoaches = getProgramCoaches()

  return (
    <section className="bg-brand-sandstone py-20 md:py-28 scroll-mt-28" id="team">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection className="mb-14 md:mb-18">
          <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-4">
            Coaching Team
          </p>
          <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk tracking-[-0.02em]">
            Meet the Team
          </h2>
          <p className="font-sans text-[15px] text-brand-pacific-dusk/70 mt-3 max-w-[560px] leading-relaxed">
            100+ years of combined coaching experience across juniors, college, and professional play.
          </p>
        </AnimatedSection>

        {leadCoach && (
          <AnimatedSection delay={100} className="mb-14 md:mb-18">
            <CoachCard coach={leadCoach} variant="featured" />
          </AnimatedSection>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {programCoaches.map((coach, index) => (
            <AnimatedSection key={coach.slug ?? `order-${coach.order}`} delay={150 + index * 50}>
              <CoachCard coach={coach} variant="grid" />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
