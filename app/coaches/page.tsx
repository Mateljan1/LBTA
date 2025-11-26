import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Expert Tennis Coaches | ATP/WTA Coaching | LBTA',
  description: 'Meet our championship coaching staff. Andrew Mateljan (ATP/WTA Coach), Kevin Jackson (20+ D1 placements), and expert team. Schedule your trial today.',
  keywords: 'tennis coaches Laguna Beach, ATP coach, WTA coach, D1 college tennis, private tennis lessons, Kevin Jackson, Andrew Mateljan',
}

const coaches = [

const coaches = [
  {
    id: "andrew-mateljan",
    name: "Andrew Mateljan",
    title: "Director & Head Coach",
    philosophy: "I don't teach tennis. I teach athletes how to think, move, and solve under pressure.",
    specialization: "ATP/WTA Tour Coach • High Performance Training",
    credentials: [
      "ATP/WTA Tour Coaching Experience",
      "Former Top Junior (#3 SoCal, #12 USA)",
      "20+ D1 College Placements",
      "High Performance Specialist",
      "Founder: LBTA, VYLO, Fit4Tennis (100K+ followers)"
    ],
    bio: "After competing at the highest junior levels and coaching internationally in Spain, Croatia, and Norway, Andrew founded LBTA to create something different: a training environment where technical precision meets authentic mentorship. He built Fit4Tennis to 100K+ followers teaching movement systems that translate across all levels.",
    atpPlayers: "Currently coaching: Karue Sell (ATP #258) | Coached: Max McKennon (ATP #458), Ryan Seggerman (ATP Singles #348, Doubles #68), Colton Smith (ATP #133)",
    metrics: [
      { label: "ATP Players Coached", value: "5" },
      { label: "D1 Placements", value: "20+" },
      { label: "International Coaching", value: "7 Years" }
    ],
    rate_60: 250,
    rate_90: 350,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
    email: "andrew@tennisbeast.com",
    phone: "(949) 241-0847",
    signature: "— Andrew Mateljan"
  },
  {
    id: "kevin-jackson",
    name: "Kevin Jackson",
    title: "Head Coach",
    philosophy: "College tennis isn't about talent. It's about strategic positioning, timing, and knowing the system.",
    specialization: "College Prep Specialist • NCAA Recruitment Expert",
    credentials: [
      "20+ D1 College Placements",
      "NCAA Recruitment Expert",
      "Tournament Preparation Specialist",
      "USPTA Elite Professional",
      "Former Professional Player"
    ],
    bio: "Over 20 D1 college placements with proven track record in developing college-bound athletes. Kevin specializes in NCAA recruitment process, tournament preparation, and building competitive juniors who succeed at the next level. His systematic approach to player development has helped countless athletes earn scholarships.",
    successStory: "Sarah Mitchell arrived as a regional player ranked outside the top 200. Through tournament strategy refinement and recruitment positioning, she earned a full scholarship to Stanford's varsity program—now competing at NCAA Division I level.",
    metrics: [
      { label: "D1 Placements", value: "20+" },
      { label: "Scholarship Rate", value: "95%" },
      { label: "Years Coaching", value: "12" }
    ],
    rate_60: 150,
    rate_90: 200,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
    signature: "— Kevin Jackson"
  },
  {
    id: "savriyan-danilov",
    name: "Savriyan Danilov",
    title: "High Performance Coach",
    philosophy: "Professional tennis is 20% strokes, 80% decisions. I teach the 80%.",
    specialization: "ATP Professional • Advanced Technique Specialist",
    credentials: [
      "ATP Professional (Career High #556)",
      "8 Years Professional Tour Experience",
      "Advanced Technique Specialist",
      "Competitive Match Strategy Expert"
    ],
    bio: "Professional tour experience brings real-world competitive insights to high-performance training. Savriyan specializes in advanced technique development, match strategy, and preparing players for competitive success. His firsthand knowledge of professional tennis informs every aspect of his coaching.",
    successStory: "David Park arrived as a recreational 3.5 player with no competitive experience. Through ATP-level movement patterns and match awareness training, he reached competitive 4.0 status in 12 months—now competing in USTA league tournaments.",
    metrics: [
      { label: "ATP Ranking", value: "#556" },
      { label: "Tour Years", value: "8" },
      { label: "Student Growth", value: "+1.5 NTRP Avg" }
    ],
    rate_60: 120,
    rate_90: 165,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png"
  },
  {
    id: "andy-wu",
    name: "Andy Wu",
    title: "Program Coach",
    philosophy: "Tennis is learned through clarity, not complexity. I simplify the path.",
    specialization: "Junior & Adult Development • EdD in Educational Leadership",
    credentials: [
      "USPTA Certified Professional",
      "Doctor of Education (EdD) - 2020",
      "Junior Development Expert",
      "Adult Program Specialist",
      "Fundamentals & Stroke Development"
    ],
    bio: "Solid fundamentals, progressive skill development, and positive learning environment define Andy's coaching philosophy. Works with all ages and skill levels with focus on building proper technique from the ground up. His EdD in Educational Leadership brings academic rigor and systematic methodology to tennis instruction.",
    metrics: [
      { label: "Satisfaction Rate", value: "85%" },
      { label: "USPTA Certified", value: "2018" },
      { label: "EdD Leadership", value: "2020" }
    ],
    rate_60: 100,
    rate_90: 135,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/5ed56f130_AndyWuHeadshot.png"
  },
  {
    id: "michelle-bevins",
    name: "Michelle Bevins",
    title: "Youth Director",
    philosophy: "Young athletes don't need motivation. They need trust, structure, and space to explore.",
    specialization: "Youth Development Specialist • Ages 3-12 Expert",
    credentials: [
      "Youth Development Specialist",
      "Ages 3-12 Expert",
      "Red/Orange Ball Certified",
      "Positive Learning Environment Specialist",
      "95% Parent Satisfaction Rate"
    ],
    bio: "Engaging, fun approach that builds confidence and love for tennis while developing proper technique. Michelle makes young players fall in love with the game through age-appropriate activities, games, and positive reinforcement. Her energy and patience create the perfect learning environment for young children.",
    successStory: "Emma Rodriguez arrived as a timid 7-year-old with no sports background. Through confidence-building progression and positive reinforcement, she advanced from 3.0 to 4.5 NTRP in 18 months—now competing at junior sectionals with self-assurance.",
    metrics: [
      { label: "Parent Satisfaction", value: "95%" },
      { label: "Multi-Year Retention", value: "90%" },
      { label: "Youth Specialists", value: "Ages 3-12" }
    ],
    rate_60: 120,
    rate_90: 165,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
    signature: "— Michelle Bevins"
  }
]

const pathways = [
  {
    title: "Junior Development (Ages 3-12)",
    coach: "Michelle Bevins - Youth Director",
    description: "Specializes in foundational technique and love of the game for young players",
    scrollTo: "michelle-bevins"
  },
  {
    title: "Competitive Juniors (Ages 13-18)",
    coach: "Kevin Jackson - Head Coach",
    description: "20+ D1 college placements, tournament preparation specialist",
    scrollTo: "kevin-jackson"
  },
  {
    title: "High Performance / College Prep",
    coach: "Andrew Mateljan - Founder & ATP/WTA Coach",
    description: "Tour-level training for serious competitors and college-bound athletes",
    scrollTo: "andrew-mateljan"
  },
  {
    title: "Adult Players (All Levels)",
    coach: "Savriyan Danilov & Andy Wu",
    description: "Professional insights and structured approach for adult game development",
    scrollTo: "savriyan-danilov"
  },
]

export default function CoachesPage() {
  const scrollToCoach = (coachId: string) => {
    document.getElementById(coachId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Our Coaches</p>
            <h1 className="text-display-lg heading-display mb-6">
              Meet Your Coaches
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ATP/WTA tour experience. NCAA recruitment expertise. Genuine care for each athlete's journey.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Find Your Perfect Coach Match */}
      <section className="bg-white section-spacing">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-lbta-charcoal mb-4">
              Find Your Perfect Coach Match
            </h2>
            <p className="text-lg text-gray-600">
              Choose the right coach for your goals and playing level
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pathways.map((pathway, index) => (
              <AnimatedSection key={pathway.title} delay={index * 0.1}>
                <button
                  onClick={() => scrollToCoach(pathway.scrollTo)}
                  className="bg-lbta-cream border border-gray-300 rounded-lg p-6 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group w-full"
                >
                  <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-2">
                    {pathway.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-lbta-burnt mb-3" />
                  <p className="text-base text-lbta-intense font-sans font-medium mb-2">
                    {pathway.coach}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pathway.description}
                  </p>
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Coach */}
      <section className="bg-lbta-tan section-spacing">
        <div className="container-narrow">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-lbta-charcoal mb-6">
              Why We Coach
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              We believe tennis builds more than athleticism—it builds character, discipline, and self-leadership. Our coaching staff combines professional tour experience with genuine care for each athlete's journey. From ages 3 to ATP professionals, we meet every player exactly where they are—and help them discover what they're capable of becoming.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Coach Profiles */}
      <section className="bg-white section-spacing">
        <div className="container-lbta">
          <div className="space-y-24">
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.name}
                id={coach.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-lbta-cream border border-lbta-sand rounded-lg p-8 md:p-12 shadow-md scroll-mt-32"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                  {/* Coach Photo */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={`${coach.image}?quality=95`}
                        alt={`${coach.name}, ${coach.title}`}
                        className="w-full h-full object-cover object-top"
                        style={{ imageRendering: '-webkit-optimize-contrast' }}
                      />
                    </div>
                  </div>

                  {/* Coach Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-lbta-charcoal mb-2">
                      {coach.name}
                    </h2>

                    <p className="text-sm font-sans font-medium text-lbta-gold uppercase mb-4 tracking-widest">
                      {coach.title}
                    </p>

                    <p className="text-lg text-lbta-charcoal mb-6 italic font-sans leading-relaxed">
                      "{coach.philosophy}"
                    </p>

                    <p className="text-sm font-display font-semibold text-lbta-charcoal mb-6">
                      {coach.specialization}
                    </p>

                    {/* Bio */}
                    {coach.name === "Andrew Mateljan" && coach.atpPlayers && (
                      <p className="text-base text-lbta-charcoal leading-relaxed mb-6">
                        {coach.bio}
                      </p>
                    )}

                    {/* Credentials */}
                    <ul className="space-y-2 mb-6">
                      {coach.credentials.map((credential) => (
                        <li key={credential} className="flex items-start gap-3 text-base text-lbta-charcoal">
                          <span className="text-lbta-orange mt-1">•</span>
                          <span>{credential}</span>
                        </li>
                      ))}
                    </ul>

                    {/* ATP Players for Andrew */}
                    {coach.atpPlayers && (
                      <div className="bg-lbta-charcoal/90 border-l-4 border-lbta-orange rounded-lg p-5 mb-6">
                        <h4 className="text-xs font-display font-bold uppercase tracking-widest text-lbta-orange mb-3">
                          ATP/WTA Players
                        </h4>
                        <p className="text-sm text-white leading-relaxed">
                          {coach.atpPlayers}
                        </p>
                      </div>
                    )}

                    {/* Success Story */}
                    {coach.successStory && (
                      <div className="bg-lbta-charcoal/90 border-l-4 border-lbta-orange rounded-lg p-5 mb-6">
                        <h4 className="text-xs font-display font-bold uppercase tracking-widest text-lbta-orange mb-3">
                          Success Story
                        </h4>
                        <p className="text-sm text-white leading-relaxed">
                          {coach.successStory}
                        </p>
                      </div>
                    )}

                    {/* Bio for other coaches */}
                    {coach.name !== "Andrew Mateljan" && (
                      <p className="text-base text-lbta-charcoal leading-relaxed mb-6">
                        {coach.bio}
                      </p>
                    )}

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {coach.metrics.map((metric, idx) => (
                        <div 
                          key={metric.label}
                          className="inline-block px-4 py-2 rounded-lg text-white"
                          style={{ backgroundColor: idx % 2 === 0 ? '#2d2d2d' : '#f04e23' }}
                        >
                          <div className="text-xs font-display font-bold uppercase tracking-wider opacity-80">
                            {metric.label}
                          </div>
                          <div className="text-lg font-display font-bold">
                            {metric.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="bg-lbta-tan rounded-lg p-6 mb-6">
                      <h4 className="text-base font-display font-bold text-lbta-charcoal mb-4 flex items-center gap-2">
                        <span className="text-lbta-orange text-xl">$</span>
                        Private Lesson Rates:
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                          <span className="text-sm font-sans text-lbta-charcoal">60 minutes:</span>
                          <span className="font-display font-bold text-lbta-orange text-2xl">${coach.rate_60}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-sans text-lbta-charcoal">90 minutes:</span>
                          <span className="font-display font-bold text-lbta-orange text-2xl">${coach.rate_90}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Book */}
                    <div className="flex flex-col gap-4">
                      {coach.email && (
                        <a href={`mailto:${coach.email}`} className="flex items-center gap-2 text-lbta-burnt hover:text-lbta-orange transition-colors">
                          <Mail className="w-5 h-5" />
                          <span className="font-sans">{coach.email}</span>
                        </a>
                      )}
                      {coach.phone && (
                        <a href={`tel:${coach.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-lbta-burnt hover:text-lbta-orange transition-colors">
                          <Phone className="w-5 h-5" />
                          <span className="font-sans">{coach.phone}</span>
                        </a>
                      )}

                      <Link
                        href="/book"
                        className="btn-primary mt-2"
                      >
                        Book with {coach.name.split(' ')[0]}
                      </Link>
                    </div>

                    {/* Signature */}
                    {coach.signature && (
                      <p className="mt-8 text-xl text-lbta-charcoal font-serif italic opacity-70">
                        {coach.signature}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches in Action */}
      <section className="bg-lbta-sand section-spacing">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-lbta-charcoal mb-4">
              Your Coaches in Action
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection>
              <div className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/3f8b8b984_Coachmichelle.png?quality=95"
                  alt="Coach Michelle Bevins teaching young tennis players"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/c2d8f3254_Groupphoto.png?quality=95"
                  alt="LBTA coaches with junior tennis team"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/40c1cfa5f_GroupAdult.png?quality=95"
                  alt="LBTA coach leading adult tennis clinic"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Train with LBTA Coaches */}
      <section className="bg-white section-spacing border-t border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-lbta-charcoal mb-4">
              Why Train with LBTA Coaches?
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Professional Experience",
                desc: "Our coaches bring ATP/WTA tour experience and professional playing backgrounds to every lesson."
              },
              {
                num: "02",
                title: "Proven Track Record",
                desc: "20+ D1 college placements and countless tournament victories speak to our coaching effectiveness."
              },
              {
                num: "03",
                title: "Personalized Approach",
                desc: "Every student receives customized training plans tailored to their goals and skill level."
              },
              {
                num: "04",
                title: "All Ages & Levels",
                desc: "From 3-year-olds learning their first forehand to college-bound athletes, we serve everyone."
              }
            ].map((reason, index) => (
              <AnimatedSection key={reason.num} delay={index * 0.1}>
                <div className="bg-lbta-cream rounded-lg p-10 shadow-md relative">
                  <div className="absolute top-6 left-6 font-display font-bold text-6xl text-lbta-burnt/20">
                    {reason.num}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-display font-semibold text-lbta-charcoal mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-base text-lbta-charcoal/80 leading-relaxed">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white section-spacing border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Work with Our Coaches
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-sans leading-relaxed">
              Experience championship-level coaching. Schedule your complimentary trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                SCHEDULE TRIAL
              </Link>
              <a href="mailto:support@lagunabeachtennisacademy.com" className="btn-secondary">
                CONTACT US
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

