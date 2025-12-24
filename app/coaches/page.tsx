'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import Script from 'next/script'

export default function CoachesPage() {
  // Schema markup for coaches
  const coachesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Person",
        "position": 1,
        "name": "Andrew Mateljan",
        "jobTitle": "Director & Head Coach",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "ATP/WTA Tour Coach with 20+ years experience. Former #3 SoCal and #12 nationally ranked junior.",
        "image": "https://lagunabeachtennisacademy.com/images/founder/andrew-portrait.webp"
      },
      {
        "@type": "Person",
        "position": 2,
        "name": "Kevin Jackson",
        "jobTitle": "Head Coach & Performance Director",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "Performance architect with 25+ years experience, 3,000+ athletes trained worldwide.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/kevin.webp"
      },
      {
        "@type": "Person",
        "position": 3,
        "name": "Michelle Bevins",
        "jobTitle": "Youth Director",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "Youth Development Specialist with Red/Orange Ball Certification and 95% parent satisfaction.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/michelle.webp"
      },
      {
        "@type": "Person",
        "position": 4,
        "name": "Savriyan Danilov",
        "jobTitle": "High Performance Coach",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "ATP Professional #556 with 8 years tour experience.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/savriyan.webp"
      },
      {
        "@type": "Person",
        "position": 5,
        "name": "Andy Wu",
        "jobTitle": "Program Coach",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "USPTA Certified with EdD in Educational Leadership.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/andy.webp"
      }
    ]
  }
  
  const [heroParallax, setHeroParallax] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setHeroParallax(window.scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const leadCoaches = [
    {
      name: "Andrew Mateljan",
      title: "Director & Head Coach",
      specialization: "ATP/WTA Tour Coach",
      bio: "Twenty years developing competitive players from junior foundations to professional tour. Former #3 SoCal and #12 nationally ranked junior. Seven years coaching internationally across Spain, Croatia, and Norway shaped a movement-first approach grounded in clarity and accountability. Currently coaches ATP #262 Karue Sell. Training history includes Max McKennon (ATP #458), Ryan Seggerman (ATP #63 Doubles), with Masters 1000 experience at Indian Wells. Founder of Fit4Tennis platform serving 100K+ users worldwide.",
      quote: "Structure creates confidence.",
      credentials: ["Former Top Junior", "ATP/WTA Tour Coach", "20+ D1 Placements"],
      image: "/images/founder/andrew-portrait.webp",
      imagePosition: "50% 25%",
    },
    {
      name: "Kevin Jackson",
      title: "Head Coach & Performance Director",
      specialization: "Player Development · Global Systems Leadership",
      bio: "Performance architect with more than twenty-five years of experience in global player development, system design, and athlete management. He has coached and guided over 3,000 athletes worldwide — developing national champions, international juniors, and professional players across four continents. Career highlights include 550+ tournament victories, 20+ Division I scholarship athletes, and creating development systems combining data, psychology, and on-court performance.",
      quote: "Excellence through preparation.",
      credentials: ["25+ Years Experience", "3,000+ Athletes Trained", "Global Systems Leader"],
      image: "/images/coaches/kevin.webp",
      imagePosition: "50% 35%",
    }
  ]
  
  const programCoaches = [
    {
      name: "Michelle Bevins",
      title: "Youth Director",
      specialization: "Junior Development (Ages 3-12)",
      bio: "Michelle brings engaging, patient coaching that builds confidence and genuine love for tennis while developing proper technique. Specializing in Red Ball and Orange Ball certification, Michelle understands how to meet each child where they are and guide them toward their potential.",
      quote: "Every child can shine.",
      credentials: ["Youth Development Specialist", "Red/Orange Ball Certified"],
      image: "/images/coaches/michelle.webp",
      imagePosition: "50% 30%",
    },
    {
      name: "Savriyan Danilov",
      title: "High Performance Coach",
      specialization: "ATP Pro #556",
      bio: "Professional tour experience brings real-world competitive insights to high-performance training. Eight years of ATP tour competition inform every session — from point construction to mental toughness under pressure. Players gain tactical sophistication and the competitive mindset needed for tournament success.",
      quote: "Champions train differently.",
      credentials: ["ATP Professional", "8 Years Tour Experience"],
      image: "/images/coaches/savriyan.webp",
      imagePosition: "50% 25%",
    },
    {
      name: "Andy Wu",
      title: "Program Coach",
      specialization: "Junior & Adult Development",
      bio: "Solid fundamentals and progressive skill development define Andy's coaching philosophy. With USPTA certification and an EdD in Educational Leadership, Andy combines technical expertise with deep understanding of how people learn and grow. His patient, systematic approach helps beginners feel comfortable while challenging advanced players.",
      quote: "Fundamentals first. Always.",
      credentials: ["USPTA Certified", "EdD Educational Leadership"],
      image: "/images/coaches/andy.webp",
      imagePosition: "50% 30%",
    }
  ]

  return (
    <>
      {/* Schema Markup */}
      <Script
        id="coaches-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachesSchema) }}
      />
      
      {/* HERO SECTION - Minimal, Typography-Driven */}
      <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy coaches and players training together"
            fill
            priority
            className="object-cover"
            quality={90}
            style={{ 
              objectPosition: '50% 40%',
              transform: `translateY(${heroParallax}px)`
            }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pb-16 md:pb-24">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/70 uppercase tracking-[0.2em] mb-4">
            Our Team
          </p>
          <h1 className="font-serif text-[42px] md:text-[72px] font-medium text-white leading-[1.05] mb-6 tracking-[-0.02em]">
            The Coaches
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/85 max-w-[600px] leading-[1.7]">
            ATP/WTA-trained coaches who understand that tennis teaches more than technique. 
            Movement. Discipline. Belonging.
          </p>
        </div>
      </section>

      {/* FOUNDER SECTION - Editorial Feature */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src="/images/founder/andrew-portrait.webp"
                  alt="Andrew Mateljan, Founder & Head Coach at Laguna Beach Tennis Academy"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 25%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                  priority
                />
              </div>
              {/* Quote overlay */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 md:p-8 shadow-lg max-w-[280px] md:max-w-[320px]">
                <p className="font-serif text-[18px] md:text-[20px] text-[#1a1a1a] italic leading-[1.5] mb-3">
                  &ldquo;Structure creates confidence, and confidence creates champions.&rdquo;
                </p>
                <p className="font-sans text-[12px] text-[#888] uppercase tracking-[0.1em]">
                  — Andrew Mateljan
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:pt-8">
              <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
                Founder & Director
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] font-medium text-[#1a1a1a] mb-2 tracking-[-0.02em]">
                Andrew Mateljan
              </h2>
              <p className="font-sans text-[14px] text-[#666] mb-8">
                ATP/WTA Tour Coach · 20+ Years Experience
              </p>
              
              <div className="space-y-5 mb-10">
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Twenty years developing competitive players from junior foundations to professional tour. 
                  Former #3 SoCal and #12 nationally ranked junior.
                </p>
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Seven years coaching internationally across Spain, Croatia, and Norway shaped a 
                  movement-first approach grounded in clarity and accountability.
                </p>
                <p className="font-sans text-[16px] text-[#444] leading-[1.8]">
                  Currently coaches ATP #262 Karue Sell. Training history includes Max McKennon (ATP #458), 
                  Ryan Seggerman (ATP #63 Doubles), with Masters 1000 experience at Indian Wells.
                </p>
              </div>
              
              {/* Credentials */}
              <div className="flex flex-wrap gap-3">
                {["Former Top Junior", "ATP/WTA Tour Coach", "20+ D1 Placements", "100K+ Fit4Tennis Users"].map((cred) => (
                  <span 
                    key={cred}
                    className="font-sans text-[12px] text-[#666] px-4 py-2 bg-[#f8f8f8] rounded-full"
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COACHING TEAM - Clean Grid */}
      <section className="bg-[#fafafa] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="mb-16 md:mb-20">
            <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
              Coaching Team
            </p>
            <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
              Meet the Team
            </h2>
          </div>
          
          {/* Lead Coach - Kevin */}
          <div className="mb-16 md:mb-20">
            <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 md:gap-12 items-start bg-white rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px]">
                <Image
                  src="/images/coaches/kevin.webp"
                  alt="Kevin Jackson, Head Coach & Performance Director"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 35%' }}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={90}
                />
              </div>
              <div className="p-8 md:p-12 lg:py-16">
                <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-3">
                  Head Coach & Performance Director
                </p>
                <h3 className="font-serif text-[28px] md:text-[36px] font-medium text-[#1a1a1a] mb-2 tracking-[-0.01em]">
                  Kevin Jackson
                </h3>
                <p className="font-sans text-[14px] text-[#666] mb-6">
                  Player Development · Global Systems Leadership
                </p>
                <p className="font-sans text-[15px] text-[#444] leading-[1.8] mb-6">
                  Performance architect with more than twenty-five years of experience in global player development, 
                  system design, and athlete management. He has coached and guided over 3,000 athletes worldwide — 
                  developing national champions, international juniors, and professional players across four continents.
                </p>
                <p className="font-serif text-[18px] text-[#1a1a1a] italic mb-6">
                  &ldquo;Excellence through preparation.&rdquo;
                </p>
                <div className="flex flex-wrap gap-2">
                  {["25+ Years Experience", "3,000+ Athletes", "550+ Tournament Wins", "20+ D1 Athletes"].map((cred) => (
                    <span 
                      key={cred}
                      className="font-sans text-[11px] text-[#666] px-3 py-1.5 bg-[#f5f5f5] rounded-full"
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Program Coaches Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {programCoaches.map((coach) => (
              <div 
                key={coach.name}
                className="bg-white rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: coach.imagePosition }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                  />
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-serif text-[16px] text-white italic">
                      &ldquo;{coach.quote}&rdquo;
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.1em] mb-2">
                    {coach.title}
                  </p>
                  <h3 className="font-serif text-[22px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.01em]">
                    {coach.name}
                  </h3>
                  <p className="font-sans text-[13px] text-[#666] mb-4">
                    {coach.specialization}
                  </p>
                  <p className="font-sans text-[14px] text-[#555] leading-[1.7] mb-4">
                    {coach.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coach.credentials.map((cred) => (
                      <span 
                        key={cred}
                        className="font-sans text-[10px] text-[#777] px-2.5 py-1 bg-[#f5f5f5] rounded-full"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Minimal */}
      <section className="bg-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-white mb-6 tracking-[-0.02em]">
            Train With Us
          </h2>
          <p className="font-sans text-[16px] text-white/70 mb-10 leading-[1.7] max-w-[500px] mx-auto">
            Experience coaching that develops more than your game. 
            Book a trial session to meet our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-[#1a1a1a] font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-lg hover:bg-white/90 transition-all min-h-[52px]"
            >
              Book Trial Session
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center border border-white/30 text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-lg hover:bg-white/10 transition-all min-h-[52px]"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
