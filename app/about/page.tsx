import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

const milestones = [
  {
    year: "2020",
    title: "LBTA Founded",
    description: "Andrew Mateljan establishes Laguna Beach Tennis Academy, bringing ATP/WTA-level coaching to the community. City of Laguna Beach partnership begins."
  },
  {
    year: "2021",
    title: "First D1 Placements",
    description: "Three academy students earn Division I college scholarships, establishing LBTA's reputation for elite player development."
  },
  {
    year: "2022",
    title: "Program Expansion",
    description: "Added High Performance track and expanded to three city facilities. Enrollment reaches 100+ active students."
  },
  {
    year: "2023",
    title: "ATP Success",
    description: "Karue Sell improves 600 ATP ranking spots while training with Andrew. Fit4Tennis reaches 100K+ followers globally."
  },
  {
    year: "2024",
    title: "20+ D1 Placements",
    description: "Milestone achievement: Over 20 Division I college scholarships awarded to LBTA-trained athletes. VYLO Performance Institute announced."
  },
  {
    year: "2025",
    title: "Continued Excellence",
    description: "200+ active members. Three ATP-ranked players currently training. Scholarship program expands to $25K+ annually."
  }
]

const values = [
  {
    title: "Excellence",
    description: "We pursue mastery in technique, tactics, and mental performance. Championship-level standards applied at every level."
  },
  {
    title: "Individual Development",
    description: "Every student receives personalized attention. We group by skill level, not just age. Custom training plans for each athlete."
  },
  {
    title: "Honest Communication",
    description: "We tell you the truth about your level, timeline, and realistic goals. No false promises. Just professional guidance."
  },
  {
    title: "Community",
    description: "200+ families training together. From ages 3 to ATP professionals. Everyone values discipline, progress, and belonging."
  }
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">About LBTA</p>
            <h1 className="text-display-lg heading-display mb-6">
              Excellence Built Here
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Championship-level tennis training in Laguna Beach since 2020.  
              Official City Partner.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_HEROIMAGE-2.png?quality=95"
                alt="Laguna Beach Tennis Academy facilities"
                className="w-full h-auto rounded-sm"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Laguna Beach Tennis Academy was founded in 2020 by Andrew Mateljan—a former top-ranked national junior and professional coach with international experience across Spain, Croatia, and Norway.
                </p>
                <p>
                  After years coaching on the ATP/WTA tours, Andrew returned to Laguna Beach with a mission: create a training environment where technical precision meets authentic mentorship. Where players of every level—from 3-year-olds discovering tennis to professionals competing on tour—receive the same systematic approach to development.
                </p>
                <p>
                  Today, LBTA serves 200+ families across three premier city facilities, maintains the official City of Laguna Beach tennis partnership, and has helped 20+ athletes earn Division I college scholarships while currently coaching multiple ATP-ranked professionals.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Our Journey</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Five Years of Growth
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {milestones.map((milestone, index) => (
              <AnimatedSection key={milestone.year} delay={index * 0.1}>
                <div className="flex gap-8">
                  <div className="flex-shrink-0 w-24 text-right">
                    <div className="text-3xl font-serif font-light text-lbta-burnt">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-8">
                    <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Our Values</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              What We Stand For
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="text-center">
                  <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Join Our Tennis Community
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Experience the difference that dedicated coaching and a supportive environment can make
            </p>
            <Link href="/book" className="btn-primary">
              SCHEDULE TRIAL
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
