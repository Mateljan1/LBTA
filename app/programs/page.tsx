import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import TestimonialQuote from '@/components/ui/TestimonialQuote'

const programs = [
  {
    category: "Junior Development",
    description: "Ages 3-18. Foundation building through competitive development.",
    offerings: [
      { name: "Little Tennis Stars", ages: "Ages 3-4", price: "$140/mo", link: "/programs/junior#foundation" },
      { name: "Red Ball Training", ages: "Ages 5-7", price: "$140/mo", link: "/programs/junior#red-ball" },
      { name: "Orange Ball Development", ages: "Ages 7-9", price: "$140/mo", link: "/programs/junior#orange-ball" },
      { name: "Green Dot Mastery", ages: "Ages 9-11", price: "$140/mo", link: "/programs/junior#green-dot" },
      { name: "Youth Development", ages: "Ages 11-15", price: "$200/mo", link: "/programs/junior#youth" },
      { name: "High Performance", ages: "Ages 12-17", price: "$260/mo", link: "/programs/high-performance" },
    ],
    link: "/programs/junior"
  },
  {
    category: "Adult Programs",
    description: "All skill levels. Beginner instruction through competitive training.",
    offerings: [
      { name: "First Strokes", level: "NTRP 1.0-2.5", price: "$180/mo", link: "/programs/adult#beginner" },
      { name: "League Ready", level: "NTRP 3.0-3.5", price: "$240/mo", link: "/programs/adult#intermediate" },
      { name: "Competitive Excellence", level: "NTRP 4.0+", price: "$300/mo", link: "/programs/adult#advanced" },
      { name: "Cardio Tennis", level: "All Levels", price: "$180/mo", link: "/programs/adult#cardio" },
    ],
    link: "/programs/adult"
  },
  {
    category: "Private Instruction",
    description: "One-on-one coaching with ATP/WTA experienced professionals.",
    offerings: [
      { name: "Andrew Mateljan", specialty: "ATP/WTA Tour Coach", price: "$250/hr", link: "/coaches/andrew-mateljan" },
      { name: "Kevin Jackson", specialty: "College Prep Specialist", price: "$150/hr", link: "/coaches#kevin" },
      { name: "Savriyan Danilov", specialty: "ATP Pro #556", price: "$120/hr", link: "/coaches#savriyan" },
      { name: "Andy Wu", specialty: "USPTA Certified", price: "$100/hr", link: "/coaches#andy" },
      { name: "Michelle Bevins", specialty: "Youth Director", price: "$120/hr", link: "/coaches#michelle" },
    ],
    link: "/programs/private"
  },
]

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Programs</p>
            <h1 className="text-display-lg heading-display mb-6">
              Our Programs
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ages 3 to professional. Beginners to tour players.  
              Find what fits.
            </p>
          </AnimatedSection>
        </div>
      </section>


      {/* Programs Overview */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {programs.map((program, index) => (
              <AnimatedSection key={program.category} delay={index * 0.1}>
                <div className="card-lbta p-8 md:p-10 h-full flex flex-col">
                  <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-4">
                    {program.category}
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                    {program.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {program.offerings.map((offering) => (
                      <div key={offering.name} className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                        <div>
                          <div className="text-sm font-sans font-medium text-lbta-charcoal">
                            {offering.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {'ages' in offering ? offering.ages : 'level' in offering ? offering.level : offering.specialty}
                          </div>
                        </div>
                        <div className="text-sm font-sans text-gray-500 tracking-wide">
                          {offering.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={program.link}
                    className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow">
          <TestimonialQuote 
            quote="Andrew transformed my son's tennis game and his confidence. The D1 scholarship offer was the result we hoped for—the life skills he gained were the bonus we didn't expect."
            author="Sarah M."
            role="Parent of D1 Player"
          />
        </div>
      </section>

      {/* Scholarship Information */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Scholarship Program
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              $25,000+ awarded annually to families demonstrating need and commitment.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="card-lbta p-10 max-w-3xl mx-auto">
              <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-6">
                Requirements
              </h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Household income below $75,000/year</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Student commitment to 2+ sessions per week</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Academic good standing (2.5+ GPA for students)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Brief essay on tennis goals and family situation</span>
                </li>
              </ul>

              <p className="text-gray-600 mb-4">
                Scholarships cover 25-50% of program tuition for qualified families.
              </p>

              <p className="text-sm text-gray-500">
                Email applications to{' '}
                <a href="mailto:scholarships@lagunabeachtennisacademy.com" className="text-lbta-burnt hover:text-lbta-orange transition-colors">
                  scholarships@lagunabeachtennisacademy.com
                </a>
                {' '}by December 15 for Winter 2026 consideration.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Not Sure Which Program Fits?
            </h2>
            <p className="text-lg font-sans font-light text-white/80 mb-10 leading-relaxed">
              Schedule a complimentary consultation. We'll assess your level and recommend the ideal path.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
              style={{ minHeight: '48px', letterSpacing: '1.5px' }}
            >
              SCHEDULE CONSULTATION
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
