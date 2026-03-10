import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'

export const metadata: Metadata = {
  title: 'Peter DeFrantz — LBTA Coach | Laguna Beach Tennis Academy',
  description: 'USPTA & PTR certified professional. 8+ years coaching. College tennis at Mt. San Jacinto — #1 in SoCal. All ages and levels.',
  openGraph: {
    title: 'Peter DeFrantz — LBTA Coach | Laguna Beach Tennis Academy',
    description: 'USPTA & PTR certified professional. 8+ years coaching. College tennis at Mt. San Jacinto — #1 in SoCal. All ages and levels.',
    type: 'website',
    images: [{ url: '/images/coaches/peter-defrantz.png', width: 800, height: 1000, alt: 'Peter DeFrantz' }],
  },
}

const strengths = [
  { title: 'Communication', desc: 'Connects with children of all ages. Builds real relationships, not just runs drills.' },
  { title: 'Teaching Method', desc: 'Progressive, scaffolded approach — starts inside the service line, gradually expanding distance and complexity.' },
  { title: 'Player Development', desc: 'Strong observation and evaluation skills. Delivers feedback constructively, meeting each player where they are.' },
  { title: 'Fitness Integration', desc: 'Passionate about on-court and off-court fitness, current with modern training trends.' },
  { title: 'Energy & Attitude', desc: 'Consistently positive presence. Lessons are fun, challenging, and engaging — players stay motivated and come back.' },
]

const creds = [
  { title: 'USPTA', sub: 'Certified Professional' },
  { title: 'PTR', sub: 'Certified Professional' },
  { title: 'College Tennis', sub: '#1 SoCal, #2 California' },
]

export default function PeterDeFrantzPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Coaches', href: '/coaches' },
        { label: 'Peter DeFrantz' }
      ]} />

      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
            <AnimatedSection className="relative aspect-[200/260] overflow-hidden rounded-xl border border-black/5">
              <Image
                src="/images/coaches/peter-defrantz.png"
                alt="Peter DeFrantz, LBTA Coach at Laguna Beach Tennis Academy"
                fill
                className="object-cover object-top"
                sizes="200px"
                quality={90}
              />
            </AnimatedSection>
            <div>
              <AnimatedSection>
                <h1 className="text-display-lg heading-display mb-2">Peter DeFrantz</h1>
                <p className="font-headline text-lg italic text-brand-pacific-dusk/60 mb-6">
                  USPTA & PTR Certified Professional. College Tennis. 8+ Years Coaching.
                </p>
                <div className="flex flex-wrap gap-6 py-4 border-y border-black/6">
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">8+</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Years Coaching</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">#1</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">SoCal Team</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">2</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Certifications</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">All</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Ages & Levels</div>
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
              Peter DeFrantz grew up on the tennis court. Raised by a father who coached high school tennis, he learned early that the game is about more than strokes — it is about how you carry yourself, how you compete, and how you treat the people around you.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              He played college tennis at Mt. San Jacinto College, where his team was ranked number one in Southern California and number two in the state. That competitive foundation — combined with dual USPTA and PTR certification — shapes how he coaches today: with structure, with intention, and with genuine care for every player.
            </p>
          </AnimatedSection>
          <div className="section-quote py-5 pl-6 border-l-2 border-brand-victoria-cove/40">
            <p className="font-headline text-xl italic text-brand-pacific-dusk leading-snug">
              Over 8+ years of coaching across Southern California, Peter has built a reputation for making tennis accessible and engaging for players of all ages and abilities.
            </p>
          </div>

          <AnimatedSection>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-thousand-steps mb-4">Coaching Strengths</p>
            <div className="grid md:grid-cols-2 gap-4">
              {strengths.map((s) => (
                <div key={s.title} className="bg-white border border-black/5 rounded-md p-4">
                  <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-1">{s.title}</h4>
                  <p className="font-sans text-xs text-brand-pacific-dusk/70 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

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
            Book a lesson with Peter
          </h2>
          <p className="text-white/70 font-sans mb-6">No commitment. No pressure. Just tennis.</p>
          <div className="flex flex-col gap-4 mb-8 items-center">
            <a href="mailto:andrew@lagunabeachtennisacademy.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Mail className="w-5 h-5" aria-hidden />
              <span>andrew@lagunabeachtennisacademy.com</span>
            </a>
            <a href="tel:9492410847" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Phone className="w-5 h-5" aria-hidden />
              <span>(949) 241-0847</span>
            </a>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
          >
            Get Started
          </Link>
        </div>
      </DarkSection>
    </>
  )
}
