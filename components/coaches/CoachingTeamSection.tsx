import { getTeamCoachesForGrid } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoachCard from './CoachCard'

export default function CoachingTeamSection() {
  const teamCoaches = getTeamCoachesForGrid()

  return (
    <section
      className="scroll-mt-28 bg-brand-sandstone py-20 md:py-24 lg:py-28"
      id="team"
      aria-labelledby="meet-the-team-heading"
    >
      {/* Match FounderSection max-width + horizontal padding so the page reads as one editorial column */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16">
        <AnimatedSection className="mb-12 md:mb-14 lg:mb-16">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-pacific-dusk/60">
            Coaching Team
          </p>
          <h2
            id="meet-the-team-heading"
            className="font-headline text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.02em] text-brand-pacific-dusk"
          >
            Meet the Team
          </h2>
          <div className="section-horizon mb-3 mt-3 max-w-[min(100%,12rem)] opacity-90" aria-hidden="true" />
          <p className="max-w-[52ch] font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/70 md:text-[16px]">
            One coaching standard across every program: movement first, then craft.
          </p>
          <p className="mt-4 max-w-[52ch] border-l-2 border-brand-victoria-cove/35 pl-4 font-sans text-[13px] leading-relaxed text-brand-pacific-dusk/58 md:text-[14px]">
            Choose the coach and track that match your goals.
          </p>
        </AnimatedSection>

        {/* Balanced 3-up layout on desktop keeps cards compact and editorial. */}
        <div className="mx-auto grid w-full max-w-[1060px] grid-cols-1 items-stretch justify-items-center gap-6 sm:gap-7 md:grid-cols-2 md:gap-x-6 md:gap-y-7 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-8">
          {teamCoaches.map((coach, index) => (
            <AnimatedSection
              key={coach.slug ?? `order-${coach.order}-${index}`}
              delay={100 + index * 50}
              className="flex min-h-0 min-w-0 h-full w-full"
            >
              <CoachCard coach={coach} variant="compact" compactStacked />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
