'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import StickyCTA from '@/components/StickyCTA'
import TrustBadges from '@/components/TrustBadges'
import FAQSection from '@/components/FAQSection'
import AnimatedSection from '@/components/AnimatedSection'

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
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tennis Programs",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Junior Tennis Programs",
          "description": "Red Ball, Orange Ball, Green Ball, and competitive junior development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Adult Tennis Programs",
          "description": "Beginner, intermediate, and advanced adult tennis lessons"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "High Performance Training",
          "description": "Tournament preparation and competitive player development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cardio Tennis & LiveBall",
          "description": "High-energy fitness classes combining tennis and cardio"
        }
      }
    ]
  }
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
      setHeroParallax(window.scrollY * 0.4)
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
          style={{ 
            objectPosition: '50% 70%',
            transform: `translateY(${heroParallax}px)`
          }}
          aria-label="Laguna Beach Tennis Academy training video"
          poster="/images/hero/laguna-horizon.webp"
        >
          <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/25 to-transparent" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto w-[90%] flex flex-col justify-center min-h-[65vh] md:min-h-0">
          {/* Eyebrow */}
          <p 
            className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/80 mb-4 md:mb-6"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          >
            Laguna Beach, California
          </p>
          
          <h1 
            className="font-serif text-[36px] md:text-[72px] font-bold leading-[1.1] tracking-[-0.5px] mb-4 md:mb-6"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.45)' }}
          >
            Tennis, as it should be taught.
          </h1>
          <p 
            className="font-serif text-[20px] md:text-[32px] leading-[1.2] mb-6 md:mb-8"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.45)' }}
          >
            Movement. Discipline. Belonging.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
            <Link
              href="/book"
              className="group bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] md:text-[15px] py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] inline-flex items-center gap-2 hover:-translate-y-0.5"
            >
              Book Your Free Trial
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/programs"
              className="text-white/90 hover:text-white font-sans text-[14px] md:text-[15px] py-3 px-6 rounded-full transition-all duration-300 border border-white/30 hover:border-white/60 hover:bg-white/10"
            >
              View Programs
            </Link>
          </div>
          
          {/* Social proof under CTA */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/50 backdrop-blur-sm"
                />
              ))}
            </div>
            <p className="font-sans text-[13px] text-white/80">
              <span className="font-semibold text-white">500+</span> players trained this year
            </p>
          </div>
          
          <p 
            className="text-lbta-orange font-sans text-[13px] md:text-[14px] uppercase tracking-[2px] cursor-pointer hover:opacity-80 transition-opacity animate-bounce"
            onClick={() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ animationDuration: '2s' }}
          >
            Explore ↓
          </p>
        </div>
      </section>

      {/* TRUST BADGES - Social Proof */}
      <TrustBadges />

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
            style={{ objectPosition: '50% 35%' }}
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
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 md:auto-rows-fr">
            {[
              {
                image: '/images/philosophy/movement.webp',
                title: 'Movement',
                description: 'The foundation of repeatable success.',
                detail: 'Technical precision through biomechanics and footwork mastery.'
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
              <div 
                key={pillar.title}
                className="group cursor-default flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden mb-6 rounded-lg transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-hover">
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
                <p className="font-sans text-[16px] text-black/80 leading-[1.6] mb-2">
                  {pillar.description}
                </p>
                <p className="font-sans text-[14px] text-black/60 leading-[1.6]">
                  {pillar.detail}
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

      {/* SCENE 7.5: TESTIMONIALS - "What Our Players Say" */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-[36px] md:text-[44px] font-semibold text-black mb-4 text-center">
            What our players say.
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-black/70 mb-12 text-center max-w-2xl mx-auto">
            Real feedback from families and players who train with LBTA.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#FAF8F3] p-8 rounded-lg">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-lbta-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-sans text-[15px] text-black/80 leading-[1.7] mb-6">
                "Andrew's coaching transformed my son's game in just one season. The movement-first approach is unlike anything we've experienced. His confidence on court has skyrocketed."
              </p>
              <div>
                <p className="font-sans text-[14px] font-semibold text-black">Sarah M.</p>
                <p className="font-sans text-[13px] text-black/60">Parent, Junior Development</p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-[#FAF8F3] p-8 rounded-lg">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-lbta-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-sans text-[15px] text-black/80 leading-[1.7] mb-6">
                "After 20 years away from tennis, I was nervous to start again. The adult beginner program made me feel welcome from day one. Michelle and the team are incredible."
              </p>
              <div>
                <p className="font-sans text-[14px] font-semibold text-black">David R.</p>
                <p className="font-sans text-[13px] text-black/60">Adult Beginner Program</p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-[#FAF8F3] p-8 rounded-lg">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-lbta-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-sans text-[15px] text-black/80 leading-[1.7] mb-6">
                "The JTT program gave my daughter real match experience and taught her how to compete. She went from nervous to confident, and now loves tournament play."
              </p>
              <div>
                <p className="font-sans text-[14px] font-semibold text-black">Jennifer T.</p>
                <p className="font-sans text-[13px] text-black/60">Parent, Junior Team Tennis</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/success-stories" 
              className="inline-block font-sans text-[16px] text-lbta-orange hover:underline transition-all"
            >
              Read More Success Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

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
