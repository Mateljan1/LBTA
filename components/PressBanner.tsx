'use client'

// Press/Media mentions for social proof
// Add actual press logos when available

interface PressMention {
  name: string
  logo?: string
  quote?: string
}

const pressMentions: PressMention[] = [
  { name: 'Laguna Beach Magazine' },
  { name: 'OC Register' },
  { name: 'USTA Southern California' },
  { name: 'Tennis Channel' },
]

export default function PressBanner() {
  return (
    <section className="bg-white border-y border-lbta-stone/50 py-10 md:py-12" aria-labelledby="press-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <h2 id="press-heading" className="sr-only">Press and Credentials</h2>
        <p className="font-sans text-[11px] uppercase tracking-[3px] text-lbta-slate/60 text-center mb-8" aria-hidden="true">
          As Featured In
        </p>

        {/* Logos/Names */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {pressMentions.map((press) => (
            <div
              key={press.name}
              className="flex items-center justify-center"
            >
              {press.logo ? (
                <img
                  src={press.logo}
                  alt={press.name}
                  className="h-6 md:h-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <span className="font-serif text-[16px] md:text-[18px] text-lbta-slate/40 hover:text-lbta-charcoal transition-colors duration-300">
                  {press.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Credentials Row */}
        <div className="mt-10 pt-8 border-t border-lbta-stone/30" role="list" aria-label="Professional credentials">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2" role="listitem">
              <svg className="w-5 h-5 text-lbta-charcoal" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-sans text-[13px] text-lbta-charcoal">ATP/WTA Certified</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <svg className="w-5 h-5 text-lbta-charcoal" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-sans text-[13px] text-lbta-charcoal">USTA Member</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <svg className="w-5 h-5 text-lbta-charcoal" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-sans text-[13px] text-lbta-charcoal">PTR Certified</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <svg className="w-5 h-5 text-lbta-charcoal" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-sans text-[13px] text-lbta-charcoal">Background Checked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
