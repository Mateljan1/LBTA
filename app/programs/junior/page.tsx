'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Data from winter2026.json - matches schedules page
const winterPrograms = [
  {
    id: "little-stars",
    name: "Little Tennis Stars",
    ages: "Ages 3-4",
    duration: "45 min",
    location: "Moulton Meadows",
    schedule: "Mon & Wed 3:30-4:15 PM",
    coach: "Michelle",
    pricing: {
      monthly: 120,
      drop_in: 40
    },
    description: "Introduction to tennis through play-based activities and movement fundamentals.",
    features: [
      "Movement fundamentals",
      "Coordination through play",
      "Early tennis exposure",
      "Confidence building"
    ]
  },
  {
    id: "red-ball",
    name: "Red Ball Tennis",
    ages: "Ages 5-6",
    duration: "1 hr",
    location: "Moulton Meadows",
    schedule: "Mon & Wed 4:15-5:15 PM",
    coach: "Michelle",
    pricing: {
      "1x": 546,
      "2x": 1092,
      drop_in: 50
    },
    description: "First structured tennis program using red balls on smaller courts.",
    features: [
      "Forehand & backhand foundations",
      "Serving mechanics",
      "Rally consistency",
      "Net play introduction"
    ]
  },
  {
    id: "orange-ball",
    name: "Orange Ball Tennis",
    ages: "Ages 7-8",
    duration: "1 hr",
    location: "Moulton Meadows",
    schedule: "Mon-Thu various times",
    coach: "Michelle & Andy",
    pricing: {
      "1x": 546,
      "2x": 1092,
      "3x": 1635,
      drop_in: 50
    },
    description: "Technical development and match play preparation for advancing juniors.",
    features: [
      "Topspin & slice technique",
      "Court positioning",
      "Point construction",
      "Match play preparation"
    ]
  },
  {
    id: "orange-ball-match",
    name: "Orange Ball Match Play",
    ages: "Ages 7-8",
    duration: "1 hr",
    location: "Moulton Meadows",
    schedule: "Fri 3:30-4:30 PM",
    coach: "Michelle",
    pricing: {
      monthly: 85,
      drop_in: 25
    },
    description: "Weekly competitive match play for Orange Ball players.",
    features: [
      "Organized match play",
      "Score tracking",
      "Competitive experience",
      "Sportsmanship development"
    ]
  },
  {
    id: "green-dot",
    name: "Green Dot Tennis",
    ages: "Ages 9-11",
    duration: "1 hr",
    location: "Moulton Meadows",
    schedule: "Tue & Thu 4:30-5:30 PM",
    coach: "Andy",
    pricing: {
      "1x": 546,
      "2x": 1092,
      drop_in: 50
    },
    description: "Transition to full court play with green dot balls and advanced tactics.",
    features: [
      "Advanced mechanics",
      "Tactical patterns",
      "Full-court movement",
      "Tournament readiness"
    ]
  },
  {
    id: "green-dot-match",
    name: "Green Dot Match Play",
    ages: "Ages 9-11",
    duration: "1 hr",
    location: "Moulton Meadows",
    schedule: "Fri 4:30-5:30 PM",
    coach: "Michelle",
    pricing: {
      monthly: 85,
      drop_in: 25
    },
    description: "Weekly competitive match play for Green Dot players.",
    features: [
      "Organized match play",
      "Score tracking",
      "Competitive experience",
      "Tournament prep"
    ]
  },
  {
    id: "youth-development",
    name: "Youth Development",
    ages: "Ages 11-15",
    duration: "1.5 hr",
    location: "Alta Laguna Park",
    schedule: "Mon-Fri various times",
    coach: "Michelle & Andy",
    pricing: {
      "1x": 756,
      "2x": 1437,
      "3x": 2160,
      "4x": 2880,
      "5x": 3250,
      drop_in: 70
    },
    description: "Comprehensive training for competitive juniors with match play included.",
    features: [
      "Advanced match tactics",
      "Physical conditioning",
      "Mental resilience",
      "Friday match play included"
    ]
  },
  {
    id: "high-performance",
    name: "High Performance Training",
    ages: "Ages 12-17 (UTR 5-8)",
    duration: "2 hr",
    location: "Laguna Beach High School",
    schedule: "Mon-Sat various times",
    coach: "Kevin & Savriyan",
    pricing: {
      "1x": 810,
      "2x": 1620,
      "3x": 2268,
      "4x": 2916,
      "5x": 3200,
      drop_in: 100
    },
    description: "Elite training for college-bound players with tournament preparation.",
    features: [
      "College recruiting guidance",
      "Video analysis",
      "Strength & conditioning",
      "Tournament coaching"
    ]
  }
]

export default function JuniorProgramsPage() {
  const [activeSeason, setActiveSeason] = useState<'winter'>('winter')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Junior Programs' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Junior Development</p>
            <h1 className="text-display-lg heading-display mb-6">
              Ages 3 to Professional
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Structured pathways built by ATP-level coaches.  
              From first forehand to scholarship.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Info Banner */}
      <section className="py-6 bg-[#FAF8F3] border-b border-gray-200">
        <div className="container-lbta text-center">
          <p className="text-sm text-gray-600 font-sans">
            <strong>Winter 2026:</strong> January 6 – April 5 (13 weeks) • Registration Now Open
          </p>
          <Link 
            href="/schedules" 
            className="inline-block mt-2 text-sm text-black/70 hover:text-black underline underline-offset-4"
          >
            View Full Schedule →
          </Link>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-16">
          {winterPrograms.map((program, index) => (
            <AnimatedSection key={program.id} delay={index * 0.1}>
              <div id={program.id} className="scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div>
                    <h2 className="text-3xl font-serif font-light text-black mb-4">
                      {program.name}
                    </h2>
                    <p className="text-lg text-black/60 font-sans font-medium mb-2">
                      {program.ages} • {program.duration}
                    </p>
                    <p className="text-sm text-black/50 font-sans mb-6">
                      {program.location} • {program.schedule}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {program.description}
                    </p>

                    <h3 className="text-lg font-sans font-medium text-black mb-4">
                      What You'll Learn
                    </h3>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-gray-600">
                          <span className="text-black/40 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing */}
                  <div>
                    <div className="bg-[#FAF8F3] rounded-lg p-8">
                      <h3 className="text-lg font-sans font-medium text-black mb-6">
                        Winter 2026 Pricing
                      </h3>
                      <div className="space-y-4">
                        {/* Monthly pricing */}
                        {program.pricing.monthly && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10">
                            <span className="text-gray-600">Monthly</span>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing.monthly}
                            </span>
                          </div>
                        )}
                        
                        {/* Quarterly pricing options */}
                        {program.pricing['1x'] && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10">
                            <span className="text-gray-600">Quarterly (1x/week)</span>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing['1x']}
                            </span>
                          </div>
                        )}
                        {program.pricing['2x'] && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10 bg-gray-50 -mx-4 px-4 py-2">
                            <div>
                              <span className="text-gray-600">Quarterly (2x/week)</span>
                              <span className="ml-2 text-xs text-black/50">Most Popular</span>
                            </div>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing['2x']}
                            </span>
                          </div>
                        )}
                        {program.pricing['3x'] && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10">
                            <span className="text-gray-600">Quarterly (3x/week)</span>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing['3x']}
                            </span>
                          </div>
                        )}
                        {program.pricing['4x'] && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10">
                            <span className="text-gray-600">Quarterly (4x/week)</span>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing['4x']}
                            </span>
                          </div>
                        )}
                        {program.pricing['5x'] && (
                          <div className="flex justify-between items-center pb-3 border-b border-black/10">
                            <span className="text-gray-600">Quarterly (5x/week)</span>
                            <span className="text-xl font-serif font-light text-black">
                              ${program.pricing['5x']}
                            </span>
                          </div>
                        )}
                        
                        {/* Drop-in */}
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-600">Drop-in Rate</span>
                          <span className="text-xl font-serif font-light text-black">
                            ${program.pricing.drop_in}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/schedules"
                        className="block w-full mt-8 bg-black text-white text-center py-4 font-sans text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors"
                      >
                        Register Now
                      </Link>
                      
                      <p className="text-xs text-center text-gray-500 mt-3">
                        $50 Early Bird Discount • Register by Dec 20
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#FAF8F3]">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-black mb-8">
              Begin Your Tennis Journey
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Experience professional coaching. Zero commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-black text-white px-10 py-4 font-sans text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors"
              >
                Book Free Trial
              </Link>
              <Link
                href="/schedules"
                className="inline-block bg-transparent text-black px-10 py-4 font-sans text-sm font-medium tracking-wider uppercase border border-black/20 hover:border-black transition-colors"
              >
                View Full Schedule
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
