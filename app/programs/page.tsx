import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-16">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>Programs</p>
            <h1 className="display mb-6">
              Find Your Path
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              From first lesson to professional tour. Small groups, ATP/WTA coaching, proven results.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-lbta-bone border-y border-gray-200 py-12">
        <div className="container-lbta">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <div className="headline-sm text-lbta-charcoal">200+</div>
              <div className="body-sm text-gray-600">Active Students</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="headline-sm text-lbta-charcoal">20+</div>
              <div className="body-sm text-gray-600">D1 Placements</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="headline-sm text-lbta-charcoal">4-8</div>
              <div className="body-sm text-gray-600">Students Per Group</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="headline-sm text-lbta-charcoal">3</div>
              <div className="body-sm text-gray-600">Premium Locations</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main Program Pathways */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          
          {/* Junior Development */}
          <AnimatedSection className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100">
                <Image
                  src="/photos/junior-program-hero.jpg"
                  alt="Junior tennis development at LBTA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="eyebrow mb-4" style={{ color: '#E8956F' }}>AGES 3–18</p>
                <h2 className="headline mb-6">Junior Development</h2>
                <p className="body-lg text-gray-600 mb-8">
                  From first lesson to D1 scholarship. Little Stars (ages 3-4) through High Performance training.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="subhead-sm mb-2">What You'll Learn</p>
                    <p className="body-sm text-gray-600">
                      Age-appropriate technique, match play tactics, physical conditioning, mental toughness, and tournament preparation.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Who It's For</p>
                    <p className="body-sm text-gray-600">
                      Children ages 3-18, from first-time players through competitive tournament athletes seeking college placement.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Results</p>
                    <p className="body-sm text-gray-600">
                      20+ students placed at D1 universities including Stanford, UCLA, and USC.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/programs/junior"
                    className="eyebrow bg-lbta-coral text-white px-8 py-4 transition hover:bg-lbta-coral-dark inline-flex items-center gap-2"
                  >
                    EXPLORE PROGRAM <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/schedules"
                    className="eyebrow border border-lbta-charcoal text-lbta-charcoal px-8 py-4 transition hover:bg-lbta-charcoal hover:text-white inline-flex items-center gap-2"
                  >
                    SEE SCHEDULE
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Adult Programs */}
          <AnimatedSection className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="eyebrow mb-4" style={{ color: '#E8956F' }}>ALL LEVELS</p>
                <h2 className="headline mb-6">Adult Programs</h2>
                <p className="body-lg text-gray-600 mb-8">
                  Beginner through USTA 4.0+. Fitness, social connection, and competitive play.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="subhead-sm mb-2">What You'll Learn</p>
                    <p className="body-sm text-gray-600">
                      Proper technique, consistent strokes, match strategy, fitness conditioning, and competitive point play.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Who It's For</p>
                    <p className="body-sm text-gray-600">
                      Adults of all skill levels seeking fitness, social connection, skill improvement, or competitive play.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Schedule Flexibility</p>
                    <p className="body-sm text-gray-600">
                      Morning, afternoon, and evening sessions across three Laguna Beach locations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/programs/adult"
                    className="eyebrow bg-lbta-coral text-white px-8 py-4 transition hover:bg-lbta-coral-dark inline-flex items-center gap-2"
                  >
                    EXPLORE PROGRAM <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/schedules"
                    className="eyebrow border border-lbta-charcoal text-lbta-charcoal px-8 py-4 transition hover:bg-lbta-charcoal hover:text-white inline-flex items-center gap-2"
                  >
                    SEE SCHEDULE
                  </Link>
                </div>
              </div>
              <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100 order-1 lg:order-2">
                <Image
                  src="/photos/adult-program.jpg"
                  alt="Adult tennis programs at LBTA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* High Performance */}
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100">
                <Image
                  src="/photos/high-performance.jpg"
                  alt="High performance tennis training at LBTA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="eyebrow mb-4" style={{ color: '#E8956F' }}>COMPETITIVE</p>
                <h2 className="headline mb-6">High Performance</h2>
                <p className="body-lg text-gray-600 mb-8">
                  College recruitment and ATP/WTA tour preparation. Full-time training for serious athletes.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="subhead-sm mb-2">What You'll Get</p>
                    <p className="body-sm text-gray-600">
                      15-20 hours weekly: Technical training, match play, fitness, video analysis, mental coaching, and tournament support.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Who It's For</p>
                    <p className="body-sm text-gray-600">
                      Tournament players ages 12-18 with UTR 5.0+ seeking D1 college placement or professional development.
                    </p>
                  </div>
                  <div>
                    <p className="subhead-sm mb-2">Track Record</p>
                    <p className="body-sm text-gray-600">
                      20+ D1 placements at Stanford, UCLA, USC. Currently coaching ATP #258 Karue Sell.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/programs/high-performance"
                    className="eyebrow bg-lbta-charcoal text-white px-8 py-4 transition hover:bg-lbta-charcoal/90 inline-flex items-center gap-2"
                  >
                    VIEW REQUIREMENTS <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/apply-scholarship"
                    className="eyebrow border border-lbta-charcoal text-lbta-charcoal px-8 py-4 transition hover:bg-lbta-charcoal hover:text-white"
                  >
                    APPLY
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* Private Coaching */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Private Coaching</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              One-on-one sessions with ATP/WTA tour experienced coaches. Personalized development for all ages and levels.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Andrew', title: 'ATP/WTA Coach', link: '/coaches/andrew-mateljan' },
              { name: 'Kevin', title: 'College Prep', link: '/coaches#kevin' },
              { name: 'Savriyan', title: 'ATP Pro #556', link: '/coaches#savriyan' },
              { name: 'Andy', title: 'Program Coach', link: '/coaches#andy' },
              { name: 'Michelle', title: 'Youth Director', link: '/coaches#michelle' },
            ].map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.05}>
                <Link href={coach.link} className="block">
                  <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-lg">
                    <p className="subhead-sm mb-1">{coach.name}</p>
                    <p className="body-sm text-gray-600">{coach.title}</p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/coaches"
              className="eyebrow inline-flex items-center text-lbta-charcoal hover:text-lbta-coral transition pb-1"
              style={{ borderBottom: '1px solid #D1D5DB' }}
            >
              VIEW ALL COACHES & RATES <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scholarship */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6">Scholarship Program</h2>
            <p className="body-lg mb-8 text-gray-600">
              $25,000+ awarded annually to families demonstrating need and commitment.
            </p>
            <div className="bg-lbta-bone border border-gray-200 p-8 max-w-2xl mx-auto text-left">
              <p className="body-sm mb-4 text-gray-600">
                Scholarships cover 25-50% of program tuition for qualified families.
              </p>
              <p className="body-sm mb-6 text-gray-600">
                Requirements: Household income &lt; $75K, 2+ sessions/week commitment, 3.5+ GPA
              </p>
              <Link
                href="/apply-scholarship"
                className="eyebrow inline-flex items-center justify-center bg-lbta-coral text-white px-8 py-4 transition hover:bg-lbta-coral-dark"
              >
                APPLY FOR SCHOLARSHIP
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6 text-white">
              Ready to Start?
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              View full schedule with times and pricing, or book your complimentary trial session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedules" className="eyebrow inline-flex items-center justify-center bg-white text-lbta-charcoal px-10 py-4 transition-all duration-300 hover:bg-lbta-bone">
                VIEW SCHEDULE & PRICING
              </Link>
              <Link
                href="/book"
                className="eyebrow inline-flex items-center justify-center border border-white text-white px-10 py-4 transition-all duration-300 hover:bg-white/10"
              >
                BOOK FREE TRIAL
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
