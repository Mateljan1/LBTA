import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import FAQSection from '@/components/FAQSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import HomeHero from '@/components/HomeHero'
import HomeCTAForm from '@/components/HomeCTAForm'

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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '47' },
}

export const metadata = {
  title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
  description:
    'Movement. Craft. Community. Premier tennis academy in Laguna Beach — junior programs, adult training, high-performance. Free trial.',
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description: 'Movement. Craft. Community. Premier tennis in Laguna Beach. Free trial.',
    type: 'website',
  },
}

export default function Home() {
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
                  src="/images/founder/andrew-portrait.webp"
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
                <span className="text-eyebrow mb-4 block">Our Founder</span>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <h2 className="font-headline text-headline font-light mb-6">Founded in Laguna Beach by Andrew Mateljan</h2>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <p className="text-subhead font-light mb-6">A lifetime in the game — from international courts to California&apos;s coast.</p>
              </AnimatedSection>
              <AnimatedSection delay={400}>
                <p className="text-body text-lbta-slate mb-8">
                  25 years in tennis as a top-ranked junior and international coach. Years spent coaching in Spain and Croatia shaped a
                  movement-first approach grounded in clarity and accountability. Now guiding players of every level toward their best version
                  of the game.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={500}>
                <blockquote className="border-l-2 border-brand-pacific-dusk/30 pl-6 mb-8">
                  <p className="font-headline text-[1.5rem] italic text-brand-pacific-dusk font-light leading-relaxed mb-3">
                    &quot;Structure creates confidence. Confidence creates results.&quot;
                  </p>
                  <footer className="text-body-sm text-lbta-slate">— Andrew Mateljan</footer>
                </blockquote>
              </AnimatedSection>
              <AnimatedSection delay={600}>
                <Link href="/about" className="btn-ghost">
                  <span>Read Andrew&apos;s Story</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            alt="Karue Sell ATP training session"
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
              <span className="text-eyebrow text-black mb-4 block">Player Success</span>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <h2 className="font-headline text-[clamp(3rem,8vw,5rem)] font-light text-white leading-[1] tracking-[-0.02em] mb-6">
                #858 → #258
                <span className="block text-[0.5em] font-normal text-white/70 mt-2">ATP World Ranking</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-body-lg text-white/80 mb-2 font-light">Guided by structure, repetition, and trust.</p>
              <p className="text-body text-white/60 mb-8">Karue Sell — ATP Tour Player<br />Coached by Andrew Mateljan</p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <Link href="/success-stories" className="btn-ghost text-white/80 hover:text-white">
                <span>Watch His Journey</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <span className="text-eyebrow mb-4 block">Our Philosophy</span>
            <h2 className="font-headline text-headline font-light">The Three Pillars</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { image: '/images/philosophy/movement.webp', title: 'Movement', description: 'The foundation of repeatable success.', detail: 'Technical precision through biomechanics and footwork fundamentals.' },
              { image: '/images/philosophy/discipline.webp', title: 'Craft', description: 'Structure that builds confidence.', detail: 'Consistent practice routines create lasting mental toughness.' },
              { image: '/images/philosophy/belonging.webp', title: 'Community', description: 'A community built on respect.', detail: 'Players support each other through wins, losses, and growth.' },
            ].map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 150}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-subtle mb-6">
                    <Image src={pillar.image} alt={`${pillar.title} - ${pillar.description}`} fill className="object-cover image-zoom" sizes="(max-width: 768px) 100vw, 33vw" quality={90} />
                  </div>
                  <h3 className="font-headline text-headline-sm font-light mb-3 group-hover:text-brand-pacific-dusk/70 transition-colors">{pillar.title}</h3>
                  <p className="text-body text-brand-pacific-dusk mb-2">{pillar.description}</p>
                  <p className="text-body-sm text-lbta-slate">{pillar.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />
      <section id="programs" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <span className="text-eyebrow mb-4 block">Our Programs</span>
            <h2 className="font-headline text-headline font-light mb-4">Pathways for Every Player</h2>
            <p className="text-subhead max-w-2xl mx-auto font-light">From first serves to tournament victories, we have a program for you.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-12">
            {[
              { image: '/images/programs/juniors.webp', title: 'Junior Pathway', description: 'From red ball to college prep.', link: '/programs/junior' },
              { image: '/images/programs/adults.webp', title: 'Adult Training', description: 'Focused development for any level.', link: '/programs/adult' },
              { image: '/images/programs/private-lessons.webp', title: 'Private Coaching', description: 'Personal sessions built around your goals.', link: '/book' },
            ].map((program, i) => (
              <AnimatedSection key={program.title} delay={i * 150}>
                <Link href={program.link} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-subtle mb-5">
                    <Image src={program.image} alt={program.title} fill className="object-cover image-zoom" sizes="(max-width: 768px) 100vw, 33vw" quality={90} />
                  </div>
                  <h3 className="font-headline text-headline-sm font-light mb-2 group-hover:text-brand-pacific-dusk/70 transition-colors duration-300">{program.title}</h3>
                  <p className="text-body text-lbta-slate">{program.description}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="text-center">
            <Link href="/programs" className="btn-secondary">
              <span>View All Programs</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section id="destination" className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero/laguna-horizon.webp" alt="Laguna Beach tennis courts with ocean view" fill className="object-cover" sizes="100vw" quality={90} />
          <div className="absolute inset-0 bg-brand-deep-water/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] mb-4 text-shadow-hero">Train where focus meets horizon.</h2>
            <p className="text-body-lg text-white/80 text-shadow-subtle font-light">Laguna Beach — where performance meets perspective.</p>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />
      <section id="community" className="bg-white section-lg">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <span className="text-eyebrow mb-4 block">Our Community</span>
            <h2 className="font-headline text-headline font-light mb-4">Players who train our way.</h2>
            <p className="text-subhead max-w-2xl mx-auto font-light">From junior pathways to ATP courts, each player shares the same standard.</p>
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
            <span className="text-eyebrow text-black mb-4 block">Get Started</span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="font-headline text-[clamp(2rem,5vw,2.75rem)] font-light mb-8 leading-[1.2] text-shadow-hero">Start training with purpose.</h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <HomeCTAForm />
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <p className="text-body-sm text-white/60">30-Day Money-Back Guarantee · No Long-Term Commitment</p>
          </AnimatedSection>
        </div>
      </section>

      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
