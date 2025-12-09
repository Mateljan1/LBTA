import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const faqs = [
  {
    q: "Do I need prior fitness experience?",
    a: "No. Sessions are scaled based on the individual."
  },
  {
    q: "Can adults and juniors both participate?",
    a: "Yes—each group trains separately with age-appropriate programming."
  },
  {
    q: "Is the Fit4Tennis App included?",
    a: "Yes, for all active LBTA members."
  },
  {
    q: "What equipment do I need?",
    a: "Most workouts require minimal equipment. The app provides alternatives for home and gym settings."
  },
  {
    q: "Can I train if I'm recovering from an injury?",
    a: "We recommend a private session first, so we can understand your needs and adjust safely."
  }
]

export default function FitnessPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Fitness' }
      ]} />
      
      {/* Hero */}
      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>LBTA FIT4TENNIS</p>
            <h1 className="display mb-8">
              Fitness & Strength Training for Tennis
            </h1>
            <p className="body-lg max-w-3xl mx-auto text-gray-600 leading-relaxed mb-8">
              A simple, dependable training structure designed to support players on and off the court.
            </p>
            <p className="body-lg max-w-3xl mx-auto text-gray-600 leading-relaxed">
              Physical training at LBTA focuses on three things: <strong>strength, movement, and durability.</strong>
            </p>
            <p className="body-lg max-w-3xl mx-auto text-gray-600 leading-relaxed mt-8">
              Nothing loud. Nothing extreme. Just the work players need to stay healthy and play with more ease.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* App Access */}
      <section className="bg-lbta-bone border-y border-gray-200 py-12">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="body-sm text-gray-600 max-w-3xl mx-auto">
              Members of LBTA receive access to the Fit4Tennis App, allowing them to train at home, at the gym, or while traveling—whenever it fits their schedule.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline mb-8 text-center">Our Approach</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-600 body-sm leading-relaxed">
              <p>
                Tennis places specific demands on the body: rotational power, coordination, changes of direction, and repeat efforts over long periods of play.
              </p>
              <p>
                The goal of this program is to help players meet those demands with less strain and more efficiency.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <p className="subhead-sm mb-6">Training is built around:</p>
              <div className="space-y-3">
                {[
                  "foundational strength",
                  "stable, reliable movement patterns",
                  "court-specific footwork",
                  "injury-prevention habits",
                  "mobility that supports long-term play"
                ].map((item, index) => (
                  <div key={item} className="flex gap-4 items-start">
                    <span className="eyebrow text-lbta-coral flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="body-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
              <p className="body-sm text-gray-600 mt-8">
                Sessions are coached with attention to detail and respect for individual experience levels.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* On-Court & Off-Court Options */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="headline mb-4">On-Court & Off-Court Options</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            {/* Group Sessions */}
            <AnimatedSection>
              <div className="bg-white border border-gray-200 p-8">
                <div className="mb-6">
                  <span className="eyebrow text-lbta-coral mb-4 block">01</span>
                  <h3 className="subhead mb-4">Group Fitness Sessions at LBTA</h3>
                  <p className="body-sm text-gray-600 leading-relaxed">
                    These sessions blend strength work, movement training, and tennis-specific conditioning in a calm, organized environment.
                  </p>
                </div>

                <p className="body-sm text-gray-600 mb-6">
                  Groups are small, allowing coaches to monitor form and adjust the day's plan based on how players are feeling.
                </p>

                <div className="mb-6">
                  <p className="subhead-sm mb-3">Suitable for:</p>
                  <ul className="space-y-2">
                    {[
                      "juniors preparing for higher training loads",
                      "adults who want a consistent weekly fitness routine",
                      "players returning after a break or managing past injuries"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 body-sm text-gray-600">
                        <span className="text-lbta-coral mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="body-sm text-gray-600">
                  Frequency varies by season and program.
                </p>
              </div>
            </AnimatedSection>

            {/* Fit4Tennis App */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 p-8">
                <div className="mb-6">
                  <span className="eyebrow text-lbta-coral mb-4 block">02</span>
                  <h3 className="subhead mb-4">Fit4Tennis App — Included for LBTA Members</h3>
                  <p className="body-sm text-gray-600 leading-relaxed">
                    All LBTA students receive access to the Fit4Tennis training app, created by Andrew Mateljan.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="subhead-sm mb-3">The app provides:</p>
                  <ul className="space-y-2">
                    {[
                      "clear follow-along workouts",
                      "mobility sequences",
                      "tennis-specific strength programs",
                      "off-court footwork patterns",
                      "recovery guidance",
                      "options for home, gym, or travel"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 body-sm text-gray-600">
                        <span className="text-lbta-coral mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="body-sm text-gray-600">
                  Workouts are simple to follow and designed to match your weekly on-court load. This allows players to maintain consistency even on days they aren't at the courts.
                </p>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Why Fitness Matters */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline mb-8 text-center">Why Fitness Matters in Tennis</h2>
            <p className="body-sm text-gray-600 max-w-3xl mx-auto leading-relaxed text-center mb-12">
              A stronger, more balanced body supports better tennis—not through power alone, but through stability and repeatability.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                "fewer compensations during swings",
                "more comfortable movement on court",
                "better control in long rallies",
                "improved posture and alignment",
                "increased confidence in match play",
                "reduced risk of overuse injuries"
              ].map((benefit, index) => (
                <div key={benefit} className="flex gap-4 items-start">
                  <span className="eyebrow text-lbta-coral flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="body-sm text-gray-600">{benefit}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <div className="text-center mt-12">
            <p className="body-sm text-gray-600 italic">
              This is preparation that respects the athlete's longevity.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Available */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-12">Programs Available Throughout the Year</h2>
          </AnimatedSection>

          <div className="space-y-8 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="subhead-sm mb-3">Junior Fitness Training</h3>
                <p className="body-sm text-gray-600">
                  Designed to match developmental stages—focusing on coordination, movement quality, and age-appropriate strength work.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="subhead-sm mb-3">Adult Fitness Sessions</h3>
                <p className="body-sm text-gray-600">
                  Straightforward training blocks that reinforce strength, movement, and mobility in a low-pressure, well-run setting.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="subhead-sm mb-3">Private Training</h3>
                <p className="body-sm text-gray-600">
                  One-on-one sessions for players who want personalized attention or have specific needs (returning from injury, college-bound preparation, targeted strength work).
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What a Session Looks Like */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-8">What a Typical Session Looks Like</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <p className="body-sm text-gray-600 mb-8">A session may include:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "warm-up and mobility",
                  "movement patterns",
                  "strength circuits",
                  "court footwork",
                  "stability work",
                  "short conditioning sets"
                ].map((item, index) => (
                  <div key={item} className="flex gap-4 items-start">
                    <span className="eyebrow text-lbta-coral flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="body-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4 text-center">
                <p className="body-sm text-gray-600">The pace stays steady.</p>
                <p className="body-sm text-gray-600">The focus stays on form, habits, and repeatability.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Who Leads */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="headline text-center mb-8">Who Leads the Training</h2>
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

      {/* FAQ */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-12">Common Questions</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.q} delay={index * 0.05}>
                <div className="border-b border-gray-200 pb-6">
                  <p className="subhead-sm mb-3">{faq.q}</p>
                  <p className="body-sm text-gray-600">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="body-sm text-gray-600">
                If you are part of any LBTA program, you already have access to the Fit4Tennis App.
              </p>
              <p className="body-sm text-gray-600">
                Group sessions and private training can be added anytime during the year.
              </p>
              <div className="mt-8">
                <Link
                  href="/schedules"
                  className="eyebrow bg-lbta-coral text-white px-10 py-4 inline-flex items-center transition hover:bg-lbta-coral-dark"
                >
                  VIEW SCHEDULE & OPTIONS
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="body-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Our goal is straightforward: help players feel stronger, move better, and stay healthy through the demands of the sport.
            </p>
            <p className="body-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              If you'd like to add fitness training to your tennis program, we're here to guide you.
            </p>
            <Link
              href="/book"
              className="eyebrow border border-lbta-charcoal text-lbta-charcoal px-10 py-4 inline-flex items-center transition hover:bg-lbta-charcoal hover:text-white"
            >
              GET STARTED
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
