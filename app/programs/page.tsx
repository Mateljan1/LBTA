import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import MethodSection from '@/components/programs/MethodSection'
import ProgramsTabView from '@/components/programs/ProgramsTabView'
import { getSpringProgramsForDisplay } from '@/lib/programs-data'
import { parsePrograms, parseYear2026Sections } from '@/lib/schedule-schemas'
import year2026Data from '@/data/year2026.json'

export const metadata: Metadata = {
  alternates: { canonical: '/programs' },
  title: 'Programs | Find Your Path',
  description:
    'Junior development from age 3 through college pathway. Adult programs from beginner to advanced. LiveBall, camps, leagues — all built on the Mateljan Method in Laguna Beach.',
  openGraph: {
    images: [
      {
        url: '/images/programs/hero.webp',
        width: 1200,
        height: 900,
        alt: 'Tennis programs at Laguna Beach Tennis Academy',
      },
    ],
  },
}

const savings = [
  { label: 'Early Bird', discount: '5% off', detail: 'Register 2+ weeks before the season' },
  { label: 'Sibling', discount: '10% off', detail: 'Additional children in the same program' },
  { label: 'Multi-Season', discount: '5% off', detail: 'Register for 2 consecutive seasons' },
  { label: 'Multi-Camp Week', discount: '10% off', detail: '4+ weeks of summer camp' },
  { label: 'Annual Payment', discount: '10% off', detail: 'Full year paid upfront' },
]

export default function Programs() {
  const rawPrograms = getSpringProgramsForDisplay()
  const programs = parsePrograms(rawPrograms)
  const year2026 = parseYear2026Sections(year2026Data)

  return (
    <>
      <CourseSchema />

      {/* ── 1. Hero ── */}
      <section className="relative min-h-[55vh] md:min-h-[62vh] flex items-center justify-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/hero.webp"
            alt="Tennis programs and training at Laguna Beach Tennis Academy"
            fill
            className="object-cover max-md:brightness-[0.9]"
            style={{ objectPosition: '50% 48%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.45) 0%, transparent 80%), linear-gradient(to top, rgba(15,34,55,0.85) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.35) 100%)',
            }}
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="text-eyebrow text-white/80 mb-4 block text-shadow-hero-readable">
              Laguna Beach, California
            </span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="font-headline text-display-xl text-white mb-5 text-shadow-hero-readable">
              Every Player Has a Path.
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-body-lg font-light text-white/90 max-w-2xl mx-auto mb-8 text-shadow-hero-readable">
              From age three to college pathway. From first rally to USTA league.
              One coaching system, every court.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#programs-tabs"
                className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Find Your Program
              </a>
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/60 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Book a Trial
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      {/* ── 2. The Mateljan Method ── */}
      <MethodSection />

      <HorizonDivider />

      {/* ── 3. Programs — 5-tab toggle ── */}
      <section id="programs-tabs" className="container-lbta section bg-brand-morning-light scroll-mt-20">
        <AnimatedSection>
          <div className="mb-10 md:mb-12">
            <span className="text-eyebrow text-brand-victoria-cove mb-3 block">
              All Programs
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15]">
              Find What Fits
            </h2>
          </div>
        </AnimatedSection>
        <ProgramsTabView programs={programs} year2026={year2026} />
      </section>

      <HorizonDivider />

      {/* ── 4. Ways to Save ── */}
      <section className="container-lbta section bg-brand-sandstone/40">
        <AnimatedSection>
          <div className="text-center mb-10">
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
              Investment
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              Ways to Save
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-lg mx-auto leading-relaxed">
              No hidden fees. No contracts. Per-week rate times number of weeks — calculated the same way for every program.
            </p>
          </div>
        </AnimatedSection>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {savings.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 50}>
              <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] p-5 h-full">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-sans text-[15px] font-medium text-brand-pacific-dusk">
                    {s.label}
                  </h3>
                  <span className="font-sans text-[12px] font-medium text-brand-victoria-cove">
                    {s.discount}
                  </span>
                </div>
                <p className="font-sans text-[13px] text-brand-pacific-dusk/50 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </AnimatedSection>
          ))}
          <AnimatedSection delay={savings.length * 50}>
            <div className="bg-brand-deep-water/[0.03] border border-brand-pacific-dusk/5 rounded-[2px] p-5 h-full">
              <h3 className="font-sans text-[15px] font-medium text-brand-pacific-dusk mb-1">
                Scholarship Program
              </h3>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/50 leading-relaxed">
                $25,000 annual budget. 25–50% coverage.{' '}
                <Link href="/apply-scholarship" className="text-brand-victoria-cove hover:underline">
                  Apply here
                </Link>.
              </p>
            </div>
          </AnimatedSection>
        </div>
        <AnimatedSection>
          <div className="text-center">
            <Link
              href="/schedules"
              className="font-sans text-[14px] font-medium text-brand-sunset-cliff hover:text-brand-sunset-cliff/80 transition-colors inline-flex items-center gap-1 min-h-[48px]"
            >
              View full pricing &rarr;
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── 5. Dark CTA ── */}
      <DarkSection className="py-20 md:py-28">
        <div className="max-w-[640px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(1.5rem,4vw,2.5rem)] font-medium text-white leading-[1.2] mb-4">
              Start training with purpose.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="font-sans text-[16px] md:text-[17px] text-white/60 mb-9 leading-relaxed">
              Book a complimentary trial to find your level and meet the coaching team —
              or view the full schedule and pricing for every program.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Book a Trial
              </Link>
              <Link
                href="/schedules"
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/20 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                View Schedules
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </DarkSection>
    </>
  )
}
