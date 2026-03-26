'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import AnimatedSection from '@/components/AnimatedSection'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import DarkSection from '@/components/ui/DarkSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import { ZigzagSection } from '@/components/sections'
import { CampListingCard, CampFAQAccordion } from '@/components/camps'
import { getCampsFromYear2026, type CampWeek, type CampWithWeeks } from '@/lib/camps-data'
import { getCampsHeading } from '@/lib/site-copy'
import { buildCampModalRegistration } from '@/lib/camp-modal-data'
import type { CampRegistrationData } from '@/lib/camp-modal-data'

const camps = getCampsFromYear2026()
const campsHeading = getCampsHeading()

const SEASON_FILTERS = ['all', 'winter', 'spring', 'summer', 'fall'] as const

export default function CampsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCamp, setSelectedCamp] = useState<CampRegistrationData | null>(null)

  const filteredCamps = useMemo(() => {
    const list =
      selectedSeason === 'all' ? camps : camps.filter((c) => c.season === selectedSeason)
    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }, [selectedSeason])

  const handleRegisterClick = (camp: CampWithWeeks & { selectedWeek?: CampWeek }) => {
    setSelectedCamp(buildCampModalRegistration(camp, camp.selectedWeek))
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="relative min-h-[min(85vh,820px)] overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/camps/camp-action-4.webp"
            alt="Junior campers and coaches on court during LBTA holiday and summer tennis camps"
            fill
            className="object-cover max-md:brightness-[0.92]"
            style={{ objectPosition: '50% 42%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 hero-scrim-branded" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(85vh,820px)] max-w-[1200px] flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-32 lg:justify-center lg:pb-28">
          <div className="max-w-[34rem] text-left">
            <p className="font-sans text-eyebrow mb-4 text-brand-victoria-cove text-shadow-hero-readable">
              Holiday & summer
            </p>
            <h1 className="font-headline text-display-xl mb-5 text-white text-shadow-hero-readable">
              Camps at LBTA
            </h1>
            <p className="font-sans text-body-lg max-w-xl font-light text-white text-shadow-hero-readable max-md:text-white/95 md:text-white/90">
              School-break sessions and summer weeks for ages 5–17. Movement first, then craft — on court with coaches who know your player&apos;s name.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#camps"
                className="inline-flex min-h-[48px] items-center justify-center bg-white px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-brand-deep-water transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
              >
                Browse sessions
              </Link>
              <Link
                href="/schedules#camps"
                className="inline-flex min-h-[48px] items-center justify-center border border-white/45 bg-transparent px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
              >
                Schedule & pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Camps' }]} />
      </div>

      <HorizonDivider />

      <section
        id="camps"
        className="scroll-mt-28 border-b border-brand-pacific-dusk/[0.06] bg-brand-morning-light"
      >
        <div className="container-lbta section">
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">{campsHeading}</p>
              <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">Sessions</h2>
              <p className="font-sans text-body-lg text-brand-pacific-dusk/80">
                Filter by season, then register for a specific week or open the form to choose. Pricing matches{' '}
                <Link
                  href="/schedules#camps"
                  className="font-medium text-brand-victoria-cove underline decoration-brand-victoria-cove/35 underline-offset-4 hover:decoration-brand-victoria-cove focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
                >
                  schedule & pricing
                </Link>
                .
              </p>
            </div>
          </div>

          <div
            className="mb-10 -mx-4 flex gap-0 overflow-x-auto px-4 pb-px sm:mx-0 sm:overflow-visible sm:px-0 snap-x snap-mandatory sm:snap-none"
            role="group"
            aria-label="Filter camps by season"
          >
            <div className="flex min-w-full shrink-0 gap-0 border-b border-brand-pacific-dusk/10 sm:min-w-0">
              {SEASON_FILTERS.map((season) => {
                const active = selectedSeason === season
                const label = season === 'all' ? 'All' : season.charAt(0).toUpperCase() + season.slice(1)
                return (
                  <button
                    key={season}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedSeason(season)}
                    className={`snap-start shrink-0 px-4 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors min-h-[48px] border-b-2 -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm sm:px-6 ${
                      active
                        ? 'border-brand-pacific-dusk text-brand-pacific-dusk'
                        : 'border-transparent text-brand-pacific-dusk/45 hover:text-brand-pacific-dusk/75'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mx-auto flex max-w-[880px] flex-col gap-10 md:gap-12">
            {filteredCamps.length === 0 ? (
              <p className="font-sans text-body text-brand-pacific-dusk/65 text-center py-12">
                No camps in this season. Try &ldquo;All&rdquo; or view the full{' '}
                <Link href="/schedules" className="text-brand-victoria-cove underline underline-offset-4">
                  schedule
                </Link>
                .
              </p>
            ) : (
              filteredCamps.map((camp, index) => (
                <AnimatedSection key={camp.id} delay={80 + index * 40}>
                  <CampListingCard camp={camp} onRegister={handleRegisterClick} />
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </section>

      <HorizonDivider />

      <ZigzagSection
        className="bg-white py-16 md:py-24"
        title={
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">On court</p>
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">
              What a week feels like
            </h2>
            <div className="section-horizon mb-6 opacity-90" aria-hidden="true" />
            <p className="font-sans text-body-lg text-brand-pacific-dusk/80">
              Drills, games, and match play — paced for each group. Same philosophy as our year-round programs.
            </p>
          </div>
        }
        blocks={[
          {
            imageSrc: '/images/camps/camp-action-1.webp',
            imageAlt: 'Young players in camp footwork and movement at LBTA',
            content: (
              <AnimatedSection delay={0}>
                <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-3">Movement first</h3>
                <p className="font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/75">
                  Footwork and court coverage come before we stack technique. Players learn to move efficiently on the
                  surfaces they play.
                </p>
              </AnimatedSection>
            ),
          },
          {
            imageSrc: '/images/camps/camp-action-2.webp',
            imageAlt: 'Campers in progressive ball drills at Laguna Beach Tennis Academy',
            content: (
              <AnimatedSection delay={0}>
                <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-3">Progressive groups</h3>
                <p className="font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/75">
                  Red, orange, and green ball progressions keep each age band challenged. Coaches adjust to the level in
                  the room — then add rally and point play when players are ready.
                </p>
              </AnimatedSection>
            ),
          },
          {
            imageSrc: '/images/camps/camp-action-3.webp',
            imageAlt: 'LBTA camp players in match play and community on court',
            content: (
              <AnimatedSection delay={0}>
                <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-3">Community</h3>
                <p className="font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/75">
                  Camps are about belonging as much as tennis. Players push each other in a supportive environment — the
                  same community you find in our year-round programs.
                </p>
              </AnimatedSection>
            ),
          },
        ]}
      />

      <section className="border-t border-brand-pacific-dusk/[0.06] bg-brand-sandstone/50 py-16 md:py-20">
        <div className="container-lbta">
          <blockquote className="section-quote my-0 max-w-3xl font-headline text-[clamp(1.25rem,2.5vw,1.5rem)] font-light leading-snug text-brand-pacific-dusk">
            Movement. Craft. Community. — the same foundation in every camp session as in our academy programs.
          </blockquote>
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-18 md:py-22">
        <div className="container-lbta">
          <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 md:gap-16 md:pb-16">
            <div>
              <p className="font-sans text-eyebrow mb-3 text-white/60">Match play</p>
              <h2 className="font-headline text-display-sm mb-4 text-white">Saturday UTR series</h2>
              <p className="font-sans text-[15px] leading-relaxed text-white/80">
                Rated Saturday match play in five divisions — separate from camps, but a natural next step for players who
                want competition on the calendar.
              </p>
              <Link
                href="/programs/utr-match-play"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center bg-black px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
              >
                UTR Match Play
              </Link>
            </div>
            <div>
              <p className="font-sans text-eyebrow mb-3 text-white/60">Questions</p>
              <h2 className="font-headline text-display-sm mb-4 text-white">We&apos;re here</h2>
              <p className="font-sans text-[15px] leading-relaxed text-white/80">
                Call or write — we&apos;ll help you pick the right week and explain session vs drop-in where it applies.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center justify-center border border-white/40 bg-transparent px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
                >
                  Contact
                </Link>
                <a
                  href="tel:9495340457"
                  aria-label="Call (949) 534-0457"
                  className="inline-flex min-h-[48px] items-center justify-center px-2 font-sans text-[14px] font-medium text-white/90 underline underline-offset-4 decoration-white/30 hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  (949) 534-0457
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-14 md:pt-16">
            <p className="font-sans text-eyebrow mb-6 text-center text-white/55">Common questions</p>
            <div className="mx-auto max-w-2xl">
              <CampFAQAccordion />
            </div>
          </div>

          <div className="border-t border-white/10 pt-14 text-center md:pt-18">
            <h2 className="font-headline text-display-sm md:text-[clamp(1.75rem,3vw,2.25rem)] mb-4 text-brand-sandstone">
              Ready to choose a week?
            </h2>
            <p className="mx-auto mb-10 max-w-md font-sans text-[16px] text-white/85">
              Register from the sessions above, or reach out if you are deciding between programs.
            </p>
            <Link
              href="#camps"
              className="inline-flex min-h-[48px] items-center justify-center bg-white px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-brand-deep-water transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
            >
              Back to sessions
            </Link>
          </div>
        </div>
      </DarkSection>

      <LuxuryYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="camp"
        data={selectedCamp}
        season={selectedCamp?.season || 'summer'}
      />

      <StickyCTA text="Browse sessions" href="#camps" showAfterScroll={500} />
    </>
  )
}
