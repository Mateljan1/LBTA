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
        "image": "https://lagunabeachtennisacademy.com/images/coaches/andrew.webp"
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
      setHeroParallax(window.scrollY * 0.4)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const leadCoaches = [
    {
      name: "Andrew Mateljan",
      title: "Director & Head Coach",
      specialization: "ATP/WTA Tour Coach",
      bio: "Twenty years developing competitive players from junior foundations to professional tour. Former #3 SoCal and #12 nationally ranked junior. Seven years coaching internationally across Spain, Croatia, and Norway shaped a movement-first approach grounded in clarity and accountability. Currently coaches ATP #262 Karue Sell. Training history includes Max McKennon (ATP #458), Ryan Seggerman (ATP #63 Doubles), with Masters 1000 experience at Indian Wells. Founder of Fit4Tennis platform serving 100K+ users worldwide. Every lesson reflects one belief: structure creates confidence, and confidence creates champions.",
      quote: "Structure creates confidence.",
      credentials: "Former Top Junior • ATP/WTA Tour Coach • 20+ D1 Placements",
      image: "/images/coaches/andrew.webp",
    },
    {
      name: "Kevin Jackson",
      title: "Head Coach & Performance Director",
      specialization: "Player Development · Global Systems Leadership",
      bio: "Kevin Jackson is a performance architect with more than twenty-five years of experience in global player development, system design, and athlete management. He has coached and guided over 3,000 athletes worldwide — developing national champions, international juniors, and professional players across four continents. His approach combines clarity, structure, and adaptability to help athletes build long-term, sustainable performance systems. Kevin has directed full-time training environments, advised high-net-worth families on performance planning, and designed integrated development frameworks that merge technical, tactical, and mindset training. Career highlights include 3,000+ athletes trained, 550+ tournament victories, 20+ Division I scholarship athletes, and creating development systems combining data, psychology, and on-court performance. Kevin's coaching reflects a simple belief — that performance grows from clarity, discipline, and structure.",
      quote: "Excellence through preparation.",
      credentials: "25+ Years Experience • 3,000+ Athletes Trained • 20+ D1 Placements • Global Systems Leader",
      image: "/images/coaches/kevin.webp",
    }
  ]
  
  const programCoaches = [
    {
      name: "Michelle Bevins",
      title: "Youth Director",
      specialization: "Junior Development (Ages 3-12)",
      bio: "Michelle brings engaging, patient coaching that builds confidence and genuine love for tennis while developing proper technique. Her approach creates the perfect learning environment for young children through age-appropriate activities, positive reinforcement, and structured fun. Specializing in Red Ball and Orange Ball certification, Michelle understands how to meet each child where they are and guide them toward their potential. Parents consistently praise her ability to make tennis feel like play while building real skills. With a 95% parent satisfaction rate and years of youth development expertise, Michelle has helped hundreds of young players discover movement, discipline, and belonging through tennis.",
      quote: "Every child can shine.",
      credentials: "Youth Development Specialist • Red/Orange Ball Certified • 95% Parent Satisfaction",
      image: "/images/coaches/michelle.webp",
    },
    {
      name: "Savriyan Danilov",
      title: "High Performance Coach",
      specialization: "ATP Pro #556",
      bio: "Professional tour experience brings real-world competitive insights to high-performance training at LBTA. Savriyan specializes in advanced technique development, match strategy, and preparing players for competitive success at the highest levels. Eight years of ATP tour competition inform every session — from point construction to mental toughness under pressure. His training focuses on translating professional-level patterns into junior and collegiate development. Players working with Savriyan gain tactical sophistication, court positioning mastery, and the competitive mindset needed for tournament success. His approach balances technical precision with strategic awareness, creating players who can execute under pressure and adapt to any opponent or surface.",
      quote: "Champions train differently.",
      credentials: "ATP Professional • 8 Years Tour Experience • Match Strategy Expert",
      image: "/images/coaches/savriyan.webp",
    },
    {
      name: "Andy Wu",
      title: "Program Coach",
      specialization: "Junior & Adult Development",
      bio: "Solid fundamentals and progressive skill development define Andy's coaching philosophy. With USPTA certification and an EdD in Educational Leadership, Andy combines technical expertise with deep understanding of how people learn and grow. Working with all ages and skill levels, he focuses on building proper technique from the ground up — ensuring every student develops repeatable strokes, tactical awareness, and confidence in their game. Andy's patient, systematic approach helps beginners feel comfortable while challenging advanced players to refine their skills. His background in education brings structure and clarity to every lesson, making complex concepts accessible and progress measurable for every student.",
      quote: "Fundamentals create mastery.",
      credentials: "USPTA Certified • EdD Educational Leadership • Fundamentals Specialist",
      image: "/images/coaches/andy.webp",
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
      
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy coaches and players training together"
            fill
            className="object-cover"
            style={{ 
              objectPosition: '50% 40%',
              transform: `translateY(${heroParallax}px)`
            }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/25 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[36px] md:text-[64px] font-bold leading-[1.1] mb-6 text-shadow">
            Meet Our Coaching Team.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[90%] mx-auto">
            ATP/WTA-trained coaches who understand that tennis teaches more than technique.
          </p>
          <Link 
            href="/programs"
            className="inline-block border-2 border-white hover:bg-lbta-red hover:border-lbta-red text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            View Programs →
          </Link>
        </div>
      </section>

      {/* LEAD COACHES - Row 1 (2 coaches) */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <h2 className="font-serif text-[32px] md:text-[48px] font-semibold text-black mb-4 text-center">
            Our Coaches
          </h2>
          <p className="font-sans text-[16px] text-black/70 mb-16 text-center max-w-2xl mx-auto">
            Every coach at LBTA shares one philosophy: Movement. Discipline. Belonging.
          </p>
          
          {/* Row 1: Lead Coaches */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
            {leadCoaches.map((coach) => (
              <div 
                key={coach.name}
                className="group bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
              >
                {/* Coach Image with Hover Overlay */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: '50% 35%' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Hover Quote Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                    <p className="font-serif text-[20px] md:text-[24px] italic text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      "{coach.quote}"
                    </p>
                  </div>
                </div>
                
                {/* Coach Info */}
                <div className="p-6 md:p-8">
                  <h3 className="font-serif text-[24px] font-bold text-black mb-1">
                    {coach.name}
                  </h3>
                  <p className="font-sans text-[16px] font-medium text-lbta-orange mb-2">
                    {coach.title}
                  </p>
                  <p className="font-sans text-[14px] text-black/60 mb-4">
                    {coach.specialization}
                  </p>
                  <p className="font-sans text-[15px] text-black/80 leading-[1.7] mb-4">
                    {coach.bio}
                  </p>
                  <p className="font-sans text-[13px] text-black/60 leading-relaxed">
                    {coach.credentials}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Row 2: Program Coaches */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {programCoaches.map((coach) => (
              <div 
                key={coach.name}
                className="group bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
              >
                {/* Coach Image with Hover Overlay */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: '50% 35%' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Hover Quote Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                    <p className="font-serif text-[18px] md:text-[20px] italic text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      "{coach.quote}"
                    </p>
                  </div>
                </div>
                
                {/* Coach Info */}
                <div className="p-6 md:p-8">
                  <h3 className="font-serif text-[22px] font-bold text-black mb-1">
                    {coach.name}
                  </h3>
                  <p className="font-sans text-[16px] font-medium text-lbta-orange mb-2">
                    {coach.title}
                  </p>
                  <p className="font-sans text-[14px] text-black/60 mb-4">
                    {coach.specialization}
                  </p>
                  <p className="font-sans text-[14px] md:text-[15px] text-black/80 leading-[1.7] mb-4">
                    {coach.bio}
                  </p>
                  <p className="font-sans text-[13px] text-black/60 leading-relaxed">
                    {coach.credentials}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COACHING PHILOSOPHY CTA */}
      <section className="bg-[#FAF8F3] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-6">
            Work With Our Coaches
          </h2>
          <p className="font-sans text-[16px] md:text-[17px] text-black/70 mb-8 max-w-2xl mx-auto leading-[1.7]">
            Our coaches share one philosophy: movement, discipline, belonging. Each brings unique expertise 
            but follows the same commitment to structure and growth.
          </p>
          <Link
            href="/programs"
            className="inline-block bg-lbta-orange hover:bg-lbta-red text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all duration-300 shadow-md hover:shadow-lg min-h-[48px]"
          >
            Explore Programs →
          </Link>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Explore Programs" href="/programs" showAfterScroll={600} />
    </>
  )
}
