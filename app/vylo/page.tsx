import AnimatedSection from '@/components/ui/AnimatedSection'

const admissionSteps = [
  {
    number: "01",
    title: "Initial Consultation",
    duration: "45-60 minutes | Complimentary | Confidential",
    description: "Video call with both co-founders. We assess alignment: your athlete's goals, family commitment capacity, long-term objectives. What we're assessing: Is this the right system? What you're assessing: Are we the right coaches? No pressure. Just honest conversation."
  },
  {
    number: "02",
    title: "Player Evaluation",
    duration: "2-3 hours | $300 (credited if accepted)",
    description: "On-court assessment: stroke analysis (filmed), tactical patterns, movement testing, mental composure, competitive mindset. You receive written evaluation, video analysis, honest assessment. Results within 48 hours."
  },
  {
    number: "03",
    title: "30-Day Trial Period",
    duration: "$750 (credited if accepted)",
    description: "Integration into VYLO system. Full training access (8-12 sessions), personalized blueprint, integration with current players. Mutual evaluation period. Either party can exit. Fit matters more than revenue."
  },
  {
    number: "04",
    title: "Full Integration",
    duration: "Ongoing | $2,200-3,500/month",
    description: "Upon mutual agreement: customized schedule (12-20 hrs/week), performance blueprint, video analysis after every session, mental coaching, tournament strategy, recruiting management, monthly family calls. Investment based on volume and age."
  }
]

const principles = [
  {
    roman: "I.",
    title: "Selective",
    description: "Filter for alignment, not volume. We designed VYLO for ten committed families who value systematic mastery over popularity. Quality beats quantity. Always."
  },
  {
    roman: "II.",
    title: "Structure",
    description: "We manage evolution, not sessions. Your athlete receives a performance architecture: technical refinement, tactical intelligence, mental conditioning, competition strategy—unified and measurable."
  },
  {
    roman: "III.",
    title: "Systematic Mastery",
    description: "We track every session. Video-analyze every stroke. Benchmark every adjustment. Mastery emerges from systematic, measured progression."
  }
]

export default function VYLOPage() {
  return (
    <>
      {/* Hero - VYLO Aesthetic */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/10dc22497_VYLOCOURTSETTING1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 container-narrow text-center px-6 py-40">
          <AnimatedSection>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/1daf9879b_VYLO_logo_grayscale_version.png"
              alt="VYLO Performance Institute"
              className="mx-auto mb-16"
              style={{ 
                width: '110px',
                filter: 'brightness(0) invert(1)'
              }}
            />

            <p className="font-sans text-xs uppercase text-white/60 mb-6 tracking-ultra-wide">
              Launching January 2026
            </p>

            <h1 className="text-4xl md:text-6xl font-serif font-light text-white mb-10 leading-tight">
              This Isn't an Academy.
              <br />
              It's a System Built for Velocity.
            </h1>

            <p className="text-base md:text-lg font-sans font-light text-white/85 mb-12 max-w-2xl mx-auto leading-relaxed">
              VYLO manages the process of excellence for 10 athletes. Precision with purpose. By selection, not recruitment.
            </p>

            <p className="text-sm text-white/70 mb-12 font-sans tracking-wide">
              20 Division I placements  |  3 ATP/WTA professionals  |  Laguna Beach, California
            </p>

            <a
              href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=vylo&utm_campaign=consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-12 py-4 border border-white/50 text-white font-sans text-sm font-medium tracking-ultra-wide hover:bg-white/10 hover:border-white transition-all duration-500"
              style={{ minHeight: '48px', letterSpacing: '2px' }}
            >
              REQUEST CONSULTATION
            </a>

            <p className="text-xs text-white/65 mt-6 font-sans">
              Ten athletes. Two coaches. Zero compromises.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-16">
            <p className="text-overline mb-6">Position</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              We Don't Recruit. We Align.
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                VYLO is a performance institute. Not an academy. Not a program. An environment engineered for Grand Slam-level development.
              </p>
              <p>
                Ten athletes. Two performance directors. One outcome: athletes remembered by achievement, not participation.
              </p>
              <p>
                We are a selective ecosystem designed to produce Grand Slam-level athletes. By selection, not recruitment. We don't sell coaching. We manage the process of excellence.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Admission Process */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Admission</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Ten Athletes. Selection Only.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Every spot represents commitment, not convenience. VYLO partnerships begin with alignment—between player, family, and performance team.
            </p>
          </AnimatedSection>

          <div className="space-y-12">
            {admissionSteps.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-vylo-orange flex items-center justify-center mb-6">
                    <span className="font-sans font-semibold text-xl text-vylo-orange">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-vylo-orange mb-5 tracking-wide">
                    {step.duration}
                  </p>
                  <p className="text-gray-600 max-w-2xl leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
            {principles.map((principle, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="relative">
                  <div className="w-8 h-0.5 bg-vylo-orange mb-8" />
                  <div className="text-8xl font-serif font-light text-lbta-cream mb-[-40px]">
                    {principle.roman}
                  </div>
                  <h3 className="text-2xl font-serif font-normal text-lbta-charcoal mb-6 leading-tight">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs">
                    {principle.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              We Don't Chase Clients.  
              We Filter for Alignment.
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed max-w-2xl mx-auto mb-12">
              <p>
                Your child has talent. You've invested years and thousands of dollars. But something's missing.
              </p>
              <p>
                You need a system—precision, structure, accountability—without relocating your family or spending $60,000/year at a boarding academy.
              </p>
              <p>
                VYLO exists for that gap. Ten athletes. Unlimited accountability. Zero excuses.
              </p>
            </div>
            
            <a
              href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=vylo_cta&utm_campaign=consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-12 py-4 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
              style={{ minHeight: '48px', letterSpacing: '1.5px' }}
            >
              REQUEST PRIVATE CONSULTATION
            </a>

            <p className="text-sm text-white/60 mt-8">
              Most consultations happen within 5-7 days of request.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

