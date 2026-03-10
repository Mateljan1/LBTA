import Link from 'next/link'
import Image from 'next/image'
import { getFounder } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PullQuote from '@/components/ui/PullQuote'

export default function FounderSection() {
  const founder = getFounder()
  if (!founder) return null

  return (
    <section className="bg-white py-20 md:py-32" id="leadership-content">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-12 lg:gap-16 xl:gap-20 items-start">
          <AnimatedSection>
            <div className={`relative aspect-[3/4] max-w-[380px] mx-auto lg:mx-0 overflow-hidden rounded-lg ${founder.image.includes('andrew-headshot') ? '[filter:brightness(1.12)_contrast(1.05)]' : ''}`}>
              <Image
                src={founder.image}
                alt={`${founder.name}, Founder & Head Coach at Laguna Beach Tennis Academy`}
                fill
                className="object-cover"
                style={{ objectPosition: founder.imagePosition }}
                sizes="(max-width: 1024px) 100vw, 380px"
                quality={95}
              />
            </div>
          </AnimatedSection>

          <div className="lg:pt-2 w-full text-left">
            <AnimatedSection delay={100}>
              <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-4">
                Founder & Director
              </p>
              {founder.slug ? (
                <Link href={`/coaches/${founder.slug}`} className="block group">
                  <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em] group-hover:text-brand-victoria-cove transition-colors">
                    {founder.name}
                  </h2>
                </Link>
              ) : (
                <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em]">
                  {founder.name}
                </h2>
              )}
              <p className="font-sans text-[14px] text-brand-pacific-dusk/70 mb-6">
                {founder.specialization}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-5 mb-8">
                {founder.bio
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i} className="font-sans text-[16px] text-brand-pacific-dusk leading-[1.8]">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
              <PullQuote
                quote={founder.quoteExtended ?? founder.quote}
                attribution={founder.name}
                variant="light"
                className="mb-8"
              />
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-wrap gap-3">
                {founder.credentials.map((cred) => (
                  <span
                    key={cred}
                    className="font-sans text-[12px] text-brand-pacific-dusk/70 px-4 py-2 bg-brand-sandstone rounded-full"
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
