import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ScheduleTable from '@/components/ScheduleTable'
import scheduleData from '@/data/schedule-2026.json'

export const metadata: Metadata = {
  title: '2026 Schedule | Laguna Beach Tennis Academy',
  description: 'View the complete 2026 tennis schedule for Laguna Beach Tennis Academy. Quarterly sessions, holiday camps, and Junior Team Tennis dates.',
  keywords: 'tennis schedule Laguna Beach, 2026 tennis lessons, tennis camps Orange County, JTT schedule',
  openGraph: {
    title: '2026 Schedule | Laguna Beach Tennis Academy',
    description: 'Complete 2026 tennis schedule with quarterly sessions, camps, and JTT dates.',
    type: 'website',
    images: ['/images/og-schedule.jpg'],
  },
}

// Event Schema for SEO
function EventSchema() {
  const events = scheduleData.camps.map(camp => ({
    "@type": "Event",
    "name": `LBTA ${camp.name}`,
    "description": camp.description,
    "startDate": `2026-${camp.dates.split('–')[0].trim()}`,
    "location": {
      "@type": "Place",
      "name": camp.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Laguna Beach",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Laguna Beach Tennis Academy",
      "url": "https://lagunabeachtennisacademy.com"
    }
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": events
        })
      }}
    />
  )
}

export default function SchedulePage() {
  return (
    <>
      <EventSchema />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy courts at sunset"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 60%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 py-20 max-w-4xl mx-auto">
          <p className="font-sans text-xs tracking-[3px] uppercase text-lbta-orange mb-4">
            Plan Your Year
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 text-shadow">
            2026 Schedule
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Four seasons of structured training, holiday camps, and competitive league play.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-white text-black font-sans text-sm font-medium tracking-[2px] uppercase min-h-[48px] px-8 py-4 rounded-[2px] transition-all duration-300 hover:bg-lbta-orange hover:text-white"
            >
              View Pricing →
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center border-2 border-white text-white font-sans text-sm font-medium tracking-[2px] uppercase min-h-[48px] px-8 py-4 rounded-[2px] transition-all duration-300 hover:bg-white/10"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-black text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-lbta-orange">4</p>
              <p className="font-sans text-xs tracking-[2px] uppercase text-white/70 mt-1">Quarters</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-lbta-orange">6</p>
              <p className="font-sans text-xs tracking-[2px] uppercase text-white/70 mt-1">Holiday Camps</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-lbta-orange">3</p>
              <p className="font-sans text-xs tracking-[2px] uppercase text-white/70 mt-1">JTT Seasons</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-lbta-orange">50</p>
              <p className="font-sans text-xs tracking-[2px] uppercase text-white/70 mt-1">Weeks of Tennis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Schedule Content */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScheduleTable data={scheduleData} />
        </div>
      </section>

      {/* Registration CTA */}
      <section className="bg-lbta-beige py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-sans text-xs tracking-[3px] uppercase text-lbta-orange mb-4">
            Winter 2026 Registration Open
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-black mb-6">
            Ready to Start Training?
          </h2>
          <p className="font-sans text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Early bird pricing available through December 20. Save $50 on full-quarter enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-lbta-orange"
            >
              Book Trial
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-black text-black font-sans text-sm font-medium tracking-[2px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-black hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-black mb-4">
            Questions About the Schedule?
          </h2>
          <p className="font-sans text-base text-gray-600 mb-6">
            Our team is here to help you find the right program and timing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:9494646645"
              className="font-sans text-lg text-black hover:text-lbta-orange transition-colors"
            >
              (949) 464-6645
            </a>
            <span className="hidden sm:block text-gray-300">|</span>
            <a
              href="mailto:support@lagunabeachtennisacademy.com"
              className="font-sans text-lg text-black hover:text-lbta-orange transition-colors"
            >
              support@lagunabeachtennisacademy.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

