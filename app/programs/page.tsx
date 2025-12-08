import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, Trophy, Target } from 'lucide-react'
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
              Find Your Program
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              Ages 3 to professional. Little Stars through ATP tour preparation. Small groups, ATP/WTA coaching, proven results.
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
              <div className="headline-sm text-lbta-charcoal">3</div>
              <div className="body-sm text-gray-600">ATP/WTA Players</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="headline-sm text-lbta-charcoal">Since 2020</div>
              <div className="body-sm text-gray-600">City Partner</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main Program Pathways */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Junior Development */}
            <AnimatedSection>
              <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_junior-hero.png"
                    alt="Junior tennis development"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>AGES 3–18</p>
                    <h2 className="headline-sm mb-4">Junior Development</h2>
                    <p className="body-sm text-gray-600">
                      From first lesson to D1 scholarship. Little Stars (ages 3-4) through High Performance training.
                    </p>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Users className="w-4 h-4 text-lbta-coral" />
                      <span>Small groups (4-6 players)</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Clock className="w-4 h-4 text-lbta-coral" />
                      <span>45min - 2hr sessions</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-lbta-coral" />
                      <span>20+ D1 college placements</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between body-sm">
                      <span className="text-gray-600">From</span>
                      <span className="font-medium text-lbta-charcoal">$120/month</span>
                    </div>
                  </div>

                  <Link
                    href="/programs/junior"
                    className="eyebrow mt-6 bg-lbta-coral text-white px-8 py-4 text-center transition hover:bg-lbta-coral-dark"
                  >
                    EXPLORE JUNIOR PROGRAMS
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Adult Programs */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_adult-hero.png"
                    alt="Adult tennis programs"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>ALL LEVELS</p>
                    <h2 className="headline-sm mb-4">Adult Programs</h2>
                    <p className="body-sm text-gray-600">
                      Beginner through USTA 4.0+. Same ATP/WTA coaching systems adapted to your level.
                    </p>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Users className="w-4 h-4 text-lbta-coral" />
                      <span>6-8 player groups</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Clock className="w-4 h-4 text-lbta-coral" />
                      <span>Morning, afternoon & evening options</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Target className="w-4 h-4 text-lbta-coral" />
                      <span>Fitness, social & competitive tracks</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between body-sm">
                      <span className="text-gray-600">From</span>
                      <span className="font-medium text-lbta-charcoal">$546/quarter</span>
                    </div>
                  </div>

                  <Link
                    href="/programs/adult"
                    className="eyebrow mt-6 bg-lbta-coral text-white px-8 py-4 text-center transition hover:bg-lbta-coral-dark"
                  >
                    EXPLORE ADULT PROGRAMS
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* High Performance */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_hp-hero.png"
                    alt="High performance tennis training"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>COMPETITIVE</p>
                    <h2 className="headline-sm mb-4">High Performance</h2>
                    <p className="body-sm text-gray-600">
                      College recruitment and ATP/WTA tour preparation. Application only.
                    </p>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-lbta-coral" />
                      <span>20+ D1 placements (Stanford, UCLA, USC)</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Clock className="w-4 h-4 text-lbta-coral" />
                      <span>15-20 hours/week intensive</span>
                    </div>
                    <div className="flex items-center gap-3 body-sm text-gray-600">
                      <Users className="w-4 h-4 text-lbta-coral" />
                      <span>UTR 5.0+ / Tournament players</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between body-sm">
                      <span className="text-gray-600">From</span>
                      <span className="font-medium text-lbta-charcoal">$1,437/quarter</span>
                    </div>
                  </div>

                  <Link
                    href="/programs/high-performance"
                    className="eyebrow mt-6 bg-lbta-charcoal text-white px-8 py-4 text-center transition hover:bg-lbta-charcoal/90"
                  >
                    VIEW HIGH PERFORMANCE
                  </Link>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Private Coaching Section */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Private Coaching</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              One-on-one sessions with ATP/WTA tour experienced coaches. Personalized attention for faster progress.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <AnimatedSection>
              <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300">
                <div className="mb-3">
                  <p className="subhead-sm mb-1">Andrew</p>
                  <p className="body-sm text-gray-600">ATP/WTA Coach</p>
                </div>
                <p className="body-sm text-lbta-charcoal font-medium">$250/hr</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300">
                <div className="mb-3">
                  <p className="subhead-sm mb-1">Kevin</p>
                  <p className="body-sm text-gray-600">College Prep</p>
                </div>
                <p className="body-sm text-lbta-charcoal font-medium">$150/hr</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300">
                <div className="mb-3">
                  <p className="subhead-sm mb-1">Savriyan</p>
                  <p className="body-sm text-gray-600">ATP Pro #556</p>
                </div>
                <p className="body-sm text-lbta-charcoal font-medium">$120/hr</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300">
                <div className="mb-3">
                  <p className="subhead-sm mb-1">Andy</p>
                  <p className="body-sm text-gray-600">USPTA Certified</p>
                </div>
                <p className="body-sm text-lbta-charcoal font-medium">$100/hr</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 p-6 text-center hover:border-lbta-charcoal/40 transition-all duration-300">
                <div className="mb-3">
                  <p className="subhead-sm mb-1">Michelle</p>
                  <p className="body-sm text-gray-600">Youth Director</p>
                </div>
                <p className="body-sm text-lbta-charcoal font-medium">$120/hr</p>
              </div>
            </AnimatedSection>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/coaches"
              className="eyebrow inline-flex items-center text-lbta-charcoal hover:text-lbta-coral transition pb-1"
              style={{ borderBottom: '1px solid #D1D5DB' }}
            >
              VIEW ALL COACHES →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose LBTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Why LBTA</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center">
                <h3 className="subhead mb-3">Small Groups</h3>
                <p className="body-sm text-gray-600">
                  4-8 students maximum. Personal attention at every session.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <h3 className="subhead mb-3">ATP/WTA Systems</h3>
                <p className="body-sm text-gray-600">
                  Tour-proven patterns adapted to your level. Same coaching Andrew uses with ATP #258.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <h3 className="subhead mb-3">Proven Results</h3>
                <p className="body-sm text-gray-600">
                  20+ D1 college placements. 3 ATP/WTA tour players currently training.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Scholarship */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6">
              Scholarship Program
            </h2>
            <p className="body-lg mb-8">
              $25,000+ awarded annually to families demonstrating need and commitment.
            </p>
            <div className="bg-white border border-gray-200 p-8 max-w-2xl mx-auto text-left">
              <p className="body-sm mb-4 text-gray-600">
                Scholarships cover 25-50% of program tuition for qualified families.
              </p>
              <p className="body-sm text-gray-600">
                Requirements: Household income &lt; $75K, 2+ sessions/week commitment, 3.5+ GPA
              </p>
              <div className="mt-6">
                <Link
                  href="/apply-scholarship"
                  className="eyebrow inline-flex items-center justify-center bg-lbta-coral text-white px-8 py-4 transition hover:bg-lbta-coral-dark"
                >
                  APPLY FOR SCHOLARSHIP
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6 text-white">
              Not Sure Which Program?
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              View full schedule with times and pricing, or book your free trial.
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
