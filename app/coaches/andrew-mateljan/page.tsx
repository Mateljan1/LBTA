import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const philosophy = [
  {
    number: "01",
    title: "Movement First",
    description: "Great footwork produces great shots. We build athletic foundations before technical refinement—speed, agility, and court coverage unlock stroke potential."
  },
  {
    number: "02",
    title: "Simplicity & System",
    description: "Complex theory doesn't win matches. We focus on fundamentals that translate to match play: clean technique, tactical awareness, percentage tennis."
  },
  {
    number: "03",
    title: "Performance Over Perfection",
    description: "Build confidence through execution. We train players to trust their strokes under pressure, not just on the practice court."
  },
  {
    number: "04",
    title: "Whole-Athlete Development",
    description: "Tennis requires more than on-court skills. We integrate fitness, recovery protocols, nutrition guidance, and mental performance training."
  },
  {
    number: "05",
    title: "Player Ownership",
    description: "We teach athletes to lead themselves. Self-evaluation, goal-setting, accountability—these are the skills that separate college players from professionals."
  }
]

const atpPlayers = [
  { name: "Karue Sell", rank: "ATP #262", status: "Current", achievement: "Active ATP Tour Professional" },
  { name: "Max McKennon", rank: "ATP #458", status: "Career High 2024", achievement: "Featured in Fit4Tennis Pro Workout Series" },
  { name: "Ryan Seggerman", rank: "ATP Singles #348, Doubles #68", status: "Career High 2024", achievement: "Professional Tour Success" },
  { name: "Colton Smith", rank: "ATP #133", status: "Career High 2025", achievement: "Rising Professional Prospect" },
]

export default function AndrewMateljanPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Coaches', href: '/coaches' },
        { label: 'Andrew Mateljan' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h1 className="text-display-lg heading-display mb-6">
              Andrew Mateljan
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 leading-relaxed">
              ATP/WTA Coach. Founder. Building championship-level players for 25 years.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Playing Career */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection>
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Playing Career
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Ranked #3 Southern California, #12 Nationally</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Winner: The Ojai Tournament</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Multiple SoCal Junior Tournament Victories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Finalist: Southern California Sectionals</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Coaching Journey
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>Started coaching at age 19</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>7+ years international coaching (Spain, Croatia, Norway)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>ATP Masters 1000 tournament experience (Indian Wells)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-burnt mt-1">•</span>
                  <span>European player development philosophy</span>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ATP Players */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light mb-4">
              Currently Coaching ATP-Ranked Players
            </h2>
            <p className="text-lg text-white/70 font-sans">
              One of the few academy directors actively coaching on the professional tour
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {atpPlayers.map((player, index) => (
              <AnimatedSection key={player.name} delay={index * 0.1}>
                <div className="bg-white/10 p-6 rounded-sm border border-white/20 hover:bg-white/20 transition-colors text-center">
                  <p className="text-xl font-sans font-medium mb-2">{player.name}</p>
                  <p className="text-lbta-burnt font-sans font-medium text-lg mb-2">{player.rank}</p>
                  <p className="text-sm text-white/70 mb-2">{player.status}</p>
                  <p className="text-xs text-white/50">{player.achievement}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Coaching Philosophy</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Five Pillars
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-3xl mx-auto">
              A systematic approach to player development refined over 25 years of coaching at every level
            </p>
          </AnimatedSection>

          <div className="space-y-8 max-w-4xl mx-auto">
            {philosophy.map((pillar, index) => (
              <AnimatedSection key={pillar.number} delay={index * 0.1}>
                <div className="card-lbta p-8 md:p-10 relative">
                  <div className="absolute top-4 left-4 text-7xl font-serif font-light text-lbta-burnt/10 leading-none">
                    {pillar.number}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Fit4Tennis & VYLO */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="card-lbta p-8">
                <h3 className="text-2xl font-sans font-medium mb-4">Fit4Tennis</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Global tennis fitness platform with 100,000+ followers across Instagram, YouTube, and TikTok. Andrew shares professional-grade training methods, movement drills, and strength conditioning protocols used by ATP/WTA players.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pro workout series featuring Max McKennon (ATP #458)</li>
                  <li>• Evidence-based strength, mobility, and conditioning</li>
                  <li>• Movement-first philosophy applied globally</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-gradient-to-br from-lbta-charcoal to-lbta-slate text-white p-8 rounded-sm border-2 border-vylo-orange">
                <h3 className="text-2xl font-sans font-medium mb-4">VYLO Performance Institute</h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  Co-founder of VYLO—a high-performance extension of LBTA philosophy. "Beyond the academy. Toward velocity." Elite training for serious athletes committed to professional or collegiate pathways.
                </p>
                <ul className="space-y-2 text-sm text-white/80 mb-6">
                  <li>• 10 athletes maximum—personalized attention</li>
                  <li>• Professional-grade training systems</li>
                  <li>• Excellence, alignment, measurable progress</li>
                </ul>
                <a href="/vylo" className="text-sm font-sans text-white tracking-wide hover:text-vylo-orange transition-colors border-b border-white/30 hover:border-vylo-orange pb-1 inline-block">
                  Learn About VYLO →
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Train with Andrew
            </h2>
            <div className="flex flex-col gap-4 mb-8 items-center">
              <a href="mailto:andrew@tennisbeast.com" className="flex items-center gap-3 text-gray-600 hover:text-lbta-burnt transition-colors">
                <Mail className="w-5 h-5" />
                <span>andrew@tennisbeast.com</span>
              </a>
              <a href="tel:9492410847" className="flex items-center gap-3 text-gray-600 hover:text-lbta-burnt transition-colors">
                <Phone className="w-5 h-5" />
                <span>(949) 241-0847</span>
              </a>
            </div>
            <Link
              href="/book"
              className="btn-primary"
            >
              SCHEDULE SESSION
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

