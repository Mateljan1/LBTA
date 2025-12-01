'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, TrendingUp, DollarSign, Award, Users, Shield, AlertCircle, HelpCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const faqs = [
  {
    icon: TrendingUp,
    question: "What if my child doesn't make it to ATP/WTA level?",
    answer: "Let's be direct: 99.9% of junior players won't reach the ATP/WTA tour. That's not failure—that's reality. What LBTA provides is transferable excellence: discipline, resilience, strategic thinking, and work ethic that translates to every arena of life. Our college placement track record (20+ D1 scholarships) shows that elite development creates options. Tennis becomes the vehicle for becoming the kind of person who succeeds anywhere.",
    category: "Goals & Expectations"
  },
  {
    icon: DollarSign,
    question: "How much does the full pro pathway actually cost?",
    answer: "Complete transparency: A serious 10-year junior development pathway (ages 8-18) costs $150,000-$300,000+ depending on commitment level. This includes group training, private lessons, tournaments (travel, entry fees), equipment, physical training, and mental performance coaching. Monthly investment averages $1,500-$3,000 for competitive players training 10-15 hours/week. The real question: What's the ROI of raising a disciplined, college-ready athlete? Our D1 scholarships average $50,000/year (4 years = $200,000 value).",
    category: "Investment & Pricing"
  },
  {
    icon: Award,
    question: "What makes Andrew Mateljan different from other coaches?",
    answer: "Andrew isn't just teaching tennis—he's architecting player development systems refined over 25 years and 3 continents. His ATP/WTA tour experience means he knows what actually matters at the highest level. He currently coaches Karue Sell (ATP #258), has coached Max McKennon (ATP #458), and places players at D1 schools annually. You're not getting a 'tennis coach'—you're getting a performance architect who sees the invisible gaps others miss.",
    category: "Coaching Philosophy"
  },
  {
    icon: Users,
    question: "Can we transfer from another academy?",
    answer: "Yes, and transfers often accelerate fastest because they know what mediocre coaching looks like. We assess current level, identify technical gaps, and create a custom integration plan. Most transfers notice the difference immediately: structure, accountability, and coaching that actually progresses week-to-week. If you're frustrated with your current academy, book an assessment and see the LBTA difference firsthand.",
    category: "Getting Started"
  },
  {
    icon: Shield,
    question: "Do you offer financial aid or payment plans?",
    answer: "We offer payment plans (monthly, quarterly with prepay discount) and can split payments across credit cards for cash flow flexibility. For families demonstrating financial need and player commitment, we occasionally offer partial scholarships (typically 20-30% discount) on a case-by-case basis. The best 'financial aid' is our prepay discounts (save 5-10% paying quarterly upfront). We'd rather work with committed families on payment terms than turn away serious athletes.",
    category: "Investment & Pricing"
  },
  {
    icon: TrendingUp,
    question: "What's your D1 placement success rate?",
    answer: "20+ Division I placements in the last 8 years from our high-performance track. But statistics lie without context: We don't accept every player into HP programs—you must demonstrate commitment, coachability, and minimum skill threshold (typically UTR 6+ by age 14). Of athletes who commit to 4+ sessions/week for 3+ years, roughly 60% earn college scholarship offers (D1, D2, D3, NAIA).",
    category: "Results & Track Record"
  },
  {
    icon: AlertCircle,
    question: "How do you handle player burnout?",
    answer: "We prevent it through intelligent periodization and honest conversations. Burnout signals: declining performance, loss of enjoyment, chronic fatigue, or avoidance behaviors. Our response: mandatory rest weeks, training load adjustments, mental performance check-ins, and parent communication. Sometimes 'burnout' is really misaligned expectations—parents pushing harder than the kid wants. We'd rather course-correct to recreational/fitness tennis than force a trajectory that breaks the player.",
    category: "Player Development"
  },
  {
    icon: HelpCircle,
    question: "How do I know if LBTA is right for my family?",
    answer: "You're a fit if: (1) You value measurable progress over participation trophies. (2) You can commit to 2+ sessions/week minimum. (3) You understand pro pathways require sacrifice, focus, and long-term vision. (4) You want ATP-caliber coaching, not recreational babysitting. (5) You see tennis as a vehicle for discipline and excellence. You're NOT a fit if: You want 'fun first, development second,' need constant praise without correction, or aren't willing to practice outside of lessons.",
    category: "Getting Started"
  },
  {
    icon: DollarSign,
    question: "Why is LBTA more expensive than other programs?",
    answer: "You're paying for results, not just court time. Our coaches have placed 20+ athletes in D1 programs and currently train ATP-ranked players. You're accessing the same training systems that produce professionals—just scaled for your level. Cheap coaching keeps you stuck. Great coaching transforms your game. One D1 scholarship ($200K+ value) pays for 10 years of training.",
    category: "Investment & Pricing"
  }
]

const categories = Array.from(new Set(faqs.map(faq => faq.category)))

export default function FAQInteractive() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Add FAQ Schema for rich snippets
  useEffect(() => {
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

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(faqSchema)
    script.id = 'faq-schema'
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('faq-schema')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative bg-lbta-charcoal text-white py-32">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <HelpCircle className="w-16 h-16 text-lbta-burnt mx-auto mb-8" />
            <h1 className="text-display-lg font-serif font-light mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 font-sans mb-4">
              Honest, unfiltered answers about tennis training, costs, and what it really takes
            </p>
            <p className="text-sm text-lbta-burnt font-sans font-medium tracking-wide">
              No sales pitch. No sugar-coating. Just truth.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <AnimatedSection>
                <h2 className="text-2xl font-sans font-medium text-lbta-charcoal mb-8 pb-4 border-b-2 border-lbta-burnt">
                  {category}
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq)
                    const Icon = faq.icon
                    return (
                      <AnimatedSection key={globalIndex} delay={index * 0.05}>
                        <div className="card-lbta overflow-hidden">
                          <button
                            onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                            className="w-full flex items-start gap-4 p-8 text-left hover:bg-gray-50 transition-colors"
                          >
                            <Icon className="w-6 h-6 text-lbta-burnt flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="text-lg font-sans font-medium text-lbta-charcoal pr-8">
                                {faq.question}
                              </h3>
                            </div>
                            <ChevronDown
                              className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                                openIndex === globalIndex ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {openIndex === globalIndex && (
                            <div className="px-8 pb-8 transition-all duration-300 ease-out">
                              <div className="pl-10 pt-4 border-l-4 border-lbta-burnt">
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-sans leading-relaxed">
              Schedule a complimentary trial. Experience our approach firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                SCHEDULE TRIAL
              </Link>
              <a href="tel:9494646645" className="btn-secondary">
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
