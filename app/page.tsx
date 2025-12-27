'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import StickyCTA from '@/components/StickyCTA'
import TrustBadges from '@/components/TrustBadges'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'

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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" aria-hidden="true" />
        
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
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/book"
              className="btn-pill-primary group"
            >
              <span>Book Your Free Trial</span>
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/programs"
              className="btn-pill-secondary"
            >
              View Programs
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/40"
                />
              ))}
            </div>
            <p className="text-body-sm text-white/70">
              <span className="font-semibold text-white">500+</span> players trained this year
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
          TRUST BADGES - Social Proof
          ============================================ */}
      <TrustBadges />

      {/* ============================================
          SCENE 2: FOUNDER - "The Vision"
          ============================================ */}
      <section id="founder" className="bg-lbta-beige section-lg">
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
      <section id="philosophy" className="bg-lbta-beige section-lg">
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
      <section id="programs" className="bg-lbta-cream section-lg">
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
      <section id="community" className="bg-lbta-cream section-lg">
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
          SCENE 7.6: TEXT TESTIMONIALS - "What Our Players Say"
          ============================================ */}
      <section className="bg-white section">
        <div className="container-lbta max-w-5xl">
          <AnimatedSection className="text-center mb-12">
            <span className="text-eyebrow mb-4 block">Testimonials</span>
            <h2 className="text-headline mb-4">What our players say.</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-body font-semibold">5.0</span>
              <span className="text-body-sm text-lbta-slate">from 47 Google reviews</span>
            </div>
            <p className="text-subhead max-w-xl mx-auto">
              Real transformations from families and players who train with LBTA.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "My son went from unranked to sectional top 20 in one season. Andrew's movement-first approach fixed technique issues three other coaches couldn't.",
                name: "Sarah Mitchell",
                role: "Parent, Junior Development",
                outcome: "Son: Unranked → Top 20 Sectional",
                image: "/images/community/community-3.webp"
              },
              {
                quote: "At 52, I picked up tennis for the first time. 6 months later, I'm playing 4.0 USTA leagues. The adult program is genuinely life-changing.",
                name: "David Richardson",
                role: "Adult Beginner Program",
                outcome: "Beginner → 4.0 USTA in 6 months",
                image: "/images/community/community-1.webp"
              },
              {
                quote: "Emma went from crying before matches to winning her division. The mental coaching here is as strong as the technical training.",
                name: "Jennifer Torres",
                role: "Parent, Junior Team Tennis",
                outcome: "Daughter: Division Champion",
                image: "/images/community/community-5.webp"
              },
            ].map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="card-flat p-8 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Outcome Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full mb-4 w-fit">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-ui-sm font-semibold text-lbta-charcoal">{testimonial.outcome}</span>
                  </div>
                  
                  <p className="text-body text-lbta-charcoal mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lbta-sand overflow-hidden relative">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="text-ui font-semibold text-lbta-black">{testimonial.name}</p>
                      <p className="text-ui-sm text-lbta-slate">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection className="text-center mt-12">
            <Link href="/success-stories" className="btn-ghost">
              <span>Read More Success Stories</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

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
