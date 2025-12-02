'use client'

import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director & Head Coach",
    specialization: "ATP/WTA Tour Coach",
    bio: "After competing at the highest junior levels and coaching internationally in Spain, Croatia, and Norway, Andrew founded LBTA with a singular focus: championship-level training accessible to all. His work with ATP/WTA professionals informs every lesson.",
    credentials: "Former Top Junior • ATP/WTA Tour Coach • 20+ D1 Placements",
    rate: "$250/hour",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialization: "College Recruitment",
    bio: "Over 20 D1 college placements. Kevin specializes in NCAA recruitment strategy, tournament preparation, and developing college-bound athletes. His systematic approach has helped countless families navigate the college tennis process successfully.",
    credentials: "20+ D1 Placements • NCAA Recruitment Expert • USPTA Elite",
    rate: "$150/hour",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialization: "Ages 3-12",
    bio: "Engaging, patient approach that builds confidence and love for tennis while developing proper technique. Michelle creates the perfect learning environment for young children through age-appropriate activities and positive reinforcement.",
    credentials: "Youth Development Specialist • Red/Orange Ball Certified • 95% Parent Satisfaction",
    rate: "$120/hour",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance Coach",
    specialization: "ATP Pro #556",
    bio: "Professional tour experience brings real-world competitive insights to high-performance training. Savriyan specializes in advanced technique development, match strategy, and preparing players for competitive success.",
    credentials: "ATP Professional • 8 Years Tour Experience • Match Strategy Expert",
    rate: "$120/hour",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png",
  },
  {
    name: "Andy Wu",
    title: "Program Coach",
    specialization: "Junior & Adult Development",
    bio: "Solid fundamentals and progressive skill development define Andy's coaching philosophy. Works with all ages and skill levels with focus on building proper technique from the ground up.",
    credentials: "USPTA Certified • EdD Educational Leadership • Fundamentals Specialist",
    rate: "$100/hour",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/5ed56f130_AndyWuHeadshot.png",
  }
]

export default function CoachesPage() {
  return (
    <>
      {/* Hero - Museum Quality */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Your Development Team</p>
            <h1 className="text-display-lg heading-display mb-6">
              Meet Your Coaches
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ATP/WTA tour experience. NCAA recruitment expertise. Coaches who've trained at the highest levels and know how to teach beginners.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Coach Profiles - Elegant Grid */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="space-y-32">
            {coaches.map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.1}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  {/* Photo */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
                      <Image
                        src={coach.image}
                        alt={`${coach.name} - ${coach.title} at Laguna Beach Tennis Academy`}
                        fill
                        quality={90}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8ZAAAAAAAAA//Z"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <p className="text-overline mb-4">{coach.specialization}</p>
                    
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-2 tracking-tight">
                      {coach.name}
                    </h2>
                    
                    <p className="text-lg text-gray-500 mb-8 font-sans">
                      {coach.title}
                    </p>

                    <div className="h-0.5 w-12 bg-lbta-burnt mb-8" />

                    <p className="text-gray-600 leading-relaxed mb-8 font-sans">
                      {coach.bio}
                    </p>

                    <p className="text-sm text-gray-500 mb-8 font-sans">
                      {coach.credentials}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-300 pt-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Private Lessons</p>
                        <p className="text-2xl font-serif font-light text-lbta-charcoal">
                          {coach.rate}
                        </p>
                      </div>
                      
                      <Link
                        href="/book"
                        className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1"
                      >
                        Schedule Lesson →
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Work with Our Coaches
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Experience championship-level coaching. Schedule your complimentary trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                SCHEDULE TRIAL
              </Link>
              <a href="tel:9494646645" className="btn-secondary">
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
