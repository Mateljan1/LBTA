'use client'

import { useState } from 'react'
import Script from 'next/script'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import faqsData from '@/data/faq.json'

const faqs = faqsData as Array<{ id: string; question: string; answer: string }>

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
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-brand-morning-light section">
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
            const panelId = `faq-panel-${faq.id}`
            const buttonId = `faq-button-${faq.id}`

            return (
              <div
                key={faq.id}
                className={`
                  bg-white rounded-subtle overflow-hidden
                  border transition-all duration-500 ease-luxury
                  ${isOpen 
                    ? 'border-brand-sunset-cliff shadow-medium' 
                    : 'border-brand-pacific-dusk/10 hover:border-brand-pacific-dusk/25'
                  }
                `}
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-inset group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`
                    font-sans text-body font-medium transition-colors duration-300
                    ${isOpen ? 'text-black' : 'text-brand-deep-water group-hover:text-black'}
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
                
                {reduceMotion ? (
                  isOpen && (
                    <div id={panelId} role="region" aria-labelledby={buttonId}>
                      <div className="px-6 pb-6">
                        <div className="w-12 h-px bg-black/20 mb-4" />
                        <p className="text-body-sm text-brand-pacific-dusk/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
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
                          <div className="w-12 h-px bg-black/20 mb-4" />
                          <p className="text-body-sm text-brand-pacific-dusk/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-body-sm text-brand-pacific-dusk/80 mb-4">
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
