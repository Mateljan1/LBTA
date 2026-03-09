'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ProgramsOverviewCard } from '@/lib/programs-data'

interface ProgramOverviewCardProps {
  program: ProgramsOverviewCard
  index: number
  featured?: boolean
}

export default function ProgramOverviewCard({ program, index, featured = false }: ProgramOverviewCardProps) {
  const reduceMotion = useReducedMotion()
  const delay = index * 0.08
  const Wrapper = reduceMotion ? 'div' : motion.div
  const wrapperProps = reduceMotion
    ? { className: featured ? 'md:col-span-2' : '' }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] },
        className: featured ? 'md:col-span-2' : '',
      }

  return (
    <Wrapper {...wrapperProps}>
      <Link
        href={program.href}
        className="group block h-full overflow-hidden rounded-[2px] bg-white border border-brand-pacific-dusk/5 transition-all duration-300 hover:border-brand-pacific-dusk/15 hover:shadow-[0_8px_32px_rgba(27,58,92,0.08)] focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove/40 focus:ring-offset-2"
      >
        <div className={`flex flex-col ${featured ? 'md:flex-row' : ''}`}>
          {/* Image */}
          {program.image && (
            <div className={`relative shrink-0 overflow-hidden ${featured ? 'md:w-[45%] aspect-[4/3] md:aspect-auto' : 'aspect-[16/10]'} bg-brand-sandstone`}>
              <Image
                src={program.image}
                alt={`${program.title} at Laguna Beach Tennis Academy`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes={featured ? '(max-width: 767px) 100vw, 45vw' : '(max-width: 1023px) 50vw, 33vw'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
            </div>
          )}
          {/* Content */}
          <div className={`flex flex-col justify-center p-6 md:p-8 ${featured ? 'md:min-h-[240px]' : 'min-h-[200px]'}`}>
            <span className="text-eyebrow text-brand-victoria-cove mb-2 block">
              {program.eyebrow}
            </span>
            <h2 className="font-headline text-[22px] md:text-[28px] font-medium text-brand-pacific-dusk mb-2 group-hover:text-brand-deep-water transition-colors">
              {program.title}
            </h2>
            <p className="font-sans text-body-sm text-brand-pacific-dusk/75 leading-relaxed line-clamp-2 mb-4">
              {program.description}
            </p>
            <div className="mt-auto flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {'fromPrice' in program && program.fromPrice != null && (
                <span className="font-sans text-sm text-brand-pacific-dusk/70">
                  From ${program.fromPrice}/session
                </span>
              )}
              <span className="font-sans text-sm font-medium text-brand-sunset-cliff tracking-wide group-hover:underline">
                Learn more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Wrapper>
  )
}
