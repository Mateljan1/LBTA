'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Script from 'next/script'

const faqs = [
  {
    question: "What age groups do you offer tennis lessons for?",
    answer: "We offer programs for all ages starting from 3 years old. Our Little Tennis Stars program (ages 3-4) introduces children to tennis through play-based activities. We have progressive programs through Red Ball (5-6), Orange Ball (7-8), Green Ball (9-10), Youth Development (11-14), High Performance (competitive juniors), and comprehensive adult programs for beginners through advanced players."
  },
  {
    question: "Do I need to bring my own equipment?",
    answer: "No equipment is required for your first trial lesson - we provide racquets appropriate for your age and skill level. For ongoing classes, we can recommend equipment based on your needs. Our Racquet Rescue service also offers professional stringing and equipment consultation."
  },
  {
    question: "What is your coaching philosophy?",
    answer: "Our movement-first approach focuses on building proper footwork and body mechanics before technical stroke development. This foundation creates more consistent, powerful, and injury-resistant players. We believe that 'Movement builds mastery. Discipline builds confidence.' - combining technical excellence with mental toughness and a supportive community."
  },
  {
    question: "Where are your tennis courts located?",
    answer: "Our primary location is Moulton Meadows Park at 1098 Balboa Ave, Laguna Beach, CA 92651. We also utilize Alta Laguna Park for our summer Swim & Tennis camps. Both locations offer beautiful ocean views and well-maintained courts."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We offer a 30-day money-back guarantee for new students. For ongoing classes, we request 24-hour notice for cancellations to allow rescheduling. Weather-related cancellations are automatically rescheduled at no charge."
  },
  {
    question: "Do you offer private lessons?",
    answer: "Yes! Private and semi-private lessons are available with all our coaches. Private lessons allow for personalized attention and accelerated improvement. Contact us to discuss your goals and we'll match you with the ideal coach for your needs."
  },
  {
    question: "What is Junior Team Tennis (JTT)?",
    answer: "JTT is a USTA-sanctioned team tennis league that provides match play experience in a supportive team environment. Players compete in age-based divisions (10U, 12U, 14U, 18U) with weekly matches on Sundays. Our JTT program includes twice-weekly practice sessions, team uniforms, and USTA registration."
  },
  {
    question: "How do I get started?",
    answer: "The best way to start is by booking a trial lesson. This allows us to assess your current level and discuss your tennis goals. From there, we'll recommend the ideal program for you or your child. Click 'Book a Trial' to schedule your first session!"
  }
]

// Generate FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-[#FAF8F3] py-16 md:py-24">
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-sans text-[11px] text-lbta-orange uppercase tracking-[2px] mb-4">
            Common Questions
          </p>
          <h2 className="font-serif text-[36px] md:text-[44px] font-semibold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-[16px] text-black/70 max-w-xl mx-auto">
            Everything you need to know about training at Laguna Beach Tennis Academy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-200"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-lbta-orange focus-visible:ring-inset"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-sans text-[15px] md:text-[16px] font-medium text-[#1a1a1a] pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-lbta-orange flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="font-sans text-[14px] md:text-[15px] text-black/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after FAQ */}
        <div className="text-center mt-12">
          <p className="font-sans text-[15px] text-black/60 mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold text-lbta-orange hover:text-lbta-red transition-colors"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </section>
  )
}

