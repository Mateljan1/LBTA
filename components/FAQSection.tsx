'use client'

import { useState } from 'react'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'

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
    answer: "Our movement-first approach focuses on building proper footwork and body mechanics before technical stroke development. This foundation creates more consistent, powerful, and injury-resistant players. We believe that structure creates confidence — combining technical excellence with mental toughness and a supportive community."
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-lbta-cream section">
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-eyebrow mb-4 block">Common Questions</span>
          <h2 className="text-headline mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-subhead max-w-xl mx-auto">
            Everything you need to know about training at Laguna Beach Tennis Academy.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div
                key={index}
                className={`
                  bg-white rounded-subtle overflow-hidden
                  border transition-all duration-500 ease-luxury
                  ${isOpen 
                    ? 'border-lbta-orange shadow-medium' 
                    : 'border-lbta-stone hover:border-lbta-slate'
                  }
                `}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-lbta-orange focus-visible:ring-inset group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className={`
                    font-sans text-body font-medium transition-colors duration-300
                    ${isOpen ? 'text-black' : 'text-lbta-black group-hover:text-black'}
                  `}>
                    {faq.question}
                  </span>
                  
                  {/* Custom animated icon */}
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-500 ease-luxury
                    ${isOpen 
                      ? 'bg-black text-white rotate-180' 
                      : 'bg-gray-100 text-black group-hover:bg-gray-200'
                    }
                  `}>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-500"
                    >
                      <path 
                        d="M2 4L6 8L10 4" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.22, 0.61, 0.36, 1],
                        opacity: { duration: 0.25 }
                      }}
                    >
                      <div className="px-6 pb-6">
                        {/* Subtle divider */}
                        <div className="w-12 h-px bg-black/20 mb-4" />
                        <p className="text-body-sm text-lbta-slate leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-body-sm text-lbta-slate mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-ui font-medium text-black hover:text-black/70 transition-colors group"
          >
            <span>Contact Us</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
