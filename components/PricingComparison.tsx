'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
  savings?: string
}

const tiers: PricingTier[] = [
  {
    name: 'Drop-In',
    price: '$50',
    period: 'per session',
    description: 'Try before you commit',
    features: [
      'Single group session',
      'All skill levels welcome',
      'No commitment required',
      'Same expert coaching',
    ],
    cta: 'Book a Session',
    href: '/book',
  },
  {
    name: 'Seasonal',
    price: '$546',
    period: 'per quarter',
    description: 'Most popular choice',
    features: [
      '13 weeks of training',
      '1x per week sessions',
      'Progress tracking',
      'Priority scheduling',
      'Community events access',
      '$42/session value',
    ],
    cta: 'Start Training',
    href: '/book',
    popular: true,
    savings: 'Save 16%',
  },
  {
    name: 'Committed',
    price: '$1,292',
    period: 'per quarter',
    description: 'Maximum results',
    features: [
      '13 weeks of training',
      '2x per week sessions',
      'Accelerated progress',
      'Video analysis included',
      'Private coach access',
      'Competition preparation',
      '$50/session value',
    ],
    cta: 'Go All In',
    href: '/book',
    savings: 'Best Value',
  },
]

export default function PricingComparison() {
  return (
    <section className="bg-lbta-cream py-16 md:py-24" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-eyebrow text-lbta-charcoal/60 mb-4">Simple Pricing</p>
          <h2 id="pricing-heading" className="font-serif text-[32px] md:text-[40px] font-semibold text-lbta-charcoal leading-tight mb-4">
            Choose Your Path
          </h2>
          <p className="font-sans text-[16px] text-lbta-slate max-w-xl mx-auto">
            All programs include ATP/WTA-certified coaching, small group sizes, and our 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-sm overflow-hidden transition-all duration-300 ${
                tier.popular
                  ? 'ring-2 ring-lbta-charcoal shadow-xl scale-[1.02] md:scale-105'
                  : 'border border-lbta-stone hover:border-lbta-charcoal/30'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-lbta-charcoal text-white text-center py-2">
                  <span className="font-sans text-[11px] uppercase tracking-[2px] font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Savings Badge */}
              {tier.savings && !tier.popular && (
                <div className="absolute top-4 right-4">
                  <span className="font-sans text-[10px] uppercase tracking-wider bg-lbta-cream text-lbta-charcoal px-2 py-1 rounded-sm">
                    {tier.savings}
                  </span>
                </div>
              )}

              <div className={`p-8 ${tier.popular ? 'pt-14' : ''}`}>
                {/* Tier Name */}
                <h3 className="font-sans text-[14px] uppercase tracking-wider text-lbta-slate mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <span className="font-serif text-[48px] font-semibold text-lbta-charcoal">
                    {tier.price}
                  </span>
                  <span className="font-sans text-[14px] text-lbta-slate ml-1">
                    {tier.period}
                  </span>
                </div>

                {/* Savings indicator for popular */}
                {tier.popular && tier.savings && (
                  <p className="font-sans text-[12px] text-green-600 font-medium mb-4">
                    {tier.savings} vs drop-in
                  </p>
                )}

                {/* Description */}
                <p className="font-sans text-[15px] text-lbta-slate mb-6">
                  {tier.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={tier.href}
                  className={`block w-full text-center py-4 font-sans text-[13px] uppercase tracking-wider font-medium transition-all duration-300 ${
                    tier.popular
                      ? 'bg-lbta-charcoal text-white hover:bg-black'
                      : 'border border-lbta-charcoal text-lbta-charcoal hover:bg-lbta-charcoal hover:text-white'
                  }`}
                >
                  {tier.cta}
                </Link>

                {/* Features */}
                <ul className="mt-8 space-y-3" aria-label={`${tier.name} plan features`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="font-sans text-[14px] text-lbta-charcoal">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Line */}
        <div className="mt-12 text-center" role="contentinfo" aria-label="Pricing guarantees">
          <p className="font-sans text-[13px] text-lbta-slate">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-Day Money-Back Guarantee
            </span>
            <span className="mx-4 text-lbta-stone">·</span>
            <span>No Long-Term Contracts</span>
            <span className="mx-4 text-lbta-stone">·</span>
            <span>Cancel Anytime</span>
          </p>
        </div>
      </div>
    </section>
  )
}
