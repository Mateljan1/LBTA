'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    level: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: 'Free Trial - Homepage',
          source: 'homepage-final-cta',
        }),
      })

      if (response.ok) {
        window.location.href = '/thank-you'
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-[#E76F51] text-white py-3 text-center text-sm font-medium" role="banner" aria-label="Announcement">
        <span className="font-semibold">Winter 2026 Enrollment Opens Dec 1</span> · 24 Spots Only · <Link href="/schedules" className="underline hover:no-underline">Join Waitlist →</Link>
      </div>

      {/* Hero Video Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#FCFCF9]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover brightness-95"
          aria-label="Laguna Beach Tennis Academy training video"
        >
          <source src="/videos/LBTA HOME PAGE VIDEO 2.webm" type="video/webm" />
          <source src="/videos/vylo-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center text-[#FCFCF9] px-6 md:px-12 max-w-3xl">
          <h1 className="font-headline text-5xl md:text-6xl font-semibold mb-4 leading-tight">
            Tennis as it should be taught.
          </h1>
          <p className="font-body text-xl md:text-2xl mb-2">
            Movement. Discipline. Belonging.
          </p>
          <p className="font-body text-base md:text-lg mb-6 text-white/90">
            Train with the system trusted by pros and built for everyone.
          </p>
          <a 
            href="#trial" 
            className="inline-block bg-[#E76F51] px-8 py-3 rounded-full text-sm uppercase tracking-wide font-semibold hover:bg-[#d86247] transition-all"
          >
            Claim Your Free Trial →
          </a>
          <p className="mt-3 text-sm opacity-80">No commitment. Starts this week.</p>
        </div>
      </section>

      {/* Real Results Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center bg-[#FCFCF9] py-24 px-6 md:px-20">
        {/* Left - Narrative */}
        <div className="max-w-xl">
          <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-4">
            From recreational to remarkable — in twelve months.
          </h2>
          <p className="font-body text-lg md:text-xl text-[#134252] leading-relaxed mb-3">
            Real athletes. Real results.
          </p>
          <p className="font-body text-base md:text-lg text-[#134252] opacity-90">
            College scholarships, national titles, and pros who started here.
          </p>
        </div>

        {/* Right - Stats Grid with Karue Background */}
        <div className="relative">
          {/* Karue Background Image (Desktop Only) */}
          <div className="hidden md:block absolute inset-0 -z-10">
            <Image
              src="/photos/atp-story-karue.jpg"
              alt="Karue Sell improved ATP ranking by 600 positions in one year"
              fill
              className="object-cover brightness-95 rounded-sm"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-white/80"></div>
          </div>

          <div className="font-body text-[#134252] text-lg md:text-xl space-y-2 relative p-8 md:p-12">
            <p>20 Division I Scholarships</p>
            <p>A player who climbed <strong>600 ATP ranking spots in one year</strong></p>
            <p>100K+ players trained through Fit4Tennis</p>
            <p>Hundreds of adults rediscovering their game</p>
            <Link
              href="/success-stories"
              className="inline-block mt-6 text-[#E76F51] font-semibold hover:text-[#d86247] transition-colors"
            >
              See Their Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* The Approach */}
      <section className="bg-white py-24 px-6 md:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-4">
            Small groups. Proven systems. Real accountability.
          </h2>
          <p className="font-body text-lg md:text-xl text-[#A7A9A9] mb-12">
            Our 4-Pillar Method → Technique · Conditioning · Strategy · Mindset
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-5xl md:text-6xl font-headline text-[#E76F51] mb-3">01</div>
              <h3 className="font-body font-semibold text-[#134252] mb-2">Technique</h3>
              <p className="font-body text-sm text-[#A7A9A9]">ATP/WTA fundamentals</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-headline text-[#E76F51] mb-3">02</div>
              <h3 className="font-body font-semibold text-[#134252] mb-2">Conditioning</h3>
              <p className="font-body text-sm text-[#A7A9A9]">Tennis-specific fitness</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-headline text-[#E76F51] mb-3">03</div>
              <h3 className="font-body font-semibold text-[#134252] mb-2">Strategy</h3>
              <p className="font-body text-sm text-[#A7A9A9]">Match intelligence</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-headline text-[#E76F51] mb-3">04</div>
              <h3 className="font-body font-semibold text-[#134252] mb-2">Mindset</h3>
              <p className="font-body text-sm text-[#A7A9A9]">Mental performance</p>
            </div>
          </div>

          <Link href="/philosophy" className="text-[#E76F51] font-semibold hover:text-[#d86247]">
            See how it works →
          </Link>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="bg-[#FCFCF9] py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Junior Development */}
            <div className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="/photos/junior-program-hero.jpg"
                  alt="Junior Development"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="font-headline text-3xl font-semibold text-[#134252] mb-3">Junior</h3>
                <p className="font-body text-[#A7A9A9] mb-6">
                  Ages 3-18. From first lesson to D1 scholarship.
                </p>
                <Link href="/programs/junior" className="text-[#E76F51] font-semibold hover:text-[#d86247]">
                  Explore →
                </Link>
              </div>
            </div>

            {/* Adult Programs */}
            <div className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="/photos/adult-program.jpg"
                  alt="Adult Programs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="font-headline text-3xl font-semibold text-[#134252] mb-3">Adult</h3>
                <p className="font-body text-[#A7A9A9] mb-6">
                  All levels. Fitness, social, competitive.
                </p>
                <Link href="/programs/adult" className="text-[#E76F51] font-semibold hover:text-[#d86247]">
                  Explore →
                </Link>
              </div>
            </div>

            {/* High Performance */}
            <div className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="/photos/high-performance.jpg"
                  alt="High Performance"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="font-headline text-3xl font-semibold text-[#134252] mb-3">High Performance</h3>
                <p className="font-body text-[#A7A9A9] mb-6">
                  College recruitment. Tour preparation.
                </p>
                <Link href="/programs/high-performance" className="text-[#E76F51] font-semibold hover:text-[#d86247]">
                  Explore →
                </Link>
              </div>
            </div>

          </div>

          <p className="text-center mt-12 font-body text-[#A7A9A9]">
            Winter 2026 enrollment open. Limited spots per tier.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-white py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sm font-semibold text-[#E76F51] uppercase tracking-wide mb-4">
              Meet the Director
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-6">
              Andrew Mateljan
            </h2>
            <div className="font-body text-base md:text-lg text-[#134252] space-y-4 leading-relaxed">
              <p>
                20 years developing competitive players—junior, collegiate, and professional.
              </p>
              <p>
                Former #3 SoCal · #12 US junior · Seven years in Spain, Croatia, Norway.
              </p>
              <p>
                Guided players to Division I and professional tour success, including ATP athletes Karue Sell, Max McKennon, Ryan Seggerman, Colton Smith, and numerous WTA/ITF players.
              </p>
              <p>
                Experience at Masters 1000 Indian Wells. Founder of Fit4Tennis (100K users).
              </p>
              <p className="italic text-[#A7A9A9] border-l-4 border-[#E76F51] pl-4">
                "Great tennis isn't taught — it's developed, one disciplined day at a time."
              </p>
            </div>
            <Link 
              href="/book" 
              className="inline-block mt-8 bg-[#E76F51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d86247] transition"
            >
              Book a Trial with Andrew's Team →
            </Link>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <Image
              src="/photos/andrew-portrait.jpg"
              alt="Andrew Mateljan, Director & ATP/WTA Coach"
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Coaching Team */}
      <section className="bg-[#FCFCF9] py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-12 text-center">
            Your Development Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <Image
                  src="/photos/CQ8A0199.jpg"
                  alt="Kevin Jackson, Head Coach"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-headline text-2xl font-semibold text-[#134252] mb-2">Kevin Jackson</h3>
                <p className="font-body text-sm text-[#E76F51] mb-3 uppercase tracking-wide">College Recruitment Director</p>
                <p className="font-body text-[#A7A9A9] text-sm">
                  100% placement rate. 20+ D1 athletes.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <Image
                  src="/photos/CQ8A0490.jpg"
                  alt="Michelle Bevins, Youth Director"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-headline text-2xl font-semibold text-[#134252] mb-2">Michelle Bevins</h3>
                <p className="font-body text-sm text-[#E76F51] mb-3 uppercase tracking-wide">Youth Development</p>
                <p className="font-body text-[#A7A9A9] text-sm">
                  USTA Certified. Ages 3-12 specialist.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <Image
                  src="/photos/CQ8A0537.jpg"
                  alt="Savriyan Danilov, ATP Pro"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-headline text-2xl font-semibold text-[#134252] mb-2">Savriyan Danilov</h3>
                <p className="font-body text-sm text-[#E76F51] mb-3 uppercase tracking-wide">ATP #556</p>
                <p className="font-body text-[#A7A9A9] text-sm">
                  Mental conditioning. High performance.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/coaches" className="text-[#E76F51] font-semibold hover:text-[#d86247]">
              Meet the Team →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Video */}
      <section className="bg-white py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-sm text-[#E76F51] uppercase tracking-wide mb-4">Real Results</p>
            <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-4">
              Hear From Our Members
            </h2>
            <p className="font-body text-lg text-[#A7A9A9]">
              Adults who started as complete beginners and now play confidently every week.
            </p>
          </div>

          <div className="aspect-video overflow-hidden bg-[#134252] shadow-2xl rounded-sm">
            <iframe
              src="https://player.vimeo.com/video/1134930901?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="Member testimonials"
            />
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="bg-[#FCFCF9] py-16 px-6 md:px-20 border-y border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-body text-sm text-[#A7A9A9] mb-8">
            Trusted by pros, schools, and the City of Laguna Beach.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60 hover:opacity-80 transition">
            <Image src="/logos/city-laguna-beach.png" alt="City of Laguna Beach" width={120} height={60} className="h-12 w-auto object-contain" />
            <Image src="/logos/fit4tennis.png" alt="Fit4Tennis" width={120} height={60} className="h-12 w-auto object-contain" />
            <Image src="/logos/racketrescue.png" alt="Racket Rescue" width={120} height={60} className="h-12 w-auto object-contain" />
            <Image src="/logos/racquetiq.png" alt="RacquetIQ" width={120} height={60} className="h-12 w-auto object-contain" />
            <Image src="/logos/tennisbeast.png" alt="Tennis Beast" width={120} height={60} className="h-12 w-auto object-contain" />
            <Image src="/logos/lbhs.png" alt="Laguna Beach High School" width={120} height={60} className="h-12 w-auto object-contain" />
          </div>
          <p className="font-body text-xs text-[#A7A9A9] mt-8 italic">
            Official Partner since 2020
          </p>
        </div>
      </section>

      {/* Final CTA / Form */}
      <section id="trial" className="bg-[#FCFCF9] py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-semibold text-[#134252] mb-4">
                Begin your development.
              </h2>
              <p className="font-body text-lg text-[#134252] mb-4">
                Free trial session. No commitment. Start this week.
              </p>
              <p className="font-body text-sm text-[#E76F51] font-semibold">
                Only 24 Winter spots remaining.
              </p>
            </div>

            <div className="bg-white p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-[#134252] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#E76F51] focus:border-[#E76F51] outline-none transition font-body"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-[#134252] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#E76F51] focus:border-[#E76F51] outline-none transition font-body"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="level" className="block font-body text-sm font-medium text-[#134252] mb-2">
                    Level
                  </label>
                  <select
                    id="level"
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#E76F51] focus:border-[#E76F51] outline-none transition font-body bg-white"
                  >
                    <option value="">Select your level...</option>
                    <option value="beginner">Beginner - Never played</option>
                    <option value="intermediate">Intermediate - Can rally</option>
                    <option value="advanced">Advanced - Competitive player</option>
                    <option value="junior">Junior (ages 3-18)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E76F51] text-white font-semibold py-4 rounded-full hover:bg-[#d86247] transition disabled:opacity-50 uppercase tracking-wide text-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Claim My Free Trial →'}
                </button>

                <p className="text-xs text-center text-[#A7A9A9]">
                  Only 24 Winter spots remaining.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Block */}
      <section className="bg-[#134252] text-white py-16 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-headline text-3xl font-semibold mb-4">
            Stay Ahead of the Game
          </h3>
          <p className="font-body text-white/80 mb-8">
            Join 2,400+ players receiving weekly tips and early access to camps.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 outline-none font-body"
              required
            />
            <button
              type="submit"
              className="bg-[#E76F51] px-8 py-3 font-semibold hover:bg-[#d86247] transition uppercase tracking-wide text-sm"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
