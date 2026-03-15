'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, TrendingUp, DollarSign, Award, Users, Shield, AlertCircle, HelpCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type FAQItem = { id: string; question: string; answer: string; category?: string; icon?: string }

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  DollarSign,
  Award,
  Users,
  Shield,
  AlertCircle,
  HelpCircle,
}

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

function getCategories(faqs: FAQItem[]): string[] {
  const seen = new Set<string>()
  const order: string[] = []
  faqs.forEach((faq) => {
    const cat = faq.category ?? 'General'
    if (!seen.has(cat)) {
      seen.add(cat)
      order.push(cat)
    }
  })
  return order
}

interface FAQInteractiveProps {
  faqs: FAQItem[]
}

export default function FAQInteractive({ faqs }: FAQInteractiveProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reducedMotion = useReducedMotion()
  const categories = getCategories(faqs)
  const safeCategoryIndex = categories.length > 0 ? Math.min(selectedCategoryIndex, categories.length - 1) : 0
  const activeCategory = categories[safeCategoryIndex]
  const categoryFaqs = activeCategory
    ? faqs.filter((faq) => (faq.category ?? 'General') === activeCategory)
    : []

  useEffect(() => {
    setOpenIndex(null)
  }, [safeCategoryIndex])

  useEffect(() => {
    if (categories.length === 0) return
    const el = tabRefs.current[safeCategoryIndex] ?? document.getElementById(`faq-tab-${safeCategoryIndex}`)
    if (el && typeof (el as HTMLButtonElement).focus === 'function') (el as HTMLButtonElement).focus()
  }, [safeCategoryIndex, categories.length])

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, numTabs: number) => {
      if (numTabs <= 0) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedCategoryIndex((i) => (i <= 0 ? numTabs - 1 : i - 1))
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedCategoryIndex((i) => (i >= numTabs - 1 ? 0 : i + 1))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setSelectedCategoryIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setSelectedCategoryIndex(numTabs - 1)
      }
    },
    []
  )

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-pacific-dusk text-white py-24">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <HelpCircle className="w-16 h-16 text-brand-sunset-cliff mx-auto mb-8" />
            <h1 className="text-display-xl font-headline font-light mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 font-sans mb-4">
              Honest, unfiltered answers about tennis training, costs, and what it really takes
            </p>
            <p className="text-sm text-brand-sunset-cliff font-sans font-medium tracking-wide">
              No sales pitch. No sugar-coating. Just truth.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Content — category tabs */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          {categories.length === 0 ? (
            <p className="text-center text-gray-600 font-sans">No FAQs available yet.</p>
          ) : (
          <>
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex flex-wrap gap-2 border-b-2 border-brand-pacific-dusk/10 pb-6 mb-8"
          >
            {categories.map((category, i) => {
              const isSelected = safeCategoryIndex === i
              const tabId = `faq-tab-${i}`
              return (
                <button
                  key={category}
                  ref={(el) => { tabRefs.current[i] = el }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`faq-panel-${i}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedCategoryIndex(i)}
                  onKeyDown={(e) => handleTabKeyDown(e, categories.length)}
                  className={`
                    min-h-[48px] px-6 py-3 rounded-subtle font-sans text-body font-medium
                    transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-offset-2
                    ${isSelected
                      ? 'bg-brand-pacific-dusk text-white'
                      : 'bg-gray-100 text-brand-pacific-dusk hover:bg-gray-200'
                    }
                  `}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <div
            id={`faq-panel-${safeCategoryIndex}`}
            role="tabpanel"
            aria-labelledby={`faq-tab-${safeCategoryIndex}`}
          >
            <AnimatedSection>
              <h2 className="sr-only">{activeCategory}</h2>
            </AnimatedSection>
            <div className="space-y-4">
              {categoryFaqs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq)
                const IconComponent = (faq.icon && ICON_MAP[faq.icon]) ? ICON_MAP[faq.icon] : HelpCircle
                return (
                  <AnimatedSection key={faq.id} delay={index * 0.05}>
                    <div className="card-lbta overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                        className="w-full flex items-start gap-4 p-8 text-left hover:bg-gray-50 transition-colors min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-inset"
                        aria-expanded={openIndex === globalIndex}
                        aria-controls={`faq-panel-${faq.id}`}
                      >
                        <IconComponent className="w-6 h-6 text-brand-sunset-cliff flex-shrink-0 mt-1" aria-hidden />
                        <div className="flex-1">
                          <h3 id={`faq-question-${faq.id}`} className="text-lg font-sans font-medium text-brand-pacific-dusk pr-8">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-6 h-6 text-gray-400 flex-shrink-0 ${reducedMotion ? '' : 'transition-transform duration-300'} ${
                            openIndex === globalIndex ? 'rotate-180' : ''
                          }`}
                          aria-hidden
                        />
                      </button>

                      {openIndex === globalIndex && (
                        <div
                          id={`faq-panel-${faq.id}`}
                          role="region"
                          aria-labelledby={`faq-question-${faq.id}`}
                          className={`px-8 pb-8 ${reducedMotion ? '' : 'transition-all duration-300 ease-out'}`}
                        >
                          <div className="pl-10 pt-4 border-l-4 border-brand-sunset-cliff">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
          </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-headline font-light text-brand-pacific-dusk mb-8">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-sans leading-relaxed">
              Schedule a complimentary trial. Experience our approach firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                SCHEDULE TRIAL
              </Link>
              <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="btn-secondary">
                (949) 534-0457
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
