import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'
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
          <h1 className="font-serif text-display-xl text-white mb-6">
            Programs for Every Player.
          </h1>
          <p className="font-sans text-body-lg font-light text-white/85 max-w-2xl mx-auto">
            From your child's first rally to college recruitment and lifelong play — movement, craft, community.
          </p>
        </div>
      </section>

      <div className="horizon-line" />

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
              <h2 className="font-serif text-headline text-brand-pacific-dusk mb-3 group-hover:text-brand-deep-water transition-colors">
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

      {/* Schedule CTA */}
      <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="View of Laguna Beach tennis courts overlooking ocean horizon at sunset"
            fill
            className="object-cover opacity-50"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/80 to-brand-deep-water/40" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto py-16">
          <h2 className="font-serif text-display-md text-white mb-4">
            View Full Schedule & Pricing
          </h2>
          <p className="text-body font-light text-white/80 mb-8">
            Schedules, pricing, and registration for all programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/schedules" className="btn-primary">
              View Schedules →
            </Link>
            <Link
              href="/schedules"
              className="btn-secondary border-white/30 text-white hover:border-white hover:bg-white/10"
            >
              View Full Schedule
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
