import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Tennis Lesson Pricing - Transparent Rates | LBTA',
  description: 'Complete pricing: Junior $140-$260/mo, Adult $180-$300/mo, Private $100-$250/hr, VYLO $2,200-3,500/mo. Prepay discounts & $25K+ scholarships available.',
  keywords: 'tennis lesson prices Laguna Beach, tennis academy cost, private tennis lessons cost, tennis scholarship, tennis training investment',
}

const programs = [
  { name: "Little Tennis Stars", ages: "3-4", monthly_1x: 140, monthly_2x: 260, category: "Junior" },
  { name: "Red/Orange/Green Ball", ages: "5-11", monthly_1x: 140, monthly_2x: 260, category: "Junior" },
  { name: "Youth Development", ages: "11-15", monthly_1x: 200, monthly_2x: 380, category: "Junior" },
  { name: "High Performance", ages: "12-17", monthly_1x: 260, monthly_2x: 490, category: "Junior" },
  { name: "College Bound", ages: "14-18", monthly_1x: 260, monthly_2x: 520, category: "Junior" },
  { name: "Adult Beginner", level: "1.0-2.5", monthly_1x: 180, monthly_2x: null, category: "Adult" },
  { name: "Adult Intermediate", level: "3.0-3.5", monthly_1x: 240, monthly_2x: 450, category: "Adult" },
  { name: "Adult Advanced", level: "4.0+", monthly_1x: 300, monthly_2x: null, category: "Adult" },
  { name: "Cardio Tennis", level: "All", monthly_1x: 180, monthly_2x: null, category: "Adult" },
]

const privateRates = [
  { coach: "Andrew Mateljan", specialty: "ATP/WTA Coach", rate_60: 250, rate_90: 350 },
  { coach: "Kevin Jackson", specialty: "College Prep", rate_60: 150, rate_90: 200 },
  { coach: "Savriyan Danilov", specialty: "ATP Pro #556", rate_60: 120, rate_90: 165 },
  { coach: "Andy Wu", specialty: "USPTA Certified", rate_60: 100, rate_90: 135 },
  { coach: "Michelle Bevins", specialty: "Youth Director", rate_60: 120, rate_90: 165 },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Pricing</p>
            <h1 className="text-display-lg heading-display mb-6">
              Transparent Investment
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Clear pricing. No hidden fees. Prepay discounts available.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Group Programs Table */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6 text-center">
              Group Programs
            </h2>
          </AnimatedSection>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <thead className="bg-lbta-charcoal text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-sans font-medium tracking-wide">Program</th>
                  <th className="px-6 py-4 text-left text-sm font-sans font-medium tracking-wide">Ages/Level</th>
                  <th className="px-6 py-4 text-right text-sm font-sans font-medium tracking-wide">Monthly (1x)</th>
                  <th className="px-6 py-4 text-right text-sm font-sans font-medium tracking-wide">Monthly (2x)</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program, index) => (
                  <tr key={program.name} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 font-sans font-medium text-lbta-charcoal">
                      {program.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {program.ages || program.level}
                    </td>
                    <td className="px-6 py-4 text-right font-serif font-light text-lbta-charcoal text-lg">
                      ${program.monthly_1x}
                    </td>
                    <td className="px-6 py-4 text-right font-serif font-light text-lbta-charcoal text-lg">
                      {program.monthly_2x ? `$${program.monthly_2x}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Quarterly prepay discounts available (save 5-10%)
          </p>
        </div>
      </section>

      {/* Private Lessons */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6 text-center">
              Private Instruction
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateRates.map((coach, index) => (
              <AnimatedSection key={coach.coach} delay={index * 0.1}>
                <div className="card-lbta p-6">
                  <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-1">
                    {coach.coach}
                  </h3>
                  <p className="text-sm text-lbta-burnt font-sans mb-4">
                    {coach.specialty}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">60 min</span>
                      <span className="text-lg font-serif font-light">${coach.rate_60}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">90 min</span>
                      <span className="text-lg font-serif font-light">${coach.rate_90}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Package discounts: 5 lessons (5% off), 10 lessons (10% off), 20 lessons (15% off)
          </p>
        </div>
      </section>

      {/* VYLO */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-xs font-sans tracking-ultra-wide uppercase text-white/60 mb-6">
              Elite Training
            </p>
            <h2 className="text-4xl font-serif font-light mb-6">
              VYLO Performance Institute
            </h2>
            <p className="text-lg text-white/80 mb-8">
              10 athletes maximum. Professional-grade training systems.
            </p>
            <div className="flex justify-center gap-6 mb-8">
              <div>
                <p className="text-sm text-white/60 mb-1">Monthly Investment</p>
                <p className="text-3xl font-serif font-light">$2,200-3,500</p>
              </div>
            </div>
            <Link href="/vylo" className="btn-secondary bg-white/10 border-white text-white hover:bg-white hover:text-lbta-charcoal">
              LEARN ABOUT VYLO
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Scholarship */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Scholarship Program
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              $25,000+ awarded annually to families demonstrating need and commitment
            </p>
            <div className="card-lbta p-8 max-w-2xl mx-auto text-left">
              <p className="text-gray-600 mb-4">
                Scholarships cover 25-50% of program tuition for qualified families.
              </p>
              <p className="text-sm text-gray-500">
                Requirements: Household income &lt; $75K, 2+ sessions/week commitment, 2.5+ GPA
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Email applications to{' '}
                <a href="mailto:scholarships@lagunabeachtennisacademy.com" className="text-lbta-burnt hover:text-lbta-orange">
                  scholarships@lagunabeachtennisacademy.com
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Questions About Pricing?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Schedule a complimentary consultation. We'll help you find the right program and investment level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                SCHEDULE CONSULTATION
              </Link>
              <a href="tel:9494646645" className="btn-secondary">
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

