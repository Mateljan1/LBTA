import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import { getProgramsOverview } from '@/lib/programs-data'
import ProgramOverviewCard from '@/components/programs/ProgramOverviewCard'

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
      <section className="relative min-h-[55vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/hero.webp"
            alt="Laguna Beach Tennis Academy players training at sunset on coastal courts"
            fill
            className="object-cover opacity-55"
            style={{ objectPosition: '50% 70%' }}
            sizes="100vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-brand-deep-water/50" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <span className="text-eyebrow text-brand-victoria-cove/90 mb-4 block">Choose Your Path</span>
          <h1 className="font-headline text-display-xl text-white mb-5">
            Programs for Every Player.
          </h1>
          <p className="font-sans text-body-lg font-light text-white/90 max-w-2xl mx-auto">
            From first rally to college and beyond — movement, craft, community.
          </p>
        </div>
      </section>

      <HorizonDivider />

      {/* Program cards — image-led, first featured */}
      <section className="container-lbta section bg-brand-morning-light">
        <p className="font-sans text-body text-brand-pacific-dusk/75 text-center max-w-xl mx-auto mb-12 md:mb-16">
          Find your path. Every program is built on the same foundation: movement first, then craft, inside a real community.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <ProgramOverviewCard
              key={program.title}
              program={program}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-headline text-[26px] md:text-[36px] font-medium text-white leading-[1.2] mb-3">
            Schedules & Pricing
          </h2>
          <p className="font-sans text-[16px] md:text-[17px] text-white/85 mb-8">
            Full schedule, pricing, and registration for all programs.
          </p>
          <Link
            href="/schedules"
            className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            View Schedules
          </Link>
        </div>
      </DarkSection>
    </>
  )
}
