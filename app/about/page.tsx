'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TimelineSection from '@/components/TimelineSection'
import StickyCTA from '@/components/StickyCTA'

// Note: Metadata is defined in about/layout.tsx for client components

const principles = [
  { title: 'The Work', description: 'Technique takes time. Mental clarity and discipline come first.' },
  { title: 'Your Path', description: 'Every athlete develops uniquely. Training is personalized.' },
  { title: 'Honest Feedback', description: 'Real progress requires truth — no sugar-coating.' },
  { title: 'The Community', description: 'From 3-year-olds to ATP players — one shared pursuit of excellence.' },
]

export default function AboutPage() {
  const [heroParallax, setHeroParallax] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setHeroParallax(window.scrollY * 0.4)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
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
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/15 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="font-serif text-[36px] md:text-[64px] font-bold leading-[1.05] mb-6 text-shadow">
            Where Character Meets Championship.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
            Tennis as craft. Coaching as mentorship. Development as life preparation.
          </p>
          <Link 
            href="/programs"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Explore Programs →
          </Link>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded">
              <Image
                src="/images/programs/private-specialty.webp"
                alt="LBTA tennis coaching session"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 55%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 overlay-light" />
            </div>
            
            <div className="space-y-6 max-w-[700px]">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black leading-tight">
                Our Story
              </h2>
              <p className="font-sans text-[16px] md:text-[17px] leading-[1.7] text-black/85">
                Since 2020, students have learned that good tennis teaches more than strokes. 
                It builds focus, resilience, and quiet confidence through disciplined effort.
              </p>
              <p className="font-sans text-[16px] md:text-[17px] leading-[1.7] text-black/85">
                Founded by Andrew Mateljan, LBTA brings ATP/WTA-level coaching to every player — 
                from first rally to professional tour.
              </p>
              <p className="font-sans text-[16px] md:text-[17px] leading-[1.7] text-black/85">
                Today, our players compete globally, earn college scholarships, and carry themselves 
                with the composure of true mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR JOURNEY - Timeline */}
      <TimelineSection />

      {/* OUR FOUNDATION - Principles */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-12 text-center">
            Our Foundation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {principles.map((principle, index) => (
              <div 
                key={principle.title}
                className="bg-[#FAF8F3] rounded-2xl p-8 md:p-10 shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <div className="text-[36px] md:text-[42px] text-lbta-orange font-serif font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-serif text-[22px] md:text-[26px] font-semibold text-black mb-4">
                  {principle.title}
                </h3>
                <p className="font-sans text-[15px] md:text-[16px] text-black/80 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover cta-img"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[36px] md:text-[52px] font-semibold mb-8 leading-[1.15] text-shadow">
            Start Your Development
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/95 mb-10">
            Professional coaching for all ages and levels.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Book Trial →
          </Link>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
