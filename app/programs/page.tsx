import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import { getProgramsOverview } from '@/lib/programs-data'

export const metadata: Metadata = {
  title: 'Programs | Laguna Beach Tennis Academy',
  description: 'Choose your path — junior development, youth, high performance, adult programs, camps, fitness, and leagues. Every program built around movement, craft, and community.',
}

export default function Programs() {
  const programs = getProgramsOverview()
  return (
    <>
      <CourseSchema />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/hero.webp"
            alt="Laguna Beach Tennis Academy players training at sunset on coastal courts"
            fill
            className="object-cover opacity-60"
            style={{ objectPosition: '50% 70%' }}
            sizes="100vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-brand-deep-water/40" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <span className="text-eyebrow text-brand-victoria-cove/90 mb-4 block">Choose Your Path</span>
          <h1 className="font-headline text-display-xl text-white mb-6">
            Programs for Every Player.
          </h1>
          <p className="font-sans text-body-lg font-light text-white/85 max-w-2xl mx-auto">
            From your child's first rally to college recruitment and lifelong play — movement, craft, community.
          </p>
        </div>
      </section>

      <HorizonDivider />

      {/* Card Grid */}
      <section className="container-lbta section bg-brand-morning-light">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program) => (
            <Link
              key={program.title}
              href={program.href}
              className="group flex flex-col p-6 md:p-8 bg-white rounded-luxury border border-brand-pacific-dusk/5 hover:border-brand-sunset-cliff/20 hover:shadow-card-hover transition-all duration-300"
            >
              <span className="text-eyebrow text-brand-victoria-cove mb-3 block">
                {program.eyebrow}
              </span>
              <h2 className="font-headline text-headline text-brand-pacific-dusk mb-3 group-hover:text-brand-deep-water transition-colors">
                {program.title}
              </h2>
              <p className="text-body font-light text-brand-pacific-dusk/70 mb-4 flex-1 leading-relaxed">
                {program.description}
              </p>
              {'fromPrice' in program && program.fromPrice != null && (
                <p className="font-sans text-body-sm text-brand-pacific-dusk/60 mb-4">
                  From ${program.fromPrice}/session
                </p>
              )}
              <span className="font-sans text-ui font-medium text-brand-sunset-cliff group-hover:text-brand-sunset-cliff/80 transition-colors">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-headline text-[28px] md:text-[40px] font-medium text-white leading-[1.15] mb-4">
            View Full Schedule & Pricing
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-8">
            Schedules, pricing, and registration for all programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedules"
              className="inline-flex items-center justify-center bg-brand-sunset-cliff text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
            >
              View Schedules
            </Link>
            <Link
              href="/schedules"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/50 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
            >
              View Full Schedule
            </Link>
          </div>
        </div>
      </DarkSection>
    </>
  )
}
