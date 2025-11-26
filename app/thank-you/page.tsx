import Link from 'next/link'
import { CheckCircle, Phone, Calendar, Clock, Mail, Users } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ThankYouPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-lbta-charcoal text-white py-32 min-h-[400px] flex items-center">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <CheckCircle className="w-20 h-20 text-lbta-orange mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Your Request is Confirmed
            </h1>
            <p className="text-xl text-white/90 font-sans">
              We'll contact you within 24 hours to schedule your trial class
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              What Happens Next
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="flex gap-6 p-8 bg-lbta-cream rounded-sm border border-gray-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-2">
                    Expect Our Call
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our team will reach out within 24 hours to schedule your trial at your preferred location and time.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex gap-6 p-8 bg-lbta-cream rounded-sm border border-gray-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-2">
                    What to Bring
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tennis racket (we have loaners if needed), athletic shoes, water bottle, and comfortable athletic clothing. We'll provide the balls.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex gap-6 p-8 bg-lbta-cream rounded-sm border border-gray-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-2">
                    What to Expect
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    45-60 minute session with our ATP/WTA-trained coaches. We'll assess your level, introduce our training philosophy, and answer all your questions.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6">
              While You Wait, Explore LBTA
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedSection delay={0.1}>
              <Link href="/schedules">
                <div className="card-lbta p-8 text-center hover:border-lbta-charcoal group cursor-pointer">
                  <Calendar className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-lbta-orange transition-colors" />
                  <h3 className="font-sans font-medium text-lbta-charcoal mb-2">
                    Class Schedules
                  </h3>
                  <p className="text-sm text-gray-600">
                    See available times
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link href="/programs">
                <div className="card-lbta p-8 text-center hover:border-lbta-charcoal group cursor-pointer">
                  <CheckCircle className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-lbta-orange transition-colors" />
                  <h3 className="font-sans font-medium text-lbta-charcoal mb-2">
                    View Programs
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explore all offerings
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Link href="/coaches">
                <div className="card-lbta p-8 text-center hover:border-lbta-charcoal group cursor-pointer">
                  <Users className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-lbta-orange transition-colors" />
                  <h3 className="font-sans font-medium text-lbta-charcoal mb-2">
                    Meet Coaches
                  </h3>
                  <p className="text-sm text-gray-600">
                    ATP/WTA experience
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <Link href="/faq">
                <div className="card-lbta p-8 text-center hover:border-lbta-charcoal group cursor-pointer">
                  <Phone className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-lbta-orange transition-colors" />
                  <h3 className="font-sans font-medium text-lbta-charcoal mb-2">
                    FAQ
                  </h3>
                  <p className="text-sm text-gray-600">
                    Honest answers
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-light mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-600 mb-8">
              Our team is here to answer any questions
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <a
                href="tel:9494646645"
                className="flex items-center gap-3 text-lbta-burnt hover:text-lbta-orange transition-colors"
              >
                <Phone className="w-5 h-5" />
                (949) 464-6645
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="mailto:support@lagunabeachtennisacademy.com"
                className="flex items-center gap-3 text-lbta-burnt hover:text-lbta-orange transition-colors"
              >
                <Mail className="w-5 h-5" />
                support@lagunabeachtennisacademy.com
              </a>
            </div>

            <p className="text-sm text-gray-500">
              <strong>Office Hours:</strong> Monday-Friday 9 AM - 5 PM PST
              <br />
              <em>We typically respond within 2-4 hours during business hours</em>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Return Home */}
      <section className="bg-lbta-cream py-8">
        <div className="container-narrow text-center">
          <Link
            href="/"
            className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
          >
            ← Return to Homepage
          </Link>
        </div>
      </section>
    </>
  )
}

