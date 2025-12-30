'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import AnimatedSection from '@/components/AnimatedSection'
import JTTRegistrationModalStreamlined from '@/components/JTTRegistrationModalStreamlined'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Team Divisions data
const divisions = [
  {
    name: '10 & Under — Orange Ball',
    description: 'For players developing foundational movement and coordination using lower-compression balls on a 36-foot court.',
    matchFormat: '4 singles / 2 doubles'
  },
  {
    name: '10 & Under — Green Dot',
    description: 'For players transitioning to full-court tennis with green dot balls to refine stroke mechanics and basic tactics.',
    matchFormat: '6 singles / 3 doubles'
  },
  {
    name: '12 & Under',
    description: 'Focus on consistent groundstrokes, serving technique, and early tactical understanding.',
    matchFormat: '6 singles / 3 doubles (L6/L7) or 4 singles / 2 doubles (L5)'
  },
  {
    name: '14 & Under',
    description: 'Introduces advanced patterns, serve variation, and mental resilience.',
    matchFormat: '6 singles / 3 doubles or 4 singles / 2 doubles'
  },
  {
    name: '16 & Under',
    description: 'Sharpens competitive decision-making, conditioning, and playing identity.',
    matchFormat: '4 singles / 2 doubles'
  },
  {
    name: '18 & Under',
    description: 'Prepares players for high-school, college, and sectional competition through high-intensity training.',
    matchFormat: '4 singles / 2 doubles'
  }
]

// Practice Schedule
const practiceSchedule = [
  { division: '10U Orange', location: 'Alta Laguna Park', days: 'Mon/Wed/Fri', time: '3:45 – 5:45 PM' },
  { division: '10U Green Dot', location: 'Alta Laguna Park', days: 'Tue/Thu/Fri', time: '4:00 – 6:00 PM' },
  { division: '12U & 14U', location: 'Laguna Beach HS', days: 'Mon/Wed/Fri', time: '4:00 – 6:00 PM' },
  { division: '16U & 18U', location: 'Laguna Beach HS', days: 'Mon/Wed/Fri', time: '6:00 – 8:00 PM' },
]

// Key Dates
const keyDates = [
  { date: 'January 12', event: 'Practices Begin' },
  { date: 'January 16', event: 'Team Registration Deadline' },
  { date: 'February 6', event: 'Age Cut-Off Date' },
  { date: 'February 7–8', event: 'Match Season Begins' },
  { date: 'March 9', event: 'Player Registration Deadline' },
  { date: 'April 4–5', event: 'Easter Weekend — No Matches' },
  { date: 'April 11–26', event: 'Local League Playoffs' },
  { date: 'May 16–17', event: 'Sectional Championships (12U–18U)' },
]

// What's Included
const included = [
  'Three weekly practices (technical + tactical + match prep)',
  'Weekend matches with coach presence',
  'Match-day support (warm-ups, feedback, strategy)',
  'LBTA team shirt — identity + pride',
  'Player assessments (mid- and end-season reports)',
  '15% private-lesson discount during the season'
]

// JTT Program data for modal
const jttProgramData = {
  id: 'spring-jtt',
  name: 'Spring 2026 Junior Team Tennis',
  dates: 'January 12 – April 26, 2026',
  weeks: 15,
  matchDay: 'Saturdays & Sundays',
  divisions: [
    { age: '10U', price: 2800 },
    { age: '12U', price: 2800 },
    { age: '14U', price: 2800 },
    { age: '16U', price: 2800 },
    { age: '18U', price: 2800 },
  ],
  includes: included,
  description: 'Competitive team-based tennis for juniors. 15 weeks of structured training with weekend matches against academies across Southern California.'
}

export default function JTTPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-3.webp"
            alt="Junior Team Tennis players competing at Laguna Beach"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 40%' }}
            sizes="100vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-24">
          <AnimatedSection delay={0}>
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/80 mb-4">
              USTA League Play · Spring 2026
            </p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="font-serif text-[44px] md:text-[72px] font-bold leading-[1.05] mb-6 text-shadow">
              Junior Team Tennis
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-4 max-w-[85%] mx-auto">
              Competitive team-based tennis for juniors. Weekly practices and Sunday matches against academies across Southern California.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={250}>
            <p className="font-serif text-[18px] md:text-[22px] italic text-white/90 mb-10">
              Movement. Discipline. Belonging.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Register Now
              </button>
              <Link 
                href="#schedule"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                View Schedule
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Junior Team Tennis' }]} />
      </div>

      {/* SEASON OVERVIEW */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection delay={0}>
                <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                  Season Overview
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6 leading-tight">
                  Spring 2026 Season
                </h2>
                <p className="font-sans text-[16px] md:text-[18px] text-black/70 leading-relaxed mb-6">
                  The Spring 2026 Junior Team Tennis season runs for <strong className="text-black">15 weeks</strong>, combining structured weekday training with competitive weekend matches against other Orange County academies.
                </p>
                <p className="font-sans text-[16px] md:text-[18px] text-black/70 leading-relaxed mb-8">
                  Players develop individually while learning accountability, teamwork, and composure under pressure.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={100}>
                <div className="bg-[#FAF8F3] p-8 rounded-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-wide text-black/50 mb-1">Season Dates</p>
                      <p className="font-serif text-[20px] text-black">January 12 – April 26</p>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-wide text-black/50 mb-1">Duration</p>
                      <p className="font-serif text-[20px] text-black">15 Weeks</p>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-wide text-black/50 mb-1">Match Days</p>
                      <p className="font-serif text-[20px] text-black">Saturdays & Sundays</p>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-wide text-black/50 mb-1">Training Hours</p>
                      <p className="font-serif text-[20px] text-black">~90 hours/season</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            <AnimatedSection delay={150}>
              <div className="bg-black text-white p-8 md:p-10 rounded-lg">
                <h3 className="font-serif text-[24px] md:text-[28px] font-semibold mb-8">
                  Key Dates
                </h3>
                <div className="space-y-4">
                  {keyDates.map((item, index) => (
                    <div key={index} className="flex items-baseline gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                      <span className="font-sans text-[14px] text-white/60 font-semibold min-w-[100px]">
                        {item.date}
                      </span>
                      <span className="font-sans text-[14px] text-white/80">
                        {item.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* OUR FOUNDATION */}
      <section className="bg-[#FAF8F3] py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                Our Foundation
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6">
                Three Core Principles
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto leading-relaxed">
                Everything we teach is built on three core principles that develop complete tennis players.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <AnimatedSection delay={100}>
              <div className="bg-white p-8 rounded-lg text-center h-full">
                <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-4">
                  Movement
                </h3>
                <p className="font-sans text-[15px] md:text-[16px] text-black/70 leading-relaxed">
                  Athletic footwork and court coverage form the foundation of every great player. We train efficient movement patterns that become instinctive.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="bg-white p-8 rounded-lg text-center h-full">
                <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-4">
                  Discipline
                </h3>
                <p className="font-sans text-[15px] md:text-[16px] text-black/70 leading-relaxed">
                  Focus, consistency, and mental toughness separate good players from great ones. We build habits that transfer to school and life.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="bg-white p-8 rounded-lg text-center h-full">
                <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-4">
                  Belonging
                </h3>
                <p className="font-sans text-[15px] md:text-[16px] text-black/70 leading-relaxed">
                  Being part of a team creates motivation, accountability, and friendships. Players push each other to improve while having fun together.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TEAM DIVISIONS */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                Age Groups
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6">
                Team Divisions
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto leading-relaxed">
                Every player develops at their own pace. LBTA offers six divisions, each designed to challenge players appropriately while supporting steady growth.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisions.map((division, index) => (
              <AnimatedSection key={division.name} delay={100 + index * 50}>
                <div className="bg-[#FAF8F3] p-6 md:p-8 rounded-lg h-full">
                  <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-black mb-3">
                    {division.name}
                  </h3>
                  <p className="font-sans text-[14px] text-black/70 leading-relaxed mb-4">
                    {division.description}
                  </p>
                  <div className="pt-4 border-t border-black/10">
                    <p className="font-sans text-[11px] uppercase tracking-wide text-black/50 mb-1">Match Format</p>
                    <p className="font-sans text-[14px] text-black/80">{division.matchFormat}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={400}>
            <p className="font-sans text-[14px] text-black/60 text-center mt-10">
              Within each division, teams compete in <strong className="text-black">Gold</strong>, <strong className="text-black">Silver</strong>, or <strong className="text-black">Bronze</strong> brackets based on WTN (World Tennis Number). Gold teams advance to Sectionals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* PRACTICE SCHEDULE */}
      <section id="schedule" className="bg-[#FAF8F3] py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                Training Schedule
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6">
                Weekly Practice Schedule
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto leading-relaxed">
                All practices are 2 hours, three times per week, with consistent coaching throughout the season.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-4 gap-4 p-4 bg-black text-white font-sans text-[12px] uppercase tracking-wide">
                <span>Division</span>
                <span>Location</span>
                <span>Days</span>
                <span>Time</span>
              </div>
              {practiceSchedule.map((item, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-2 md:gap-4 p-4 md:p-6 border-b border-black/10 last:border-0">
                  <div>
                    <span className="md:hidden font-sans text-[11px] uppercase tracking-wide text-black/50 block mb-1">Division</span>
                    <span className="font-serif text-[18px] md:text-[16px] text-black font-semibold">{item.division}</span>
                  </div>
                  <div>
                    <span className="md:hidden font-sans text-[11px] uppercase tracking-wide text-black/50 block mb-1">Location</span>
                    <span className="font-sans text-[14px] text-black/70">{item.location}</span>
                  </div>
                  <div>
                    <span className="md:hidden font-sans text-[11px] uppercase tracking-wide text-black/50 block mb-1">Days</span>
                    <span className="font-sans text-[14px] text-black/70">{item.days}</span>
                  </div>
                  <div>
                    <span className="md:hidden font-sans text-[11px] uppercase tracking-wide text-black/50 block mb-1">Time</span>
                    <span className="font-sans text-[14px] text-black/60 font-semibold">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <p className="font-sans text-[14px] text-black/60 text-center mt-8">
              Each session includes warm-ups, technical development, tactical drills, and live match play.<br />
              <strong className="text-black">Total training time: ~90 hours per season</strong>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection delay={0}>
                <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                  Season Pricing
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6 leading-tight">
                  Investment in Excellence
                </h2>
                <p className="font-sans text-[16px] md:text-[18px] text-black/70 leading-relaxed mb-8">
                  The program includes 15 weeks of training, professional coaching, and match play. Everything your player needs to compete at their best.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={100}>
                <div className="bg-[#FAF8F3] p-8 md:p-10 rounded-lg">
                  <p className="font-sans text-[12px] uppercase tracking-wide text-black/50 mb-2">All Divisions</p>
                  <p className="font-sans text-[14px] text-black/60 mb-6">10U Orange Ball through 18U</p>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-serif text-[56px] md:text-[72px] font-semibold text-black leading-none">$2,800</span>
                    <span className="font-sans text-[14px] text-black/50">per season</span>
                  </div>
                  
                  <div className="bg-black/5 text-black/60 px-4 py-3 rounded-lg mb-8">
                    <p className="font-sans text-[14px] font-semibold">Pay-in-Full: $2,750 <span className="font-normal">(save $50)</span></p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <p className="font-sans text-[13px] text-black/70 font-semibold">Payment Options:</p>
                    <ul className="space-y-2 font-sans text-[14px] text-black/70">
                      <li>→ Pay Upfront — save $50</li>
                      <li>→ Two Installments — half at registration, half mid-season</li>
                      <li>→ Four Monthly Payments — no fees</li>
                    </ul>
                  </div>
                  
                  <p className="font-sans text-[12px] text-black/50 mb-6">
                    USTA Registration: $33.15/player (paid directly to USTA)
                  </p>
                  
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] py-4 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
                  >
                    Register Now
                  </button>
                </div>
              </AnimatedSection>
            </div>
            
            <AnimatedSection delay={150}>
              <div>
                <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-8">
                  What's Included
                </h3>
                <div className="space-y-4">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-black/10 last:border-0">
                      <svg className="w-5 h-5 text-black/40 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-sans text-[15px] text-black/70 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* COACHING APPROACH */}
      <section className="bg-[#FAF8F3] py-20 md:py-32">
        <div className="max-w-[1000px] mx-auto px-4 md:px-12 text-center">
          <AnimatedSection delay={0}>
            <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
              Our Coaching Approach
            </p>
            <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-8">
              Developing Complete Players
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <blockquote className="mb-12">
              <p className="font-serif text-[20px] md:text-[24px] text-black/80 italic leading-relaxed mb-4">
                "Our mission goes beyond creating better tennis players. We teach confidence, resilience, and a lifelong love of the sport."
              </p>
              <cite className="font-sans text-[14px] text-black/60 not-italic">
                — Andrew Mateljan, LBTA Director
              </cite>
            </blockquote>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                { title: 'Technical Development', desc: 'Age-appropriate instruction emphasizing efficient mechanics and personalized learning.' },
                { title: 'Character Building', desc: 'Sportsmanship, discipline, and accountability — win with class, lose with perspective.' },
                { title: 'Competitive Training', desc: 'Live-point play that translates skills into strategy and composure.' },
                { title: 'Team Experience', desc: 'The motivation and joy of belonging to a team that private lessons cannot provide.' },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg">
                  <h3 className="font-serif text-[18px] font-semibold text-black mb-2">{item.title}</h3>
                  <p className="font-sans text-[14px] text-black/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={300}>
            <div className="mt-12">
              <p className="font-sans text-[14px] text-black/60 mb-2">Your Coaching Team</p>
              <p className="font-sans text-[16px] text-black/80">
                <strong>Andrew Mateljan</strong> (LBTA Director, ATP/WTA experience), <strong>Coach Kevin</strong>, and <strong>Coach Andy</strong> — consistent presence every session.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* HOW TO REGISTER */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                Get Started
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-black mb-6">
                How to Register
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto leading-relaxed">
                Registration is simple, but space is limited. Secure your player's spot today.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatedSection delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
                  <span className="font-serif text-[28px] font-semibold text-black/60">1</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-black mb-3">Register Online</h3>
                <p className="font-sans text-[14px] text-black/70">Click "Register Now" and fill out the registration form.</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
                  <span className="font-serif text-[28px] font-semibold text-black/60">2</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-black mb-3">Receive Confirmation</h3>
                <p className="font-sans text-[14px] text-black/70">Get an email with team placement and payment details.</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
                  <span className="font-serif text-[28px] font-semibold text-black/60">3</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-black mb-3">Start Training</h3>
                <p className="font-sans text-[14px] text-black/70">Complete payment and receive your welcome packet.</p>
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection delay={400}>
            <div className="bg-black text-white p-8 md:p-10 rounded-lg">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-wide text-white/50 mb-2">Team Registration</p>
                  <p className="font-serif text-[24px] text-white">Fri Jan 16</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-wide text-white/50 mb-2">Practices Begin</p>
                  <p className="font-serif text-[24px] text-white">Mon Jan 12</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-wide text-white/50 mb-2">Player Deadline</p>
                  <p className="font-serif text-[24px] text-white">Mon Mar 9</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset over tennis courts"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-24">
          <AnimatedSection delay={0}>
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/80 mb-4">
              Join LBTA for Spring 2026
            </p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="font-serif text-[36px] md:text-[52px] font-semibold mb-6 leading-[1.15] text-shadow">
              Be Part of the Team
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/95 mb-4">
              Be part of a community that believes in growth, support, and continuous improvement. Whether your child competes in college or plays for life, this program builds the foundation for success on and off the court.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={250}>
            <p className="font-serif text-[18px] md:text-[22px] italic text-white/90 mb-10">
              Movement. Discipline. Belonging.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Register Now
              </button>
              <Link 
                href="/contact"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Contact Info */}
      <section className="bg-black text-white py-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 text-center">
          <p className="font-sans text-[14px] text-white/60 mb-2">Questions? We're here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            <a href="mailto:support@lagunabeachtennisacademy.com" className="font-sans text-[16px] text-white hover:text-white transition-colors">
              support@lagunabeachtennisacademy.com
            </a>
            <a href="tel:9494646645" className="font-sans text-[16px] text-white hover:text-white transition-colors">
              (949) 464-6645
            </a>
          </div>
        </div>
      </section>
      
      {/* JTT Registration Modal - Streamlined */}
      <JTTRegistrationModalStreamlined
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* Sticky Mobile CTA */}
      <StickyCTA 
        text="Register for JTT" 
        onClick={() => setIsModalOpen(true)} 
        showAfterScroll={600} 
      />
    </>
  )
}
