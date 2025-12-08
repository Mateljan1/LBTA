import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Clock, Target, Users, TrendingUp, Award } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const placements = [
  "Stanford University",
  "UCLA",
  "USC",
  "UC Berkeley",
  "Pepperdine",
  "And 15+ more D1 programs"
]

const whatYouGet = [
  { icon: Clock, title: "15-20 Hours Weekly", desc: "On-court training, match play, fitness, video analysis" },
  { icon: Users, title: "Small Group Focus", desc: "4-6 players maximum. Personal attention from ATP/WTA coaches" },
  { icon: Trophy, title: "Tournament Support", desc: "Coach-accompanied events, strategy sessions, UTR tracking" },
  { icon: Target, title: "College Placement", desc: "NCAA recruitment guidance, showcase event prep, scholarship strategy" },
  { icon: TrendingUp, title: "Performance Analytics", desc: "Video analysis, progress tracking, personalized development plans" },
  { icon: Award, title: "Mental Coaching", desc: "Sports psychology, pressure management, competitive mindset" },
]

const requirements = [
  "Ages 12-18",
  "Tournament experience required",
  "UTR 5.0+ (or evaluation by Andrew)",
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
      <section className="relative bg-white pt-32 pb-16">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>HIGH PERFORMANCE</p>
            <h1 className="display mb-6">
              Championship Training
            </h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-600">
              Full-time development for competitive juniors seeking D1 college placement or ATP/WTA tour preparation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Track Record */}
      <section className="bg-lbta-bone border-y border-gray-200 py-12">
        <div className="container-lbta">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <div className="headline-sm text-lbta-charcoal">20+</div>
              <div className="body-sm text-gray-600">D1 Placements</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="headline-sm text-lbta-charcoal">#258</div>
              <div className="body-sm text-gray-600">ATP Coached</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="headline-sm text-lbta-charcoal">15-20</div>
              <div className="body-sm text-gray-600">Hours/Week</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="headline-sm text-lbta-charcoal">3</div>
              <div className="body-sm text-gray-600">ATP/WTA Coaches</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Complete Development</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              Everything needed to compete at the highest levels and earn college scholarships.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouGet.map((item, index) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={index * 0.05}>
                  <div className="bg-white border border-gray-200 p-6 hover:border-lbta-charcoal/40 transition-all duration-300">
                    <Icon className="w-5 h-5 mb-4" style={{ color: '#E8956F' }} />
                    <h3 className="subhead-sm mb-2">{item.title}</h3>
                    <p className="body-sm text-gray-600">{item.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* College Placements */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6">College Placements</h2>
            <p className="body-lg mb-8 text-gray-600">
              LBTA athletes have earned Division I scholarships at:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {placements.map((school, index) => (
                <AnimatedSection key={school} delay={index * 0.05}>
                  <div className="body-sm text-lbta-charcoal">
                    {school}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Who This Is For</h2>
            <p className="body-sm text-gray-600 max-w-2xl mx-auto">
              High Performance training is selective. Athletes must demonstrate commitment and competitive readiness.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-lbta-bone border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="subhead mb-6">Requirements</h3>
              <ul className="space-y-3 mb-8">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3 body-sm text-gray-600">
                    <span className="text-lbta-coral mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
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
      </section>

      {/* Coaches */}
      <section className="section-spacing bg-lbta-bone border-t border-gray-200">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">Your Coaches</h2>
            <p className="body-sm text-gray-600">
              Train with coaches who've competed and coached at the highest levels.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedSection>
              <div className="bg-white border border-gray-200 p-6 text-center">
                <p className="subhead-sm mb-1">Andrew Mateljan</p>
                <p className="body-sm text-gray-600 mb-2">ATP/WTA Tour Coach</p>
                <p className="body-sm text-lbta-coral">Currently coaches ATP #258</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 p-6 text-center">
                <p className="subhead-sm mb-1">Kevin Jackson</p>
                <p className="body-sm text-gray-600 mb-2">College Prep Expert</p>
                <p className="body-sm text-lbta-coral">20+ D1 placements</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 p-6 text-center">
                <p className="subhead-sm mb-1">Savriyan Danilov</p>
                <p className="body-sm text-gray-600 mb-2">ATP Professional</p>
                <p className="body-sm text-lbta-coral">Career high ATP #556</p>
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
              Application required. We'll evaluate your readiness and contact you within 24 hours.
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
