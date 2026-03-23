import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import PullQuote from '@/components/ui/PullQuote'
import WhyChooseImage from '@/components/ui/WhyChooseImage'
import { MasonryGrid } from '@/components/sections'
import type { MasonryImageItem } from '@/components/sections/MasonryGrid'
import HomeHero from '@/components/HomeHero'
import HomeCTAForm from '@/components/HomeCTAForm'
import { coachImageSrc } from '@/lib/coaches-data'
import siteStats from '@/data/site-stats.json'
import homepageCopy from '@/data/homepage-copy.json'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'Laguna Beach Tennis Academy',
  alternateName: 'LBTA',
  description:
    'Tennis academy in Laguna Beach offering junior programs, adult lessons, high-performance training, and fitness classes. Movement-first coaching philosophy.',
  url: 'https://lagunabeachtennisacademy.com',
  telephone: '+1-949-534-0457',
  email: 'support@lagunabeachtennisacademy.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Moulton Meadows Park, 1098 Balboa Ave',
    addressLocality: 'Laguna Beach',
    addressRegion: 'CA',
    postalCode: '92651',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 33.5427, longitude: -117.7854 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '08:00', closes: '18:00' },
  ],
  priceRange: '$$',
  image: 'https://lagunabeachtennisacademy.com/images/hero/laguna-horizon.webp',
  logo: 'https://lagunabeachtennisacademy.com/logos/LBTAblktext.png',
  sameAs: ['https://www.instagram.com/lagunabeachtennisacademy', 'https://www.facebook.com/lagunabeachtennisacademy'],
  founder: { '@type': 'Person', name: 'Andrew Mateljan', jobTitle: 'Director & Head Coach' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: siteStats.trustStats.rating,
    reviewCount: siteStats.trustStats.reviewCount,
  },
}

export const metadata = {
  title: {
    absolute: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
  },
  description:
    'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, high-performance pathway. Book a trial.',
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description:
      'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, high-performance pathway. Book a trial.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy courts' }],
  },
}

type WhyChooseCopy = {
  headline: string
  subline: string
  image1: string
  image2: string
  image1Alt: string
  image2Alt: string
  image1ObjectPosition?: string
  image2ObjectPosition?: string
}

type PhilosophyPillar = (typeof homepageCopy)['philosophy']['pillars'][number] & {
  image: string
  imageAlt: string
  objectPosition?: string
}

type ProgramItem = (typeof homepageCopy)['programs']['items'][number] & {
  image: string
  imageAlt: string
  objectPosition?: string
}

type ResultsCopy = (typeof homepageCopy)['results'] & {
  backgroundImage: string
  backgroundAlt: string
  objectPosition?: string
}

type DestinationCopy = (typeof homepageCopy)['destination'] & {
  backgroundImage: string
  backgroundAlt: string
  objectPosition?: string
}

type CommunityGalleryItem = {
  src: string
  alt: string
  span?: 'small' | 'medium' | 'large'
  objectPosition?: string
}
type CommunitySection = (typeof homepageCopy)['community'] & { gallery: CommunityGalleryItem[] }

export default function Home() {
  const whyChoose = (homepageCopy as { whyChoose?: WhyChooseCopy }).whyChoose
  const communitySection = homepageCopy.community as CommunitySection
  const results = homepageCopy.results as ResultsCopy
  const destination = homepageCopy.destination as DestinationCopy
  return (
    <>
      <Script id="local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <HomeHero />

      <HorizonDivider animate />
      <section id="founder" className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-16">
            <AnimatedSection>
              <div className="bracket relative max-w-[480px] mx-auto lg:mx-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-subtle">
                  <Image
                    src={coachImageSrc('/images/founder/andrew-mateljan-on-court.webp')}
                    alt="Andrew Mateljan, Founder and Head Coach, reaching for a low ball on court in Laguna Beach"
                    fill
                    priority
                    className="object-cover"
                    style={{ objectPosition: '50% 40%' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                  />
                </div>
              </div>
            </AnimatedSection>
            <div className="lg:py-8">
              <AnimatedSection delay={100}>
                <span className="text-eyebrow mb-4 block">{homepageCopy.founder.eyebrow}</span>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.founder.headline}</h2>
                <div className="section-horizon" aria-hidden="true" />
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <p className="text-subhead font-light mb-6">{homepageCopy.founder.subhead}</p>
              </AnimatedSection>
              <AnimatedSection delay={400}>
                <p className="text-body text-lbta-slate mb-8">{homepageCopy.founder.body}</p>
              </AnimatedSection>
              <AnimatedSection delay={500}>
                <PullQuote
                  quote={homepageCopy.founder.quote}
                  attribution={homepageCopy.founder.quoteAttribution}
                  variant="light"
                  className="mb-8"
                />
              </AnimatedSection>
              <AnimatedSection delay={600}>
                <Link href={homepageCopy.founder.ctaSecondaryHref} className="btn-horizon">
                  <span>{homepageCopy.founder.ctaSecondary}</span>
                  <svg className="w-4 h-4 ml-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="stat-strip" className="bg-brand-deep-water py-12 md:py-14" aria-label="Academy at a glance">
        <div className="container-lbta">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            <div className="bg-brand-deep-water px-6 py-6 md:px-8 md:py-8 text-center border border-white/10">
              <p className="font-headline text-3xl md:text-4xl font-light text-white tabular-nums">{siteStats.trustStats.yearsExperience}</p>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 mt-2">Years Experience</p>
            </div>
            <div className="bg-brand-deep-water px-6 py-6 md:px-8 md:py-8 text-center border border-white/10">
              <p className="font-headline text-3xl md:text-4xl font-light text-white tabular-nums">{siteStats.trustStats.playersCount}</p>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 mt-2">Players Coached</p>
            </div>
            <div className="bg-brand-deep-water px-6 py-6 md:px-8 md:py-8 text-center border border-white/10">
              <p className="font-headline text-3xl md:text-4xl font-light text-white tabular-nums">{siteStats.trustStats.rating}</p>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 mt-2">Google Rating</p>
            </div>
            <div className="bg-brand-deep-water px-6 py-6 md:px-8 md:py-8 text-center border border-white/10">
              <p className="font-headline text-3xl md:text-4xl font-light text-white tabular-nums">{siteStats.trustStats.reviewCount}</p>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 mt-2">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={results.backgroundImage}
            alt={results.backgroundAlt}
            fill
            className="object-cover"
            style={{ objectPosition: results.objectPosition ?? '50% 42%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep-water/95 via-black/70 to-transparent" />
        </div>
        <div className="relative z-10 container-lbta">
          <div className="max-w-xl">
            <AnimatedSection>
              <span className="text-eyebrow text-white/90 mb-4 block">{results.eyebrow}</span>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <h2 className="font-headline text-[clamp(2.5rem,6vw,4rem)] font-light text-white leading-[1.15] tracking-[-0.02em] mb-6">
                {results.headline}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-body-lg text-white/80 mb-8">{results.subline}</p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <Link href={results.ctaSecondaryHref} className="btn-ghost text-white/80 hover:text-white inline-flex items-center min-h-[48px]">
                <span>{results.ctaSecondary}</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="philosophy" className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">{homepageCopy.philosophy.eyebrow}</span>
            <h2 className="font-headline text-headline font-light">{homepageCopy.philosophy.headline}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {(homepageCopy.philosophy.pillars as PhilosophyPillar[]).map((pillar, i) => {
              return (
                <AnimatedSection key={pillar.title} delay={i * 150}>
                  <div className="group h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-subtle mb-4 flex-shrink-0">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        className="object-cover image-zoom"
                        style={{ objectPosition: pillar.objectPosition ?? '50% 44%' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-headline text-headline-sm font-light mb-3 group-hover:text-brand-pacific-dusk/70 transition-colors">{pillar.title}</h3>
                      <p className="text-body text-brand-pacific-dusk mb-2">{pillar.description}</p>
                      <p className="text-body-sm text-lbta-slate">{pillar.detail}</p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="programs" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">{homepageCopy.programs.eyebrow}</span>
            <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.programs.headline}</h2>
            <p className="text-subhead max-w-2xl mx-auto font-light">{homepageCopy.programs.subline}</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-12">
            {(homepageCopy.programs.items as ProgramItem[]).map((program, index) => {
              return (
                <AnimatedSection key={program.title} delay={index * 150}>
                  <Link href={program.link} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-subtle mb-5">
                      <Image
                        src={program.image}
                        alt={program.imageAlt}
                        fill
                        className="object-cover image-zoom"
                        style={{ objectPosition: program.objectPosition ?? '50% 44%' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                      />
                    </div>
                    <h3 className="font-headline text-headline-sm font-light mb-2 group-hover:text-brand-pacific-dusk/70 transition-colors duration-300">{program.title}</h3>
                    <p className="text-body text-lbta-slate">{program.description}</p>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
          <AnimatedSection className="text-center">
            <Link href={homepageCopy.programs.ctaSecondaryHref} className="btn-horizon">
              <span>{homepageCopy.programs.ctaSecondary}</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="why-choose" className="bg-brand-sandstone section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-headline text-headline font-light mb-4">
              {whyChoose?.headline ?? 'Why Choose Laguna Beach Tennis Academy'}
            </h2>
            <p className="text-subhead max-w-2xl mx-auto font-light text-brand-pacific-dusk">
              {whyChoose?.subline ?? ''}
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            <AnimatedSection delay={100} className="md:col-span-3">
              <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-subtle">
                <WhyChooseImage
                  src={whyChoose?.image1 ?? '/images/why-choose/why-choose-1.webp'}
                  fallbackSrc="/images/hero/laguna-horizon.webp"
                  alt={whyChoose?.image1Alt ?? 'LBTA coach and players on court'}
                  fill
                  className="object-cover image-zoom"
                  style={{ objectPosition: whyChoose?.image1ObjectPosition ?? '50% 45%' }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  quality={90}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="md:col-span-2 flex flex-col gap-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-subtle flex-1 min-h-[200px]">
                <WhyChooseImage
                  src={whyChoose?.image2 ?? '/images/why-choose/why-choose-2.webp'}
                  fallbackSrc="/images/community/community-1.webp"
                  alt={whyChoose?.image2Alt ?? 'Laguna Beach tennis facility and community'}
                  fill
                  className="object-cover image-zoom"
                  style={{ objectPosition: whyChoose?.image2ObjectPosition ?? '50% 52%' }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  quality={90}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="destination" className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={destination.backgroundImage}
            alt={destination.backgroundAlt}
            fill
            className="object-cover"
            style={{ objectPosition: destination.objectPosition ?? '50% 52%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-brand-deep-water/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] mb-4 text-shadow-hero">{destination.headline}</h2>
            <p className="text-body-lg text-white/80 text-shadow-subtle font-light">{destination.subline}</p>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="community" className="bg-white section-lg">
        <div className="container-lbta">
          <MasonryGrid
            header={
              <AnimatedSection className="text-center mb-12">
                <span className="text-eyebrow mb-4 block">{homepageCopy.community.eyebrow}</span>
                <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.community.headline}</h2>
                <p className="text-subhead max-w-2xl mx-auto font-light">{homepageCopy.community.subline}</p>
              </AnimatedSection>
            }
            items={communitySection.gallery.map(
              (item): MasonryImageItem => ({
                src: item.src,
                alt: item.alt,
                span: item.span as MasonryImageItem['span'],
                objectPosition: item.objectPosition,
              })
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </section>

      <VideoTestimonials />

      <FAQSection />

      <section id="cta" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/cta/cta-background.webp" alt="Laguna Beach tennis courts at sunset" fill className="object-cover" sizes="100vw" quality={90} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/90 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-lg mx-auto py-20">
          <AnimatedSection>
            <span className="text-eyebrow text-white/90 mb-4 block">{homepageCopy.cta.eyebrow}</span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="font-headline text-[clamp(2rem,5vw,2.75rem)] font-light mb-8 leading-[1.2] text-shadow-hero">{homepageCopy.cta.headline}</h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <HomeCTAForm />
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <p className="text-body-sm text-white/70">{homepageCopy.cta.guarantee}</p>
          </AnimatedSection>
        </div>
      </section>

      <StickyCTA text={homepageCopy.stickyCta.text} href={homepageCopy.stickyCta.href} showAfterScroll={homepageCopy.stickyCta.showAfterScroll} />
    </>
  )
}
