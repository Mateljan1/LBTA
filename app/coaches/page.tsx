'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import Script from 'next/script'
import DarkSection from '@/components/ui/DarkSection'
import HorizonDivider from '@/components/ui/HorizonDivider'

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
        "name": "Robert LeBuhn",
        "jobTitle": "Director of Tennis Operations",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "USPTR-certified professional with 25+ years developing players from junior foundations to collegiate competition. NCAA D1 at Lafayette College.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/robert.webp"
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
        "description": "Youth Development Specialist with Red/Orange Ball Certification.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/michelle.webp"
      },
      {
        "@type": "Person",
        "position": 4,
        "name": "Peter DeFrantz",
        "jobTitle": "Senior Coach",
        "worksFor": {
          "@type": "SportsOrganization",
          "name": "Laguna Beach Tennis Academy"
        },
        "description": "Dual USPTA and PTR certified professional with 8+ years coaching in Southern California. Ranked #1 in SoCal college tennis.",
        "image": "https://lagunabeachtennisacademy.com/images/coaches/peter.webp"
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
      name: "Robert LeBuhn",
      title: "Director of Tennis Operations",
      specialization: "Director of Tennis Operations · USPTR Certified",
      bio: "Twenty-five years developing players from junior foundations to collegiate competition. USPTR-certified professional who trained at the Harry Hopman Academy and competed as a Top 20 USTA Eastern junior and 1983 New Jersey State Singles Champion. Played NCAA Division I tennis at Lafayette College. Multiple Coach of the Year honoree across New Jersey, Union County, Somerset County, and San Diego CIF. Certified in Adaptive Tennis, Cardio Tennis, and CPR/AED.",
      quote: "Development never stops.",
      credentials: ["USPTR Certified", "25+ Years Experience", "NCAA D1 Lafayette", "Multiple Coach of Year"],
      image: "/images/coaches/robert.webp",
      imagePosition: "50% 30%",
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
      availability: "On leave — may return Spring 2026",
    },
    {
      name: "Peter DeFrantz",
      title: "Senior Coach",
      specialization: "USPTA & PTR Certified · College Tennis",
      bio: "Dual USPTA and PTR certified professional with eight years of coaching experience in Southern California. Competed at Mt. San Jacinto College, ranked number one in Southern California and number two in California. Progressive teaching approach focused on clear communication, player development, and building confidence through structured fundamentals and fitness.",
      quote: "Build the player, not just the game.",
      credentials: ["USPTA & PTR Certified", "8+ Years Coaching", "#1 SoCal College Tennis"],
      image: "/images/coaches/peter.webp",
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
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/85 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pb-16 md:pb-24">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/70 uppercase tracking-[0.2em] mb-4">
            Our Team
          </p>
          <h1 className="font-headline text-[42px] md:text-[72px] font-medium text-white leading-[1.05] mb-6 tracking-[-0.02em]">
            The Coaches
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/85 max-w-[600px] leading-[1.7]">
            ATP/WTA-trained coaches who understand that tennis teaches more than technique. 
            Movement. Craft. Community.
          </p>
        </div>
      </section>

      <HorizonDivider />
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
                />
              </div>
              {/* Quote overlay */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 md:p-8 shadow-lg max-w-[280px] md:max-w-[320px]">
                <p className="font-headline text-[18px] md:text-[20px] text-brand-pacific-dusk italic leading-[1.5] mb-3">
                  &ldquo;Structure creates confidence, and confidence creates champions.&rdquo;
                </p>
                <p className="font-sans text-[12px] text-brand-pacific-dusk/60 uppercase tracking-[0.1em]">
                  — Andrew Mateljan
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:pt-8">
              <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-4">
                Founder & Director
              </p>
              <h2 className="font-headline text-[36px] md:text-[48px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em]">
                Andrew Mateljan
              </h2>
              <p className="font-sans text-[14px] text-lbta-slate mb-8">
                ATP/WTA Tour Coach · 20+ Years Experience
              </p>
              
              <div className="space-y-5 mb-10">
                <p className="font-sans text-[16px] text-brand-pacific-dusk leading-[1.8]">
                  Twenty years developing competitive players from junior foundations to professional tour. 
                  Former #3 SoCal and #12 nationally ranked junior.
                </p>
                <p className="font-sans text-[16px] text-brand-pacific-dusk leading-[1.8]">
                  Seven years coaching internationally across Spain, Croatia, and Norway shaped a 
                  movement-first approach grounded in clarity and accountability.
                </p>
                <p className="font-sans text-[16px] text-brand-pacific-dusk leading-[1.8]">
                  Currently coaches ATP #262 Karue Sell. Training history includes Max McKennon (ATP #458), 
                  Ryan Seggerman (ATP #63 Doubles), with Masters 1000 experience at Indian Wells.
                </p>
              </div>
              
              {/* Credentials */}
              <div className="flex flex-wrap gap-3">
                {["Former Top Junior", "ATP/WTA Tour Coach", "20+ D1 Placements", "100K+ Fit4Tennis Users"].map((cred) => (
                  <span 
                    key={cred}
                    className="font-sans text-[12px] text-lbta-slate px-4 py-2 bg-brand-sandstone rounded-full"
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
      <section className="bg-brand-sandstone py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="mb-16 md:mb-20">
            <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-4">
              Coaching Team
            </p>
            <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk tracking-[-0.02em]">
              Meet the Team
            </h2>
          </div>
          
          {/* Associate Head Coach - Robert */}
          <div className="mb-16 md:mb-20">
            <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 md:gap-12 items-start bg-white rounded-lg overflow-hidden">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px]">
                <Image
                  src="/images/coaches/robert.webp"
                  alt="Robert LeBuhn, Director of Tennis Operations at Laguna Beach Tennis Academy"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 30%' }}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={90}
                />
              </div>
              <div className="p-8 md:p-12 lg:py-16">
                <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-3">
                  Director of Tennis Operations
                </p>
                <h3 className="font-headline text-[28px] md:text-[36px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.01em]">
                  Robert LeBuhn
                </h3>
                <p className="font-sans text-[14px] text-lbta-slate mb-6">
                  Director of Tennis Operations · USPTR Certified
                </p>
                <p className="font-sans text-[15px] text-brand-pacific-dusk leading-[1.8] mb-6">
                  Twenty-five years developing players from junior foundations to collegiate competition. 
                  USPTR-certified professional who trained at the Harry Hopman Academy and competed as a 
                  Top 20 USTA Eastern junior and 1983 New Jersey State Singles Champion. Played NCAA Division I 
                  tennis at Lafayette College. Multiple Coach of the Year honoree across New Jersey, Union County, 
                  Somerset County, and San Diego CIF. Certified in Adaptive Tennis, Cardio Tennis, and CPR/AED.
                </p>
                <p className="font-headline text-[18px] text-brand-pacific-dusk italic mb-6">
                  &ldquo;Development never stops.&rdquo;
                </p>
                <div className="flex flex-wrap gap-2">
                  {["USPTR Certified", "25+ Years Experience", "NCAA D1 Lafayette", "Multiple Coach of Year"].map((cred) => (
                    <span 
                      key={cred}
                      className="font-sans text-[11px] text-lbta-slate px-3 py-1.5 bg-brand-sandstone rounded-full"
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Program Coaches Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[960px]">
            {programCoaches.map((coach) => (
              <div 
                key={coach.name}
                className="bg-white rounded-lg overflow-hidden group"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: coach.imagePosition }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-headline text-[16px] text-white italic">
                      &ldquo;{coach.quote}&rdquo;
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.1em] mb-2">
                    {coach.title}
                  </p>
                  <h3 className="font-headline text-[22px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.01em]">
                    {coach.name}
                  </h3>
                  <p className="font-sans text-[13px] text-lbta-slate mb-4">
                    {coach.specialization}
                  </p>
                  {'availability' in coach && (
                    <p className="font-sans text-[12px] text-brand-pacific-dusk/50 italic mb-4">
                      {(coach as { availability: string }).availability}
                    </p>
                  )}
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/80 leading-[1.7] mb-4">
                    {coach.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coach.credentials.map((cred) => (
                      <span 
                        key={cred}
                        className="font-sans text-[10px] text-lbta-slate px-2.5 py-1 bg-brand-sandstone rounded-full"
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

      <HorizonDivider />
      {/* CTA SECTION */}
      <DarkSection className="py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-sandstone mb-6 tracking-[-0.02em]">
            Train With Us
          </h2>
          <p className="font-sans text-[16px] text-white/85 mb-10 leading-[1.7] max-w-[500px] mx-auto">
            Experience coaching that develops more than your game. 
            Book a trial session to meet our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-[2px] hover:bg-gray-800 hover:-translate-y-0.5 transition-all min-h-[52px] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              Book Trial Session
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center border border-white/40 text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 px-8 rounded-[2px] hover:bg-white/10 transition-all min-h-[52px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              View Programs
            </Link>
          </div>
        </div>
      </DarkSection>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
