import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import PullQuote from '@/components/ui/PullQuote'
import HomeHero from '@/components/HomeHero'
import HomeCTAForm from '@/components/HomeCTAForm'
import siteStats from '@/data/site-stats.json'
import homepageCopy from '@/data/homepage-copy.json'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'Laguna Beach Tennis Academy',
  alternateName: 'LBTA',
  description:
    'Premier tennis academy in Laguna Beach offering junior programs, adult lessons, high-performance training, and fitness classes. Movement-first coaching philosophy.',
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
  title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
  description:
    'Movement. Craft. Community. Premier tennis academy in Laguna Beach — junior programs, adult training, high-performance. Free trial.',
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description: 'Movement. Craft. Community. Premier tennis in Laguna Beach. Free trial.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy courts' }],
  },
}

type WhyChooseCopy = { headline: string; subline: string; image1: string; image2: string; image1Alt: string; image2Alt: string }

export default function Home() {
  const whyChoose = (homepageCopy as { whyChoose?: WhyChooseCopy }).whyChoose
  return (
    <>
      <Script id="local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <HomeHero />

      <HorizonDivider />
      <section id="founder" className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-16">
            <AnimatedSection>
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-subtle">
                <Image
                  src="/images/coaches/andrew-headshot.png"
                  alt="Andrew Mateljan, Founder & Head Coach"
                  fill
                  priority
                  className="object-cover"
                  style={{ objectPosition: '50% 25%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
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
                <Link href={homepageCopy.founder.ctaSecondaryHref} className="btn-ghost inline-flex items-center min-h-[48px]">
                  <span>{homepageCopy.founder.ctaSecondary}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/results/karue-training.webp"
            alt="ATP player in training session at LBTA"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 35%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep-water/95 via-black/70 to-transparent" />
        </div>
        <div className="relative z-10 container-lbta">
          <div className="max-w-xl">
            <AnimatedSection>
              <span className="text-eyebrow text-white/90 mb-4 block">{homepageCopy.results.eyebrow}</span>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <h2 className="font-headline text-[clamp(2.5rem,6vw,4rem)] font-light text-white leading-[1.15] tracking-[-0.02em] mb-6">
                {homepageCopy.results.headline}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-body-lg text-white/80 mb-8">{homepageCopy.results.subline}</p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <Link href={homepageCopy.results.ctaSecondaryHref} className="btn-ghost text-white/80 hover:text-white inline-flex items-center min-h-[48px]">
                <span>{homepageCopy.results.ctaSecondary}</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HorizonDivider />
      <section id="philosophy" className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">{homepageCopy.philosophy.eyebrow}</span>
            <h2 className="font-headline text-headline font-light">{homepageCopy.philosophy.headline}</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {homepageCopy.philosophy.pillars.map((pillar, i) => {
              const images = ['/images/philosophy/movement.webp', '/images/philosophy/discipline.webp', '/images/philosophy/belonging.webp']
              return (
              <AnimatedSection key={pillar.title} delay={i * 150}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-subtle mb-6">
                    <Image src={images[i]} alt={`${pillar.title} — ${pillar.description}`} fill className="object-cover image-zoom" sizes="(max-width: 768px) 100vw, 33vw" quality={90} />
                  </div>
                  <h3 className="font-headline text-headline-sm font-light mb-3 group-hover:text-brand-pacific-dusk/70 transition-colors">{pillar.title}</h3>
                  <p className="text-body text-brand-pacific-dusk mb-2">{pillar.description}</p>
                  <p className="text-body-sm text-lbta-slate">{pillar.detail}</p>
                </div>
              </AnimatedSection>
            );
            })}
          </div>
        </div>
      </section>

      <HorizonDivider />
      <section id="programs" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">{homepageCopy.programs.eyebrow}</span>
            <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.programs.headline}</h2>
            <p className="text-subhead max-w-2xl mx-auto font-light">{homepageCopy.programs.subline}</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-12">
            {homepageCopy.programs.items.map((program, i) => {
              const images = ['/images/programs/juniors.webp', '/images/programs/adults.webp', '/images/programs/private-lessons.webp']
              return (
                <AnimatedSection key={program.title} delay={i * 150}>
                  <Link href={program.link} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-subtle mb-5">
                      <Image src={images[i]} alt={program.title} fill className="object-cover image-zoom" sizes="(max-width: 768px) 100vw, 33vw" quality={90} />
                    </div>
                    <h3 className="font-headline text-headline-sm font-light mb-2 group-hover:text-brand-pacific-dusk/70 transition-colors duration-300">{program.title}</h3>
                    <p className="text-body text-lbta-slate">{program.description}</p>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
          <AnimatedSection className="text-center">
            <Link href={homepageCopy.programs.ctaSecondaryHref} className="btn-secondary">
              <span>{homepageCopy.programs.ctaSecondary}</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />
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
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection delay={100}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-subtle">
                <Image
                  src={whyChoose?.image1 ?? '/images/why-choose/why-choose-1.webp'}
                  alt={whyChoose?.image1Alt ?? 'LBTA coach and players on court'}
                  fill
                  className="object-cover image-zoom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-subtle">
                <Image
                  src={whyChoose?.image2 ?? '/images/why-choose/why-choose-2.webp'}
                  alt={whyChoose?.image2Alt ?? 'Laguna Beach tennis facility and community'}
                  fill
                  className="object-cover image-zoom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HorizonDivider />
      <section id="destination" className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero/laguna-horizon.webp" alt="Laguna Beach tennis courts with ocean view" fill className="object-cover" sizes="100vw" quality={90} />
          <div className="absolute inset-0 bg-brand-deep-water/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] mb-4 text-shadow-hero">{homepageCopy.destination.headline}</h2>
            <p className="text-body-lg text-white/80 text-shadow-subtle font-light">{homepageCopy.destination.subline}</p>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />
      <section id="community" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <span className="text-eyebrow mb-4 block">{homepageCopy.community.eyebrow}</span>
            <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.community.headline}</h2>
            <p className="text-subhead max-w-2xl mx-auto font-light">{homepageCopy.community.subline}</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((num, i) => (
              <AnimatedSection key={num} delay={i * 100}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-subtle">
                  <Image
                    src={`/images/community/community-${num}.webp`}
                    alt={`LBTA community member ${num}`}
                    fill
                    className="object-cover image-zoom"
                    style={{ objectPosition: '50% 55%' }}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    quality={90}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
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
            <p className="text-body-sm text-white/60">{homepageCopy.cta.guarantee}</p>
          </AnimatedSection>
        </div>
      </section>

      <StickyCTA text={homepageCopy.stickyCta.text} href={homepageCopy.stickyCta.href} showAfterScroll={homepageCopy.stickyCta.showAfterScroll} />
    </>
  )
}
