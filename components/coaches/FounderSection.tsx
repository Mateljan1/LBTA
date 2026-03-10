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
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
          <AnimatedSection className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={founder.image}
                alt={`${founder.name}, Founder & Head Coach at Laguna Beach Tennis Academy`}
                fill
                className="object-cover"
                style={{ objectPosition: founder.imagePosition }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 md:p-8 shadow-lg max-w-[280px] md:max-w-[320px]">
              <PullQuote
                quote={founder.quoteExtended ?? founder.quote}
                attribution={founder.name}
                variant="light"
                className="!mb-0 !py-0"
              />
            </div>
          </AnimatedSection>

          <div className="lg:pt-8">
            <AnimatedSection delay={100}>
              <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-4">
                Founder & Director
              </p>
              {founder.slug ? (
                <Link href={`/coaches/${founder.slug}`} className="block group">
                  <h2 className="font-headline text-[36px] md:text-[48px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em] group-hover:text-brand-victoria-cove transition-colors">
                    {founder.name}
                  </h2>
                </Link>
              ) : (
                <h2 className="font-headline text-[36px] md:text-[48px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em]">
                  {founder.name}
                </h2>
              )}
              <p className="font-sans text-[14px] text-brand-pacific-dusk/70 mb-8">
                {founder.specialization}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-5 mb-10">
                {founder.bio
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i} className="font-sans text-[16px] text-brand-pacific-dusk leading-[1.8]">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
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
