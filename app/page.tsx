'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { value: "200+", label: "Active Members" },
  { value: "20+", label: "D1 Placements" },
  { value: "5", label: "Years" },
  { value: "3", label: "Locations" },
]

const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director",
    specialty: "ATP/WTA Tour Coach",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialty: "College Recruitment",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialty: "Ages 3-12",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance",
    specialty: "ATP Pro #556",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png",
  },
]

export default function Home() {
  return (
    <>
      {/* Hero - Refined & Elegant */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_HEROIMAGE-2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-8 tracking-tight" 
                style={{ lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              Excellence Built Here
            </h1>
            
            <p className="text-lg md:text-xl font-sans font-light text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
               style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              ATP/WTA coaching for ages 3 to professional.  
              Small by design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=hero&utm_campaign=nextjs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                BEGIN YOUR JOURNEY
              </a>

              <Link href="/programs" className="btn-secondary bg-white/10 border-white text-white hover:bg-white hover:text-lbta-charcoal">
                EXPLORE PROGRAMS
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm font-sans tracking-wide">
              <span>20 D1 Placements</span>
              <span className="hidden sm:inline">•</span>
              <span>ATP/WTA Coaching</span>
              <span className="hidden sm:inline">•</span>
              <span>City Partner Since 2020</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principles - Quiet Confidence */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Our Approach</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              What Sets Us Apart
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">01</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  Professional Expertise
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  ATP/WTA tour experience informs every lesson. From beginners to professionals, we apply proven systems.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">02</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  Individual Attention
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Small group sizes ensure personalized feedback. Eight specialized coaches, each committed to your progress.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">03</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  Proven Results
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Twenty D1 placements. ATP player development. From weekend players to tour professionals.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats - Minimal */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-5xl md:text-6xl font-serif font-light text-lbta-charcoal mb-3">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-sans tracking-wide">
                  {stat.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ATP Excellence - Refined */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <AnimatedSection>
              <div className="relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png"
                  alt="Andrew Mateljan coaching ATP professional Karue Sell"
                  className="w-full h-auto rounded-sm"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    ATP Ranking
                  </p>
                  <p className="text-5xl font-serif font-light text-lbta-charcoal">
                    #258
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Content */}
            <AnimatedSection delay={0.2}>
              <p className="text-overline mb-6">Professional Development</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-8 tracking-tight leading-tight">
                Real Players.  
                Real Results.
              </h2>
              <p className="body-text mb-6">
                Karue Sell improved his ATP ranking by 600 positions in one year through structured training focused on movement efficiency and match conditioning.
              </p>
              <p className="body-text mb-8">
                The same principles that develop ATP professionals apply to every level—from weekend players to competitive juniors.
              </p>
              <Link href="/coaches/andrew-mateljan" className="btn-secondary">
                MEET ANDREW
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* City Partnership - Museum Quality */}
      <section className="section-spacing bg-lbta-tan">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Official Partner</p>
            <h2 className="text-5xl md:text-7xl font-serif font-light text-lbta-charcoal mb-4 tracking-tight">
              City of Laguna Beach
            </h2>
            <p className="text-sm text-gray-500 font-sans tracking-wide">
              Since 2020
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="flex justify-center mb-20">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/e9aabb5b1_CityofLBLogo.png"
              alt="City of Laguna Beach"
              className="h-64 md:h-80 w-auto opacity-90"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Laguna Beach High School", img: "0f3eda457_1.png" },
                { name: "Moulton Meadows Park", img: "d1706d2b0_2.png" },
                { name: "Alta Laguna Park", img: "0f3eda457_1.png" }
              ].map((facility) => (
                <div key={facility.name} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4">
                    <img 
                      src={`https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/${facility.img}`}
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-500 font-sans tracking-wide">
                    {facility.name}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs - Minimal Grid */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Programs</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              Junior & Adult Development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
              Structured pathways for every age and skill level
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection delay={0.2}>
              <Link href="/programs/junior">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Junior Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ages 3-18. Foundation building through competitive development and college preparation.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Link href="/programs/adult">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Adult Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    All skill levels. Beginner instruction through competitive tournament training.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} className="text-center">
            <Link href="/programs" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              View Complete Program Overview
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Coaching Team - Refined Grid */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Coaches</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal tracking-tight">
              Our Team
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {coaches.map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.1}>
                <Link href="/coaches" className="group">
                  <div className="aspect-square overflow-hidden rounded-sm mb-4">
                    <img 
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-1 group-hover:text-lbta-burnt transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {coach.title}
                  </p>
                  <p className="text-xs text-lbta-burnt tracking-wide">
                    {coach.specialty}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5} className="text-center mt-16">
            <Link href="/coaches" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              Meet the Full Team
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonial - Single Quote */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <blockquote className="text-2xl md:text-3xl font-serif font-light text-lbta-charcoal leading-relaxed text-center mb-8">
              "The coaches at LBTA don't just teach tennis—they build character. My daughter learned discipline and resilience here."
            </blockquote>
            <p className="text-center text-sm text-gray-500 tracking-wide font-sans">
              Sarah M., Parent
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 tracking-tight">
              Begin Your Tennis Journey
            </h2>
            <p className="text-lg font-sans font-light text-white/80 mb-10 leading-relaxed">
              Experience our approach firsthand. Complimentary trial. No pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=cta&utm_campaign=nextjs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                SCHEDULE TRIAL
              </a>
              <a
                href="tel:9494646645"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-sans text-sm font-medium tracking-wide hover:border-white hover:bg-white/10 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
