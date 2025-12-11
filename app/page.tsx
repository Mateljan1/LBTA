'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
          source: 'homepage-cta',
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
      {/* SCENE 1: HERO - "The Standard" */}
      <section 
        id="hero" 
        className="relative min-h-[65vh] md:h-screen md:min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 70%' }}
          aria-label="Laguna Beach Tennis Academy training video"
          poster="/images/hero/poster.jpg"
        >
          <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-black/10" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto w-[90%]">
          <h1 
            className="font-serif text-[32px] md:text-[72px] font-bold leading-[1.1] tracking-[-0.5px] mb-4 md:mb-6"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.45)' }}
          >
            Tennis, as it should be taught.
          </h1>
          <p 
            className="font-serif text-[20px] md:text-[32px] leading-[1.2] mb-8 md:mb-12"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.45)' }}
          >
            Movement. Discipline. Belonging.
          </p>
          <p 
            className="text-lbta-orange font-sans text-[16px] uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore ↓
          </p>
        </div>
      </section>

      {/* SCENE 2: FOUNDER - "The Vision" */}
      <section 
        id="founder" 
        className="bg-[#F8E6BB] py-12 md:py-20"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left: Image */}
            <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden">
              <Image
                src="/images/founder/andrew-portrait.webp"
                alt="Andrew Mateljan, Founder & Head Coach"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 30%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Right: Story */}
            <div className="space-y-6">
              <h2 className="font-serif text-[28px] md:text-[48px] leading-[1.1] font-semibold text-black">
                Founded in Laguna Beach by Andrew Mateljan
              </h2>
              <p className="font-sans text-[16px] leading-[1.8] text-black/85">
                A lifetime in the game — from international courts to California's coast.
              </p>
              <p className="font-sans text-[16px] leading-[1.8] text-black/85">
                25 years in tennis as a top-ranked junior and international coach. 
                Years spent coaching in Spain and Croatia shaped a movement-first approach 
                grounded in clarity and accountability. Now guiding players of every level 
                toward their best version of the game.
              </p>
              <blockquote className="font-serif italic text-[24px] leading-[1.4] text-lbta-orange pt-6">
                "Movement builds mastery. Discipline builds confidence."
                <footer className="font-sans text-[16px] not-italic text-black/70 mt-2">
                  — Andrew Mateljan
                </footer>
              </blockquote>
              <Link 
                href="/about" 
                className="inline-block font-sans font-semibold text-[16px] text-lbta-red hover:underline transition-all"
              >
                Read Andrew's Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 3: RESULTS - "Results in Motion" */}
      <section 
        id="results" 
        className="relative min-h-[60vh] md:h-[80vh] md:min-h-[500px] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/results/karue-training.webp"
            alt="Karue Sell ATP training session"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40 w-full">
          <div className="max-w-2xl">
            <h2 className="font-serif text-[60px] md:text-[72px] font-bold text-white leading-[1.1] tracking-[-0.5px] mb-4">
              #858 → #258 ATP
            </h2>
            <p className="font-sans text-[18px] text-white/90 leading-[1.6] mb-3">
              Guided by structure, repetition, and trust.
            </p>
            <p className="font-sans text-[16px] text-white/80 mb-6">
              Karue Sell — ATP Tour Player<br />
              Coached by Andrew Mateljan | Laguna Beach Tennis Academy
            </p>
            <Link 
              href="/success-stories" 
              className="inline-block font-sans text-[16px] text-lbta-orange hover:underline transition-all"
            >
              Watch His Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* SCENE 4: PHILOSOPHY - "Our System" */}
      <section 
        id="philosophy" 
        className="bg-[#F8E6BB] py-12 md:py-20"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                image: '/images/philosophy/movement.webp',
                title: 'Movement',
                description: 'The foundation of repeatable success.',
              },
              {
                image: '/images/philosophy/discipline.webp',
                title: 'Discipline',
                description: 'Structure that builds confidence.',
              },
              {
                image: '/images/philosophy/belonging.webp',
                title: 'Belonging',
                description: 'A community built on respect.',
              },
            ].map((pillar, i) => (
              <div 
                key={pillar.title}
                className="group cursor-default"
              >
                <div className="relative aspect-square overflow-hidden mb-6 transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                  <Image
                    src={pillar.image}
                    alt={`${pillar.title} - ${pillar.description}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-serif text-[24px] font-semibold text-black mb-2">
                  {pillar.title}
                </h3>
                <p className="font-sans text-[16px] text-black/80 leading-[1.6]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 5: PROGRAMS - "Pathways for Every Player" */}
      <section 
        id="programs" 
        className="bg-[#FAF8F3] py-12 md:py-20"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <h2 className="font-serif text-[40px] md:text-[48px] font-semibold text-black mb-12 text-center">
            Pathways for Every Player
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {[
              {
                image: '/images/programs/juniors.webp',
                title: 'Junior Pathway',
                description: 'From red ball to college prep.',
                link: '/programs/junior',
              },
              {
                image: '/images/programs/adults.webp',
                title: 'Adult Training',
                description: 'Focused development for any level.',
                link: '/programs/adult',
              },
              {
                image: '/images/programs/private-lessons.webp',
                title: 'Private Coaching',
                description: 'Personal sessions built around your goals.',
                link: '/book',
              },
            ].map((program) => (
              <Link 
                key={program.title}
                href={program.link}
                className="group block"
              >
                <div className="relative aspect-[3/2] overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-serif text-[24px] font-semibold text-black mb-2 group-hover:text-lbta-orange transition-colors">
                  {program.title}
                </h3>
                <p className="font-sans text-[16px] text-black/70">
                  {program.description}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/programs" 
              className="inline-block font-sans text-[16px] text-lbta-orange hover:underline transition-all"
            >
              View All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* SCENE 6: DESTINATION - "Laguna Advantage" */}
      <section 
        id="destination" 
        className="relative min-h-[50vh] md:h-[70vh] md:min-h-[500px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach tennis courts with ocean view"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h2 className="font-serif text-[40px] md:text-[48px] font-semibold leading-[1.2] mb-4">
            Train where focus meets horizon.
          </h2>
          <p className="font-sans text-[18px] md:text-[20px] leading-[1.6] text-white/90">
            Laguna Beach — where performance meets perspective.
          </p>
        </div>
      </section>

      {/* SCENE 7: COMMUNITY - "Players Who Train Our Way" */}
      <section 
        id="community" 
        className="bg-[#F8E6BB]/20 py-12 md:py-20"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <h2 className="font-serif text-[40px] font-semibold text-black mb-4 text-center">
            Players who train our way.
          </h2>
          <p className="font-sans text-[18px] text-black/85 mb-12 text-center max-w-3xl mx-auto">
            From junior pathways to ATP courts, each player shares the same standard.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div 
                key={num}
                className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded"
              >
                <Image
                  src={`/images/community/community-${num}.webp`}
                  alt={`LBTA community member ${num}`}
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 20%' }}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 8: CTA - "The Invitation" */}
      <section 
        id="cta" 
        className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/cta/cta-background.webp"
            alt="Laguna Beach tennis courts at sunset"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto py-20">
          <h2 className="font-serif text-[40px] md:text-[48px] font-semibold mb-8 leading-[1.2]">
            Start training with purpose.
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-6 py-4 bg-[#F8F8F5] text-black rounded-lg font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-6 py-4 bg-[#F8F8F5] text-black rounded-lg font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-6 py-4 bg-[#F8F8F5] text-black rounded-lg font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lbta-red hover:bg-gradient-to-r hover:from-lbta-red hover:to-lbta-orange text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200 ease-out disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Claim Your Spot →'}
            </button>
          </form>
          
          <p className="font-sans text-[14px] text-white/80">
            30-Day Money-Back Guarantee · No Long-Term Commitment
          </p>
        </div>
      </section>
    </>
  )
}
