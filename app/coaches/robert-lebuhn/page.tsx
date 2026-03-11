import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'

export const metadata: Metadata = {
  title: 'Robert W. LeBuhn — Director of Tennis Operations | Laguna Beach Tennis Academy',
  description: 'USPTR-certified tennis professional with 25+ years coaching. NCAA Division I at Lafayette College. Director of Tennis Operations at LBTA.',
  openGraph: {
    title: 'Robert W. LeBuhn — Director of Tennis Operations | Laguna Beach Tennis Academy',
    description: 'USPTR-certified tennis professional with 25+ years coaching. NCAA Division I at Lafayette College. Director of Tennis Operations at LBTA.',
    type: 'website',
    images: [{ url: '/images/coaches/robert-lebuhn.png', width: 800, height: 1000, alt: 'Robert W. LeBuhn' }],
  },
}

const awards = [
  'NJ Boys Tennis Coach of the Year (Dwight-Englewood)',
  'Union County Girls Coach of the Year (Summit HS)',
  'Somerset County Girls Coach of the Year (Ridge HS)',
  'San Diego CIF Girls Coach of the Year (Coronado HS)',
]

const creds = [
  { title: 'USPTR Professional', sub: 'Highest Level' },
  { title: 'NCAA Division I', sub: 'Lafayette College' },
  { title: 'Adaptive Tennis', sub: 'Special Olympics Certified' },
  { title: 'CPR / AED', sub: 'Red Cross Certified' },
]

export default function RobertLeBuhnPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Coaches', href: '/coaches' },
        { label: 'Robert LeBuhn' }
      ]} />

      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
            <AnimatedSection className="relative aspect-[200/260] overflow-hidden rounded-xl border border-black/5">
              <Image
                src="/images/coaches/robert-lebuhn.png"
                alt="Robert W. LeBuhn, Director of Tennis Operations at Laguna Beach Tennis Academy"
                fill
                className="object-cover object-top"
                sizes="200px"
                quality={90}
              />
            </AnimatedSection>
            <div>
              <AnimatedSection>
                <h1 className="text-display-lg heading-display mb-2">Robert W. LeBuhn</h1>
                <p className="font-headline text-lg italic text-brand-pacific-dusk/60 mb-6">
                  Director of Tennis Operations & Growth. NCAA Division I. USPTR Professional.
                </p>
                <div className="flex flex-wrap gap-6 py-4 border-y border-black/6">
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">25+</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Years Coaching</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">NCAA</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Division I</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">4x</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Coach of Year</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">USPTR</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Professional</div>
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
              Robert LeBuhn is a USPTR-certified tennis professional with more than 25 years of coaching, teaching, and program-building experience across every level of the game — from junior development and high school to college, country club, resort, and professional settings.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              At Laguna Beach Tennis Academy, Robert leads day-to-day operations, staff coordination, scheduling, parent communications, lead management, partnership development, and revenue growth — while remaining an active coaching presence on the court. He reports directly to Founder and Academy Director Andrew Mateljan.
            </p>
          </AnimatedSection>
          <div className="section-quote py-5 pl-6 border-l-2 border-brand-victoria-cove/40">
            <p className="font-headline text-xl italic text-brand-pacific-dusk leading-snug">
              His background in transforming programs, building team culture, and managing complex tennis operations makes him a natural fit for LBTA&apos;s mission: Movement. Discipline. Belonging.
            </p>
          </div>
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              Robert trained at the Harry Hopman Tennis Academy and was a Top 20 USTA Eastern junior. He was the 1983 State Singles Champion at the Lawrenceville School and National Prep Champion. He competed NCAA Division I at Lafayette College (1983–85), earning two-time All-Conference honors and a B.A. in Government & Law.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-thousand-steps mb-3">Coaching Awards</p>
            <ul className="space-y-2">
              {awards.map((a) => (
                <li key={a} className="font-sans text-sm text-brand-pacific-dusk/70 flex items-center gap-2 border-b border-black/4 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-brand-victoria-cove to-brand-sunset-cliff shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-thousand-steps mb-3">LBTA Strengths</p>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              Player Development — structured methods across juniors, college, resort, and pro settings. Operational Leadership — staff, scheduling, budgets, and client communications. Program Building — transforming programs from the ground up. Match Preparation — lineup decisions, scouting, and competitive play. Inclusive Tennis — adaptive and Special Olympics certification.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            Book a lesson with Robert
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
            className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            Get Started
          </Link>
        </div>
      </DarkSection>
    </>
  )
}
