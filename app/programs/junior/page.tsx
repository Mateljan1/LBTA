import AnimatedSection from '@/components/ui/AnimatedSection'

const programs = [
  {
    id: "foundation",
    name: "Foundation Building",
    ages: "Ages 3-4",
    duration: "45 minutes",
    monthly_1x: 140,
    monthly_2x: 260,
    quarterly_prepay: 420,
    drop_in: 45,
    description: "First tennis experience through play-based learning. Builds coordination and confidence using foam balls.",
    badge: "Foundation Building",
    features: [
      "Movement fundamentals",
      "Coordination through play",
      "Early tennis exposure",
      "Confidence building"
    ]
  },
  {
    id: "red-ball",
    name: "Rally-Ready Training",
    ages: "Ages 5-7",
    duration: "60 minutes",
    monthly_1x: 140,
    monthly_2x: 260,
    quarterly_prepay: 420,
    drop_in: 45,
    description: "Build stroke fundamentals and rally skills on small courts. Most students rally within 12 weeks.",
    badge: "Rally-Ready in 12 Weeks",
    features: [
      "Forehand & backhand foundations",
      "Serving mechanics",
      "Rally consistency",
      "Net play introduction"
    ]
  },
  {
    id: "orange-ball",
    name: "Tournament Introduction",
    ages: "Ages 7-9",
    duration: "60 minutes",
    monthly_1x: 140,
    monthly_2x: 260,
    quarterly_prepay: 420,
    drop_in: 45,
    description: "Transition to competitive tennis. Develop spin, positioning, and early match awareness.",
    badge: "Tournament Introduction",
    features: [
      "Topspin & slice technique",
      "Court positioning",
      "Point construction",
      "First tournament prep"
    ]
  },
  {
    id: "green-dot",
    name: "Competitive Development",
    ages: "Ages 9-11",
    duration: "60 minutes",
    monthly_1x: 140,
    monthly_2x: 260,
    quarterly_prepay: 420,
    drop_in: 45,
    description: "Full court training with tactical focus. Prepare for competitive tournaments and match situations.",
    badge: "Competitive Development",
    features: [
      "Advanced mechanics",
      "Tactical patterns",
      "Full-court movement",
      "Tournament readiness"
    ]
  },
  {
    id: "youth",
    name: "Scholarship Pathway",
    ages: "Ages 11-15",
    duration: "90 minutes",
    monthly_1x: 200,
    monthly_2x: 380,
    quarterly_prepay: 610,
    drop_in: 60,
    description: "Structured training for college-bound athletes. Proven track record with 20+ D1 placements.",
    badge: "20 D1 Placements Since 2020",
    features: [
      "Advanced match tactics",
      "Physical conditioning",
      "Mental resilience",
      "NCAA recruitment prep"
    ]
  }
]

export default function JuniorProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Junior Development</p>
            <h1 className="text-display-lg heading-display mb-6">
              Ages 3 to Professional
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Structured pathways built by ATP-level coaches.  
              From first forehand to scholarship.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Winter 2026 Notice */}
      <section className="bg-lbta-cream py-6 border-b border-gray-200">
        <div className="container-lbta">
          <p className="text-center text-sm text-gray-600 font-sans">
            Winter 2026: January 6 – April 5 (13 weeks) • Registration Opens December 1, 2025
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="section-spacing bg-white">
        <div className="container-lbta space-y-16">
          {programs.map((program, index) => (
            <AnimatedSection key={program.id} delay={index * 0.1}>
              <div id={program.id} className="scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-lbta-charcoal text-white text-xs font-sans tracking-wider mb-4">
                      {program.badge}
                    </span>
                    <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-4">
                      {program.name}
                    </h2>
                    <p className="text-lg text-lbta-burnt font-sans font-medium mb-6">
                      {program.ages} • {program.duration}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {program.description}
                    </p>

                    <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4">
                      What You'll Learn
                    </h3>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-gray-600">
                          <span className="text-lbta-burnt mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing */}
                  <div>
                    <div className="card-lbta p-8">
                      <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-6">
                        Winter 2026 Pricing
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Monthly (1x/week)</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.monthly_1x}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Monthly (2x/week)</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.monthly_2x}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Quarterly (prepay)</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.quarterly_prepay}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-600">Drop-in Rate</span>
                          <span className="text-xl font-serif font-light text-lbta-charcoal">
                            ${program.drop_in}
                          </span>
                        </div>
                      </div>

                      <a
                        href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=junior_programs&utm_campaign=nextjs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full mt-8 justify-center"
                      >
                        START TRIAL
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Begin Your Tennis Journey
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Experience professional coaching. Zero commitment required.
            </p>
            <a
              href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=junior_cta&utm_campaign=nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              START FREE TRIAL
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

