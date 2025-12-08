import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const methodology = [
  { number: "01", title: "Speed", desc: "First-step quickness and court coverage. Sprint mechanics, lateral acceleration, direction changes." },
  { number: "02", title: "Stamina", desc: "Cardiovascular endurance for three-set matches. VO2 max development and match conditioning." },
  { number: "03", title: "Agility", desc: "Tennis-specific movement patterns. Multi-directional footwork and deceleration control." },
  { number: "04", title: "Strength", desc: "Functional power for injury prevention and shot velocity. Rotational power and core stability." },
]

export default function FitnessPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Fitness' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>FIT4TENNIS</p>
            <h1 className="display mb-6">
              Tennis-Specific Training
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              Performance conditioning designed by ATP/WTA tour coaches. Science-backed training used by professional players.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-lbta-bone border-y border-gray-200 py-16">
        <div className="container-lbta">
          <AnimatedSection>
            <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100">
              <Image
                src="/photos/GymSetting.png"
                alt="Fit4Tennis training facility"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Four Pillars */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <h2 className="headline mb-4">The Fit4Tennis Method</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              Four pillars of championship fitness. Developed for ATP professionals, adapted for all levels.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {methodology.map((item, index) => (
              <AnimatedSection key={item.number} delay={index * 0.05}>
                <div className="flex gap-6 p-6 border-l-2 border-lbta-coral bg-lbta-bone/50">
                  <div className="flex-shrink-0">
                    <span className="eyebrow text-lbta-coral">{item.number}</span>
                  </div>
                  <div>
                    <h3 className="subhead-sm mb-3">{item.title}</h3>
                    <p className="body-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Group Training */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="headline mb-6">Group Training</h2>
              <p className="body-lg text-gray-600 mb-8">
                High-intensity sessions at Laguna Beach. Small groups, professional coaching, complete programming.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <span className="eyebrow text-lbta-coral flex-shrink-0">WHERE</span>
                  <p className="body-sm text-gray-600">Laguna Beach High School</p>
                </div>
                <div className="flex gap-4">
                  <span className="eyebrow text-lbta-coral flex-shrink-0">WHEN</span>
                  <p className="body-sm text-gray-600">Tuesday & Thursday, 5:30-6:30pm</p>
                </div>
                <div className="flex gap-4">
                  <span className="eyebrow text-lbta-coral flex-shrink-0">WHO</span>
                  <p className="body-sm text-gray-600">All levels welcome, max 12 participants</p>
                </div>
              </div>

              <Link
                href="/schedules"
                className="eyebrow bg-lbta-coral text-white px-10 py-4 inline-flex items-center transition hover:bg-lbta-coral-dark"
              >
                SEE SCHEDULE & PRICING
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="subhead mb-6">What's Included</h3>
                <div className="space-y-3">
                  {[
                    "NASM-certified coaching",
                    "Tennis-specific movement training",
                    "12-week progressive programming",
                    "Video analysis and form correction",
                    "Competition preparation",
                    "Recovery and mobility work"
                  ].map((item, index) => (
                    <div key={item} className="flex gap-4">
                      <span className="eyebrow text-lbta-coral flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="body-sm text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Fit4Tennis Platform */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6">Train Anywhere</h2>
            <p className="body-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't make it to Laguna Beach? Access Andrew's complete training library online. 100+ workouts, 100K+ global community.
            </p>
            <Link
              href="https://www.fit4tennis.com"
              target="_blank"
              className="eyebrow border border-lbta-charcoal text-lbta-charcoal px-10 py-4 inline-flex items-center transition hover:bg-lbta-charcoal hover:text-white"
            >
              VISIT FIT4TENNIS.COM
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6 text-white">
              Start Training
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              First session free for new members. See full schedule and pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedules" className="eyebrow inline-flex items-center justify-center bg-white text-lbta-charcoal px-10 py-4 transition-all duration-300 hover:bg-lbta-bone">
                VIEW SCHEDULE
              </Link>
              <Link
                href="/book"
                className="eyebrow inline-flex items-center justify-center border border-white text-white px-10 py-4 transition-all duration-300 hover:bg-white/10"
              >
                BOOK FREE SESSION
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
