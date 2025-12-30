import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Phone, Calendar, Clock, Mail, Users, ArrowRight, Download } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata = {
  title: 'Thank You | Laguna Beach Tennis Academy',
  description: 'Your booking request has been confirmed. We will contact you within 24 hours.',
}

export default function ThankYouPage() {
  return (
    <>
      {/* Hero - Success Confirmation */}
      <section className="relative bg-black text-white py-24 md:py-32 min-h-[450px] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-narrow text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-8">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="font-serif text-[36px] md:text-[48px] font-semibold mb-6 leading-tight">
              You're All Set
            </h1>
            <p className="font-sans text-[18px] md:text-[20px] text-white/80 max-w-lg mx-auto">
              We've received your request and will contact you within 24 hours to confirm your trial.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline - What Happens Next */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="font-sans text-[11px] text-black/50 uppercase tracking-[2px] mb-4">
              Next Steps
            </p>
            <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-black">
              What Happens Now
            </h2>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-black/10 hidden md:block" />
            
            <div className="space-y-8 md:space-y-0">
              {/* Step 1 */}
              <AnimatedSection delay={100}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative">
                  <div className="md:w-1/2 md:text-right md:pr-12">
                    <div className="bg-[#FAF8F3] p-6 md:p-8 rounded-lg">
                      <div className="inline-flex items-center gap-2 text-green-600 font-sans text-[12px] font-semibold uppercase tracking-[1.5px] mb-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">1</span>
                        Within 24 Hours
                      </div>
                      <h3 className="font-serif text-[22px] font-semibold text-black mb-2">
                        We'll Reach Out
                      </h3>
                      <p className="font-sans text-[15px] text-black/70 leading-relaxed">
                        Our team will call or email to confirm your preferred time slot and answer any questions.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-black absolute left-1/2 -translate-x-1/2" />
                  <div className="md:w-1/2 md:pl-12" />
                </div>
              </AnimatedSection>

              {/* Step 2 */}
              <AnimatedSection delay={200}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative">
                  <div className="md:w-1/2 md:pr-12" />
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-black absolute left-1/2 -translate-x-1/2" />
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-[#FAF8F3] p-6 md:p-8 rounded-lg">
                      <div className="inline-flex items-center gap-2 text-blue-600 font-sans text-[12px] font-semibold uppercase tracking-[1.5px] mb-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</span>
                        Before Your Trial
                      </div>
                      <h3 className="font-serif text-[22px] font-semibold text-black mb-2">
                        What to Bring
                      </h3>
                      <p className="font-sans text-[15px] text-black/70 leading-relaxed">
                        Tennis racquet (loaners available), athletic shoes, water bottle, and comfortable clothing. We provide the balls.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Step 3 */}
              <AnimatedSection delay={300}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative">
                  <div className="md:w-1/2 md:text-right md:pr-12">
                    <div className="bg-[#FAF8F3] p-6 md:p-8 rounded-lg">
                      <div className="inline-flex items-center gap-2 text-orange-600 font-sans text-[12px] font-semibold uppercase tracking-[1.5px] mb-3">
                        <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">3</span>
                        Your First Session
                      </div>
                      <h3 className="font-serif text-[22px] font-semibold text-black mb-2">
                        What to Expect
                      </h3>
                      <p className="font-sans text-[15px] text-black/70 leading-relaxed">
                        A 45-60 minute session with our coaches. We'll assess your level, introduce our movement-first philosophy, and create your personalized plan.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-black absolute left-1/2 -translate-x-1/2" />
                  <div className="md:w-1/2 md:pl-12" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-20 bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-[28px] md:text-[32px] font-semibold text-black">
              While You Wait
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatedSection delay={100}>
              <Link href="/schedules" className="group block">
                <div className="bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 h-full">
                  <Calendar className="w-8 h-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
                  <h3 className="font-sans text-[15px] font-semibold text-black mb-1">
                    View Schedules
                  </h3>
                  <p className="font-sans text-[13px] text-black/60">
                    See class times
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <Link href="/programs" className="group block">
                <div className="bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 h-full">
                  <CheckCircle className="w-8 h-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
                  <h3 className="font-sans text-[15px] font-semibold text-black mb-1">
                    Our Programs
                  </h3>
                  <p className="font-sans text-[13px] text-black/60">
                    Explore options
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Link href="/coaches" className="group block">
                <div className="bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 h-full">
                  <Users className="w-8 h-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
                  <h3 className="font-sans text-[15px] font-semibold text-black mb-1">
                    Meet Coaches
                  </h3>
                  <p className="font-sans text-[13px] text-black/60">
                    ATP/WTA trained
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={250}>
              <Link href="/faq" className="group block">
                <div className="bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 h-full">
                  <Clock className="w-8 h-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
                  <h3 className="font-sans text-[15px] font-semibold text-black mb-1">
                    FAQ
                  </h3>
                  <p className="font-sans text-[13px] text-black/60">
                    Common questions
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-black rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-serif text-[28px] md:text-[32px] font-semibold text-white mb-4">
                  Download the LBTA App
                </h2>
                <p className="font-sans text-[16px] text-white/70 mb-6">
                  Book sessions, track progress, and manage your schedule on the go.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a 
                    href="https://apps.apple.com/us/app/lbta/id6746348933" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-black px-5 py-3 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Download on the</div>
                      <div className="text-[14px] font-semibold">App Store</div>
                    </div>
                  </a>
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.playbypoint.appx&pli=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-black px-5 py-3 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Get it on</div>
                      <div className="text-[14px] font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <Download className="w-24 h-24 text-white/20" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-[#FAF8F3] border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="font-sans text-[15px] text-black/60 mb-6">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              <a 
                href="tel:9494646645" 
                className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-sans text-[15px]">(949) 464-6645</span>
              </a>
              <span className="hidden sm:block text-black/20">|</span>
              <a 
                href="mailto:support@lagunabeachtennisacademy.com" 
                className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="font-sans text-[15px]">support@lagunabeachtennisacademy.com</span>
              </a>
            </div>
            <p className="font-sans text-[13px] text-black/50">
              Office Hours: Monday-Friday 9 AM - 5 PM PST
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Return Home */}
      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-[14px] text-black/60 hover:text-black transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Return to Homepage
          </Link>
        </div>
      </section>
    </>
  )
}
