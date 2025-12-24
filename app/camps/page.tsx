'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import AnimatedSection from '@/components/AnimatedSection'

// Camp data from year2026.json
const camps = [
  {
    id: "swim-tennis",
    name: "Swim & Tennis Camp",
    dates: "June 16 – August 14",
    days: "Weekly (Mon–Thu)",
    hours: "9:00 AM – 3:00 PM",
    ages: "5-11",
    location: "Alta Laguna Park",
    price: 495,
    perDay: 124,
    description: "Structured tennis lessons, swimming, and team-based activities that create lasting memories.",
    includes: ["Tennis instruction", "Supervised swimming", "Team activities", "Certified lifeguards"],
    coaches: ["Andrew Mateljan", "Michelle Bevins"],
    featured: true,
    safetyNote: "All participants must be able to swim independently.",
    season: "summer"
  },
  {
    id: "ski-week",
    name: "Ski Week Camp",
    dates: "February 16–20",
    days: "5 days",
    hours: "9:00 AM – 3:00 PM",
    ages: "5-14",
    location: "Laguna Beach High School",
    price: 525,
    perDay: 105,
    description: "Full-day tennis camp during Presidents' Week break. Perfect for keeping skills sharp while school is out.",
    includes: ["Lunch provided", "Skills clinics", "Match play", "Games & activities"],
    season: "winter"
  },
  {
    id: "spring-break",
    name: "Spring Break Camp",
    dates: "March 30 – April 3",
    days: "5 days",
    hours: "9:00 AM – 3:00 PM",
    ages: "5-14",
    location: "Laguna Beach High School",
    price: 525,
    perDay: 105,
    description: "Intensive training during spring break. Build skills and confidence before the summer season.",
    includes: ["Lunch provided", "Skills clinics", "Match play", "Tournament prep"],
    season: "spring"
  },
  {
    id: "summer",
    name: "Summer Tennis Camps",
    dates: "June 15 – August 14",
    days: "Weekly (5 days)",
    hours: "9:00 AM – 3:00 PM",
    ages: "5-17",
    location: "Laguna Beach High School",
    price: 725,
    halfDay: 425,
    perDay: 145,
    description: "Full-day summer tennis camps with half-day options. Our flagship camp program with comprehensive training.",
    includes: ["Lunch provided", "Swimming breaks", "Tournament prep option", "Skills assessment"],
    featured: true,
    season: "summer"
  },
  {
    id: "back-to-school",
    name: "Back-to-School Mini",
    dates: "August 17–19",
    days: "3 days",
    hours: "9:00 AM – 1:00 PM",
    ages: "5-14",
    location: "Laguna Beach High School",
    price: 325,
    perDay: 108,
    description: "Get back in the groove before school starts. A fun way to transition from summer to fall.",
    includes: ["Snacks provided", "Skills refresher", "Fun games", "Team competitions"],
    season: "summer"
  },
  {
    id: "thanksgiving",
    name: "Thanksgiving Camp",
    dates: "November 23–25",
    days: "3 days",
    hours: "9:00 AM – 1:00 PM",
    ages: "5-14",
    location: "Laguna Beach High School",
    price: 325,
    perDay: 108,
    description: "Holiday tennis fun during Thanksgiving break. Stay active while the family gathers.",
    includes: ["Snacks provided", "Holiday activities", "Match play", "Team games"],
    season: "fall"
  },
  {
    id: "winter-break",
    name: "Winter Break Camp",
    dates: "Dec 21–24 & Dec 28–31",
    days: "4 days per session",
    hours: "9:00 AM – 1:00 PM",
    ages: "5-14",
    location: "Laguna Beach High School",
    price: 425,
    perDay: 106,
    description: "Holiday camps during winter break. Choose one or both sessions for continuous play.",
    includes: ["Snacks provided", "Holiday fun", "Two session options", "Skills development"],
    season: "winter"
  }
]

// JTT data
const jttPrograms = [
  {
    id: "spring-jtt",
    name: "Spring JTT",
    dates: "January 12 – April 26",
    weeks: 15,
    matchDay: "Sundays",
    practiceIncluded: true,
    divisions: [
      { age: "10U", price: 2350 },
      { age: "12U", price: 2800 },
      { age: "14U", price: 2800 },
      { age: "18U", price: 2800 }
    ],
    includes: ["Weekly practice (2x)", "Sunday matches", "Team uniform", "USTA registration"],
    description: "USTA Junior Team Tennis league play. Compete against other academies in Southern California."
  },
  {
    id: "fall-jtt",
    name: "Fall JTT",
    dates: "September 5 – November 22",
    weeks: 12,
    matchDay: "Sundays",
    practiceIncluded: true,
    divisions: [
      { age: "10U", price: 2350 },
      { age: "12U", price: 2800 },
      { age: "14U", price: 2800 },
      { age: "18U", price: 2800 }
    ],
    includes: ["Weekly practice (2x)", "Sunday matches", "Team uniform", "USTA registration"],
    description: "Fall league competition season. Build teamwork and competitive experience."
  }
]

export default function CampsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  
  const filteredCamps = selectedSeason === 'all' 
    ? camps 
    : camps.filter(camp => camp.season === selectedSeason)

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-5.webp"
            alt="Junior tennis campers at Laguna Beach celebrating on courts at sunset"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 50%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-24">
          <AnimatedSection delay={0}>
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/80 mb-4">
              Year-Round Programming
            </p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="font-serif text-[40px] md:text-[64px] font-bold leading-[1.05] mb-6 text-shadow">
              Camps & Junior Team Tennis
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
              From holiday break camps to competitive USTA league play — development opportunities all year long.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#camps"
                className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                View Camps
              </Link>
              <Link 
                href="#jtt"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Junior Team Tennis
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CAMPS SECTION */}
      <section id="camps" className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-12">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-lbta-orange mb-4">
                2026 Camp Schedule
              </p>
              <h2 className="font-serif text-[36px] md:text-[52px] font-semibold text-black mb-4">
                Tennis Camps
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto">
                Holiday break camps and summer programs for ages 5-17. High-energy development with our movement-first philosophy.
              </p>
            </div>
          </AnimatedSection>

          {/* Season Filter */}
          <AnimatedSection delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['all', 'winter', 'spring', 'summer', 'fall'].map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-6 py-2.5 rounded-full font-sans text-[13px] font-medium uppercase tracking-[1px] transition-all duration-300 ${
                    selectedSeason === season
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black/70 hover:bg-gray-200'
                  }`}
                >
                  {season === 'all' ? 'All Camps' : season}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Camp Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCamps.map((camp, index) => (
              <AnimatedSection key={camp.id} delay={150 + index * 50}>
                <div className={`bg-[#FAF8F3] rounded-lg overflow-hidden h-full flex flex-col ${camp.featured ? 'ring-2 ring-lbta-orange' : ''}`}>
                  {camp.featured && (
                    <div className="bg-lbta-orange text-white text-center py-2 font-sans text-[11px] uppercase tracking-[2px] font-semibold">
                      Featured Camp
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-[22px] font-semibold text-black mb-1">
                          {camp.name}
                        </h3>
                        <p className="font-sans text-[13px] text-lbta-orange uppercase tracking-wide">
                          Ages {camp.ages}
                        </p>
                      </div>
                      <span className="bg-black/5 px-3 py-1 rounded-full font-sans text-[12px] text-black/60 capitalize">
                        {camp.season}
                      </span>
                    </div>
                    
                    <p className="font-sans text-[14px] text-black/70 mb-4 leading-relaxed flex-grow">
                      {camp.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 font-sans text-[13px] text-black/80">
                      <div className="flex items-center gap-2">
                        <span className="text-lbta-orange">📅</span>
                        <span>{camp.dates}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lbta-orange">⏰</span>
                        <span>{camp.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lbta-orange">📍</span>
                        <span>{camp.location}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-black/10 pt-4 mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="font-sans text-[12px] text-black/50 uppercase tracking-wide">Starting at</p>
                          <p className="font-serif text-[28px] font-semibold text-black">
                            ${camp.price}
                            {camp.halfDay && (
                              <span className="font-sans text-[14px] text-black/50 ml-2">
                                (Half-day: ${camp.halfDay})
                              </span>
                            )}
                          </p>
                          <p className="font-sans text-[12px] text-black/50">
                            ${camp.perDay}/day
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        href="/book"
                        className="block w-full text-center bg-black hover:bg-lbta-orange text-white font-sans font-semibold text-[13px] py-3 rounded transition-all duration-300 uppercase tracking-[1px]"
                      >
                        Register Now
                      </Link>
                    </div>
                    
                    {camp.safetyNote && (
                      <p className="font-sans text-[11px] text-black/50 mt-3 italic">
                        * {camp.safetyNote}
                      </p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-4">
                What Makes LBTA Camps Different
              </h2>
              <p className="font-sans text-[16px] text-black/70 max-w-2xl mx-auto">
                Every camp follows our movement-first philosophy with professional coaching and structured development.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Movement',
                description: 'Footwork, agility, and dynamic movement patterns that transfer to match play.',
                icon: '🏃'
              },
              {
                title: 'Discipline',
                description: 'Structured sessions with clear goals, feedback, and measurable improvement.',
                icon: '🎯'
              },
              {
                title: 'Belonging',
                description: 'Team activities, new friendships, and a supportive community atmosphere.',
                icon: '🤝'
              },
            ].map((pillar, index) => (
              <AnimatedSection key={pillar.title} delay={100 + index * 100}>
                <div className="bg-white p-8 rounded-lg text-center">
                  <div className="text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="font-serif text-[24px] font-semibold text-black mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[15px] text-black/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* JTT SECTION */}
      <section id="jtt" className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-12">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-lbta-orange mb-4">
                USTA League Play
              </p>
              <h2 className="font-serif text-[36px] md:text-[52px] font-semibold text-black mb-4">
                Junior Team Tennis
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 max-w-2xl mx-auto">
                Competitive team-based tennis for juniors. Weekly practices and Sunday matches against academies across Southern California.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {jttPrograms.map((program, index) => (
              <AnimatedSection key={program.id} delay={100 + index * 100}>
                <div className="bg-[#FAF8F3] rounded-lg p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-serif text-[28px] font-semibold text-black mb-1">
                        {program.name}
                      </h3>
                      <p className="font-sans text-[14px] text-black/60">
                        {program.weeks} weeks · Matches on {program.matchDay}
                      </p>
                    </div>
                    <span className="bg-lbta-orange/10 text-lbta-orange px-3 py-1 rounded-full font-sans text-[12px] font-semibold uppercase tracking-wide">
                      USTA
                    </span>
                  </div>
                  
                  <p className="font-sans text-[15px] text-black/70 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  
                  <div className="space-y-2 mb-6 font-sans text-[14px] text-black/80">
                    <div className="flex items-center gap-2">
                      <span className="text-lbta-orange">📅</span>
                      <span>{program.dates}</span>
                    </div>
                  </div>
                  
                  {/* What's Included */}
                  <div className="mb-6">
                    <p className="font-sans text-[12px] uppercase tracking-wide text-black/50 mb-3">Includes</p>
                    <div className="flex flex-wrap gap-2">
                      {program.includes.map((item) => (
                        <span key={item} className="bg-white px-3 py-1.5 rounded-full font-sans text-[12px] text-black/70">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Divisions & Pricing */}
                  <div className="border-t border-black/10 pt-6">
                    <p className="font-sans text-[12px] uppercase tracking-wide text-black/50 mb-4">Divisions & Pricing</p>
                    <div className="grid grid-cols-2 gap-3">
                      {program.divisions.map((division) => (
                        <div key={division.age} className="bg-white p-4 rounded-lg text-center">
                          <p className="font-sans text-[14px] font-semibold text-black mb-1">{division.age}</p>
                          <p className="font-serif text-[20px] font-semibold text-lbta-orange">${division.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    href="/book"
                    className="block w-full text-center bg-black hover:bg-lbta-orange text-white font-sans font-semibold text-[13px] py-4 rounded transition-all duration-300 uppercase tracking-[1px] mt-6"
                  >
                    Register for {program.name}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-4">
                Camp FAQs
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="space-y-4">
            {[
              {
                q: "What should my child bring to camp?",
                a: "Tennis racquet (we can provide one if needed), water bottle, sunscreen, hat, and appropriate athletic clothing. For full-day camps, we provide lunch. For half-day camps, bring a snack."
              },
              {
                q: "What skill level is required?",
                a: "Our camps welcome all skill levels from complete beginners to advanced players. We group campers by age and ability to ensure appropriate instruction and match play."
              },
              {
                q: "Can I register for individual days?",
                a: "Camp registration is by the week or session. However, we offer drop-in options for some programs. Contact us for availability."
              },
              {
                q: "What is your cancellation policy?",
                a: "Full refunds are available up to 14 days before camp start. 50% refund up to 7 days before. Credits can be applied to future programs within 7 days of start."
              },
              {
                q: "Is there early drop-off or late pickup?",
                a: "Extended care is available for an additional fee. Early drop-off starts at 8:00 AM and late pickup extends until 4:00 PM. Contact us to arrange."
              }
            ].map((faq, index) => (
              <AnimatedSection key={index} delay={50 + index * 50}>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-sans text-[16px] font-semibold text-black mb-2">{faq.q}</h3>
                  <p className="font-sans text-[14px] text-black/70 leading-relaxed">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset over tennis courts"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <AnimatedSection delay={0}>
            <h2 className="font-serif text-[36px] md:text-[52px] font-semibold mb-6 leading-[1.15] text-shadow">
              Reserve Your Spot
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/95 mb-10">
              Camp spaces fill quickly — secure your week today. Questions? We're here to help.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/book"
                className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Book Now
              </Link>
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
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Reserve Your Spot" href="/book" showAfterScroll={600} />
    </>
  )
}
