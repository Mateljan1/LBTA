import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const whatYouGet = [
  { number: "01", title: "15-20 Hours Weekly", desc: "On-court training, match play, fitness integration, video analysis sessions" },
  { number: "02", title: "Tournament Support", desc: "Coach-accompanied events, strategy preparation, UTR tracking and optimization" },
  { number: "03", title: "College Placement", desc: "NCAA recruitment guidance, showcase events, scholarship application strategy" },
  { number: "04", title: "Performance Analytics", desc: "Video analysis, data tracking, personalized development planning" },
  { number: "05", title: "Mental Performance", desc: "Sports psychology, pressure management, competitive mindset development" },
  { number: "06", title: "Small Group Training", desc: "4-6 players maximum. Personal attention from ATP/WTA tour coaches" },
]

const placements = [
  "Stanford University",
  "UCLA",
  "USC",
  "UC Berkeley",
  "Pepperdine University",
  "UC Irvine",
]

const requirements = [
  "Ages 12-18",
  "Tournament experience required",
  "UTR 5.0+ or evaluation by Andrew",
  "Full commitment to training schedule",
  "Family support and alignment",
]

export default function HighPerformancePage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'High Performance' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>HIGH PERFORMANCE</p>
            <h1 className="display mb-6">
              Championship Training
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              Full-time development for competitive juniors. D1 college placement and ATP/WTA tour preparation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Results */}
      <section className="bg-lbta-bone border-y border-gray-200 py-16">
        <div className="container-lbta">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <div className="headline text-lbta-charcoal">20+</div>
              <div className="body-sm text-gray-600">D1 Placements</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="headline text-lbta-charcoal">#258</div>
              <div className="body-sm text-gray-600">ATP Coached</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="headline text-lbta-charcoal">15-20</div>
              <div className="body-sm text-gray-600">Hours/Week</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="headline text-lbta-charcoal">3</div>
              <div className="body-sm text-gray-600">ATP/WTA Coaches</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What You Get - No Icons, Just Numbers */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <h2 className="headline mb-4">Complete Development</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              Everything needed to compete at the highest levels and earn Division I scholarships.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {whatYouGet.map((item, index) => (
              <AnimatedSection key={item.number} delay={index * 0.05}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="eyebrow text-lbta-coral">{item.number}</span>
                  </div>
                  <div>
                    <h3 className="subhead-sm mb-2">{item.title}</h3>
                    <p className="body-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* College Placements */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-8">College Placements</h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {placements.map((school, index) => (
              <AnimatedSection key={school} delay={index * 0.05}>
                <div className="text-center">
                  <p className="subhead-sm text-lbta-charcoal">{school}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="body-sm text-gray-600">
              And 15+ additional Division I programs nationwide
            </p>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Requirements</h2>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto">
            <AnimatedSection delay={0.2}>
              <div className="bg-lbta-bone border border-gray-200 p-10">
                <div className="space-y-4 mb-10">
                  {requirements.map((req, index) => (
                    <div key={req} className="flex gap-6 items-start">
                      <span className="eyebrow text-lbta-coral flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="body-sm text-gray-700">{req}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/schedules"
                    className="flex-1 eyebrow bg-lbta-coral text-white px-8 py-4 text-center transition hover:bg-lbta-coral-dark"
                  >
                    SEE SCHEDULE & PRICING
                  </Link>
                  <Link
                    href="/book"
                    className="flex-1 eyebrow border border-lbta-charcoal text-lbta-charcoal px-8 py-4 text-center transition hover:bg-lbta-charcoal hover:text-white"
                  >
                    APPLY NOW
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section className="section-spacing bg-lbta-bone border-t border-gray-200">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Your Coaches</h2>
          </AnimatedSection>

          <div className="space-y-6 max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="subhead-sm mb-1">Andrew Mateljan</p>
                    <p className="body-sm text-gray-600">ATP/WTA Tour Coach</p>
                  </div>
                  <span className="eyebrow text-lbta-coral">01</span>
                </div>
                <p className="body-sm text-gray-600 mt-4">
                  Currently coaches ATP #258 Karue Sell. Former top-ranked national junior with international coaching experience.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="subhead-sm mb-1">Kevin Jackson</p>
                    <p className="body-sm text-gray-600">College Prep Expert</p>
                  </div>
                  <span className="eyebrow text-lbta-coral">02</span>
                </div>
                <p className="body-sm text-gray-600 mt-4">
                  20+ Division I placements. Expert in NCAA recruitment process and college tennis strategy.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="subhead-sm mb-1">Savriyan Danilov</p>
                    <p className="body-sm text-gray-600">ATP Professional</p>
                  </div>
                  <span className="eyebrow text-lbta-coral">03</span>
                </div>
                <p className="body-sm text-gray-600 mt-4">
                  Career high ATP ranking #556. Professional tour experience brings real competitive insights.
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
            <h2 className="headline mb-6 text-white">
              Ready to Compete?
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              Application required. We evaluate readiness and contact you within 24 hours.
            </p>
            <Link href="/book" className="eyebrow inline-flex items-center justify-center bg-white text-lbta-charcoal px-10 py-4 transition-all duration-300 hover:bg-lbta-bone">
              APPLY FOR HIGH PERFORMANCE
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
