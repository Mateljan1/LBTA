import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Match Play Friday - Competitive Tennis Event | LBTA',
  description: 'Friday evening match play for all ages. Junior session 4-5:30pm ($25), Adult session 6-8pm ($35). Round robin doubles, drop-in friendly.',
  keywords: 'tennis match play Laguna Beach, Friday tennis, round robin tennis, competitive tennis, drop-in tennis',
}

const features = [
  "Round robin format - play with different partners",
  "Supervised play - LBTA coach on-site",
  "All balls provided",
  "Drop-in friendly - no commitment",
  "Guaranteed court time",
  "Family discount available"
]

export default function MatchPlayPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Match Play</p>
            <h1 className="text-display-lg heading-display mb-6">
              Test Your Game
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Every Friday evening, you'll experience real match pressure in a supportive environment. Round robin doubles. All skill levels welcome. Your competitive confidence grows here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sessions */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Junior */}
            <AnimatedSection>
              <div className="card-lbta p-10">
                <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                  Junior Competitive Play
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Ages:</strong> 8-18, All Skill Levels</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Time:</strong> Fridays 4:00-5:30 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Format:</strong> Round Robin Doubles</span>
                  </div>
                </div>

                <div className="bg-lbta-tan rounded-sm p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-lbta-burnt" />
                    <h3 className="text-lg font-sans font-medium">Pricing</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop-In</span>
                      <span className="text-2xl font-serif font-light">$25</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Monthly: 4 sessions for $85 (save $15)
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="btn-primary w-full justify-center"
                >
                  RESERVE SPOT
                </Link>
              </div>
            </AnimatedSection>

            {/* Adult */}
            <AnimatedSection delay={0.2}>
              <div className="card-lbta p-10">
                <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                  Adult League Play
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Level:</strong> NTRP 2.5-4.5+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Time:</strong> Fridays 6:00-8:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-lbta-burnt" />
                    <span className="text-gray-600"><strong>Format:</strong> Round Robin Doubles</span>
                  </div>
                </div>

                <div className="bg-lbta-tan rounded-sm p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-lbta-burnt" />
                    <h3 className="text-lg font-sans font-medium">Pricing</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop-In</span>
                      <span className="text-2xl font-serif font-light">$35</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Monthly: 4 sessions for $120 (save $20)
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="btn-primary w-full justify-center"
                >
                  RESERVE SPOT
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} className="mt-12 text-center">
            <div className="card-lbta p-8 max-w-md mx-auto">
              <h3 className="text-xl font-sans font-medium mb-4">Family Package</h3>
              <p className="text-gray-600 mb-4">Bring family members for discounted rates</p>
              <div className="text-2xl font-serif font-light text-lbta-charcoal mb-2">
                $60 drop-in
              </div>
              <p className="text-sm text-gray-500">Monthly: $200 for family</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-spacing bg-lbta-tan">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              What to Expect
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={feature} delay={index * 0.05}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-lbta-burnt flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Join Friday
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Competitive play. Balanced pairings. Weekly.
            </p>
            <Link
              href="/book"
              className="btn-primary"
            >
              RESERVE SPOT
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

