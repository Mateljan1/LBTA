import Script from 'next/script'
import Link from 'next/link'
import HomeProgramCardLink from '@/components/home/HomeProgramCardLink'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import PullQuote from '@/components/ui/PullQuote'
import WhyChooseImage from '@/components/ui/WhyChooseImage'
import HomeCommunityGallery from '@/components/home/HomeCommunityGallery'
import HomeHero from '@/components/HomeHero'
import HomeCTAForm from '@/components/HomeCTAForm'
import PlayerSuccessCarousel, { type PlayerSuccessSlide } from '@/components/home/PlayerSuccessCarousel'
import { coachImageSrc } from '@/lib/coaches-data'
import siteStats from '@/data/site-stats.json'
import homepageCopy from '@/data/homepage-copy.json'
import pricingSupplemental from '@/data/pricing-supplemental.json'

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
  alternates: { canonical: '/' },
  title: {
    absolute: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
  },
  description:
    'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, high-performance pathway. Book a trial. Summer camps now enrolling - ages 5-11.',
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description:
      'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, high-performance pathway. Book a trial. Summer camps now enrolling - ages 5-11.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy courts' }],
  },
}

type WhyChooseCopy = {
  headline: string
  subline: string
  bullets?: string[]
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

type ProgramItem = (typeof homepageCopy)['programs']['groups'][number]['items'][number] & {
  image: string
  imageAlt: string
  objectPosition?: string
}

type ProgramGroup = {
  id: string
  label: string
  groupSubline?: string
  tier?: 'primary' | 'secondary'
  items: ProgramItem[]
}

type DestinationCopy = (typeof homepageCopy)['destination'] & {
  backgroundImage: string
  backgroundAlt: string
  objectPosition?: string
}

export default function Home() {
  const whyChoose = (homepageCopy as { whyChoose?: WhyChooseCopy }).whyChoose
  const results = homepageCopy.results
  const destination = homepageCopy.destination as DestinationCopy
  const comparisonTiers = pricingSupplemental.comparisonTiers
  return (
    <>
      <Script id="local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <HomeHero />

      {/* Stats strip removed — keeping it clean */}

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
                    className="object-cover"
                    style={{
                      objectPosition:
                        (homepageCopy.founder as { imageObjectPosition?: string }).imageObjectPosition ?? '48% 44%',
                    }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={95}
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
      <PlayerSuccessCarousel
        eyebrow={results.eyebrow}
        headline={results.headline}
        intervalMs={results.intervalMs}
        slides={results.slides as PlayerSuccessSlide[]}
      />

      <HorizonDivider animate />
      <section className="section-lg bg-brand-morning-light" aria-labelledby="home-camps-spotlight">
        <div className="container-lbta">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <AnimatedSection>
              <p className="text-eyebrow mb-4">Summer 2026 Camps</p>
              <h2 id="home-camps-spotlight" className="font-headline text-headline mb-5 font-light">
                Summer Camp Is Open
              </h2>
              <div className="section-horizon mb-6" aria-hidden="true" />
              <p className="text-body-lg leading-relaxed text-brand-pacific-dusk/85">
                Ages 5-11 at Alta Laguna Park, Monday through Thursday from June 16 to August 19. Each week blends tennis coaching,
                field games, arts and crafts, and Thursday Splash Wars in small groups.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex min-h-[36px] items-center rounded-full bg-white px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk">
                  8 kids per group
                </span>
                <span className="inline-flex min-h-[36px] items-center rounded-full bg-white px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk">
                  Full-Day: $495/week
                </span>
                <span className="inline-flex min-h-[36px] items-center rounded-full bg-white px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk">
                  Half-Day: $325/week
                </span>
              </div>
              <div className="mt-8">
                <Link
                  href="/camps"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep-water focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-morning-light"
                >
                  Explore Summer Camps
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <div className="relative aspect-[5/4] overflow-hidden rounded-subtle border border-black/10 bg-brand-deep-water shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
                <Image
                  src="https://res.cloudinary.com/dv033eo0x/image/upload/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg"
                  alt="LBTA summer camp players on court in Laguna Beach"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 42%' }}
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  quality={95}
                />
              </div>
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
            <div className="section-horizon mx-auto mt-4" aria-hidden="true" />
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
                        style={{ objectPosition: pillar.objectPosition ?? '50% 38%' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={95}
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
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="text-eyebrow mb-4 block">{homepageCopy.programs.eyebrow}</span>
            <h2 className="font-headline text-headline font-light mb-4">{homepageCopy.programs.headline}</h2>
            <div className="section-horizon mx-auto mb-6" aria-hidden="true" />
            <p className="text-subhead max-w-2xl mx-auto font-light">{homepageCopy.programs.subline}</p>
            <nav
              className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3"
              aria-label="Jump to program category"
            >
              {(homepageCopy.programs.groups as ProgramGroup[]).map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="text-[13px] font-sans font-medium uppercase tracking-[0.14em] text-brand-victoria-cove underline-offset-4 decoration-brand-victoria-cove/40 hover:text-brand-pacific-dusk hover:decoration-brand-pacific-dusk/60 underline transition-colors"
                >
                  {g.label}
                </a>
              ))}
            </nav>
          </AnimatedSection>
          <div className="space-y-14 md:space-y-16 mb-12">
            {(homepageCopy.programs.groups as ProgramGroup[]).map((group, groupIndex) => {
                const firstGroupLen = (homepageCopy.programs.groups as ProgramGroup[])[0].items.length
                const baseIndex = groupIndex === 0 ? 0 : firstGroupLen
                const n = group.items.length
                /** 4 cards: 2×2 on tablet, one row of four on xl — no 3+1 orphan. 3 cards: balanced row from md up. */
                const gridClass =
                  n === 4
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-[1400px] mx-auto'
                    : 'grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto'
                const imageSizes =
                  n === 4
                    ? '(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw'
                    : '(max-width: 767px) 100vw, 33vw'
                const isSecondary = group.tier === 'secondary'
                const programSection: 'coaching' | 'play' = isSecondary ? 'play' : 'coaching'
                return (
                  <div
                    key={group.id}
                    className={
                      isSecondary
                        ? 'pt-12 md:pt-14 border-t border-black/[0.06] scroll-mt-24'
                        : undefined
                    }
                  >
                    <h3
                      id={group.id}
                      className="font-headline text-[clamp(1.25rem,2.5vw,1.5rem)] text-brand-pacific-dusk mb-3 md:mb-4 scroll-mt-28 text-center md:text-left max-w-[1400px] mx-auto px-1"
                    >
                      {group.label}
                    </h3>
                    {group.groupSubline ? (
                      <p className="text-body-sm text-lbta-slate max-w-[1400px] mx-auto mb-6 md:mb-8 px-1 text-center md:text-left leading-relaxed">
                        {group.groupSubline}
                      </p>
                    ) : null}
                    <div className={gridClass}>
                      {group.items.map((program, index) => {
                        const cardIndex = baseIndex + index
                        return (
                          <AnimatedSection key={program.title} delay={cardIndex * 150}>
                            <HomeProgramCardLink program={program} section={programSection} imageSizes={imageSizes} />
                          </AnimatedSection>
                        )
                      })}
                    </div>
                  </div>
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
      <section id="tuition-snapshot" className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="text-eyebrow mb-4 block">Tuition Snapshot</span>
            <h2 className="font-headline text-headline font-light mb-4">What training typically costs.</h2>
            <div className="section-horizon mx-auto mb-6" aria-hidden="true" />
            <p className="text-subhead max-w-2xl mx-auto font-light text-brand-pacific-dusk/85">
              Full details live on the Schedule &amp; Pricing page. Here&apos;s a quick sense of how most players start.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="grid gap-6 lg:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {comparisonTiers.slice(0, 3).map((tier) => (
                <div
                  key={tier.name}
                  className="bg-white border border-black/5 rounded-subtle px-5 py-6 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                  <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-lbta-slate mb-2">
                    {tier.name}
                  </p>
                  <p className="font-headline text-[1.75rem] leading-tight text-brand-pacific-dusk">
                    {tier.price}
                    {tier.period ? (
                      <span className="font-sans text-[13px] text-lbta-slate ml-1 align-middle">
                        {` ${tier.period}`}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-body-sm text-lbta-slate mt-2 mb-4">{tier.description}</p>
                  <ul className="space-y-1.5 text-body-sm text-brand-pacific-dusk/90 mb-5">
                    {tier.features.slice(0, 3).map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-victoria-cove/80" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Link href={tier.href} className="btn-secondary w-full justify-center text-[13px]">
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200} className="mt-8 text-center">
            <Link href="/schedules" className="btn-horizon">
              <span>View full Schedule &amp; Pricing</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider animate />
      <section id="why-choose" className="bg-brand-sandstone section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <span className="text-eyebrow mb-4 block">Why families choose LBTA</span>
            <h2 className="font-headline text-headline font-light mb-4">
              {whyChoose?.headline ?? 'Why Choose Laguna Beach Tennis Academy'}
            </h2>
            <div className="section-horizon mx-auto mb-6" aria-hidden="true" />
            <p className="text-subhead max-w-2xl mx-auto font-light text-brand-pacific-dusk">
              {whyChoose?.subline ?? ''}
            </p>
            {whyChoose?.bullets && whyChoose.bullets.length > 0 ? (
              <ul className="mt-10 max-w-xl mx-auto text-left space-y-3 list-none pl-0">
                {whyChoose.bullets.map((line) => (
                  <li
                    key={line}
                    className="text-body text-brand-pacific-dusk/90 pl-6 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-brand-victoria-cove/80"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="btn-primary">
                Book a Trial
              </Link>
              <Link href="/programs" className="btn-secondary">
                View Programs
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8 mt-12 md:mt-14">
            <AnimatedSection delay={100} className="md:col-span-3">
              <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-subtle">
                <WhyChooseImage
                  src={whyChoose?.image1 ?? '/images/facility/hero-ocean-view-tennis-courts-sunset.webp'}
                  fallbackSrc="/images/hero/laguna-horizon.webp"
                  alt={whyChoose?.image1Alt ?? 'LBTA coach and players on court'}
                  fill
                  className="object-cover image-zoom"
                  style={{ objectPosition: whyChoose?.image1ObjectPosition ?? '50% 45%' }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  quality={95}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="md:col-span-2 flex flex-col gap-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-subtle flex-1 min-h-[200px]">
                <WhyChooseImage
                  src={whyChoose?.image2 ?? '/images/facility/detail-sunlit-blue-tennis-courts.webp'}
                  fallbackSrc="/images/community/community-1.webp"
                  alt={whyChoose?.image2Alt ?? 'Laguna Beach tennis facility and community'}
                  fill
                  className="object-cover image-zoom"
                  style={{ objectPosition: whyChoose?.image2ObjectPosition ?? '50% 52%' }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  quality={95}
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
            className="object-cover brightness-[1.02]"
            style={{ objectPosition: destination.objectPosition ?? '50% 45%' }}
            sizes="100vw"
            quality={95}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-deep-water/55 via-brand-deep-water/68 to-brand-deep-water/78" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] mb-4 text-shadow-hero">{destination.headline}</h2>
            <p className="text-body-lg text-white/80 text-shadow-subtle font-light">{destination.subline}</p>
          </AnimatedSection>
          <AnimatedSection delay={150}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/programs" className="btn-primary-invert">
                Explore Programs
              </Link>
              <Link href="/schedules" className="btn-secondary-invert">
                Schedule &amp; Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider animate />
      <HomeCommunityGallery />

      <VideoTestimonials variant="featured" />

      <section className="bg-brand-morning-light section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-10">
            <span className="text-eyebrow mb-4 block">What families say</span>
            <h2 className="font-headline text-headline-md font-light">
              Quiet confidence from the people on court.
            </h2>
            <div className="section-horizon mx-auto mt-4" aria-hidden="true" />
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            <AnimatedSection delay={50}>
              <figure className="h-full bg-white border border-black/5 rounded-subtle px-6 py-6 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <blockquote className="text-body text-brand-pacific-dusk mb-4">
                  “Our son went from hating lessons to asking when he can get back on court. The structure and atmosphere at LBTA made all the difference.”
                </blockquote>
                <figcaption className="text-body-sm text-lbta-slate">
                  — Mary, junior parent
                </figcaption>
              </figure>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <figure className="h-full bg-white border border-black/5 rounded-subtle px-6 py-6 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <blockquote className="text-body text-brand-pacific-dusk mb-4">
                  “Coaching here is calm, clear, and honest. As an adult player I feel pushed without being talked down to.”
                </blockquote>
                <figcaption className="text-body-sm text-lbta-slate">
                  — Alex, adult program player
                </figcaption>
              </figure>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <figure className="h-full bg-white border border-black/5 rounded-subtle px-6 py-6 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <blockquote className="text-body text-brand-pacific-dusk mb-4">
                  “There is a real community feel—coaches know every player by name and treat the work seriously.”
                </blockquote>
                <figcaption className="text-body-sm text-lbta-slate">
                  — Laguna Beach family
                </figcaption>
              </figure>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <FAQSection />

      <section id="cta" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cta/cta-background.webp"
            alt="Laguna Beach tennis courts at sunset"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 55%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/85 via-black/45 to-black/25" />
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
