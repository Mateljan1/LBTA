import Link from 'next/link'
import { MapPin, ExternalLink } from 'lucide-react'
import { PUBLIC_FACILITIES, googleMapsSearchUrl } from '@/lib/facilities'

export default function FacilitiesSection() {
  return (
    <section
      id="our-facilities"
      className="scroll-mt-24 md:scroll-mt-28 bg-brand-morning-light py-16 md:py-24"
      aria-labelledby="our-facilities-heading"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="text-eyebrow text-brand-victoria-cove mb-3">Where we train</p>
          <h2
            id="our-facilities-heading"
            className="font-headline text-[28px] md:text-[40px] font-semibold text-brand-pacific-dusk mb-4"
          >
            Our facilities
          </h2>
          <p className="font-sans text-[15px] md:text-[16px] text-brand-pacific-dusk/80 leading-relaxed">
            Three City of Laguna Beach sites. Programs and times vary by location —{' '}
            <Link
              href="/schedules"
              className="text-brand-victoria-cove underline decoration-brand-victoria-cove/30 underline-offset-2 hover:decoration-brand-victoria-cove focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
            >
              view the schedule
            </Link>{' '}
            for yours.
          </p>
        </div>

        <div className="grid gap-8 md:gap-10 md:grid-cols-3">
          {PUBLIC_FACILITIES.map((f) => (
            <article
              key={f.anchor}
              id={f.anchor}
              className="scroll-mt-28 md:scroll-mt-32 bg-white border border-black/8 rounded-[4px] p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-brand-victoria-cove shrink-0 mt-0.5" aria-hidden />
                <div>
                  <h3 className="font-headline text-[22px] md:text-[24px] font-semibold text-brand-pacific-dusk leading-tight">
                    {f.heading}
                  </h3>
                  <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mt-1">{f.courtLabel}</p>
                </div>
              </div>
              <p className="font-sans text-[14px] text-brand-pacific-dusk/85 mb-4 leading-relaxed">
                {f.streetLine}
                <br />
                Laguna Beach, CA 92651
              </p>
              <p className="font-sans text-[14px] text-brand-pacific-dusk/80 mb-4 leading-relaxed">
                {f.programsLine}
              </p>
              {f.parkingLine ? (
                <p className="font-sans text-[13px] text-brand-pacific-dusk/65 mb-5 leading-relaxed border-l-2 border-brand-thousand-steps/40 pl-3">
                  {f.parkingLine}
                </p>
              ) : null}
              <a
                href={googleMapsSearchUrl(f.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[48px] font-sans text-[14px] font-medium text-brand-victoria-cove hover:text-brand-pacific-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
              >
                Open in Maps
                <ExternalLink className="w-4 h-4" aria-hidden />
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
