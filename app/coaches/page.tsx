'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'

export default function CoachesPage() {
  const [heroParallax, setHeroParallax] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setHeroParallax(window.scrollY * 0.4)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director & Head Coach",
    specialization: "ATP/WTA Tour Coach",
    bio: "20 years developing competitive players. Former #3 SoCal, #12 nationally ranked junior. Seven years coaching internationally across Spain, Croatia, and Norway. Currently coaches ATP #262 Karue Sell.",
    quote: "Structure creates confidence.",
    credentials: "Former Top Junior • ATP/WTA Tour Coach • 20+ D1 Placements",
    image: "/images/coaches/andrew.webp",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialization: "College Recruitment Specialist",
    bio: "Over 20 D1 college placements. Kevin specializes in NCAA recruitment strategy, tournament preparation, and developing college-bound athletes.",
    quote: "Excellence through preparation.",
    credentials: "20+ D1 Placements • NCAA Recruitment Expert • USPTA Elite",
    image: "/images/coaches/kevin.webp",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialization: "Junior Development (Ages 3-12)",
    bio: "Engaging, patient approach that builds confidence and love for tennis while developing proper technique through age-appropriate activities.",
    quote: "Every child can shine.",
    credentials: "Youth Development Specialist • Red/Orange Ball Certified",
    image: "/images/coaches/michelle.webp",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance Coach",
    specialization: "ATP Pro #556",
    bio: "Professional tour experience brings real-world competitive insights to high-performance training. Specializes in advanced technique and match strategy.",
    quote: "Champions train differently.",
    credentials: "ATP Professional • 8 Years Tour Experience",
    image: "/images/coaches/savriyan.webp",
  },
  {
    name: "Andy Wu",
    title: "Program Coach",
    specialization: "Junior & Adult Development",
    bio: "Solid fundamentals and progressive skill development. Works with all ages and skill levels with focus on building proper technique.",
    quote: "Fundamentals create mastery.",
    credentials: "USPTA Certified • EdD Educational Leadership",
    image: "/images/coaches/andy.webp",
  }
]
  
  return (
    <>
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

      {/* COACHES GRID */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <h2 className="font-serif text-[32px] md:text-[48px] font-semibold text-black mb-4 text-center">
            Our Coaches
          </h2>
          <p className="font-sans text-[16px] text-black/70 mb-16 text-center max-w-2xl mx-auto">
            Every coach at LBTA shares one philosophy: Movement. Discipline. Belonging.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {coaches.map((coach, index) => (
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hover Quote Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="font-serif text-[18px] md:text-[20px] italic text-white">
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
                  <p className="font-sans text-[14px] text-black/80 leading-relaxed mb-4">
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
          <p className="font-sans text-[16px] text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our coaches share one philosophy: movement, discipline, belonging. Each brings unique expertise, 
            but all follow the same commitment to honest feedback and personalized development.
          </p>
          <Link
            href="/book"
            className="inline-block bg-lbta-orange hover:bg-lbta-red text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px]"
          >
            Book a Trial →
          </Link>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book a Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
