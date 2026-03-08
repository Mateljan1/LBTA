'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Phone, Mail, Shield } from 'lucide-react'
import TrialBookingModal from '@/components/TrialBookingModal'
import DarkSection from '@/components/ui/DarkSection'
import HorizonDivider from '@/components/ui/HorizonDivider'

export default function BookPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Auto-open modal when page loads
  useEffect(() => {
    setIsModalOpen(true)
  }, [])

  return (
    <>
      {/* HERO SECTION */}
      <DarkSection className="min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-headline text-[32px] md:text-[56px] font-semibold leading-[1.1] text-brand-sandstone mb-4">
            Book Your Free Trial
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 max-w-[90%] mx-auto">
            One conversation. Honest guidance. A path built around you.
          </p>
        </div>
      </DarkSection>

      <HorizonDivider />
      {/* CONTACT OPTIONS */}
      <section className="bg-brand-sandstone py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm text-center">
            <h2 className="font-headline text-[24px] md:text-[28px] font-semibold text-black mb-4">
              Ready to Start?
            </h2>
            <p className="font-sans text-[15px] text-black/70 mb-6">
              Book your free trial lesson or speak with us directly.
            </p>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-black hover:bg-gray-800 text-white font-sans font-semibold text-[15px] py-4 rounded-[2px] transition-all duration-200 mb-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              Book Free Trial
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-black/10">
              <p className="font-sans text-[13px] text-black/60">
                Prefer to speak directly?
              </p>
              <div className="flex gap-4">
                <a 
                  href="tel:9495340457" 
                  className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (949) 534-0457
                </a>
                <a 
                  href="mailto:support@lagunabeachtennisacademy.com" 
                  className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <h2 className="font-headline text-[24px] md:text-[32px] font-semibold text-black mb-8 text-center">
            What to Expect
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'We Call You', desc: 'Within 24 hours to discuss your goals and schedule.' },
              { num: '2', title: 'Free Assessment', desc: 'Meet your coach and experience our teaching style.' },
              { num: '3', title: 'Your Path Forward', desc: 'Receive a personalized program recommendation.' },
            ].map((step) => (
              <div 
                key={step.num}
                className="bg-brand-morning-light rounded-xl p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white font-headline text-[18px] font-bold flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-headline text-[18px] font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] text-black/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="bg-white py-10">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-brand-pacific-dusk/90">
              <Shield className="h-5 w-5 text-brand-victoria-cove" aria-hidden="true" />
              <span className="font-sans text-[13px] font-medium">USTA Certified</span>
            </div>
            <div className="flex items-center gap-2 text-brand-pacific-dusk/90">
              <Shield className="h-5 w-5 text-brand-victoria-cove" aria-hidden="true" />
              <span className="font-sans text-[13px] font-medium">PTR Certified</span>
            </div>
            <div className="flex items-center gap-2 text-brand-pacific-dusk/90">
              <CheckCircle className="h-5 w-5 text-brand-tide-pool" aria-hidden="true" />
              <span className="font-sans text-[13px] font-medium">Background Checked</span>
            </div>
            <div className="flex items-center gap-2 text-brand-pacific-dusk/90">
              <Shield className="h-5 w-5 text-brand-tide-pool" aria-hidden="true" />
              <span className="font-sans text-[13px] font-medium">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Booking Modal */}
      <TrialBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
