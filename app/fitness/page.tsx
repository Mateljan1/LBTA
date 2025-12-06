'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const pillars = [
  {
    id: "speed",
    title: "Speed",
    description: "Explosive first-step quickness and court coverage. React faster, move quicker, dominate every point.",
    icon: "⚡️",
    features: [
      "Linear sprint mechanics",
      "Lateral acceleration drills",
      "Change of direction training",
      "Reaction time optimization"
    ]
  },
  {
    id: "stamina",
    title: "Stamina",
    description: "Elite cardiovascular endurance for 3-set matches in peak summer heat. Outlast any opponent.",
    icon: "🔥",
    features: [
      "VO2 max development",
      "Anaerobic threshold training",
      "Match-specific conditioning",
      "Recovery optimization"
    ]
  },
  {
    id: "agility",
    title: "Agility",
    description: "Tennis-specific movement patterns that translate directly to on-court performance.",
    icon: "🎯",
    features: [
      "Multi-directional footwork",
      "Balance & proprioception",
      "Deceleration control",
      "Court movement patterns"
    ]
  },
  {
    id: "strength",
    title: "Strength",
    description: "Functional power for injury prevention and shot velocity. Build a body that performs and lasts.",
    icon: "💪",
    features: [
      "Rotational power development",
      "Core stability training",
      "Shoulder health protocols",
      "Tennis-specific strength"
    ]
  }
]

const programs = [
  {
    id: "group-training",
    name: "Elite Group Training",
    location: "Laguna Beach High School Tennis Courts",
    schedule: "Tuesday & Thursday, 5:30-6:30pm",
    duration: "60 minutes",
    level: "All Levels Welcome",
    monthly: 180,
    drop_in: 25,
    description: "High-intensity functional training designed by tennis professionals. Small groups (max 12) ensure personalized coaching while building community.",
    badge: "In-Person Training",
    highlights: [
      "NASM-certified performance coaching",
      "Tennis-specific movement patterns",
      "Progressive programming (12-week cycles)",
      "Video analysis & form correction",
      "Competition prep protocols",
      "Recovery & mobility sessions"
    ]
  },
  {
    id: "virtual-training",
    name: "Fit4Tennis Virtual",
    location: "Train Anywhere, Anytime",
    schedule: "100+ On-Demand Workouts",
    duration: "15-45 minute sessions",
    level: "Beginner to Pro",
    monthly: 29,
    quarterly: 75,
    description: "Access Andrew Mateljan's complete training library. The same workouts used by ATP professionals, adapted for your level and schedule.",
    badge: "100K+ Global Community",
    highlights: [
      "New workouts added weekly",
      "Warm-up to championship protocols",
      "Mobile app with offline access",
      "Progress tracking & benchmarks",
      "Direct coach messaging",
      "Exclusive pro player content"
    ]
  },
  {
    id: "private-training",
    name: "1-on-1 Performance",
    location: "Laguna Beach or Virtual",
    schedule: "Custom Schedule",
    duration: "60-90 minutes",
    level: "Elite Athletes",
    session: 150,
    package_5: 700,
    description: "Personalized training with Andrew Mateljan. Custom programming based on biomechanical assessment, competition calendar, and specific performance goals.",
    badge: "ATP-Level Coaching",
    highlights: [
      "Complete movement assessment",
      "Individualized programming",
      "Injury prevention protocols",
      "Strength & conditioning roadmap",
      "Nutrition guidance integration",
      "Tournament prep programming"
    ]
  }
]

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState<'in-person' | 'virtual' | 'private'>('in-person')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Fitness & Conditioning' }
      ]} />

      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Fit4Tennis Performance</p>
            <h1 className="text-display-lg heading-display mb-6">
              Build a Body That
              Dominates
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Tennis-specific strength and conditioning from the coach trusted by ATP professionals.
              Speed, stamina, agility, and strength—engineered for championship performance.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Program Toggle */}
      <section className="bg-lbta-cream border-b border-gray-200 sticky top-24 z-40 py-6">
        <div className="container-lbta">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('in-person')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === 'in-person'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              GROUP TRAINING
            </button>
            <button
              onClick={() => setActiveTab('virtual')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === 'virtual'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              VIRTUAL PROGRAMS
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === 'private'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              PRIVATE COACHING
            </button>
          </div>
        </div>
      </section>

      {/* Tab Info Banner */}
      <section
        key={activeTab}
        className={`py-6 ${activeTab === 'in-person' ? 'bg-amber-50' : activeTab === 'virtual' ? 'bg-blue-50' : 'bg-purple-50'} border-b border-gray-200 transition-all duration-300`}
      >
        <div className="container-lbta text-center">
          {activeTab === 'in-person' && (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Join anytime:</strong> Rolling enrollment • First session free for new members
            </p>
          )}
          {activeTab === 'virtual' && (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Start today:</strong> 100+ workouts • New content every week • Cancel anytime
            </p>
          )}
          {activeTab === 'private' && (
            <p className="text-sm text-gray-600 font-sans">
              <strong>Limited availability:</strong> Book 2-3 weeks in advance • Serious athletes only
            </p>
          )}
        </div>
      </section>

      {/* Programs */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          {programs
            .filter(program =>
              (activeTab === 'in-person' && program.id === 'group-training') ||
              (activeTab === 'virtual' && program.id === 'virtual-training') ||
              (activeTab === 'private' && program.id === 'private-training')
            )
            .map((program) => (
              <AnimatedSection key={program.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-lbta-charcoal text-white text-xs font-sans tracking-wider mb-4">
                      {program.badge}
                    </span>
                    <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-4">
                      {program.name}
                    </h2>
                    <div className="space-y-2 mb-6">
                      <p className="text-lg text-lbta-burnt font-sans font-medium">
                        {program.level}
                      </p>
                      <p className="text-base text-gray-600 font-sans">
                        📍 {program.location}
                      </p>
                      <p className="text-base text-gray-600 font-sans">
                        🗓 {program.schedule}
                      </p>
                      <p className="text-base text-gray-600 font-sans">
                        ⏱ {program.duration}
                      </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {program.description}
                    </p>

                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {program.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-gray-600">
                          <span className="text-lbta-burnt mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing */}
                  <div>
                    <div className="card-lbta p-8 transition-all duration-300">
                      <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-6">
                        Program Investment
                      </h3>
                      <div className="space-y-4">
                        {program.monthly && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Monthly Unlimited</span>
                            <span className="text-3xl font-serif font-light text-lbta-charcoal">
                              ${program.monthly}
                            </span>
                          </div>
                        )}
                        {program.quarterly && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Quarterly (prepay)</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.quarterly}
                            </span>
                          </div>
                        )}
                        {program.session && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Per Session</span>
                            <span className="text-3xl font-serif font-light text-lbta-charcoal">
                              ${program.session}
                            </span>
                          </div>
                        )}
                        {program.package_5 && (
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">5-Session Package</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.package_5}
                            </span>
                          </div>
                        )}
                        {program.drop_in && (
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-600">Drop-In Rate</span>
                            <span className="text-xl font-serif font-light text-lbta-charcoal">
                              ${program.drop_in}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={activeTab === 'virtual' ? 'https://www.fit4tennis.com' : '/book'}
                        className="btn-primary w-full mt-8 justify-center"
                        target={activeTab === 'virtual' ? '_blank' : undefined}
                      >
                        {activeTab === 'in-person' ? 'START FREE SESSION' : activeTab === 'virtual' ? 'START FREE TRIAL' : 'BOOK CONSULTATION'}
                      </Link>

                      <p className="text-xs text-center text-gray-500 mt-3">
                        {activeTab === 'in-person' && 'First session free for new members'}
                        {activeTab === 'virtual' && '7-day free trial • Cancel anytime'}
                        {activeTab === 'private' && 'Custom programming • Limited spots available'}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
        </div>
      </section>

      {/* Four Pillars */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Performance Foundation</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              The Four Pillars of
              Championship Fitness
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              Every program is built on these core principles. This is the training system used by ATP professionals.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <AnimatedSection key={pillar.id} delay={index * 0.1}>
                <div className="card-lbta p-8 h-full">
                  <div className="text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                  <ul className="space-y-2">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-600 text-sm">
                        <span className="text-lbta-burnt mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fit4Tennis */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">The Fit4Tennis Difference</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Trusted by ATP Professionals
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  NASM-Certified
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Performance Enhancement Specialist certification ensures evidence-based programming. Every exercise has a purpose, every session builds toward measurable goals.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  Tennis-Specific
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No generic gym workouts. Every movement pattern translates directly to on-court performance. Trained the same way ATP players train.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                  100K+ Community
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Join the global Fit4Tennis movement. Andrew's training content reaches over 100,000 athletes worldwide—from beginners to ATP professionals.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-cream border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Start Your Transformation
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Whether you're training in-person at Laguna Beach, following virtual programs from home,
              or working 1-on-1 with Andrew—your first step toward elite fitness starts here.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/book" className="btn-primary">
                BOOK FREE SESSION
              </Link>
              <Link
                href="https://www.fit4tennis.com"
                className="btn-secondary"
                target="_blank"
              >
                EXPLORE VIRTUAL TRAINING
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
