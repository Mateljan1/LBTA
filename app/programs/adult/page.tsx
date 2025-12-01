'use client'

import { useState } from 'react'
import Link from 'next/link'
// Removed framer-motion to avoid conflicts
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const programs = [
  {
    id: "beginner",
    name: "First Strokes",
    level: "NTRP 1.0-2.5",
    duration: "60 minutes",
    monthly: 180,
    quarterly_prepay: 550,
    drop_in: 55,
    description: "Build fundamentals in a supportive environment. Most students rally within 8 weeks.",
    badge: "Zero Experience Welcome",
    features: [
      "Stroke foundations",
      "Movement patterns",
      "Match play basics",
      "Supportive small groups"
    ]
  },
  {
    id: "intermediate",
    name: "League Ready",
    level: "NTRP 3.0-3.5",
    duration: "90 minutes",
    monthly_1x: 240,
    monthly_2x: 450,
    quarterly_prepay: 735,
    drop_in: 70,
    description: "Develop consistency and strategy. Students typically compete in USTA leagues within 6 months.",
    badge: "USTA League Prep",
    features: [
      "Stroke consistency",
      "Tactical patterns",
      "Doubles positioning",
      "League preparation"
    ]
  },
  {
    id: "advanced",
    name: "Competitive Excellence",
    level: "NTRP 4.0+",
    duration: "120 minutes",
    monthly: 300,
    quarterly_prepay: 920,
    drop_in: 90,
    description: "High-level training for tournament and league competitors. Professional-grade instruction.",
    badge: "Tournament Grade",
    features: [
      "Advanced shot-making",
      "Match strategy",
      "High-intensity play",
      "Tournament preparation"
    ]
  },
  {
    id: "cardio",
    name: "Cardio Tennis",
    level: "All Levels Welcome",
    duration: "90 minutes",
    monthly: 180,
    quarterly_prepay: 550,
    drop_in: 55,
    description: "High-energy workout meets tennis training. All fitness levels welcome—focus on movement, not perfection.",
    badge: "All Levels",
    features: [
      "Energized drills with music",
      "Full-body conditioning",
      "Skill development",
      "Zero pressure environment"
    ]
  }
]

export default function AdultProgramsPage() {
  const [activeSeason, setActiveSeason] = useState<'fall' | 'winter'>('fall')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Adult Programs' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Adult Programs</p>
            <h1 className="text-display-lg heading-display mb-6">
              All Skill Levels
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Professional training for beginners to league players.  
              Build fitness, skill, and community.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Toggle */}
      <section className="bg-lbta-cream border-b border-gray-200 sticky top-24 z-40 py-6">
        <div className="container-lbta">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveSeason('fall')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025 (JOIN NOW)
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>
        </div>
      </section>

      {/* Season Info Banner */}
      <section
        key={activeSeason}
        className={`py-6 ${activeSeason === 'fall' ? 'bg-lbta-tan' : 'bg-blue-50'} border-b border-gray-200 transition-all duration-300`}
      >
        <div className="container-lbta text-center">
          {activeSeason === 'fall' ? (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Fall 2025:</strong> Join anytime through December • Prorated pricing based on remaining weeks
            </p>
          ) : (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Winter 2026:</strong> January 6 – April 5 (13 weeks) • Registration Opens December 1, 2025
            </p>
          )}
        </div>
      </section>

      {/* NTRP Guide */}
      <section className="bg-lbta-tan py-12 border-b border-gray-200">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-2xl font-serif font-light text-lbta-charcoal text-center mb-8">
              Understanding NTRP Levels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-serif font-light text-lbta-burnt mb-2">
                  1.0 - 2.5
                </div>
                <h3 className="font-sans font-medium mb-2">Beginner</h3>
                <p className="text-sm text-gray-600">
                  New to tennis, learning basics
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-light text-lbta-burnt mb-2">
                  3.0 - 3.5
                </div>
                <h3 className="font-sans font-medium mb-2">Intermediate</h3>
                <p className="text-sm text-gray-600">
                  Can rally, developing strategy
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-light text-lbta-burnt mb-2">
                  4.0+
                </div>
                <h3 className="font-sans font-medium mb-2">Advanced</h3>
                <p className="text-sm text-gray-600">
                  Competitive, tournament play
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs */}
      <section className="section-spacing bg-white">
        <div className="container-lbta space-y-16">
          {programs.map((program, index) => (
            <AnimatedSection key={program.id} delay={index * 0.1}>
              <div id={program.id} className="scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-lbta-charcoal text-white text-xs font-sans tracking-wider mb-4">
                      {program.badge}
                    </span>
                    <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-4">
                      {program.name}
                    </h2>
                    <p className="text-lg text-lbta-burnt font-sans font-medium mb-6">
                      {program.level} • {program.duration}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {program.description}
                    </p>

                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-gray-600">
                          <span className="text-lbta-burnt mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing */}
                  <div>
                    <div
                      key={activeSeason}
                      className="card-lbta p-8 transition-all duration-300"
                    >
                        <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-6">
                          {activeSeason === 'fall' ? 'Fall 2025 Pricing' : 'Winter 2026 Pricing'}
                        </h3>
                      <div className="space-y-4">
                        {program.monthly_1x && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Monthly (1x/week)</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.monthly_1x}
                            </span>
                          </div>
                        )}
                        {program.monthly_2x && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Monthly (2x/week)</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.monthly_2x}
                            </span>
                          </div>
                        )}
                        {program.monthly && !program.monthly_1x && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Monthly</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.monthly}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Quarterly (prepay)</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.quarterly_prepay}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-600">Drop-in Rate</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.drop_in}
                          </span>
                        </div>
                      </div>

                        <Link
                          href="/book"
                          className="btn-primary w-full mt-8 justify-center"
                        >
                          {activeSeason === 'fall' ? 'JOIN NOW' : 'GET NOTIFIED'}
                        </Link>
                        
                        {activeSeason === 'fall' && (
                          <p className="text-xs text-center text-gray-500 mt-3">
                            Prorated pricing available • Join anytime
                          </p>
                        )}
                        {activeSeason === 'winter' && (
                          <p className="text-xs text-center text-gray-500 mt-3">
                            Registration opens December 1, 2025
                          </p>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Not sure of your level? We'll assess during your first session.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="card-lbta p-10 text-center">
              <blockquote className="text-2xl font-serif font-light text-lbta-charcoal leading-relaxed mb-6">
                "I started as a complete beginner at 45. Now I'm competing in USTA leagues and loving every match."
              </blockquote>
              <p className="text-sm text-gray-500 tracking-wide">
                Jennifer M., Adult Member (2 years)
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Begin Training
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Professional instruction. Zero commitment required.
            </p>
            <Link
              href="/book"
              className="btn-primary"
            >
              START TRIAL
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

