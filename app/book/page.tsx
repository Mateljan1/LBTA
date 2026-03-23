'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Phone, Mail, Shield } from 'lucide-react'
import TrialBookingModal from '@/components/TrialBookingModal'
import PrivateLessonModal from '@/components/PrivateLessonModal'
import DarkSection from '@/components/ui/DarkSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import { getCoachNameBySlug } from '@/lib/coach-slug'

function BookPageContent() {
  const searchParams = useSearchParams()
  const isPrivate = useMemo(() => searchParams?.get('type') === 'private', [searchParams])
  const coachSlug = searchParams?.get('coach') ?? undefined
  const defaultCoach = useMemo(() => getCoachNameBySlug(coachSlug), [coachSlug])
  const [trialModalOpen, setTrialModalOpen] = useState(!isPrivate)
  const [privateModalOpen, setPrivateModalOpen] = useState(isPrivate)

  useEffect(() => {
    if (isPrivate) {
      setTrialModalOpen(false)
      setPrivateModalOpen(true)
    } else {
      setPrivateModalOpen(false)
      setTrialModalOpen(true)
    }
  }, [isPrivate])

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/book/book-hero.webp"
            alt="Book your trial or private lesson at LBTA"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-brand-deep-water/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="font-headline text-[32px] md:text-[56px] font-semibold leading-[1.1] text-brand-sandstone mb-4">
            {isPrivate ? 'Book a Private Lesson' : 'Book Your Free Trial'}
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 max-w-[90%] mx-auto">
            {isPrivate
              ? 'Choose your coach and session type. We\'ll reach out within 24 hours to get you on court.'
              : 'One conversation. Honest guidance. A path built around you.'}
          </p>
          <p className="mt-6 font-sans text-[14px] md:text-[15px] text-white/75 max-w-lg mx-auto leading-relaxed">
            {isPrivate ? (
              <>
                The private-lesson form is open below.{' '}
                <Link
                  href="/book"
                  className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                >
                  Switch to a complimentary trial
                </Link>
                .
              </>
            ) : (
              <>
                Your trial request form opens below.{' '}
                <Link
                  href="/book?type=private"
                  className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                >
                  Book a private lesson instead
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </section>

      <HorizonDivider />
      {/* CONTACT OPTIONS */}
      <section className="bg-brand-sandstone py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm text-center">
            <h2 className="font-headline text-[24px] md:text-[28px] font-semibold text-black mb-4">
              Ready to Start?
            </h2>
            <p className="font-sans text-[15px] text-black/70 mb-6">
              {isPrivate ? 'Request a private lesson or speak with us directly.' : 'Book your free trial lesson or speak with us directly.'}
            </p>
            
            <button
              onClick={() => (isPrivate ? setPrivateModalOpen(true) : setTrialModalOpen(true))}
              className="w-full bg-black hover:bg-gray-800 text-white font-sans font-semibold text-[15px] py-4 rounded-[2px] transition-all duration-200 mb-4 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              {isPrivate ? 'Request Private Lesson' : 'Book Free Trial'}
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-black/10">
              <p className="font-sans text-[13px] text-black/60">
                Prefer to speak directly?
              </p>
              <div className="flex gap-4">
                <a 
                  href="tel:9495340457"
                  aria-label="Call (949) 534-0457"
                  className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  (949) 534-0457
                </a>
                <a 
                  href="mailto:support@lagunabeachtennisacademy.com" 
                  className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizonDivider />
      {/* CONVERSION STRIP — book-expect-1, 2, 3 */}
      <section className="bg-brand-sandstone py-10 md:py-14" aria-labelledby="expect-strip-heading">
        <h2 id="expect-strip-heading" className="sr-only">What to expect when you book</h2>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: '/images/book/book-expect-1.webp', alt: 'Junior trial — coach and player on court at LBTA' },
              { src: '/images/book/book-expect-2.webp', alt: 'Adult trial — player in a focused on-court session' },
              { src: '/images/book/book-expect-3.webp', alt: 'Private lesson — one-on-one coaching at LBTA' },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-subtle">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />
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

      <TrialBookingModal isOpen={trialModalOpen} onClose={() => setTrialModalOpen(false)} />
      <PrivateLessonModal isOpen={privateModalOpen} onClose={() => setPrivateModalOpen(false)} defaultCoach={defaultCoach} />
    </>
  )
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <>
          <DarkSection className="min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="font-headline text-[32px] md:text-[56px] font-semibold leading-[1.1] text-brand-sandstone mb-4">
                Book
              </h1>
              <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 max-w-[90%] mx-auto">
                Loading...
              </p>
            </div>
          </DarkSection>
          <HorizonDivider />
        </>
      }
    >
      <BookPageContent />
    </Suspense>
  )
}
