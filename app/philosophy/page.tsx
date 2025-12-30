import { Brain, Compass, Lightbulb, Target, Users, Zap } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const principles = [
  {
    icon: Target,
    title: 'Excellence Through Clarity',
    description: 'Excellence isn\'t accidental. Every stroke, every movement, every tactical decision receives focused attention. We believe in deliberate practice—breaking complex skills into manageable elements, refining each component, and integrating them into fluid performance.',
  },
  {
    icon: Brain,
    title: 'Mind and Body as One',
    description: 'Tennis is as much mental as physical. We develop mental resilience alongside technical skill, teaching players to manage pressure, maintain focus, and learn from both victories and defeats. The strongest players command their inner game.',
  },
  {
    icon: Compass,
    title: 'Individual Paths to Excellence',
    description: 'No two players are alike. We reject cookie-cutter instruction in favor of personalized development that honors each student\'s unique strengths, learning style, and aspirations. Your journey is yours alone—we\'re here to guide it.',
  },
  {
    icon: Zap,
    title: 'Progress Over Perfection',
    description: 'Growth happens in increments. We celebrate small improvements and consistent effort over flashy results. By focusing on the process rather than outcome alone, we build sustainable development and lasting skill.',
  },
  {
    icon: Users,
    title: 'Community Elevates Everyone',
    description: 'Tennis connects us. Training alongside others who share your passion creates energy, accountability, and inspiration. We cultivate an environment where players push each other to improve while supporting one another\'s journey.',
  },
  {
    icon: Lightbulb,
    title: 'Understanding Over Repetition',
    description: 'True learning requires understanding why, not just how. We explain the biomechanics, strategy, and reasoning behind every technique, empowering you to self-correct, adapt, and continue growing beyond our time together.',
  },
]

const methodology = [
  {
    phase: 'Assessment',
    description: 'We begin by understanding where you are. Through careful observation and conversation, we identify your current skill level, physical capabilities, learning preferences, and specific goals.',
  },
  {
    phase: 'Foundation',
    description: 'Strong fundamentals create lasting success. We ensure proper technique in core strokes, establishing patterns that will serve you throughout your tennis journey.',
  },
  {
    phase: 'Development',
    description: 'With fundamentals in place, we expand your game—adding variety, power, and tactical sophistication. This is where your personal style begins to emerge.',
  },
  {
    phase: 'Refinement',
    description: 'Advanced players focus on subtle improvements that yield significant results. We use video analysis, match play, and detailed feedback to polish each aspect of your game.',
  },
  {
    phase: 'Integration',
    description: 'The final phase brings everything together in competitive situations. You learn to execute under pressure, adapt to different opponents, and play your best tennis when it matters most.',
  },
]

export default function PhilosophyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-sand-50 to-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h1 className="text-display-lg heading-display mb-6">
              Our Philosophy
            </h1>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto">
              Excellence is cultivated, not commanded. 
              It emerges through patient dedication, mindful practice, and unwavering commitment.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-display-sm heading-display mb-6">
              What We Believe
            </h2>
            <p className="body-text text-clay-600">
              These principles guide everything we do—from how we structure lessons 
              to how we communicate with students. They represent our commitment to 
              meaningful, lasting development.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <AnimatedSection key={principle.title} delay={index * 0.1}>
                  <div className="card-luxury p-8 md:p-10 h-full">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-sage-700" />
                      </div>
                    <h3 className="subhead-sm text-lbta-charcoal mt-1">
                      {principle.title}
                    </h3>
                    </div>
                    <p className="text-clay-700 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section-spacing bg-sand-50">
        <div className="container-luxury">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-display-sm heading-display mb-6">
              Our Methodology
            </h2>
            <p className="body-text text-clay-600">
              Development happens in stages. Our proven progression takes players from 
              wherever they start to wherever they aspire to reach.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-8">
            {methodology.map((item, index) => (
              <AnimatedSection key={item.phase} delay={index * 0.1}>
                <div className="card-luxury p-8 md:p-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-600 text-sand-50 flex items-center justify-center font-display text-lg">
                      {index + 1}
                    </div>
                    <h3 className="subhead-sm text-lbta-charcoal">
                      {item.phase}
                    </h3>
                  </div>
                  <p className="text-clay-700 leading-relaxed pl-14">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-spacing bg-clay-900 text-sand-100">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <blockquote className="subhead text-lbta-charcoal leading-relaxed mb-8">
              "Tennis, at its highest level, is as much about character as it is about technique. 
              We develop both—because champions are made not just on the court, but in the mind and heart."
            </blockquote>
            <p className="text-sand-400 tracking-wider uppercase text-sm">
              — Michael Chen, Academy Director
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-sm heading-display mb-6">
              See It in Action
            </h2>
            <p className="body-text text-clay-600 mb-10 max-w-2xl mx-auto">
              Book your complimentary trial session and experience our approach firsthand.
            </p>
            <a href="/book" className="btn-primary">
              BOOK TRIAL
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

