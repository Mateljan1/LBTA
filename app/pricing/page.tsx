'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PricingComparison from '@/components/PricingComparison'

// Winter 2026 - 13 Week Pricing (Jan 6 - Apr 5, 2026)
const winter2026Programs = {
  juniors: [
    { name: "Little Tennis Stars", duration: "45 min", ages: "3-4", billing: "Monthly", price_1x: "$120/mo", price_2x: null, dropIn: "$40", location: "Moulton" },
    { name: "Red Ball Beginner", duration: "1 hr", ages: "5-7", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Red Ball Advanced", duration: "1 hr", ages: "5-7", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Orange Ball Beginner", duration: "1 hr", ages: "7-9", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Orange Ball Advanced", duration: "1 hr", ages: "7-9", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Green Dot Beginner", duration: "1 hr", ages: "9-11", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Green Dot Advanced", duration: "1 hr", ages: "9-11", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
    { name: "Fun Friday – Games & Skills", duration: "1 hr", ages: "5-10", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton / Alta" },
  ],
  youthDev: [
    { name: "Youth Development (11-13)", duration: "1.5 hr", ages: "11-13", billing: "Quarterly", price_1x: "$756.17", price_2x: null, dropIn: "$70", location: "Moulton / Alta" },
    { name: "Youth Development (13-18)", duration: "1.5 hr", ages: "13-18", billing: "Quarterly", price_1x: "$756.17", price_2x: "$1,436.50", dropIn: "$70", location: "Moulton / LBHS" },
  ],
  adults: [
    { name: "Adult Beginner (Moulton)", duration: "1 hr", level: "1.0-2.5", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "Moulton" },
    { name: "Adult Beginner (LBHS)", duration: "1 hr", level: "1.0-2.5", billing: "Quarterly", price_1x: "$546.00", price_2x: null, dropIn: "$50", location: "LBHS" },
    { name: "Adult Intermediate", duration: "1.5 hr", level: "3.0-3.5", billing: "Quarterly", price_1x: "$680.85", price_2x: "$1,292.85", dropIn: "$70", location: "LBHS" },
    { name: "Adult Advanced", duration: "2 hr", level: "4.0+", billing: "Quarterly", price_1x: "$810.33", price_2x: null, dropIn: "$80", location: "LBHS" },
  ],
  cardioLiveball: [
    { name: "Cardio Tennis – All Levels", duration: "90 min", level: "Mixed", billing: "Monthly", price_1x: "$150/mo", price_2x: null, dropIn: "$50", location: "Moulton" },
    { name: "LiveBall – Intermediate (LBHS)", duration: "90 min", level: "3.0-3.5", billing: "Monthly", price_1x: "$150/mo", price_2x: null, dropIn: "$50", location: "LBHS" },
    { name: "LiveBall – Intermediate (Moulton)", duration: "90 min", level: "3.0-3.5", billing: "Monthly", price_1x: "$150/mo", price_2x: null, dropIn: "$50", location: "Moulton" },
    { name: "LiveBall – Advanced (LBHS)", duration: "90 min", level: "4.0+", billing: "Monthly", price_1x: "$150/mo", price_2x: null, dropIn: "$50", location: "LBHS" },
  ]
}

const privateRates = [
  { coach: "Andrew Mateljan", specialty: "ATP/WTA Coach", rate_60: 250, rate_90: 350 },
  { coach: "Kevin Jackson", specialty: "College Prep", rate_60: 150, rate_90: 200 },
  { coach: "Savriyan Danilov", specialty: "ATP Pro #556", rate_60: 120, rate_90: 165 },
  { coach: "Andy Wu", specialty: "USPTA Certified", rate_60: 100, rate_90: 135 },
  { coach: "Michelle Bevins", specialty: "Youth Director", rate_60: 120, rate_90: 165 },
]

export default function PricingPage() {
  const [activeSeason, setActiveSeason] = useState<'fall' | 'winter'>('winter')

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>Pricing</p>
            <h1 className="display mb-6">
              What It Costs
            </h1>
            <p className="body-lg max-w-2xl mx-auto">
              Tennis teaches more than technique. It builds character, discipline, and confidence that last a lifetime.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Pricing Comparison - Psychology-driven */}
      <PricingComparison />

      {/* Value Proposition */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-8">
              What Your Investment Includes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="subhead mb-3">
                  ATP/WTA Expertise
                </h3>
                <p className="body-sm" style={{ color: '#6B6B6B' }}>
                  Training methods proven at the highest levels of professional tennis, adapted to your development stage.
                </p>
              </div>
              <div>
                <h3 className="subhead mb-3">
                  Individual Attention
                </h3>
                <p className="body-sm" style={{ color: '#6B6B6B' }}>
                  Small group sizes ensure personalized feedback. Your unique path honored and accelerated.
                </p>
              </div>
              <div>
                <h3 className="subhead mb-3">
                  Complete Development
                </h3>
                <p className="body-sm" style={{ color: '#6B6B6B' }}>
                  Technical skill, mental toughness, physical conditioning, and life character—integrated approach.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Selection */}
      <section className="bg-lbta-bone border-y border-gray-200 py-12">
        <div className="container-narrow">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveSeason('fall')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                activeSeason === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                activeSeason === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>
          <div className="text-center">
            <p className="body-sm" style={{ color: '#6B6B6B' }}>
              {activeSeason === 'fall'
                ? 'Current session in progress — Join us anytime'
                : '13-week session: January 6 – April 5, 2026 • Registration opens December 1'}
            </p>
          </div>
        </div>
      </section>

      {activeSeason === 'winter' ? (
        <>
          {/* Winter 2026 - Junior Programs */}
          <section className="section-spacing bg-white">
            <div className="container-lbta">
              <AnimatedSection className="mb-12">
                <h2 className="headline text-center mb-4">
                  Junior Programs
                </h2>
                <p className="body-sm text-center" style={{ color: '#6B6B6B', maxWidth: '700px', margin: '0 auto' }}>
                  13-week pricing • Quarterly billing available • All locations
                </p>
              </AnimatedSection>

              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200">
                  <thead className="bg-lbta-charcoal text-white">
                    <tr>
                      <th className="px-6 py-4 text-left eyebrow">Program</th>
                      <th className="px-6 py-4 text-left eyebrow">Duration</th>
                      <th className="px-6 py-4 text-left eyebrow">Ages</th>
                      <th className="px-6 py-4 text-left eyebrow">Billing</th>
                      <th className="px-6 py-4 text-right eyebrow">13-Week Price</th>
                      <th className="px-6 py-4 text-right eyebrow">Drop-In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winter2026Programs.juniors.map((program, index) => (
                      <tr key={program.name} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 body-sm font-medium" style={{ color: '#1A1A1A' }}>
                          {program.name}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.duration}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.ages}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.billing}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_1x}
                        </td>
                        <td className="px-6 py-4 text-right body-sm" style={{ color: '#6B6B6B' }}>
                          {program.dropIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Winter 2026 - Youth Development */}
          <section className="section-spacing bg-lbta-bone">
            <div className="container-lbta">
              <AnimatedSection className="mb-12">
                <h2 className="headline text-center mb-4">
                  Youth Development & Performance
                </h2>
                <p className="body-sm text-center" style={{ color: '#6B6B6B' }}>
                  1.5 hour sessions • Advanced training
                </p>
              </AnimatedSection>

              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200">
                  <thead className="bg-lbta-charcoal text-white">
                    <tr>
                      <th className="px-6 py-4 text-left eyebrow">Program</th>
                      <th className="px-6 py-4 text-left eyebrow">Duration</th>
                      <th className="px-6 py-4 text-left eyebrow">Ages</th>
                      <th className="px-6 py-4 text-right eyebrow">1x/week</th>
                      <th className="px-6 py-4 text-right eyebrow">2x/week</th>
                      <th className="px-6 py-4 text-right eyebrow">Drop-In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winter2026Programs.youthDev.map((program, index) => (
                      <tr key={program.name} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 body-sm font-medium" style={{ color: '#1A1A1A' }}>
                          {program.name}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.duration}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.ages}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_1x}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_2x || '—'}
                        </td>
                        <td className="px-6 py-4 text-right body-sm" style={{ color: '#6B6B6B' }}>
                          {program.dropIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Winter 2026 - Adult Programs */}
          <section className="section-spacing bg-white">
            <div className="container-lbta">
              <AnimatedSection className="mb-12">
                <h2 className="headline text-center mb-4">
                  Adult Programs
                </h2>
                <p className="body-sm text-center" style={{ color: '#6B6B6B' }}>
                  Beginner through Advanced • Multiple locations
                </p>
              </AnimatedSection>

              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200">
                  <thead className="bg-lbta-charcoal text-white">
                    <tr>
                      <th className="px-6 py-4 text-left eyebrow">Program</th>
                      <th className="px-6 py-4 text-left eyebrow">Duration</th>
                      <th className="px-6 py-4 text-left eyebrow">Level</th>
                      <th className="px-6 py-4 text-right eyebrow">1x/week</th>
                      <th className="px-6 py-4 text-right eyebrow">2x/week</th>
                      <th className="px-6 py-4 text-right eyebrow">Drop-In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winter2026Programs.adults.map((program, index) => (
                      <tr key={program.name} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 body-sm font-medium" style={{ color: '#1A1A1A' }}>
                          {program.name}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.duration}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.level}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_1x}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_2x || '—'}
                        </td>
                        <td className="px-6 py-4 text-right body-sm" style={{ color: '#6B6B6B' }}>
                          {program.dropIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Winter 2026 - Cardio & LiveBall */}
          <section className="section-spacing bg-lbta-bone">
            <div className="container-lbta">
              <AnimatedSection className="mb-12">
                <h2 className="headline text-center mb-4">
                  Cardio Tennis & LiveBall
                </h2>
                <p className="body-sm text-center" style={{ color: '#6B6B6B' }}>
                  Monthly billing • 90 minute sessions
                </p>
              </AnimatedSection>

              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200">
                  <thead className="bg-lbta-charcoal text-white">
                    <tr>
                      <th className="px-6 py-4 text-left eyebrow">Program</th>
                      <th className="px-6 py-4 text-left eyebrow">Duration</th>
                      <th className="px-6 py-4 text-left eyebrow">Level</th>
                      <th className="px-6 py-4 text-left eyebrow">Billing</th>
                      <th className="px-6 py-4 text-right eyebrow">Monthly Price</th>
                      <th className="px-6 py-4 text-right eyebrow">Drop-In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winter2026Programs.cardioLiveball.map((program, index) => (
                      <tr key={program.name} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 body-sm font-medium" style={{ color: '#1A1A1A' }}>
                          {program.name}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.duration}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.level}
                        </td>
                        <td className="px-6 py-4 body-sm" style={{ color: '#6B6B6B' }}>
                          {program.billing}
                        </td>
                        <td className="px-6 py-4 text-right subhead">
                          {program.price_1x}
                        </td>
                        <td className="px-6 py-4 text-right body-sm" style={{ color: '#6B6B6B' }}>
                          {program.dropIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="section-spacing bg-lbta-bone">
          <div className="container-narrow text-center">
            <p className="body-lg" style={{ color: '#6B6B6B' }}>
              Fall 2025 pricing information available upon request. Contact us at (949) 464-6645.
            </p>
          </div>
        </section>
      )}

      {/* Private Lessons */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-4">
              Private Instruction
            </h2>
            <p className="body-sm text-center" style={{ color: '#6B6B6B' }}>
              One-on-one coaching with our professional staff
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateRates.map((coach, index) => (
              <AnimatedSection key={coach.coach} delay={index * 0.1}>
                <div className="bg-white border border-gray-200 p-6 hover:border-lbta-charcoal/40 transition-all duration-300">
                  <h3 className="subhead mb-1">
                    {coach.coach}
                  </h3>
                  <p className="body-sm mb-4" style={{ color: '#E8956F' }}>
                    {coach.specialty}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="body-sm" style={{ color: '#6B6B6B' }}>60 min</span>
                      <span className="subhead">${coach.rate_60}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-sm" style={{ color: '#6B6B6B' }}>90 min</span>
                      <span className="subhead">${coach.rate_90}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <p className="body-sm text-center mt-8" style={{ color: '#6B6B6B' }}>
            Package discounts: 5 lessons (5% off), 10 lessons (10% off), 20 lessons (15% off)
          </p>
        </div>
      </section>

      {/* Scholarship */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6">
              Scholarship Program
            </h2>
            <p className="body-lg mb-8">
              $25,000+ awarded annually to families demonstrating need and commitment
            </p>
            <div className="bg-white border border-gray-200 p-8 max-w-2xl mx-auto text-left">
              <p className="body-sm mb-4" style={{ color: '#6B6B6B' }}>
                Scholarships cover 25-50% of program tuition for qualified families.
              </p>
              <p className="body-sm" style={{ color: '#6B6B6B' }}>
                Requirements: Household income &lt; $75K, 2+ sessions/week commitment, 3.5+ GPA
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/apply-scholarship"
                  className="eyebrow inline-flex items-center justify-center bg-lbta-coral text-white px-8 py-4 transition hover:bg-lbta-coral-dark"
                >
                  APPLY NOW
                </Link>
                <a
                  href="mailto:scholarships@lagunabeachtennisacademy.com"
                  className="eyebrow inline-flex items-center justify-center border border-lbta-charcoal text-lbta-charcoal px-8 py-4 transition hover:bg-lbta-charcoal hover:text-white"
                >
                  EMAIL QUESTIONS
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-8">
              Questions About Pricing?
            </h2>
            <p className="body-lg mb-10">
              Schedule a complimentary consultation. We'll help you find the right program and investment level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="eyebrow inline-flex items-center justify-center bg-lbta-coral text-white px-10 py-4 transition hover:bg-lbta-coral-dark">
                SCHEDULE CONSULTATION
              </Link>
              <a href="tel:9494646645" className="eyebrow inline-flex items-center justify-center border border-lbta-charcoal text-lbta-charcoal px-10 py-4 transition hover:bg-lbta-charcoal hover:text-white">
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
