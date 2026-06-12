'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

// Track CTA events
const trackEvent = (eventName: string, properties?: Record<string, string>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  console.log(`[Analytics] ${eventName}`, properties);
};

// Division data from PDF page 3
const divisions = [
  {
    name: '10U Orange Ball',
    ages: '8-10 years',
    court: '60ft court',
    ball: 'Orange ball (50% compression)',
    matches: 'Saturdays AM',
    level: 'Beginner to Intermediate',
  },
  {
    name: '10U Green Dot',
    ages: '9-10 years',
    court: '78ft court',
    ball: 'Green dot ball (75% compression)',
    matches: 'Saturdays AM',
    level: 'Intermediate',
  },
  {
    name: '12U Division',
    ages: '11-12 years',
    court: '78ft court',
    ball: 'Yellow ball',
    matches: 'Saturdays/Sundays',
    level: 'Intermediate to Advanced',
  },
  {
    name: '14U Division',
    ages: '13-14 years',
    court: '78ft court',
    ball: 'Yellow ball',
    matches: 'Saturdays/Sundays',
    level: 'Intermediate to Advanced',
  },
  {
    name: '16U/18U Division',
    ages: '15-18 years',
    court: '78ft court',
    ball: 'Yellow ball',
    matches: 'Saturdays/Sundays',
    level: 'Advanced/Competitive',
  },
];

// Practice schedule data (from PDF - 2 hours, 3x/week)
const practiceSchedule = [
  {
    division: '10U Orange Ball',
    day: 'Mon/Wed/Fri',
    time: '3:45 – 5:45 PM',
    location: 'Moulton Meadows Park',
  },
  {
    division: '10U Green Dot',
    day: 'Tue/Thu/Fri',
    time: '4:00 – 6:00 PM',
    location: 'Alta Laguna Park',
  },
  {
    division: '12U & 14U',
    day: 'Mon/Wed/Fri',
    time: '4:00 – 6:00 PM',
    location: 'Laguna Beach HS',
  },
  {
    division: '16U & 18U',
    day: 'Mon/Wed/Fri',
    time: '6:00 – 8:00 PM',
    location: 'Laguna Beach HS',
  },
];

// Key dates for season (from PDF)
const keyDates = [
  { date: 'Jan 12, 2026', event: 'Practices Begin' },
  { date: 'Jan 16, 2026', event: 'Team Registration Deadline' },
  { date: 'Jan 19, 2026', event: 'Minimum Players per Team' },
  { date: 'Feb 6, 2026', event: 'Age Cut-Off Date' },
  { date: 'Feb 7-8, 2026', event: 'Match Season Begins' },
  { date: 'Mar 9, 2026', event: 'Player Registration Deadline' },
  { date: 'Apr 4-5, 2026', event: 'Easter Weekend — No Matches' },
  { date: 'Apr 11-26, 2026', event: 'Local League Playoffs' },
  { date: 'May 16-17, 2026', event: 'Sectional Championships' },
];

export default function JuniorTeamTennisPage() {
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsActivityLocation',
            name: 'LBTA Junior Team Tennis',
            description: 'Junior Team Tennis program for ages 8-18 in Laguna Beach',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Laguna Beach',
              addressRegion: 'CA',
            },
            sport: 'Tennis',
            audience: {
              '@type': 'Audience',
              audienceType: 'Youth Athletes',
            },
          }),
        }}
      />

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/programs/jtt-hero.jpg"
            alt="Junior Team Tennis players in action"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Programs', href: '/programs' },
              { label: 'Junior Team Tennis' },
            ]}
          />

          <AnimatedSection>
            <span className="inline-block px-4 py-2 bg-lbta-red/20 text-lbta-orange font-medium rounded-full mb-6 mt-8">
              Spring 2026 Season
            </span>
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Junior Team Tennis
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              Where young athletes discover the thrill of competition, the power of teamwork,
              and the joy of tennis excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                onClick={() => trackEvent('book_trial_click', { source: 'jtt_hero' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-lbta-red hover:bg-lbta-orange text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                aria-label="Book a trial session for Junior Team Tennis"
              >
                Book a Trial Session
              </Link>
              <a
                href="/pdfs/junior-team-tennis-spring-2026.pdf"
                download
                onClick={() => trackEvent('pdf_download', { source: 'jtt_hero' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 transition-all duration-300 min-h-[48px]"
                aria-label="Download Junior Team Tennis Spring 2026 PDF"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Season Guide
              </a>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== SECTION 2: EDITORIAL STATEMENT ===== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="font-serif text-[28px] md:text-[36px] leading-[1.4] text-black/90 tracking-[-0.3px]">
              Where young athletes discover the joy of competition,
              the discipline of training, and the bond of belonging
              to something greater than themselves.
            </p>
            <div className="mt-12 flex items-center justify-center gap-8 text-black/50 font-sans text-[14px] tracking-wide uppercase">
              <span>18 Weeks</span>
              <span className="w-1 h-1 rounded-full bg-black/30" />
              <span>45 Sessions</span>
              <span className="w-1 h-1 rounded-full bg-black/30" />
              <span>Weekend Matches</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== OUR FOUNDATION: THREE PILLARS ===== */}
      <section className="py-24 md:py-32 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
              {/* Movement */}
              <div className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/images/programs/jtt-movement.jpg"
                    alt="Tennis movement and footwork training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 font-headline text-2xl font-bold text-white">
                    Movement
                  </h3>
                </div>
                <p className="text-black/70 leading-relaxed">
                  Tennis is a sport of constant motion. We develop agility, balance, and court coverage
                  that gives players the physical foundation to execute every shot with confidence.
                </p>
              </div>

              {/* Discipline */}
              <div className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/images/programs/jtt-discipline.jpg"
                    alt="Tennis discipline and focus training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 font-headline text-2xl font-bold text-white">
                    Discipline
                  </h3>
                </div>
                <p className="text-black/70 leading-relaxed">
                  Excellence requires commitment. Our players learn to show up, work hard, and push
                  through challenges—skills that serve them on the court and throughout life.
                </p>
              </div>

              {/* Belonging */}
              <div className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/images/programs/jtt-belonging.jpg"
                    alt="Team camaraderie and belonging"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 font-headline text-2xl font-bold text-white">
                    Belonging
                  </h3>
                </div>
                <p className="text-black/70 leading-relaxed">
                  Team tennis creates bonds that last. Players become part of something bigger—a
                  community that celebrates wins, learns from losses, and grows together.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 3: SEASON DETAILS & KEY DATES ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-black mb-4">
                Spring 2026 Season
              </h2>
              <p className="font-body text-lg text-black/70 max-w-2xl mx-auto">
                18 weeks of competitive tennis from January through May
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Season Info */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
                <h3 className="font-headline text-2xl font-semibold text-black mb-6">
                  Season Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-lbta-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-lbta-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Season Duration</p>
                      <p className="text-black/70">January 12 - May 17, 2026 (18 weeks)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-lbta-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-lbta-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Age Groups</p>
                      <p className="text-black/70">10U, 12U, 14U, 16U, and 18U divisions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-lbta-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-lbta-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Practice Locations</p>
                      <p className="text-black/70">Moulton Meadows Park, Alta Laguna Park & Laguna Beach HS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Dates Table */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
                <h3 className="font-headline text-2xl font-semibold text-black mb-6">
                  Key Dates
                </h3>
                <div className="space-y-3">
                  {keyDates.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                        index === 0 ? 'bg-lbta-red/10' : 'bg-[#FAF8F3]'
                      }`}
                    >
                      <span className="font-medium text-black">{item.date}</span>
                      <span className={`text-sm ${index === 0 ? 'text-lbta-orange font-semibold' : 'text-black/70'}`}>
                        {item.event}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/book"
                    onClick={() => trackEvent('register_click', { source: 'jtt_dates' })}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-lbta-red hover:bg-lbta-orange text-white font-semibold rounded-lg transition-all duration-300 min-h-[48px]"
                  >
                    Register Before Jan 16
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 4: TEAM DIVISIONS ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-black mb-4">
                Team Divisions
              </h2>
              <p className="font-body text-lg text-black/70 max-w-2xl mx-auto">
                Age-appropriate divisions ensuring competitive and developmental balance
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {divisions.map((division) => (
                <div
                  key={division.name}
                  className="border border-black/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedDivision(
                        expandedDivision === division.name ? null : division.name
                      )
                    }
                    className="w-full flex items-center justify-between p-6 bg-[#FAF8F3] hover:bg-black/5 transition-colors"
                    aria-expanded={expandedDivision === division.name}
                    aria-controls={`division-${division.name}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-lbta-red/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-lbta-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                          <path strokeLinecap="round" strokeWidth={1.5} d="M12 3c2.5 3 2.5 7.5 0 10.5m0-10.5c-2.5 3-2.5 7.5 0 10.5M3 12c3-2.5 7.5-2.5 10.5 0m-10.5 0c3 2.5 7.5 2.5 10.5 0" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-headline text-lg font-semibold text-black">
                          {division.name}
                        </h3>
                        <p className="text-sm text-black/60">{division.ages}</p>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-black/40 transition-transform ${
                        expandedDivision === division.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedDivision === division.name && (
                    <div
                      id={`division-${division.name}`}
                      className="p-6 bg-white border-t border-black/10"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lbta-orange">●</span>
                          <span className="text-black/80">
                            <strong>Court:</strong> {division.court}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lbta-orange">●</span>
                          <span className="text-black/80">
                            <strong>Ball:</strong> {division.ball}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lbta-orange">●</span>
                          <span className="text-black/80">
                            <strong>Matches:</strong> {division.matches}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lbta-orange">●</span>
                          <span className="text-black/80">
                            <strong>Level:</strong> {division.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 5: PRACTICE SCHEDULE ===== */}
      <section className="py-20 bg-[#FAF8F3]">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-black mb-4">
                Practice Schedule
              </h2>
              <p className="font-body text-lg text-black/70 max-w-2xl mx-auto">
                Weekly training sessions designed for skill development and team bonding
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden" role="table">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-6 py-4 text-left font-headline font-semibold" scope="col">Division</th>
                    <th className="px-6 py-4 text-left font-headline font-semibold" scope="col">Days</th>
                    <th className="px-6 py-4 text-left font-headline font-semibold" scope="col">Time</th>
                    <th className="px-6 py-4 text-left font-headline font-semibold" scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {practiceSchedule.map((item, index) => (
                    <tr
                      key={item.division}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]'}
                    >
                      <td className="px-6 py-4 font-medium text-black">{item.division}</td>
                      <td className="px-6 py-4 text-black/80">{item.day}</td>
                      <td className="px-6 py-4 text-black/80">{item.time}</td>
                      <td className="px-6 py-4 text-black/80">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {practiceSchedule.map((item) => (
                <div key={item.division} className="bg-white rounded-xl p-5 shadow-sm">
                  <h4 className="font-headline font-semibold text-black mb-3">{item.division}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/60">Days:</span>
                      <span className="text-black">{item.day}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Time:</span>
                      <span className="text-black">{item.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Location:</span>
                      <span className="text-black">{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 6: SEASON PRICING ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-black mb-4">
                Season Pricing
              </h2>
              <p className="font-body text-lg text-black/70 max-w-2xl mx-auto">
                All-inclusive pricing with no hidden fees
              </p>
            </div>

            {/* Single pricing for ALL divisions */}
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-black rounded-2xl p-10 text-white">
                <div className="absolute -top-3 left-6">
                  <span className="px-4 py-1 bg-lbta-red text-black text-sm font-semibold rounded-full">
                    All Divisions
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-headline text-3xl font-bold mb-2">
                    Season Registration
                  </h3>
                  <p className="text-white/60 mb-8">2-hour practices, 3 days per week • All ages & levels</p>

                  <div className="mb-8">
                    <span className="font-headline text-5xl font-bold text-lbta-orange">$2,800</span>
                    <span className="text-white/60 ml-2">/ season</span>
                  </div>

                  <ul className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-lg mx-auto">
                    {[
                      '45 practice sessions (3x/week)',
                      'All match & tournament entries',
                      'Official LBTA team shirt',
                      'Skill assessments (pre/post)',
                      'USTA membership included',
                      '15% private lesson discount'
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-white/90">
                        <svg className="w-5 h-5 text-lbta-orange shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/book"
                    onClick={() => trackEvent('register_click', { source: 'jtt_pricing' })}
                    className="inline-flex items-center justify-center px-10 py-4 bg-lbta-red hover:bg-lbta-orange text-white font-semibold rounded-lg transition-all duration-300 min-h-[48px] text-lg"
                  >
                    Register Now
                  </Link>

                  <p className="text-white/50 text-sm mt-6">
                    Payment plans available • 2-installment or 3-installment options
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-black/60 mt-8 max-w-xl mx-auto">
              Flexible payment plans available. Contact us for sibling discounts and scholarship opportunities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 7: WHAT'S INCLUDED ===== */}
      <section className="py-24 md:py-32 bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-black mb-8">
                  The Season Includes
                </h2>
                <div className="space-y-4 font-sans text-[17px] text-black/80 leading-relaxed">
                  <p>45 practice sessions across 18 weeks</p>
                  <p>Weekend match play throughout the season</p>
                  <p>USTA membership and tournament entry fees</p>
                  <p>Team shirt and practice gear</p>
                  <p>Quarterly skill assessments</p>
                  <p>15% discount on private lessons</p>
                </div>
              </div>
              <div className="bg-white p-10 rounded-xl">
                <p className="font-sans text-[14px] uppercase tracking-wider text-black/50 mb-3">
                  Season Investment
                </p>
                <p className="font-serif text-[48px] text-black leading-none mb-4">
                  $2,800
                </p>
                <p className="font-sans text-[15px] text-black/60 mb-8">
                  All divisions · Payment plans available
                </p>
                <Link
                  href="/book"
                  onClick={() => trackEvent('register_click', { location: 'included_section' })}
                  className="block w-full text-center bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold py-4 px-8 rounded-lg transition-colors"
                >
                  Reserve Your Spot
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 8: COACHING PHILOSOPHY ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Photo */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/photos/andrew-portrait.webp"
                    alt="Andrew Mateljan, LBTA Head Coach"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-lbta-red/20 rounded-full -z-10" />
              </div>

              {/* Quote & Info */}
              <div>
                <div className="relative">
                  <svg className="absolute -top-4 -left-4 w-12 h-12 text-lbta-orange/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <blockquote className="font-headline text-2xl md:text-3xl text-black leading-relaxed mb-6 pl-8">
                    Junior Team Tennis isn't just about winning matches—it's about building character,
                    fostering teamwork, and instilling a lifelong love for the game.
                  </blockquote>
                </div>

                <div className="pl-8">
                  <p className="font-headline text-xl font-semibold text-black">
                    Andrew Mateljan
                  </p>
                  <p className="text-black/60 mb-6">
                    Head Coach & Founder, LBTA
                  </p>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-lbta-orange hover:text-lbta-orange font-medium transition-colors"
                  >
                    Meet Our Coaching Team
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 9: NEXT STEP ===== */}
      <section className="py-24 md:py-32 bg-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] text-white mb-6">
              Begin with a conversation.
            </h2>
            <p className="font-sans text-[18px] text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
              Schedule a brief assessment to find the right division for your athlete.
              No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                onClick={() => trackEvent('book_trial_click', { source: 'jtt_cta' })}
                className="bg-white text-black font-sans font-semibold py-4 px-10 rounded-lg hover:bg-white/90 transition-colors"
              >
                Schedule Assessment
              </Link>
              <Link
                href="/contact"
                onClick={() => trackEvent('contact_click', { source: 'jtt_cta' })}
                className="border border-white/30 text-white font-sans font-medium py-4 px-10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Have Questions?
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 10: SEASON GUIDE ===== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-black mb-6">
                  Complete Season Guide
                </h2>
                <p className="font-sans text-[17px] text-black/70 leading-relaxed mb-8">
                  All the details—divisions, practice schedules, match dates,
                  and policies—in one comprehensive document.
                </p>
                <a
                  href="/pdfs/junior-team-tennis-spring-2026.pdf"
                  download
                  onClick={() => trackEvent('pdf_download', { source: 'jtt_guide' })}
                  className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold py-4 px-8 rounded-lg transition-colors"
                >
                  Download PDF Guide
                </a>
              </div>
              <div className="bg-[#FAF8F3] rounded-xl overflow-hidden">
                <embed
                  src="/pdfs/junior-team-tennis-spring-2026.pdf"
                  type="application/pdf"
                  width="100%"
                  height="400"
                  className="rounded-lg"
                  title="Junior Team Tennis Spring 2026 Season Guide"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 11: TESTIMONIAL ===== */}
      <section className="py-24 md:py-32 bg-[#FAF8F3]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="font-serif text-[24px] md:text-[32px] leading-[1.5] text-black/90 italic mb-8">
              "JTT transformed my daughter's game. The team environment
              pushed her to compete at a level I didn't know she had in her."
            </p>
            <div>
              <p className="font-sans font-medium text-black">Jennifer M.</p>
              <p className="font-sans text-[14px] text-black/50">Parent of 12U player</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SECTION 12: FINAL CTA ===== */}
      <section className="py-24 md:py-32 bg-white border-t border-black/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="font-sans text-[14px] uppercase tracking-wider text-black/50 mb-6">
              Spring 2026
            </p>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] text-black mb-8">
              Ready to begin?
            </h2>
            <Link
              href="/book"
              onClick={() => trackEvent('book_trial_click', { source: 'jtt_final_cta' })}
              className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold py-4 px-10 rounded-lg transition-colors"
            >
              Schedule Assessment
            </Link>
            <p className="mt-10 font-sans text-[15px] text-black/50">
              <a href="tel:+19494943117" className="hover:text-black transition-colors">
                (949) 494-3117
              </a>
              <span className="mx-3">·</span>
              <a href="mailto:info@lagunabeachtennisacademy.com" className="hover:text-black transition-colors">
                info@lagunabeachtennisacademy.com
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
