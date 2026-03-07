import Link from 'next/link'
import { Check } from 'lucide-react'
import type { getSpringSummer2026 } from '@/lib/programs-data'

import type { ExtendedSeasonKey as SeasonKey } from '@/lib/season-utils'
export type { SeasonKey }

interface Season {
  name: string
  dates: string
  weeks: number
  status: string
  multiplier: number
  [key: string]: unknown
}

interface BasePricingProgram {
  label: string
  subtitle: string
  ages: string
  duration: string
  winterPrices: { '1x': number; '2x': number; '3x'?: number }
  dropIn: number
}

interface MonthlyProgram {
  label: string
  subtitle: string
  price: number
  dropIn: number
}

interface PrivateCoach {
  coach: string
  title: string
  rate60: number
  rate90: number
  pack10: number
  pack20: number
  availability: string
}

interface Discount {
  type: string
  amount: number
  description: string
}

interface Scholarships {
  coverage: string
  email: string
}

interface PricingTabProps {
  seasons: Record<string, Season>
  selectedSeason?: SeasonKey
  springSummerData?: ReturnType<typeof getSpringSummer2026>
  basePricing: Record<string, BasePricingProgram>
  monthlyPrograms: Record<string, MonthlyProgram>
  privateCoaching: PrivateCoach[]
  discounts: Record<string, Discount>
  scholarships: Scholarships
}

function formatSpringSummerPricing (
  pricing: Record<string, unknown>,
  season: 'spring' | 'summer'
): { '1x'?: number; '2x'?: number; '3x'?: number; saturday1x?: number; monthly?: number; drop_in?: number } | null {
  if (!pricing || typeof pricing !== 'object') return null
  const seasonBlock = pricing[season] as Record<string, number> | undefined
  const monthlyVal = pricing.monthly as number | Record<string, number> | undefined
  const dropIn = pricing.drop_in as number | undefined
  if (seasonBlock && typeof seasonBlock === 'object') {
    return { ...seasonBlock, drop_in: dropIn }
  }
  if (typeof monthlyVal === 'number') {
    return { monthly: monthlyVal, drop_in: dropIn }
  }
  if (monthlyVal && typeof monthlyVal === 'object') {
    return { ...monthlyVal, drop_in: dropIn }
  }
  return null
}

export default function PricingTab({
  seasons,
  selectedSeason,
  springSummerData,
  basePricing,
  monthlyPrograms,
  privateCoaching,
  discounts,
  scholarships,
}: PricingTabProps) {
  const showSpringSummerPricing = (selectedSeason === 'spring' || selectedSeason === 'summer') && springSummerData
  const springOrSummer = selectedSeason === 'spring' ? 'spring' : 'summer'
  const seasonMeta = showSpringSummerPricing ? springSummerData[springOrSummer] : null
  const seasonPrograms = showSpringSummerPricing
    ? springSummerData.programs.filter((p) => formatSpringSummerPricing(p.pricing, springOrSummer))
    : []

  return (
    <section id="pricing" className="bg-brand-morning-light py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-center mb-4">
          2026 Program Pricing
        </h2>
        <p className="font-sans text-[14px] md:text-[16px] text-brand-pacific-dusk/80 text-center mb-10 max-w-2xl mx-auto">
          Quarterly, monthly, and private coaching options. All programs include makeup classes.
        </p>

        {/* Spring or Summer 2026 Program Pricing (when season tab is Spring/Summer) */}
        {showSpringSummerPricing && seasonMeta && (
          <div className="bg-white rounded-lg overflow-hidden shadow-soft mb-10">
            <div className="bg-brand-sandstone px-6 py-4">
              <h3 className="font-serif text-[20px] md:text-[24px] font-semibold text-brand-pacific-dusk">
                {seasonMeta.label} Program Pricing
              </h3>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
                {seasonMeta.dates}
                {seasonMeta.weeks != null && ` · ${seasonMeta.weeks} weeks`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label={`${seasonMeta.label} program prices`}>
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Program</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">1x/week</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">2x/week</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">3x/week</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Saturday 1x</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Monthly</th>
                    <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Drop-in</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonPrograms.map((p) => {
                    const row = formatSpringSummerPricing(p.pricing, springOrSummer)
                    if (!row) return null
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-sans text-[15px] font-semibold text-black">{p.program}</div>
                          {p.category && (
                            <div className="font-sans text-[12px] text-brand-pacific-dusk/80">{p.category}</div>
                          )}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                          {row['1x'] != null ? `$${row['1x']}` : '—'}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                          {row['2x'] != null ? `$${row['2x']}` : '—'}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                          {row['3x'] != null ? `$${row['3x']}` : '—'}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                          {row.saturday1x != null ? `$${row.saturday1x}` : '—'}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                          {row.monthly != null ? `$${row.monthly}` : '—'}
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[14px] text-brand-pacific-dusk/70">
                          {row.drop_in != null ? `$${row.drop_in}` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {springSummerData.discounts && springSummerData.discounts.length > 0 && (
              <div className="px-6 py-4 bg-brand-morning-light border-t border-gray-100">
                <h4 className="font-serif text-[18px] font-semibold text-black mb-3">Available Discounts</h4>
                <ul className="space-y-2">
                  {springSummerData.discounts.map((d, i) => (
                    <li key={i} className="font-sans text-[14px] text-black/80 flex items-baseline gap-2">
                      <span className="font-semibold text-black">{d.label}</span>
                      {d.percent != null && <span className="text-brand-pacific-dusk/80">{d.percent}%</span>}
                      {d.description && <span className="text-brand-pacific-dusk/80">— {d.description}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Season Price Comparison */}
        <div className="bg-white rounded-lg p-6 md:p-8 mb-10 shadow-soft">
          <h3 className="font-serif text-[20px] md:text-[24px] font-semibold mb-6 text-center">
            Seasonal Price Adjustments
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(seasons).map(([key, season]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg text-center ${
                  key === 'winter' ? 'bg-black/5 border-2 border-black' : 'bg-gray-50'
                }`}
              >
                <div className="font-sans text-[13px] text-brand-pacific-dusk/80 uppercase tracking-wider mb-1">
                  {season.name.split(' ')[0]}
                </div>
                <div className="font-serif text-[24px] font-bold text-black">
                  {season.weeks} weeks
                </div>
                <div className={`font-sans text-[14px] mt-1 ${key === 'winter' ? 'text-black font-semibold' : 'text-brand-pacific-dusk/80'}`}>
                  {key === 'winter' ? 'Base Rate' : `${Math.round(season.multiplier * 100)}% of Winter`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Programs Pricing */}
        <div className="bg-white rounded-lg overflow-hidden shadow-soft mb-8">
          <div className="bg-brand-sandstone px-6 py-4">
            <h3 className="font-serif text-[20px] md:text-[24px] font-semibold text-brand-pacific-dusk">
              Quarterly Programs
            </h3>
            <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
              Billed per season · Prices shown are for Winter 2026 (13 weeks)
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Quarterly program pricing">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Program</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">1x/week</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">
                    2x/week
                  </th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">3x/week</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase tracking-wider">Drop-in</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(basePricing).map(([key, program]) => (
                    <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-sans text-[15px] font-semibold text-black">{program.label}</div>
                        <div className="font-sans text-[12px] text-brand-pacific-dusk/80">{program.subtitle}</div>
                        <div className="font-sans text-[11px] text-brand-pacific-dusk/60 mt-1">{program.ages} · {program.duration}</div>
                      </td>
                      <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                        ${program.winterPrices['1x']}
                      </td>
                      <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                        ${program.winterPrices['2x']}
                      </td>
                      <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                        {'3x' in program.winterPrices ? `$${(program.winterPrices as any)['3x']}` : '—'}
                      </td>
                      <td className="text-center px-4 py-4 font-sans text-[14px] text-brand-pacific-dusk/70">
                        ${program.dropIn}/class
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          
          {/* Value Proposition Footer */}
          <div className="bg-brand-morning-light px-6 py-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-6 text-[13px]">
              <span className="flex items-center gap-2 text-black/70">
<svg className="w-4 h-4 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
                30-day money-back guarantee
              </span>
              <span className="flex items-center gap-2 text-black/70">
<svg className="w-4 h-4 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
                Makeup classes included
              </span>
              <span className="flex items-center gap-2 text-black/70">
<svg className="w-4 h-4 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
                Cancel anytime
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Programs */}
        <div className="bg-white rounded-lg overflow-hidden shadow-soft mb-8">
          <div className="bg-brand-sandstone px-6 py-4">
            <h3 className="font-serif text-[20px] md:text-[24px] font-semibold text-brand-pacific-dusk">
              Monthly Programs
            </h3>
            <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
              Flexible month-to-month billing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {Object.entries(monthlyPrograms).map(([key, program]) => (
              <div key={key} className="p-6 text-center">
                <div className="font-sans text-[16px] font-semibold text-black mb-1">{program.label}</div>
                <div className="font-sans text-[12px] text-brand-pacific-dusk/80 mb-3">{program.subtitle}</div>
                <div className="font-serif text-[32px] font-bold text-black">${program.price}</div>
                <div className="font-sans text-[12px] text-brand-pacific-dusk/80">/month</div>
                <div className="font-sans text-[13px] text-brand-pacific-dusk/70 mt-2">Drop-in: ${program.dropIn}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Private Coaching */}
        <div className="bg-white rounded-lg overflow-hidden shadow-soft mb-8">
          <div className="bg-brand-sandstone px-6 py-4">
            <h3 className="font-serif text-[20px] md:text-[24px] font-semibold text-brand-pacific-dusk">
              Private Coaching
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Private coaching rates by coach">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">Coach</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">60 min</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">90 min</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">10-Pack</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">20-Pack</th>
                  <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-brand-pacific-dusk/80 uppercase">Availability</th>
                </tr>
              </thead>
              <tbody>
                {privateCoaching.map((coach) => (
                  <tr key={coach.coach} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-sans text-[15px] font-semibold text-black">{coach.coach}</div>
                      <div className="font-sans text-[12px] text-brand-pacific-dusk/80">{coach.title}</div>
                    </td>
                    <td className="text-center px-4 py-4 font-sans text-[16px] text-black">${coach.rate60}</td>
                    <td className="text-center px-4 py-4 font-sans text-[16px] text-black">${coach.rate90}</td>
                    <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">${coach.pack10}</td>
                    <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">${coach.pack20}</td>
                    <td className="text-center px-4 py-4">
                      <span className={`font-sans text-[12px] px-3 py-1 rounded-full ${
                        coach.availability === 'Limited' 
                          ? 'bg-brand-sunset-cliff/10 text-brand-sunset-cliff' 
                          : 'bg-brand-tide-pool/10 text-brand-tide-pool'
                      }`}>
                        {coach.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discounts & Scholarships */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-soft">
            <h3 className="font-serif text-[20px] font-semibold mb-4">Available Discounts</h3>
            <ul className="space-y-3">
              {Object.entries(discounts).map(([key, discount]) => (
                <li key={key} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-tide-pool flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-sans text-[15px] font-medium text-black">
                      {discount.type === 'fixed' ? `$${discount.amount}` : `${discount.amount}%`} off
                    </span>
                    <span className="font-sans text-[14px] text-brand-pacific-dusk/80 ml-1">— {discount.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-brand-sandstone rounded-lg p-6">
            <h3 className="font-serif text-[20px] font-semibold mb-4">Scholarship Program</h3>
            <p className="font-sans text-[14px] text-black/70 mb-4">
              We believe tennis should be accessible to all. Our scholarship program provides {scholarships.coverage} tuition assistance for qualifying families.
            </p>
            <Link 
              href={`mailto:${scholarships.email}`}
              className="inline-flex items-center font-sans text-[14px] font-semibold text-black hover:text-black/70"
            >
              Apply for Scholarship →
            </Link>
          </div>
        </div>

        {/* Payment Note */}
        <p className="text-center font-sans text-[13px] text-brand-pacific-dusk/70 mt-8 italic">
          Payment plans available for quarterly programs. Contact us for details.
        </p>
      </div>
    </section>
  )
}
