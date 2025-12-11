import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const faqs = [
  { q: "Do I need prior fitness experience?", a: "No. Sessions are scaled based on the individual." },
  { q: "Can adults and juniors both participate?", a: "Yes—each group trains separately with age-appropriate programming." },
  { q: "Is the Fit4Tennis App included?", a: "Yes, for all active LBTA members." },
  { q: "What equipment do I need?", a: "Most workouts require minimal equipment. The app provides alternatives for home and gym settings." },
  { q: "Can I train if I'm recovering from an injury?", a: "We recommend a private session first, so we can understand your needs and adjust safely." }
]

export default function FitnessPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Fitness' }
      ]} />
      
      {/* Hero with Image */}
      <section className="relative bg-white pt-32 pb-0">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <AnimatedSection>
              <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>LBTA FIT4TENNIS</p>
              <h1 className="display mb-8">
                Fitness & Strength Training for Tennis
              </h1>
              <p className="body-lg text-gray-600 leading-relaxed mb-6">
                A simple, dependable training structure designed to support players on and off the court.
              </p>
              <p className="body-lg text-gray-600 leading-relaxed">
                Physical training at LBTA focuses on three things: <span className="text-lbta-charcoal font-medium">strength, movement, and durability.</span>
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100">
                <Image
                  src="/photos/GymSetting.webp"
                  alt="Fitness training at LBTA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Pull Quote */}
          <div className="max-w-3xl mx-auto text-center py-16 border-y border-gray-200">
            <AnimatedSection>
              <p className="text-2xl md:text-3xl font-serif font-light text-lbta-charcoal leading-relaxed">
                Nothing loud. Nothing extreme. Just the work players need to stay healthy and play with more ease.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="headline mb-6">Our Approach</h2>
              </AnimatedSection>
            </div>
            
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.1}>
                <div className="space-y-6 body-sm text-gray-600 leading-relaxed">
                  <p>
                    Tennis places specific demands on the body: rotational power, coordination, changes of direction, and repeat efforts over long periods of play.
                  </p>
                  <p>
                    The goal of this program is to help players meet those demands with less strain and more efficiency.
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="subhead-sm mb-6">Training is built around:</p>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        "foundational strength",
                        "stable, reliable movement patterns",
                        "court-specific footwork",
                        "injury-prevention habits",
                        "mobility that supports long-term play"
                      ].map((item, index) => (
                        <div key={item} className="flex gap-4">
                          <span className="eyebrow text-lbta-coral flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <p className="body-sm text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-8 italic">
                    Sessions are coached with attention to detail and respect for individual experience levels.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Options - Side by Side */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="mb-16">
            <h2 className="headline text-center mb-4">On-Court & Off-Court Options</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Group Sessions */}
            <AnimatedSection>
              <div className="h-full">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <span className="eyebrow text-lbta-coral mb-4 block">01</span>
                  <h3 className="subhead mb-4">Group Fitness Sessions at LBTA</h3>
                </div>

                <div className="space-y-6 body-sm text-gray-600 leading-relaxed">
                  <p>
                    These sessions blend strength work, movement training, and tennis-specific conditioning in a calm, organized environment.
                  </p>
                  <p>
                    Groups are small, allowing coaches to monitor form and adjust the day's plan based on how players are feeling.
                  </p>
                  
                  <div>
                    <p className="font-medium text-lbta-charcoal mb-3">Suitable for:</p>
                    <ul className="space-y-2">
                      {[
                        "juniors preparing for higher training loads",
                        "adults who want a consistent weekly fitness routine",
                        "players returning after a break or managing past injuries"
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="text-lbta-coral mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-gray-500 text-xs">
                    Frequency varies by season and program.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Fit4Tennis App */}
            <AnimatedSection delay={0.1}>
              <div className="h-full">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <span className="eyebrow text-lbta-coral mb-4 block">02</span>
                  <h3 className="subhead mb-4">Fit4Tennis App — Included for LBTA Members</h3>
                </div>

                <div className="space-y-6 body-sm text-gray-600 leading-relaxed">
                  <p>
                    All LBTA students receive access to the Fit4Tennis training app, created by Andrew Mateljan.
                  </p>
                  
                  <div>
                    <p className="font-medium text-lbta-charcoal mb-3">The app provides:</p>
                    <ul className="space-y-2">
                      {[
                        "clear follow-along workouts",
                        "mobility sequences",
                        "tennis-specific strength programs",
                        "off-court footwork patterns",
                        "recovery guidance",
                        "options for home, gym, or travel"
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="text-lbta-coral mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p>
                    Workouts are simple to follow and designed to match your weekly on-court load.
                  </p>
                  <p>
                    This allows players to maintain consistency even on days they aren't at the courts.
                  </p>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Why Fitness Matters */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="headline mb-6">Why Fitness Matters in Tennis</h2>
              </AnimatedSection>
            </div>
            
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.1}>
                <p className="body-sm text-gray-600 leading-relaxed mb-8">
                  A stronger, more balanced body supports better tennis—not through power alone, but through stability and repeatability.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "fewer compensations during swings",
                    "more comfortable movement on court",
                    "better control in long rallies",
                    "improved posture and alignment",
                    "increased confidence in match play",
                    "reduced risk of overuse injuries"
                  ].map((benefit, index) => (
                    <div key={benefit} className="flex gap-4">
                      <span className="eyebrow text-lbta-coral flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="body-sm text-gray-600">{benefit}</p>
                    </div>
                  ))}
                </div>

                <p className="body-sm text-gray-600 italic mt-8">
                  This is preparation that respects the athlete's longevity.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Available */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-12">Programs Available Throughout the Year</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="text-center p-8 border border-gray-200 bg-lbta-bone/50">
                <h3 className="subhead-sm mb-3">Junior Fitness Training</h3>
                <p className="body-sm text-gray-600">
                  Designed to match developmental stages—focusing on coordination, movement quality, and age-appropriate strength work.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="text-center p-8 border border-gray-200 bg-lbta-bone/50">
                <h3 className="subhead-sm mb-3">Adult Fitness Sessions</h3>
                <p className="body-sm text-gray-600">
                  Straightforward training blocks that reinforce strength, movement, and mobility in a low-pressure, well-run setting.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center p-8 border border-gray-200 bg-lbta-bone/50">
                <h3 className="subhead-sm mb-3">Private Training</h3>
                <p className="body-sm text-gray-600">
                  One-on-one sessions for players who want personalized attention or have specific needs.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What a Session Looks Like - Visual */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="headline mb-8">What a Typical Session Looks Like</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  "warm-up and mobility",
                  "movement patterns",
                  "strength circuits",
                  "court footwork",
                  "stability work",
                  "short conditioning sets"
                ].map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="eyebrow text-lbta-coral flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="body-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3 text-center lg:text-left">
                <p className="body-sm text-gray-600">The pace stays steady.</p>
                <p className="body-sm text-gray-600">The focus stays on form, habits, and repeatability.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative h-96 overflow-hidden bg-gray-100">
                <Image
                  src="/photos/OncourtTraining.webp"
                  alt="Training session at LBTA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Who Leads */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="headline text-center mb-12">Who Leads the Training</h2>
            <div className="max-w-3xl mx-auto space-y-6 body-sm text-gray-600 leading-relaxed">
              <p>
                Fitness at LBTA is designed and overseen by Andrew Mateljan, founder of Fit4Tennis.
              </p>
              <p>
                Andrew's experience combines tennis coaching, movement training, and long-term player development, ensuring the workouts match the demands of the sport rather than generic gym routines.
              </p>
              <p>
                Coaches maintain a supportive, attentive environment—not competitive, not rushed.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ - Clean Accordion Style */}
      <section className="section-spacing bg-lbta-bone border-t border-gray-200">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-12">Common Questions</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.q} delay={index * 0.05}>
                <div className="bg-white border border-gray-200 p-8">
                  <p className="subhead-sm mb-3 text-lbta-charcoal">{faq.q}</p>
                  <p className="body-sm text-gray-600">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started - Clean */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <p className="body-sm text-gray-600 mb-4">
                If you are part of any LBTA program, you already have access to the Fit4Tennis App.
              </p>
              <p className="body-sm text-gray-600 mb-8">
                Group sessions and private training can be added anytime during the year.
              </p>
              <Link
                href="/schedules"
                className="eyebrow bg-lbta-coral text-white px-10 py-4 inline-flex items-center transition hover:bg-lbta-coral-dark"
              >
                VIEW SCHEDULE & OPTIONS
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="body-lg text-white/90 leading-relaxed">
                Our goal is straightforward: help players feel stronger, move better, and stay healthy through the demands of the sport.
              </p>
              <p className="body-lg text-white/90 leading-relaxed">
                If you'd like to add fitness training to your tennis program, we're here to guide you.
              </p>
              <div className="pt-4">
                <Link
                  href="/book"
                  className="eyebrow bg-white text-lbta-charcoal px-10 py-4 inline-flex items-center transition hover:bg-lbta-bone"
                >
                  GET STARTED
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
