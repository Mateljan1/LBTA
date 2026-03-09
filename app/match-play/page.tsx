import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import pricingData from '@/data/pricing-supplemental.json'

const mp = pricingData.matchPlay

export const metadata: Metadata = {
  title: 'Match Play Friday - Competitive Tennis Event | LBTA',
  description: `Friday evening match play for all ages. Junior session 4-5:30pm ($${mp.junior.dropIn}), Adult session 6-8pm ($${mp.adult.dropIn}). Round robin doubles, drop-in friendly.`,
  keywords: 'tennis match play Laguna Beach, Friday tennis, round robin tennis, competitive tennis, drop-in tennis',
}

const features = [
  "Round robin format - play with different partners",
  "Supervised play - LBTA coach on-site",
  "All balls provided",
  "Drop-in friendly - no commitment",
  "Guaranteed court time",
  "Family discount available"
]

export default function MatchPlayPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Match Play</p>
            <h1 className="text-display-lg heading-display mb-6">
              Test Your Game
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Every Friday evening, you'll experience real match pressure in a supportive environment. Round robin doubles. All skill levels welcome. Your competitive confidence grows here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      {/* Sessions */}
      <section className="section-spacing bg-brand-morning-light">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Junior */}
            <AnimatedSection>
              <div className="card-lbta p-10">
                <h2 className="text-2xl font-headline font-light text-brand-pacific-dusk mb-6">
                  Junior Competitive Play
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Ages:</strong> {mp.junior.ages}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Time:</strong> {mp.junior.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Format:</strong> {mp.junior.format}</span>
                  </div>
                </div>

                <div className="bg-brand-sandstone rounded-sm p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-brand-sunset-cliff" />
                    <h3 className="text-lg font-sans font-medium">Pricing</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop-In</span>
                      <span className="text-2xl font-headline font-light">${mp.junior.dropIn}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Monthly: {mp.junior.monthlySessions} sessions for ${mp.junior.monthlyPrice} (save ${mp.junior.monthlySavings})
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="btn-primary w-full justify-center"
                >
                  RESERVE SPOT
                </Link>
              </div>
            </AnimatedSection>

            {/* Adult */}
            <AnimatedSection delay={0.2}>
              <div className="card-lbta p-10">
                <h2 className="text-2xl font-headline font-light text-brand-pacific-dusk mb-6">
                  Adult League Play
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Level:</strong> {mp.adult.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Time:</strong> {mp.adult.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-sunset-cliff" />
                    <span className="text-gray-600"><strong>Format:</strong> {mp.adult.format}</span>
                  </div>
                </div>

                <div className="bg-brand-sandstone rounded-sm p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-brand-sunset-cliff" />
                    <h3 className="text-lg font-sans font-medium">Pricing</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop-In</span>
                      <span className="text-2xl font-headline font-light">${mp.adult.dropIn}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Monthly: {mp.adult.monthlySessions} sessions for ${mp.adult.monthlyPrice} (save ${mp.adult.monthlySavings})
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="btn-primary w-full justify-center"
                >
                  RESERVE SPOT
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} className="mt-12 text-center">
            <div className="card-lbta p-8 max-w-md mx-auto">
              <h3 className="text-xl font-sans font-medium mb-4">Family Package</h3>
              <p className="text-gray-600 mb-4">Bring family members for discounted rates</p>
              <div className="text-2xl font-headline font-light text-brand-pacific-dusk mb-2">
                ${mp.family.dropIn} drop-in
              </div>
              <p className="text-sm text-gray-500">Monthly: ${mp.family.monthlyPrice} for family</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      {/* What to Expect */}
      <section className="section-spacing bg-brand-sandstone">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-headline font-light text-brand-pacific-dusk mb-6">
              What to Expect
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={feature} delay={index * 0.05}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-sunset-cliff flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-headline text-[32px] md:text-[48px] font-medium text-white leading-[1.15] mb-4">
            Join Friday
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-8">
            Competitive play. Balanced pairings. Weekly.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Reserve Spot
          </Link>
        </div>
      </DarkSection>
    </>
  )
}

