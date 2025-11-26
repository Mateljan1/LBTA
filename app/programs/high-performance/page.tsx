import AnimatedSection from '@/components/ui/AnimatedSection'

const programs = [
  {
    id: "hp-training",
    name: "HP Training",
    age_level: "Ages 12-17 / UTR 5.0-8.0",
    duration: "90 minutes",
    monthly_1x: 260,
    monthly_2x: 490,
    quarterly_prepay: 795,
    drop_in: 75,
    description: "Intensive training for tournament players. Technical refinement, tactical mastery, fitness integration, and mental performance coaching."
  },
  {
    id: "college-bound",
    name: "College Bound",
    age_level: "Ages 14-18 / UTR 8.0+",
    duration: "120 minutes",
    monthly_1x: 260,
    monthly_2x: 520,
    quarterly_prepay: 795,
    drop_in: 85,
    description: "Elite training for college-bound athletes. Includes NCAA recruitment guidance, college prep strategies, and advanced performance training."
  }
]

const components = [
  "Technical Training",
  "Video Analysis",
  "Fitness & Movement",
  "Mental Performance",
  "Tournament Strategy",
  "College Recruitment"
]

export default function HighPerformancePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">High Performance</p>
            <h1 className="text-display-lg heading-display mb-6">
              Championship Training
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Elite development for competitive juniors and college-bound athletes.  
              Ages 10-18.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta space-y-16">
          {programs.map((program, index) => (
            <AnimatedSection key={program.id} delay={index * 0.1}>
              <div id={program.id} className="card-lbta p-10">
                <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-4">
                  {program.name}
                </h2>
                <p className="text-lg text-lbta-burnt font-sans mb-6">
                  {program.age_level}
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {program.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4">
                      Training Components
                    </h3>
                    <ul className="space-y-2">
                      {components.map((component) => (
                        <li key={component} className="flex items-start gap-3 text-gray-600">
                          <span className="text-lbta-burnt mt-1">•</span>
                          <span>{component}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-6">
                      Winter 2026 Pricing
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Monthly (1x/week)</span>
                        <span className="text-xl font-serif font-light">${program.monthly_1x}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Monthly (2x/week)</span>
                        <span className="text-xl font-serif font-light">${program.monthly_2x}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Quarterly (prepay)</span>
                        <span className="text-xl font-serif font-light">${program.quarterly_prepay}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600">Drop-in</span>
                        <span className="text-xl font-serif font-light">${program.drop_in}</span>
                      </div>
                    </div>

                    <a
                      href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=hp_programs&utm_campaign=nextjs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full mt-8 justify-center"
                    >
                      APPLY NOW
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Coaches */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Your High Performance Coaches
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="card-lbta p-6">
                <h3 className="text-xl font-sans font-medium mb-2">Andrew Mateljan</h3>
                <p className="text-lbta-burnt font-sans font-medium mb-2">Director • ATP/WTA Tour Coach</p>
                <p className="text-gray-600">
                  Elite-level coaching with extensive experience on the ATP/WTA tours.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card-lbta p-6">
                <h3 className="text-xl font-sans font-medium mb-2">Kevin Jackson</h3>
                <p className="text-lbta-burnt font-sans font-medium mb-2">Head Coach • College Prep Specialist</p>
                <p className="text-gray-600">
                  20+ D1 college placements. Expert in NCAA recruitment process.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="card-lbta p-6">
                <h3 className="text-xl font-sans font-medium mb-2">Savriyan Danilov</h3>
                <p className="text-lbta-burnt font-sans font-medium mb-2">ATP Professional • Career High #556</p>
                <p className="text-gray-600">
                  Professional tour experience brings real-world competitive insights.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Ready to Train at the Highest Level?
            </h2>
            <p className="text-lg font-sans font-light text-white/80 mb-4 leading-relaxed">
              Join our elite training program today
            </p>
            <p className="text-sm text-white/60 mb-8">
              Approval required. We'll contact you within 24 hours.
            </p>
            <a
              href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=hp_cta&utm_campaign=nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
              style={{ minHeight: '48px', letterSpacing: '1.5px' }}
            >
              APPLY FOR HIGH PERFORMANCE
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

