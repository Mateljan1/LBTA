'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TimelineSection from '@/components/TimelineSection'
import StickyCTA from '@/components/StickyCTA'

// Note: Metadata is defined in about/layout.tsx for client components

const principles = [
  { 
    number: '01',
    title: 'The Work', 
    description: 'Technique takes time. Mental clarity and discipline come first. Every session builds on the last.' 
  },
  { 
    number: '02',
    title: 'Your Path', 
    description: 'Every athlete develops uniquely. Training is personalized to your goals, timeline, and potential.' 
  },
  { 
    number: '03',
    title: 'Honest Feedback', 
    description: 'Real progress requires truth — no sugar-coating. We tell you what you need to hear.' 
  },
  { 
    number: '04',
    title: 'The Community', 
    description: 'From 3-year-olds to ATP players — one shared pursuit of excellence, one family.' 
  },
]

export default function AboutPage() {
  const [heroParallax, setHeroParallax] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setHeroParallax(window.scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <>
      {/* HERO SECTION - Editorial, Typography-Driven */}
      <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach tennis courts with ocean horizon"
            fill
            priority
            className="object-cover"
            quality={90}
            style={{ 
              objectPosition: '50% 60%',
              transform: `translateY(${heroParallax}px)`
            }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pb-16 md:pb-24">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/70 uppercase tracking-[0.2em] mb-4">
            About Us
          </p>
          <h1 className="font-serif text-[42px] md:text-[72px] font-medium text-white leading-[1.05] mb-6 tracking-[-0.02em]">
            Where Character<br className="hidden md:block" /> Meets Championship
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/85 max-w-[550px] leading-[1.7]">
            Tennis as craft. Coaching as mentorship. Development as life preparation.
          </p>
        </div>
      </section>

      {/* OUR STORY - Editorial Split */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/images/programs/private-specialty.webp"
                  alt="LBTA tennis coaching session"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 55%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </div>
            
            {/* Content */}
            <div>
              <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
                Our Story
              </p>
              <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-[#1a1a1a] mb-8 tracking-[-0.02em] leading-[1.15]">
                Building Champions<br className="hidden md:block" /> Since 2020
              </h2>
              
              <div className="space-y-5">
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Since 2020, students have learned that good tennis teaches more than strokes. 
                  It builds focus, resilience, and quiet confidence through disciplined effort.
                </p>
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Founded by Andrew Mateljan, LBTA brings ATP/WTA-level coaching to every player — 
                  from first rally to professional tour.
                </p>
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Today, our players compete globally, earn college scholarships, and carry themselves 
                  with the composure that only real preparation creates.
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-[#eee]">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="font-serif text-[36px] md:text-[42px] font-medium text-[#1a1a1a]">20+</span>
                    <p className="font-sans text-[12px] text-[#666] uppercase tracking-[0.1em] mt-1">D1 Placements</p>
                  </div>
                  <div>
                    <span className="font-serif text-[36px] md:text-[42px] font-medium text-[#1a1a1a]">5</span>
                    <p className="font-sans text-[12px] text-[#666] uppercase tracking-[0.1em] mt-1">Expert Coaches</p>
                  </div>
                  <div>
                    <span className="font-serif text-[36px] md:text-[42px] font-medium text-[#1a1a1a]">100+</span>
                    <p className="font-sans text-[12px] text-[#666] uppercase tracking-[0.1em] mt-1">Active Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR JOURNEY - Timeline */}
      <TimelineSection />

      {/* PHILOSOPHY SECTION - Quote */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 md:px-16 text-center">
          <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-8">
            Our Philosophy
          </p>
          <blockquote className="font-serif text-[28px] md:text-[40px] font-medium text-[#1a1a1a] leading-[1.3] tracking-[-0.02em] mb-8">
            &ldquo;Structure creates confidence. Confidence creates results. 
            That&apos;s how champions are built.&rdquo;
          </blockquote>
          <p className="font-sans text-[14px] text-[#666]">
            — Andrew Mateljan, Founder
          </p>
        </div>
      </section>

      {/* OUR FOUNDATION - Principles */}
      <section className="bg-[#fafafa] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <div className="mb-16">
            <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
              Our Foundation
            </p>
            <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
              Guiding Principles
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {principles.map((principle) => (
              <div 
                key={principle.title}
                className="bg-white rounded-xl p-8 md:p-10"
              >
                <span className="font-sans text-[12px] font-semibold text-[#999] tracking-[0.1em]">
                  {principle.number}
                </span>
                <h3 className="font-serif text-[24px] md:text-[28px] font-medium text-[#1a1a1a] mt-3 mb-4 tracking-[-0.01em]">
                  {principle.title}
                </h3>
                <p className="font-sans text-[15px] text-[#555] leading-[1.7]">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
                Our Home
              </p>
              <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-[#1a1a1a] mb-6 tracking-[-0.02em]">
                Laguna Beach, California
              </h2>
              <p className="font-sans text-[16px] text-[#444] leading-[1.8] mb-6">
                Nestled in one of California&apos;s most beautiful coastal communities, 
                our academy offers world-class training in an inspiring environment.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] mt-2.5 flex-shrink-0" />
                  <p className="font-sans text-[15px] text-[#555]">
                    Professional-grade hard courts with excellent lighting
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] mt-2.5 flex-shrink-0" />
                  <p className="font-sans text-[15px] text-[#555]">
                    Year-round ideal weather conditions
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] mt-2.5 flex-shrink-0" />
                  <p className="font-sans text-[15px] text-[#555]">
                    Convenient location with ample parking
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="font-sans text-[14px] text-[#666] mb-1">
                  1098 Balboa Ave
                </p>
                <p className="font-sans text-[14px] text-[#666]">
                  Laguna Beach, CA 92651
                </p>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/images/hero/laguna-horizon.webp"
                  alt="Laguna Beach coastline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Minimal */}
      <section className="bg-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-white mb-6 tracking-[-0.02em]">
            Start Your Journey
          </h2>
          <p className="font-sans text-[16px] text-white/70 mb-10 leading-[1.7] max-w-[500px] mx-auto">
            Professional coaching for all ages and levels. 
            Experience the LBTA difference with a trial session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-[#1a1a1a] font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-lg hover:bg-white/90 transition-all min-h-[52px]"
            >
              Book Trial Session
            </Link>
            <Link
              href="/coaches"
              className="inline-flex items-center justify-center border border-white/30 text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-lg hover:bg-white/10 transition-all min-h-[52px]"
            >
              Meet Our Coaches
            </Link>
          </div>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
