import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>Programs</p>
            <h1 className="display mb-6">
              Find Your Path
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              Three paths. One standard. ATP/WTA coaching for all ages and levels.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Three Program Pathways */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Junior Development */}
            <AnimatedSection>
              <Link href="/schedules" className="block group">
                <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src="/photos/junior-program-hero.jpg"
                      alt="Junior tennis development"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>AGES 3–18</p>
                    <h2 className="headline-sm mb-4 group-hover:text-lbta-coral transition-colors">
                      Junior Development
                    </h2>
                    <p className="body-sm text-gray-600 mb-6">
                      From first lesson to D1 scholarship. Little Stars (ages 3-4) through High Performance training.
                    </p>
                    <div className="eyebrow text-lbta-charcoal group-hover:text-lbta-coral transition-colors inline-flex items-center">
                      SEE SCHEDULE & PRICING →
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Adult Programs */}
            <AnimatedSection delay={0.1}>
              <Link href="/schedules" className="block group">
                <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src="/photos/adult-program.jpg"
                      alt="Adult tennis programs"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>ALL LEVELS</p>
                    <h2 className="headline-sm mb-4 group-hover:text-lbta-coral transition-colors">
                      Adult Programs
                    </h2>
                    <p className="body-sm text-gray-600 mb-6">
                      Beginner through USTA 4.0+. Fitness, social connection, and competitive play.
                    </p>
                    <div className="eyebrow text-lbta-charcoal group-hover:text-lbta-coral transition-colors inline-flex items-center">
                      SEE SCHEDULE & PRICING →
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* High Performance */}
            <AnimatedSection delay={0.2}>
              <Link href="/schedules" className="block group">
                <div className="bg-white border border-gray-200 overflow-hidden hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src="/photos/high-performance.jpg"
                      alt="High performance tennis training"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="eyebrow mb-3" style={{ color: '#E8956F' }}>COMPETITIVE</p>
                    <h2 className="headline-sm mb-4 group-hover:text-lbta-coral transition-colors">
                      High Performance
                    </h2>
                    <p className="body-sm text-gray-600 mb-6">
                      College recruitment and ATP/WTA tour preparation. Application only.
                    </p>
                    <div className="eyebrow text-lbta-charcoal group-hover:text-lbta-coral transition-colors inline-flex items-center">
                      VIEW PROGRAM DETAILS →
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Private Coaching Brief Mention */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-4">Private Coaching</h2>
            <p className="body-lg text-gray-600 mb-8">
              One-on-one sessions with ATP/WTA tour coaches. $100-$250 per hour.
            </p>
            <Link
              href="/coaches"
              className="eyebrow inline-flex items-center justify-center border border-lbta-charcoal text-lbta-charcoal px-10 py-4 transition hover:bg-lbta-charcoal hover:text-white"
            >
              VIEW COACHES & RATES
            </Link>
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
              Book your complimentary trial session.
            </p>
            <Link href="/book" className="eyebrow inline-flex items-center justify-center bg-white text-lbta-charcoal px-10 py-4 transition-all duration-300 hover:bg-lbta-bone">
              BOOK FREE TRIAL
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
