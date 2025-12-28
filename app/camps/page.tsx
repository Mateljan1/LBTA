'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import AnimatedSection from '@/components/AnimatedSection'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Summer camp weeks for 2026 (5-day weeks = $725, 3-day short week = $435)
const summerWeeks = [
  { week: 1, dates: "June 15–19", label: "Week 1", days: 5, price: 725, halfDay: 425 },
  { week: 2, dates: "June 22–26", label: "Week 2", days: 5, price: 725, halfDay: 425 },
  { week: 3, dates: "June 29 – July 3", label: "Week 3", days: 5, price: 725, halfDay: 425 },
  { week: 4, dates: "July 7–11", label: "Week 4", days: 5, price: 725, halfDay: 425 },
  { week: 5, dates: "July 14–18", label: "Week 5", days: 5, price: 725, halfDay: 425 },
  { week: 6, dates: "July 21–25", label: "Week 6", days: 5, price: 725, halfDay: 425 },
  { week: 7, dates: "July 28 – August 1", label: "Week 7", days: 5, price: 725, halfDay: 425 },
  { week: 8, dates: "August 4–8", label: "Week 8", days: 5, price: 725, halfDay: 425 },
  { week: 9, dates: "August 11–15", label: "Week 9", days: 5, price: 725, halfDay: 425 },
  { week: 10, dates: "August 17–19", label: "Back-to-School (3 days)", days: 3, price: 435, halfDay: 255 },
]

// Swim & Tennis camp weeks (4-day weeks = $495, 3-day short week = $375)
const swimTennisWeeks = [
  { week: 1, dates: "June 16–19", label: "Week 1", days: 4, price: 495 },
  { week: 2, dates: "June 23–26", label: "Week 2", days: 4, price: 495 },
  { week: 3, dates: "June 30 – July 3", label: "Week 3", days: 4, price: 495 },
  { week: 4, dates: "July 7–10", label: "Week 4", days: 4, price: 495 },
  { week: 5, dates: "July 14–17", label: "Week 5", days: 4, price: 495 },
  { week: 6, dates: "July 21–24", label: "Week 6", days: 4, price: 495 },
  { week: 7, dates: "July 28–31", label: "Week 7", days: 4, price: 495 },
  { week: 8, dates: "August 4–7", label: "Week 8", days: 4, price: 495 },
  { week: 9, dates: "August 11–14", label: "Week 9", days: 4, price: 495 },
  { week: 10, dates: "August 17–19", label: "Back-to-School (3 days)", days: 3, price: 375 },
]

// Camp data for 2026
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
    season: "summer",
    weeks: swimTennisWeeks
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
    name: "Summer Tennis Camp",
    dates: "June 15 – August 15",
    days: "Weekly (Mon–Fri)",
    hours: "9:00 AM – 3:00 PM",
    ages: "5-17",
    location: "Laguna Beach High School",
    price: 725,
    halfDay: 425,
    perDay: 145,
    description: "Full-day summer tennis camps with half-day options. Our flagship camp program with comprehensive training.",
    includes: ["Lunch provided", "Swimming breaks", "Tournament prep option", "Skills assessment"],
    featured: true,
    season: "summer",
    weeks: summerWeeks
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

// Type for week data
interface CampWeek {
  week: number
  dates: string
  label: string
  days: number
  price: number
  halfDay?: number
}

// Type for camp data to match YearRegistrationModal expectations
interface CampModalData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
  weeks?: CampWeek[]
  selectedWeek?: CampWeek
}

export default function CampsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCamp, setSelectedCamp] = useState<CampModalData | null>(null)
  
  const filteredCamps = selectedSeason === 'all' 
    ? camps 
    : camps.filter(camp => camp.season === selectedSeason)

  const handleRegisterClick = (camp: typeof camps[0] & { selectedWeek?: CampWeek }) => {
    // Convert camp data to modal format - use week-specific pricing if available
    const modalData: CampModalData = {
      id: camp.id,
      name: camp.selectedWeek 
        ? `${camp.name} - ${camp.selectedWeek.label}` 
        : camp.name,
      dates: camp.selectedWeek 
        ? camp.selectedWeek.dates 
        : camp.dates,
      days: camp.selectedWeek 
        ? `${camp.selectedWeek.days} days`
        : camp.days,
      hours: camp.hours,
      ages: camp.ages,
      location: camp.location,
      price: camp.selectedWeek 
        ? camp.selectedWeek.price 
        : camp.price,
      perDay: camp.selectedWeek 
        ? Math.round(camp.selectedWeek.price / camp.selectedWeek.days)
        : camp.perDay,
      halfDay: camp.selectedWeek?.halfDay || camp.halfDay,
      description: camp.description,
      includes: camp.includes,
      safetyNote: camp.safetyNote,
      featured: camp.featured,
      season: camp.season,
      coaches: camp.coaches,
      selectedWeek: camp.selectedWeek,
    }
    setSelectedCamp(modalData)
    setIsModalOpen(true)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-3.webp"
            alt="Young boy celebrating on the tennis court at Laguna Beach Tennis Academy camp"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-24">
          <AnimatedSection delay={0}>
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/80 mb-4">
              Holiday & Summer Programs
            </p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="font-serif text-[40px] md:text-[64px] font-bold leading-[1.05] mb-6 text-shadow">
              Tennis Camps
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
              From holiday break camps to full summer programs — high-energy development with our movement-first philosophy.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#camps"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                View Camps
              </Link>
              <Link 
                href="/jtt"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Junior Team Tennis →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Camps' }]} />
      </div>

      {/* CAMPS SECTION */}
      <section id="camps" className="bg-white py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-12">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredCamps.map((camp, index) => (
              <AnimatedSection key={camp.id} delay={150 + index * 50}>
                <div className={`bg-white rounded-lg overflow-hidden ${camp.featured ? 'ring-2 ring-black' : 'border border-black/10'}`}>
                  {camp.featured && (
                    <div className="bg-black text-white text-center py-2 font-sans text-[11px] uppercase tracking-[2px] font-semibold">
                      Featured Camp
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-[22px] font-semibold text-black mb-1">
                          {camp.name}
                        </h3>
                        <p className="font-sans text-[13px] text-black/60 uppercase tracking-wide">
                          Ages {camp.ages}
                        </p>
                      </div>
                      <span className="bg-black/5 px-3 py-1 rounded-full font-sans text-[12px] text-black/60 capitalize">
                        {camp.season}
                      </span>
                    </div>
                    
                    <p className="font-sans text-[14px] text-black/70 mb-4 leading-relaxed">
                      {camp.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 font-sans text-[13px] text-black/70">
                      <div className="flex items-baseline gap-2">
                        <span className="text-black/50 font-semibold text-[11px] uppercase tracking-wide w-16">Time</span>
                        <span>{camp.hours}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-black/50 font-semibold text-[11px] uppercase tracking-wide w-16">Location</span>
                        <span>{camp.location}</span>
                      </div>
                    </div>
                    
                    {/* Week Selection for Multi-Week Camps */}
                    {camp.weeks && camp.weeks.length > 0 ? (
                      <div className="border-t border-black/10 pt-4">
                        <p className="font-sans text-[12px] text-black/50 uppercase tracking-wide mb-3">
                          Select a Week ({camp.weeks.length} available)
                        </p>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 mb-4 pr-1">
                          {camp.weeks.map((week) => (
                            <button
                              key={week.week}
                              onClick={() => handleRegisterClick({ ...camp, selectedWeek: week })}
                              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group text-left"
                            >
                              <div>
                                <p className="font-sans text-[14px] font-medium text-black group-hover:text-black">
                                  {week.label}: {week.dates}
                                </p>
                                <p className="font-sans text-[11px] text-black/50">
                                  {week.days} days{'halfDay' in week && week.halfDay && ` · Half-day: $${week.halfDay}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-[14px] font-semibold text-black">
                                  ${week.price}
                                </span>
                                <svg className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-black/10 pt-4">
                        <div className="space-y-2 mb-4 font-sans text-[13px] text-black/70">
                          <div className="flex items-baseline gap-2">
                            <span className="text-black/50 font-semibold text-[11px] uppercase tracking-wide w-16">Dates</span>
                            <span>{camp.dates}</span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="font-sans text-[12px] text-black/50 uppercase tracking-wide">Price</p>
                          <p className="font-serif text-[28px] font-semibold text-black">
                            ${camp.price}
                          </p>
                          <p className="font-sans text-[12px] text-black/50">
                            ${camp.perDay}/day
                            {camp.halfDay && ` · Half-day: $${camp.halfDay}`}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRegisterClick(camp)}
                          className="block w-full text-center bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[13px] py-3 rounded transition-all duration-300 uppercase tracking-[1px]"
                        >
                          Register Now
                        </button>
                      </div>
                    )}
                    
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

      {/* OUR FOUNDATION */}
      <section className="bg-[#FAF8F3] py-20 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-black/60 mb-4">
                Our Foundation
              </p>
              <h2 className="font-serif text-[36px] md:text-[52px] font-semibold text-black mb-6">
                What Makes LBTA Different
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
          
          <AnimatedSection delay={400}>
            <p className="font-serif text-[20px] md:text-[24px] text-black/80 text-center mt-16 italic">
              Movement. Discipline. Belonging.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* JTT PROMO */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-4 md:px-12">
          <AnimatedSection delay={0}>
            <div className="bg-black text-white p-8 md:p-12 rounded-lg text-center">
              <p className="font-sans text-[11px] uppercase tracking-[2px] text-white/70 mb-4">
                USTA League Play
              </p>
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold mb-4">
                Junior Team Tennis
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-white/80 max-w-2xl mx-auto mb-8">
                Competitive team-based tennis for juniors. 15 weeks of structured training with weekend matches against academies across Southern California.
              </p>
              <Link 
                href="/jtt"
                className="inline-block bg-white hover:bg-gray-100 text-black font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Learn More About JTT →
              </Link>
            </div>
          </AnimatedSection>
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
            quality={90}
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
                href="/contact"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Contact Us
              </Link>
              <a 
                href="tel:9494646645"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] min-h-[48px]"
              >
                Call (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Luxury Registration Modal */}
      <LuxuryYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="camp"
        data={selectedCamp}
        season={selectedCamp?.season || 'summer'}
      />
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Reserve Your Spot" href="#camps" showAfterScroll={600} />
    </>
  )
}
