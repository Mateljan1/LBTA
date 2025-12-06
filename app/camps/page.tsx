'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const camps = [
  {
    id: "summer-intensive",
    name: "College & Pro Pathway Summer Camp",
    dates: "June - August 2026",
    ages: "Ages 12-18",
    duration: "Full Day (9am-4pm)",
    level: "Intermediate to Advanced",
    weekly: 750,
    description: "Elite intensive summer program offering professional-level tennis training, daily competitive play, mental conditioning, and pro-player mentorship in a high-performance setting.",
    badge: "Elite Training",
    features: [
      "Daily match play & tournament preparation",
      "Video analysis with ATP-level coaches",
      "Mental performance training",
      "Strength & conditioning sessions",
      "College recruitment guidance",
      "Pro player guest appearances"
    ]
  },
  {
    id: "winter-break",
    name: "Winter Break Camp",
    dates: "December 2025 & January 2026",
    ages: "Ages 5-16",
    duration: "Half Day (9am-12pm)",
    level: "All Skill Levels",
    weekly: 425,
    description: "Stay sharp during school breaks. Maintain tournament form and technical progress through structured training and match play.",
    badge: "Seasonal Program",
    features: [
      "Stroke technique refinement",
      "Match play experience",
      "Age-appropriate coaching",
      "Indoor/outdoor flexibility",
      "Small group instruction",
      "Skills competitions & prizes"
    ]
  },
  {
    id: "spring-break",
    name: "Spring Break Camp",
    dates: "March - April 2026",
    ages: "Ages 5-16",
    duration: "Half Day (9am-12pm)",
    level: "Beginner to Advanced",
    weekly: 425,
    description: "Perfect introduction to competitive tennis or skill advancement during spring break. Build confidence through structured play and professional instruction.",
    badge: "Spring Development",
    features: [
      "Progressive skill development",
      "Tournament preparation for spring season",
      "Tactical training & point construction",
      "Physical conditioning drills",
      "Singles & doubles strategy",
      "End-of-week showcase tournament"
    ]
  },
  {
    id: "summer-champion",
    name: "Junior Champions Summer Camp",
    dates: "June - August 2026",
    ages: "Ages 4-13",
    duration: "Half Day (9am-1pm)",
    level: "Beginner to Intermediate",
    weekly: 550,
    description: "Where summer fun meets serious skill development. Perfect for juniors new to tennis or ready to take their game to the next level. From first strokes to competitive readiness.",
    badge: "Most Popular",
    features: [
      "Age-appropriate tennis instruction",
      "Court movement & footwork training",
      "Rally development & consistency",
      "Introduction to match play",
      "Character building through sport",
      "End-of-week awards ceremony"
    ]
  }
]

export default function CampsPage() {
  const [activeSeason, setActiveSeason] = useState<'summer' | 'break'>('summer')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Tennis Camps' }
      ]} />

      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Year-Round Excellence</p>
            <h1 className="text-display-lg heading-display mb-6">
              Tennis Camps That
              Transform
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From beginner-friendly summer programs to elite college pathway training. Professional coaching at every level, all year long.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Toggle */}
      <section className="bg-lbta-cream border-b border-gray-200 sticky top-24 z-40 py-6">
        <div className="container-lbta">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveSeason('summer')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'summer'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              SUMMER CAMPS
            </button>
            <button
              onClick={() => setActiveSeason('break')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'break'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              WINTER & SPRING CAMPS
            </button>
          </div>
        </div>
      </section>

      {/* Season Info Banner */}
      <section
        key={activeSeason}
        className={`py-6 ${activeSeason === 'summer' ? 'bg-amber-50' : 'bg-blue-50'} border-b border-gray-200 transition-all duration-300`}
      >
        <div className="container-lbta text-center">
          {activeSeason === 'summer' ? (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Summer 2026:</strong> Registration opens March 1st • Early bird discounts for multi-week enrollment
            </p>
          ) : (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Break Camps:</strong> Winter Dec/Jan • Spring March/April • Registration opens 6 weeks prior
            </p>
          )}
        </div>
      </section>

      {/* Camps */}
      <section className="section-spacing bg-white">
        <div className="container-lbta space-y-16">
          {camps
            .filter(camp =>
              activeSeason === 'summer'
                ? camp.id.includes('summer')
                : camp.id.includes('winter') || camp.id.includes('spring')
            )
            .map((camp, index) => (
            <AnimatedSection key={camp.id} delay={index * 0.1}>
              <div id={camp.id} className="scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-lbta-charcoal text-white text-xs font-sans tracking-wider mb-4">
                      {camp.badge}
                    </span>
                    <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-4">
                      {camp.name}
                    </h2>
                    <div className="space-y-2 mb-6">
                      <p className="text-lg text-lbta-burnt font-sans font-medium">
                        {camp.ages} • {camp.level}
                      </p>
                      <p className="text-base text-gray-600 font-sans">
                        {camp.dates}
                      </p>
                      <p className="text-base text-gray-600 font-sans">
                        {camp.duration}
                      </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {camp.description}
                    </p>

                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {camp.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-gray-600">
                          <span className="text-lbta-burnt mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing */}
                  <div>
                    <div className="card-lbta p-8 transition-all duration-300">
                        <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-6">
                          Camp Investment
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Per Week</span>
                            <span className="text-3xl font-serif font-light text-lbta-charcoal">
                              ${camp.weekly}
                            </span>
                          </div>
                          {camp.id === 'summer-intensive' && (
                            <>
                              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-600">4-Week Package</span>
                                <span className="text-xl font-serif font-light text-lbta-charcoal">
                                  $2,850
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-600">8-Week Package</span>
                                <span className="text-xl font-serif font-light text-lbta-charcoal">
                                  $5,400
                                </span>
                              </div>
                            </>
                          )}
                          {camp.id === 'summer-champion' && (
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-gray-600">Multi-Week Discount</span>
                              <span className="text-lg font-serif font-light text-lbta-burnt">
                                10% off 3+ weeks
                              </span>
                            </div>
                          )}
                        </div>

                        <Link
                          href="/book"
                          className="btn-primary w-full mt-8 justify-center"
                        >
                          {activeSeason === 'summer' ? 'PRE-REGISTER NOW' : 'GET NOTIFIED'}
                        </Link>

                        <p className="text-xs text-center text-gray-500 mt-3">
                          {activeSeason === 'summer'
                            ? 'Early bird pricing • Limited spots available'
                            : 'Registration opens 6 weeks before camp start'
                          }
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Why Our Camps */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">The LBTA Difference</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Where Champions Train in Summer
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  ATP-Level Coaching
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn from coaches actively training ATP professionals. Andrew Mateljan currently coaches ATP #262 Karue Sell alongside directing all camp programs.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  Small Group Ratios
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Maximum 6:1 player-to-coach ratio ensures personalized attention, immediate feedback, and accelerated skill development. No player gets lost in the crowd.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  Proven Track Record
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  20+ Division I college scholarships since 2020. Multiple ATP-ranked players trained here. Your development is backed by measurable results.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Secure Your Spot
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Limited enrollment ensures quality coaching. Summer camps fill quickly—early registration recommended.
            </p>
            <Link href="/book" className="btn-primary">
              REGISTER FOR CAMP
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
