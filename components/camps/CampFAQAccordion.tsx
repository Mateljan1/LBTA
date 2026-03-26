'use client'

const FAQS = [
  {
    q: 'What should my child bring to camp?',
    a: 'Tennis racquet (we can provide one if needed), water bottle, sunscreen, hat, and athletic clothing. Full-day camps include lunch; half-day camps, bring a snack.',
  },
  {
    q: 'What skill level is required?',
    a: 'All skill levels are welcome. We group by age and ability so instruction and match play stay appropriate.',
  },
  {
    q: 'Can I register for a single day or drop-in?',
    a: 'Many camps offer a half-day drop-in rate. When you register online, choose drop-in if available and select your day in the form. Full sessions and half-day week bundles are listed by camp.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Full refunds up to 14 days before the start date. 50% refund up to 7 days before. Credits toward future programs may apply within 7 days of start — contact us to arrange.',
  },
  {
    q: 'Is early drop-off or late pickup available?',
    a: 'Extended care is available for an additional fee. Early drop-off from 8:00 AM and late pickup until 4:00 PM can be arranged — contact the front desk.',
  },
] as const

export default function CampFAQAccordion() {
  return (
    <div className="divide-y divide-black/[0.08] border border-black/[0.06] rounded-[2px] bg-white">
      {FAQS.map((faq) => (
        <details
          key={faq.q}
          className="group px-5 py-1 sm:px-6 open:bg-brand-morning-light/40"
        >
          <summary className="cursor-pointer list-none py-4 font-sans text-[15px] font-medium leading-snug text-brand-pacific-dusk outline-none marker:content-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm">
            <span className="flex items-start justify-between gap-4">
              <span>{faq.q}</span>
              <span
                className="mt-0.5 shrink-0 text-brand-pacific-dusk/40 transition-transform duration-300 group-open:rotate-180"
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </span>
          </summary>
          <p className="pb-4 font-sans text-[14px] leading-relaxed text-brand-pacific-dusk/75 pr-8">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
