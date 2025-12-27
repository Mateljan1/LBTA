'use client'

import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Program pathway data - WHAT each level teaches (not pricing)
const pathways = [
  {
    id: "little-stars",
    name: "Little Tennis Stars",
    ages: "Ages 3-4",
    tagline: "First Steps",
    description: "Introduction to tennis through play-based activities. We focus on movement fundamentals, hand-eye coordination, and building confidence on the court.",
    outcomes: [
      "Basic movement patterns",
      "Hand-eye coordination",
      "Following instructions",
      "Love for the game"
    ],
    nextStep: "Red Ball Tennis"
  },
  {
    id: "red-ball",
    name: "Red Ball Tennis",
    ages: "Ages 5-6",
    tagline: "Building Foundations",
    description: "First structured tennis program using low-compression red balls on smaller courts. Students develop proper grip, swing mechanics, and learn to rally.",
    outcomes: [
      "Forehand & backhand foundations",
      "Serving basics",
      "Rally consistency",
      "Court awareness"
    ],
    nextStep: "Orange Ball Tennis"
  },
  {
    id: "orange-ball",
    name: "Orange Ball Tennis",
    ages: "Ages 7-8",
    tagline: "Technical Development",
    description: "Transition to larger courts with orange balls. Players develop spin, positioning, and begin understanding point construction.",
    outcomes: [
      "Topspin & slice technique",
      "Court positioning",
      "Point construction basics",
      "Match play introduction"
    ],
    nextStep: "Green Dot Tennis"
  },
  {
    id: "green-dot",
    name: "Green Dot Tennis",
    ages: "Ages 9-11",
    tagline: "Competitive Readiness",
    description: "Full court play with green dot balls. Players develop advanced tactics, movement patterns, and prepare for competitive tournaments.",
    outcomes: [
      "Advanced shot mechanics",
      "Tactical pattern play",
      "Full-court movement",
      "Tournament preparation"
    ],
    nextStep: "Youth Development"
  },
  {
    id: "youth-development",
    name: "Youth Development",
    ages: "Ages 11-15",
    tagline: "Competitive Training",
    description: "Comprehensive training for competitive juniors. Includes match play, physical conditioning, and mental game development.",
    outcomes: [
      "Advanced match tactics",
      "Physical conditioning",
      "Mental resilience",
      "Tournament competition"
    ],
    nextStep: "High Performance"
  },
  {
    id: "high-performance",
    name: "High Performance",
    ages: "Ages 12-17 (UTR 5+)",
    tagline: "College & Beyond",
    description: "Elite training for college-bound and tournament players. Includes video analysis, strength & conditioning, and recruiting guidance.",
    outcomes: [
      "College recruiting preparation",
      "Advanced video analysis",
      "Strength & conditioning",
      "Tournament coaching"
    ],
    nextStep: null
  }
]

export default function JuniorProgramsPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Junior Programs' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-black text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/programs/juniors.webp"
            alt="Junior tennis players training"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        <div className="relative max-w-[900px] mx-auto px-4 md:px-6 text-center">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[3px] text-white/60 mb-6">
              Junior Development Pathway
            </p>
            <h1 className="font-serif text-[40px] md:text-[56px] lg:text-[64px] font-light leading-[1.1] mb-6">
              Ages 3 to Professional
            </h1>
            <p className="text-[18px] md:text-[20px] font-sans font-light text-white/80 max-w-[600px] mx-auto leading-relaxed mb-10">
              A clear progression from first forehand to college scholarship. 
              Each level builds on the last.
            </p>
            <Link
              href="/schedules#programs"
              className="inline-block bg-white text-black px-10 py-4 font-sans text-[13px] font-medium tracking-[2px] uppercase hover:bg-gray-100 transition-colors"
            >
              View Schedule & Pricing
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-4 md:px-6 text-center">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[3px] text-black/50 mb-6">
              Our Approach
            </p>
            <h2 className="font-serif text-[32px] md:text-[40px] font-light text-black mb-8">
              Movement First. Always.
            </h2>
            <p className="text-[17px] md:text-[18px] font-sans text-black/70 leading-relaxed mb-6">
              We don't rush players to the next level. Each stage of our pathway 
              is designed to build the movement patterns, technical skills, and 
              competitive mindset needed for long-term success.
            </p>
            <p className="text-[17px] md:text-[18px] font-sans text-black/70 leading-relaxed">
              Our coaches—led by Andrew Mateljan with 25+ years of ATP/WTA experience—focus 
              on developing complete players, not just tennis strokes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Pathway Visual */}
      <section className="py-16 md:py-24 bg-[#FAF8F3]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[3px] text-black/50 mb-4">
                The Journey
              </p>
              <h2 className="font-serif text-[32px] md:text-[40px] font-light text-black">
                Six Stages of Development
              </h2>
            </div>
          </AnimatedSection>

          <div className="space-y-0">
            {pathways.map((pathway, index) => (
              <AnimatedSection key={pathway.id} delay={index * 0.1}>
                <div 
                  id={pathway.id}
                  className={`relative py-12 md:py-16 ${index !== pathways.length - 1 ? 'border-b border-black/10' : ''}`}
                >
                  {/* Stage Number */}
                  <div className="absolute left-0 top-12 md:top-16 text-[80px] md:text-[120px] font-serif font-light text-black/5 leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left: Info */}
                    <div className="lg:col-span-7 lg:pl-20">
                      <p className="text-[11px] uppercase tracking-[3px] text-black/50 mb-3">
                        {pathway.tagline}
                      </p>
                      <h3 className="font-serif text-[28px] md:text-[36px] font-light text-black mb-2">
                        {pathway.name}
                      </h3>
                      <p className="text-[15px] font-sans font-medium text-black/60 mb-6">
                        {pathway.ages}
                      </p>
                      <p className="text-[16px] md:text-[17px] font-sans text-black/70 leading-relaxed mb-8">
                        {pathway.description}
                      </p>
                    </div>

                    {/* Right: Outcomes */}
                    <div className="lg:col-span-5">
                      <div className="bg-white rounded-lg p-6 md:p-8">
                        <h4 className="text-[13px] uppercase tracking-[2px] text-black/50 mb-5">
                          What They'll Learn
                        </h4>
                        <ul className="space-y-3">
                          {pathway.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start gap-3 text-[15px] text-black/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-black/30 mt-2 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {pathway.nextStep && (
                          <div className="mt-6 pt-5 border-t border-black/10">
                            <p className="text-[13px] text-black/50">
                              Next: <span className="text-black/70">{pathway.nextStep}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="max-w-[700px] mx-auto px-4 md:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-[32px] md:text-[40px] font-light mb-6">
              Ready to Start?
            </h2>
            <p className="text-[17px] font-sans text-white/70 mb-10 leading-relaxed">
              View our complete schedule with class times, locations, and pricing. 
              Registration is open for Winter 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schedules"
                className="inline-block bg-white text-black px-10 py-4 font-sans text-[13px] font-medium tracking-[2px] uppercase hover:bg-gray-100 transition-colors"
              >
                View Schedule & Pricing
              </Link>
              <Link
                href="/book"
                className="inline-block bg-transparent text-white px-10 py-4 font-sans text-[13px] font-medium tracking-[2px] uppercase border border-white/30 hover:border-white/60 transition-colors"
              >
                Book Free Trial
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
