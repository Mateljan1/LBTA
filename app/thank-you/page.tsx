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
            <CheckCircle className="w-20 h-20 text-black mx-auto mb-8" />
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
                  <Calendar className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-black/70 transition-colors" />
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
                  <CheckCircle className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-black/70 transition-colors" />
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
                  <Users className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-black/70 transition-colors" />
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
                  <Phone className="w-10 h-10 text-lbta-burnt mx-auto mb-4 group-hover:text-black/70 transition-colors" />
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
                className="flex items-center gap-3 text-lbta-burnt hover:text-black/70 transition-colors"
              >
                <Phone className="w-5 h-5" />
                (949) 464-6645
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="mailto:support@lagunabeachtennisacademy.com"
                className="flex items-center gap-3 text-lbta-burnt hover:text-black/70 transition-colors"
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

      {/* Mobile App Promotion */}
      <section className="bg-lbta-cream py-16 border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6">
              Book Anytime with Our App
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Download the LBTA app for instant booking, schedule management, and session tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <a 
                href="https://apps.apple.com/us/app/lbta/id6746348933" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-lbta-charcoal text-white rounded-sm hover:bg-lbta-charcoal/90 transition-all">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-sans font-medium">App Store</div>
                  </div>
                </div>
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.playbypoint.appx&pli=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-lbta-charcoal text-white rounded-sm hover:bg-lbta-charcoal/90 transition-all">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-sans font-medium">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Available on iOS and Android
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Return Home */}
      <section className="bg-white py-8">
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

