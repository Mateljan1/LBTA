import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import HorizonDivider from '@/components/ui/HorizonDivider'
import PullQuote from '@/components/ui/PullQuote'

export const metadata: Metadata = {
  title: 'High Performance Pathway | Tennis Training | LBTA',
  description: 'Invitation-only high performance tennis training for competitive players. UTR 5-8+, tournament preparation, and college pathway with ATP/WTA certified coaches.',
  openGraph: {
    title: 'High Performance Pathway | Laguna Beach Tennis Academy',
    description: 'Where serious players become champions. ATP/WTA methodology for tournament and college preparation.',
  },
}

const highPerformanceSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "High Performance Pathway - Tennis Training",
  "description": "Invitation-only high performance tennis program for competitive players with UTR 5-8+",
  "provider": {
    "@type": "Organization",
    "name": "Laguna Beach Tennis Academy",
    "sameAs": "https://lagunabeachtennisacademy.com"
  },
  "coursePrerequisites": "UTR 5+ or equivalent competitive experience",
  "educationalLevel": "Advanced",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "onsite",
    "instructor": {
      "@type": "Person",
      "name": "Andrew Mateljan",
      "jobTitle": "ATP/WTA Tour Coach"
    }
  }
}

const achievements = [
  { stat: '#858 → #258', label: 'ATP Ranking Improvement', detail: 'Karue Sell' },
  { stat: '20+', label: 'D1 College Placements', detail: 'Since 2021' },
  { stat: 'Strong', label: 'College Placement Track Record', detail: 'For committed players' },
]

const pillars = [
  {
    title: 'Technical Precision',
    description: 'Biomechanically sound strokes built for consistency under pressure. Video analysis and data-driven refinement.',
  },
  {
    title: 'Tactical Intelligence',
    description: 'Pattern recognition, court geometry, and strategic decision-making. Learn to read opponents and construct points.',
  },
  {
    title: 'Mental Fortitude',
    description: 'Competition mindset training. Pressure simulation, match management, and psychological resilience.',
  },
  {
    title: 'Athletic Foundation',
    description: 'Tennis-specific conditioning, injury prevention, and athletic development for sustainable performance.',
  },
]

const requirements = [
  'UTR 5+ or equivalent competitive ranking',
  'Commitment to minimum 2 sessions per week',
  'Active tournament participation',
  'Coachable attitude and growth mindset',
  'Completion of assessment session',
]

export default function HighPerformancePathwayPage() {
  return (
    <>
      <Script
        id="high-performance-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(highPerformanceSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/high-performance.webp"
            alt="High performance tennis training at LBTA"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="font-sans text-[11px] uppercase tracking-[3px] text-white/60 mb-6">
            Invitation Only
          </p>
          <h1 className="font-headline text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.05] mb-6">
            The High Performance Pathway
          </h1>
          <p className="font-sans text-[18px] md:text-[20px] text-white/80 max-w-2xl mx-auto mb-10">
            Where competitive players become champions. ATP/WTA methodology for those ready to commit to excellence.
          </p>
          <Link
            href="#apply"
            className="inline-flex items-center justify-center bg-white text-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 hover:bg-white/90 transition-all duration-300"
          >
            Apply for Assessment
          </Link>
        </div>
      </section>

      <HorizonDivider />

      {/* Results Section */}
      <section className="bg-brand-pacific-dusk py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {achievements.map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-headline text-[48px] md:text-[56px] font-semibold text-white leading-none mb-2">
                  {item.stat}
                </p>
                <p className="font-sans text-[14px] uppercase tracking-wider text-white/60 mb-1">
                  {item.label}
                </p>
                <p className="font-sans text-[13px] text-white/40">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* Philosophy Section */}
      <section className="bg-brand-morning-light py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-brand-pacific-dusk/60 mb-4">Our Methodology</p>
            <h2 className="font-headline text-[32px] md:text-[40px] font-semibold text-brand-pacific-dusk leading-tight mb-4">
              The Four Pillars of Excellence
            </h2>
            <p className="font-sans text-[16px] text-lbta-slate max-w-2xl mx-auto">
              Every session is designed around comprehensive player development. We don&apos;t just teach tennis—we build complete competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="bg-white p-8 md:p-10 border border-lbta-stone/50"
              >
                <span className="font-headline text-[48px] text-lbta-stone/30 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-headline text-[24px] font-semibold text-brand-pacific-dusk mt-4 mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-[15px] text-lbta-slate leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* Coach Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/founder/andrew-portrait.webp"
                alt="Andrew Mateljan - ATP/WTA Tour Coach"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-eyebrow text-brand-pacific-dusk/60 mb-4">Your Coach</p>
              <h2 className="font-headline text-[32px] md:text-[36px] font-semibold text-brand-pacific-dusk leading-tight mb-6">
                Andrew Mateljan
              </h2>
              <p className="font-sans text-[14px] uppercase tracking-wider text-brand-sunset-cliff mb-6">
                ATP/WTA Tour Coach · 25+ Years Experience
              </p>
              <div className="space-y-4 text-[15px] text-lbta-slate leading-relaxed">
                <p>
                  Former #3 ranked junior in Southern California and #12 nationally. International coaching experience across Spain, Croatia, and Norway shaped a movement-first methodology proven at the highest levels.
                </p>
                <p>
                  Current coach of ATP #262 Karue Sell. Previous players include ATP #458 and #63 Doubles ranked professionals. Over 20 Division I college placements since 2021.
                </p>
                <p>
                  High Performance Pathway players receive direct instruction and ongoing development plans personally designed by Andrew.
                </p>
              </div>
              <PullQuote
                quote="Structure creates confidence. Confidence creates champions."
                variant="light"
                className="mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* Requirements Section */}
      <section className="bg-brand-morning-light py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-brand-pacific-dusk/60 mb-4">Requirements</p>
            <h2 className="font-headline text-[32px] md:text-[36px] font-semibold text-brand-pacific-dusk leading-tight mb-4">
              Is This Program For You?
            </h2>
            <p className="font-sans text-[16px] text-lbta-slate">
              The High Performance Pathway is selective by design. We invest deeply in players ready to match that commitment.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 border border-lbta-stone/50">
            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-brand-tide-pool flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-sans text-[15px] text-brand-pacific-dusk">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center font-sans text-[14px] text-lbta-slate mt-8">
            Not sure if you qualify? <Link href="/book" className="text-brand-pacific-dusk underline hover:no-underline">Schedule a consultation</Link> to discuss your goals.
          </p>
        </div>
      </section>

      <HorizonDivider />

      {/* Application CTA */}
      <section id="apply" className="bg-brand-pacific-dusk py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[3px] text-white/50 mb-6">
            Start Your Journey
          </p>
          <h2 className="font-headline text-[32px] md:text-[40px] font-semibold text-white leading-tight mb-6">
            Apply for Assessment
          </h2>
          <p className="font-sans text-[16px] text-white/70 mb-10 max-w-xl mx-auto">
            The first step is a complimentary assessment session. We&apos;ll evaluate your current level, discuss your goals, and determine if the High Performance Pathway is the right fit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book?program=high-performance-assessment"
              className="inline-flex items-center justify-center bg-white text-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 hover:bg-white/90 transition-all duration-300"
            >
              Request Assessment
            </Link>
            <a
              href="tel:+19495340457"
              className="inline-flex items-center justify-center border border-white/30 text-white font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 hover:bg-white/10 transition-all duration-300"
            >
              Call (949) 534-0457
            </a>
          </div>

          <p className="font-sans text-[13px] text-white/40 mt-8">
            Assessment required for enrollment · Acceptance not guaranteed
          </p>
        </div>
      </section>
    </>
  )
}
