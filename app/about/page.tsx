import Link from 'next/link'
import Image from 'next/image'
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
    title: "The Work",
    description: "Perfect technique takes time. What happens faster: mental clarity, physical discipline, the confidence that comes from doing hard things well."
  },
  {
    title: "Your Path",
    description: "No two athletes develop the same way. We honor your unique strengths, address your specific challenges, design around your goals."
  },
  {
    title: "Honest Feedback",
    description: "Real progress requires truth. You'll always know where you stand, what's working, and what needs work. No sugar-coating, no false praise."
  },
  {
    title: "The Community",
    description: "From 3-year-olds learning focus to ATP professionals refining strategy. Everyone here is serious about getting better."
  }
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Our Story</p>
            <h1 className="text-display-lg heading-display mb-6">
              Where Character Meets  
              Championship
            </h1>
              <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                For five years, students have learned that good tennis teaches more than strokes. It builds focus, resilience, and the quiet confidence that comes from doing hard work well.
              </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-gray-100">
                <Image
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_HEROIMAGE-2.png"
                  alt="Laguna Beach Tennis Academy facilities with palm trees and tennis courts"
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8ZAAAAAAAAA//Z"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
                Why We Started
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  In 2020, Andrew Mateljan came back to Laguna Beach after coaching ATP/WTA players across Europe. The goal was simple: bring professional-level training to anyone serious about getting better.
                </p>
                <p>
                  What if tennis became the foundation for unshakeable confidence? What if the clarity required for perfect form translated into clarity in every life decision? What if the mental toughness needed to compete at the highest level built leaders who could excel anywhere?
                </p>
                <p>
                  Today, LBTA is living proof of this vision. Our athletes don't just win matches—they earn full scholarships to Stanford, develop the work ethic that transforms careers, and carry themselves with the quiet confidence that comes from true mastery.
                </p>
                <p>
                  This is tennis as character development. This is sport as life preparation. This is LBTA.
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
            <p className="text-overline mb-6">Our Foundation</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              The Principles That  
              Shape Champions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              These aren't just tennis values—they're life principles that our athletes carry far beyond the court.
            </p>
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
              Begin Your Excellence Journey
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Discover how tennis excellence becomes the foundation for confidence, character, and success in every area of life. Your transformation awaits.
            </p>
            <Link href="/book" className="btn-primary">
              REQUEST CONSULTATION
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
