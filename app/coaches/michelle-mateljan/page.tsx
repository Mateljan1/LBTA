import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { coachImageSrc } from '@/lib/coaches-data'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'

export const metadata: Metadata = {
  title: 'Michelle Mateljan — LBTA Coach | Laguna Beach Tennis Academy',
  description:
    'Coach at Laguna Beach Tennis Academy. Junior and adult development with clear communication and steady on-court energy.',
  openGraph: {
    title: 'Michelle Mateljan — LBTA Coach | Laguna Beach Tennis Academy',
    description:
      'Coach at Laguna Beach Tennis Academy. Junior and adult development with clear communication and steady on-court energy.',
    type: 'website',
    images: [{ url: coachImageSrc('/images/coaches/michelle-mateljan.webp'), width: 800, height: 1000, alt: 'Michelle Mateljan' }],
  },
}

const creds = [
  { title: 'Juniors & Adults', sub: 'Pathways across ages' },
  { title: 'On-court presence', sub: 'Clear, consistent coaching' },
  { title: 'LBTA Team', sub: 'Movement · Craft · Community' },
]

export default function MichelleMateljanPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Coaches', href: '/coaches' }, { label: 'Michelle Mateljan' }]} />

      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
            <AnimatedSection className="relative aspect-[200/260] overflow-hidden rounded-xl border border-black/5">
              <Image
                src={coachImageSrc('/images/coaches/michelle-mateljan.webp')}
                alt="Michelle Mateljan, LBTA Coach at Laguna Beach Tennis Academy"
                fill
                className="object-cover object-top"
                sizes="200px"
                quality={90}
              />
            </AnimatedSection>
            <div>
              <AnimatedSection>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-thousand-steps mb-2">LBTA Coach</p>
                <h1 className="text-display-lg heading-display mb-2">Michelle Mateljan</h1>
                <p className="font-headline text-lg italic text-brand-pacific-dusk/60 mb-6">Juniors &amp; Adult Development</p>
                <div className="flex flex-wrap gap-6 py-4 border-y border-black/6">
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">LBTA</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Team</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">All</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Levels</div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="section-spacing bg-brand-morning-light">
        <div className="container-narrow space-y-6">
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              Michelle supports players with steady encouragement and structured drills — from early progressions to match-style situations. Her sessions balance focus with a positive, approachable tone.
            </p>
          </AnimatedSection>

          <div className="section-quote py-5 pl-6 border-l-2 border-brand-victoria-cove/40">
            <p className="font-headline text-xl italic text-brand-pacific-dusk leading-snug">
              Every rally is a chance to grow.
            </p>
          </div>

          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {creds.map((c) => (
                <div key={c.title} className="bg-white border border-black/5 rounded-md p-4 text-center">
                  <p className="font-sans text-xs font-semibold text-brand-pacific-dusk">{c.title}</p>
                  <p className="font-sans text-[10px] text-brand-pacific-dusk/50">{c.sub}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-headline text-[32px] md:text-[48px] font-medium text-white leading-[1.15] mb-6">
            Book a lesson with Michelle
          </h2>
          <p className="text-white/70 font-sans mb-6">No commitment. No pressure. Just tennis.</p>
          <div className="flex flex-col gap-4 mb-8 items-center">
            <a
              href="mailto:support@lagunabeachtennisacademy.com"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" aria-hidden />
              <span>support@lagunabeachtennisacademy.com</span>
            </a>
            <a href="tel:9495340457" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Phone className="w-5 h-5" aria-hidden />
              <span>(949) 534-0457</span>
            </a>
          </div>
          <Link
            href="/book?type=private&coach=michelle-mateljan"
            className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            Get Started
          </Link>
        </div>
      </DarkSection>
    </>
  )
}
