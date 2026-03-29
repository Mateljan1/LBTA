import { getTeamCoachesForGrid } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoachCard from './CoachCard'

export default function CoachingTeamSection() {
  const teamCoaches = getTeamCoachesForGrid()

  return (
    <section
      className="scroll-mt-28 bg-brand-sandstone py-24 md:py-28 lg:py-32"
      id="team"
      aria-labelledby="meet-the-team-heading"
    >
      {/* Match FounderSection max-width + horizontal padding so the page reads as one editorial column */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16">
        <AnimatedSection className="mb-14 md:mb-16 lg:mb-20">
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
            Decades of combined experience. One philosophy: movement first, then craft—and a community that stays.
          </p>
          <p className="mt-5 max-w-[52ch] border-l-2 border-brand-victoria-cove/40 pl-4 font-sans text-[13px] leading-relaxed text-brand-pacific-dusk/58 md:text-[14px]">
            Same philosophy as above. Private sessions with the coach who fits your goals.
          </p>
        </AnimatedSection>

        {/* 2×2 from md+: Robert & Peter, then Michelle & Allison (see getTeamCoachesForGrid) */}
        <div className="grid grid-cols-1 items-stretch gap-9 md:grid-cols-2 md:gap-x-10 md:gap-y-12 xl:gap-x-12 xl:gap-y-14">
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
