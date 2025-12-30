'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import StickyCTA from '@/components/StickyCTA'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import PressBanner from '@/components/PressBanner'

// LocalBusiness Schema for SEO
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Laguna Beach Tennis Academy",
  "alternateName": "LBTA",
  "description": "Premier tennis academy in Laguna Beach offering junior programs, adult lessons, high-performance training, and fitness classes. Movement-first coaching philosophy.",
  "url": "https://lagunabeachtennisacademy.com",
  "telephone": "+1-949-464-6645",
  "email": "support@lagunabeachtennisacademy.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Moulton Meadows Park, 1098 Balboa Ave",
    "addressLocality": "Laguna Beach",
    "addressRegion": "CA",
    "postalCode": "92651",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.5427,
    "longitude": -117.7854
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",
  "image": "https://lagunabeachtennisacademy.com/images/hero/laguna-horizon.webp",
  "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png",
  "sameAs": [
    "https://www.instagram.com/lagunabeachtennisacademy",
    "https://www.facebook.com/lagunabeachtennisacademy"
  ],
  "founder": {
    "@type": "Person",
    "name": "Andrew Mateljan",
    "jobTitle": "Director & Head Coach"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "47"
  }
}

// Intersection Observer hook for scroll animations
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, rootMargin: '-50px', ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number 
}) {
  const { ref, isInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-luxury ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [heroParallax, setHeroParallax] = useState(0)
  
  // Parallax effect on hero
  useEffect(() => {
    const handleScroll = () => {
      setHeroParallax(window.scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      {/* LocalBusiness Schema for SEO */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {/* ============================================
          SCENE 1: HERO - "The Standard"
          ============================================ */}
      <section 
        id="hero" 
        className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            objectPosition: '50% 70%',
            transform: `translateY(${heroParallax}px) scale(1.1)`
          }}
          aria-label="Laguna Beach Tennis Academy training video"
          poster="/images/hero/laguna-horizon.webp"
        >
          <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
        </video>
        
        {/* Gradient Overlay - Enhanced for WCAG AAA contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" aria-hidden="true" />
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <p className="text-eyebrow text-white/70 mb-6 text-shadow-subtle">
            Laguna Beach, California
          </p>
          
          {/* Main Headline - Authentic Value Proposition */}
          <h1 className="font-serif text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] mb-6 text-shadow-hero">
            Tennis, as it should<br className="hidden sm:block" /> be taught.
          </h1>
          
          {/* Subheadline - Transformation Promise */}
          <p className="font-serif text-[clamp(1.25rem,3vw,1.75rem)] text-white/90 mb-10 text-shadow-subtle">
            Movement. Discipline. Belonging.
          </p>
          
          {/* Single CTA - Clean & Confident */}
          <div className="flex flex-col items-center gap-8">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded-none hover:bg-white/90 transition-all duration-300"
            >
              Book a Trial
            </Link>
            
            {/* Subtle Social Proof - Editorial Style */}
            <p className="font-sans text-[13px] text-white/60 tracking-wide">
              5.0 ★ on Google · 500+ players trained since 2018
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator - Subtle */}
        <button 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 hover:text-white/80 transition-colors duration-500"
          onClick={() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to content"
        >
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ animationDuration: '2.5s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* ============================================
          SCENE 2: FOUNDER - "The Vision"
          ============================================ */}
      <section id="founder" className="bg-[#FAFAF9] section-lg">
        <div className="container-lbta">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <AnimatedSection>
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-subtle">
                <Image
                  src="/images/founder/andrew-portrait.webp"
                  alt="Andrew Mateljan, Founder & Head Coach"
                  fill
                  priority
                  className="object-cover"
                  style={{ objectPosition: '50% 30%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </AnimatedSection>
            
            {/* Content */}
            <div className="lg:py-8">
              <AnimatedSection delay={100}>
                <span className="text-eyebrow mb-4 block">Our Founder</span>
              </AnimatedSection>
              
              <AnimatedSection delay={200}>
                <h2 className="text-headline mb-6">
                  Founded in Laguna Beach by Andrew Mateljan
                </h2>
              </AnimatedSection>
              
              <AnimatedSection delay={300}>
                <p className="text-subhead mb-6">
                  A lifetime in the game — from international courts to California's coast.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={400}>
                <p className="text-body text-lbta-slate mb-8">
                  25 years in tennis as a top-ranked junior and international coach. 
                  Years spent coaching in Spain and Croatia shaped a movement-first approach 
                  grounded in clarity and accountability. Now guiding players of every level 
                  toward their best version of the game.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={500}>
                <blockquote className="border-l-2 border-black/30 pl-6 mb-8">
                  <p className="font-serif text-[1.5rem] italic text-lbta-charcoal leading-relaxed mb-3">
                    "Structure creates confidence. Confidence creates results."
                  </p>
                  <footer className="text-body-sm text-lbta-slate">
                    — Andrew Mateljan
                  </footer>
                </blockquote>
              </AnimatedSection>
              
              <AnimatedSection delay={600}>
                <Link href="/about" className="btn-ghost">
                  <span>Read Andrew's Story</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRESS/CREDENTIALS BANNER - Social Proof
          ============================================ */}
      <PressBanner />

      {/* ============================================
          SCENE 3: RESULTS - "Results in Motion"
          ============================================ */}
      <section id="results" className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/results/karue-training.webp"
            alt="Karue Sell ATP training session"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 35%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 container-lbta">
          <div className="max-w-xl">
            <AnimatedSection>
              <span className="text-eyebrow text-black mb-4 block">Player Success</span>
            </AnimatedSection>
            
            <AnimatedSection delay={100}>
              <h2 className="font-serif text-[clamp(3rem,8vw,5rem)] font-bold text-white leading-[1] tracking-[-0.02em] mb-6">
                #858 → #258
                <span className="block text-[0.5em] font-normal text-white/70 mt-2">ATP World Ranking</span>
              </h2>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <p className="text-body-lg text-white/80 mb-2">
                Guided by structure, repetition, and trust.
              </p>
              <p className="text-body text-white/60 mb-8">
                Karue Sell — ATP Tour Player<br />
                Coached by Andrew Mateljan
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <Link href="/success-stories" className="btn-ghost text-white/80 hover:text-white">
                <span>Watch His Journey</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================
          SCENE 4: PHILOSOPHY - "Our System"
          ============================================ */}
      <section id="philosophy" className="bg-[#FAFAF9] section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">Our Philosophy</span>
            <h2 className="text-headline">The Three Pillars</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                image: '/images/philosophy/movement.webp',
                title: 'Movement',
                description: 'The foundation of repeatable success.',
                detail: 'Technical precision through biomechanics and footwork fundamentals.'
              },
              {
                image: '/images/philosophy/discipline.webp',
                title: 'Discipline',
                description: 'Structure that builds confidence.',
                detail: 'Consistent practice routines create lasting mental toughness.'
              },
              {
                image: '/images/philosophy/belonging.webp',
                title: 'Belonging',
                description: 'A community built on respect.',
                detail: 'Players support each other through wins, losses, and growth.'
              },
            ].map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 150}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-subtle mb-6">
                    <Image
                      src={pillar.image}
                      alt={`${pillar.title} - ${pillar.description}`}
                      fill
                      className="object-cover image-zoom"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={90}
                    />
                  </div>
                  <h3 className="font-serif text-headline-sm mb-3 group-hover:text-black/70 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-body text-lbta-charcoal mb-2">
                    {pillar.description}
                  </p>
                  <p className="text-body-sm text-lbta-slate">
                    {pillar.detail}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SCENE 5: PROGRAMS - "Pathways for Every Player"
          ============================================ */}
      <section id="programs" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">Our Programs</span>
            <h2 className="text-headline mb-4">Pathways for Every Player</h2>
            <p className="text-subhead max-w-2xl mx-auto">
              From first serves to tournament victories, we have a program for you.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-12">
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
            ].map((program, i) => (
              <AnimatedSection key={program.title} delay={i * 150}>
                <Link href={program.link} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-subtle mb-5">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover image-zoom"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={90}
                    />
                  </div>
                  <h3 className="font-serif text-headline-sm mb-2 group-hover:text-black/70 transition-colors duration-300">
                    {program.title}
                  </h3>
                  <p className="text-body text-lbta-slate">
                    {program.description}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection className="text-center">
            <Link href="/programs" className="btn-secondary">
              <span>View All Programs</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================
          SCENE 6: DESTINATION - "Laguna Advantage"
          ============================================ */}
      <section id="destination" className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach tennis courts with ocean view"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.2] mb-4 text-shadow-hero">
              Train where focus meets horizon.
            </h2>
            <p className="text-body-lg text-white/80 text-shadow-subtle">
              Laguna Beach — where performance meets perspective.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================
          SCENE 7: COMMUNITY - "Players Who Train Our Way"
          ============================================ */}
      <section id="community" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <span className="text-eyebrow mb-4 block">Our Community</span>
            <h2 className="text-headline mb-4">Players who train our way.</h2>
            <p className="text-subhead max-w-2xl mx-auto">
              From junior pathways to ATP courts, each player shares the same standard.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((num, i) => (
              <AnimatedSection key={num} delay={i * 100}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-subtle">
                  <Image
                    src={`/images/community/community-${num}.webp`}
                    alt={`LBTA community member ${num}`}
                    fill
                    className="object-cover image-zoom"
                    style={{ objectPosition: '50% 20%' }}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    quality={90}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SCENE 7.5: VIDEO TESTIMONIALS
          ============================================ */}
      <VideoTestimonials />

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <FAQSection />

      {/* ============================================
          SCENE 8: CTA - "The Invitation"
          ============================================ */}
      <section id="cta" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cta/cta-background.webp"
            alt="Laguna Beach tennis courts at sunset"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-lg mx-auto py-20">
          <AnimatedSection>
            <span className="text-eyebrow text-black mb-4 block">Get Started</span>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <h2 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-semibold mb-8 leading-[1.2] text-shadow-hero">
              Start training with purpose.
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-dark"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-dark"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="input-dark"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-accent w-full"
              >
                {isSubmitting ? 'Sending...' : 'Claim Your Spot'}
              </button>
            </form>
          </AnimatedSection>
          
          <AnimatedSection delay={300}>
            <p className="text-body-sm text-white/60">
              30-Day Money-Back Guarantee · No Long-Term Commitment
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
