import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'

export const metadata: Metadata = {
  title: 'Allison Cronk — LBTA Coach | Laguna Beach Tennis Academy',
  description: 'Collegiate player. Educator. Coach. 5+ years coaching across five academies. NCAA & NAIA tennis. B.A. History, Education minor.',
  openGraph: {
    title: 'Allison Cronk — LBTA Coach | Laguna Beach Tennis Academy',
    description: 'Collegiate player. Educator. Coach. 5+ years coaching across five academies. NCAA & NAIA tennis. B.A. History, Education minor.',
    type: 'website',
    images: [{ url: '/images/coaches/allison-cronk.png', width: 800, height: 1000, alt: 'Allison Cronk' }],
  },
}

const creds = [
  { title: 'NCAA & NAIA', sub: 'Collegiate Tennis — 2 Programs' },
  { title: 'B.A. History', sub: 'Education Minor — Shepherd University' },
  { title: 'CPR / AED', sub: 'HSI Certified' },
  { title: 'Dean\'s List', sub: 'Every Semester — Both Universities' },
]

export default function AllisonCronkPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Coaches', href: '/coaches' },
        { label: 'Allison Cronk' }
      ]} />

      <section className="relative bg-white pt-32 pb-20">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
            <AnimatedSection className="relative aspect-[200/260] overflow-hidden rounded-xl border border-black/5">
              <Image
                src="/images/coaches/allison-cronk.png"
                alt="Allison Cronk, LBTA Coach at Laguna Beach Tennis Academy"
                fill
                className="object-cover object-top"
                sizes="200px"
                quality={90}
              />
            </AnimatedSection>
            <div>
              <AnimatedSection>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-thousand-steps mb-2">LBTA Coach</p>
                <h1 className="text-display-lg heading-display mb-2">Allison Cronk</h1>
                <p className="font-headline text-lg italic text-brand-pacific-dusk/60 mb-6">
                  Collegiate Player. Educator. Coach.
                </p>
                <div className="flex flex-wrap gap-6 py-4 border-y border-black/6">
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">5+</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Years Coaching</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">2</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">College Programs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">4–60</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Ages Coached</div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-2xl font-light text-brand-pacific-dusk">5</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-pacific-dusk/30">Academies</div>
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
              Allison played varsity tennis at Mira Costa High School in Manhattan Beach, then competed at Westcliff University (NAIA) and Shepherd University (NCAA) — earning Dean&apos;s List every semester at both.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              She&apos;s coached at five academies across Orange County and the South Bay. Beginners, juniors, adults, competitors. She adapts to whoever is on the other side of the net.
            </p>
          </AnimatedSection>
          <div className="section-quote py-5 pl-6 border-l-2 border-brand-victoria-cove/40">
            <p className="font-headline text-xl italic text-brand-pacific-dusk leading-snug">
              She doesn&apos;t just teach the game. She teaches the person playing it.
            </p>
          </div>
          <AnimatedSection>
            <p className="font-sans text-brand-pacific-dusk/80 leading-relaxed">
              Off the court, Allison holds a degree in History with a minor in Education. She&apos;s led classrooms, tutored college students, and served as president of an international education honor society. Teaching is what she does — tennis is where she does it.
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
            Book a lesson with Allison
          </h2>
          <p className="text-white/70 font-sans mb-6">No commitment. No pressure. Just tennis.</p>
          <div className="flex flex-col gap-4 mb-8 items-center">
            <a href="mailto:Allison.cronk1@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Mail className="w-5 h-5" aria-hidden />
              <span>Allison.cronk1@gmail.com</span>
            </a>
            <a href="tel:3105280281" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Phone className="w-5 h-5" aria-hidden />
              <span>(310) 528-0281</span>
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
