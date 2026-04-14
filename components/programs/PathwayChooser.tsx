'use client'

import { motion, useReducedMotion } from 'framer-motion'

const paths = [
  {
    id: 'junior-pathway',
    label: 'Junior Programs',
    ages: 'Ages 3–17',
    description: 'Little Tennis Stars through High Performance — a clear path from play to competition.',
    accent: 'border-brand-victoria-cove/30 hover:border-brand-victoria-cove',
    accentBg: 'group-hover:bg-brand-victoria-cove/[0.03]',
    dot: 'bg-brand-victoria-cove',
  },
  {
    id: 'adult-pathway',
    label: 'Adult Programs',
    ages: 'Beginner – Advanced',
    description: 'New to Tennis through USTA League — real instruction at every level.',
    accent: 'border-brand-sunset-cliff/30 hover:border-brand-sunset-cliff',
    accentBg: 'group-hover:bg-brand-sunset-cliff/[0.03]',
    dot: 'bg-brand-sunset-cliff',
  },
]

export default function PathwayChooser() {
  const reduceMotion = useReducedMotion()

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className="container-lbta py-12 md:py-16 bg-brand-morning-light">
      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-[13px] font-medium tracking-[2.5px] uppercase text-brand-pacific-dusk/40 text-center mb-6">
          I&rsquo;m looking for
        </p>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {paths.map((path, i) => {
            const Wrapper = reduceMotion ? 'button' : motion.button
            const props = reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-20px' },
                  transition: {
                    duration: 0.45,
                    delay: i * 0.1,
                    ease: [0.22, 0.61, 0.36, 1] as const,
                  },
                }

            return (
              <Wrapper
                key={path.id}
                type="button"
                onClick={() => scrollTo(path.id)}
                className={`group text-left w-full border-2 rounded-[2px] p-6 md:p-8 transition-all duration-300 cursor-pointer ${path.accent} ${path.accentBg} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2`}
                {...props}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${path.dot}`} aria-hidden="true" />
                  <span className="font-sans text-[12px] font-medium tracking-[2px] uppercase text-brand-pacific-dusk/50">
                    {path.ages}
                  </span>
                </div>
                <h3 className="font-headline text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk mb-2 leading-[1.2]">
                  {path.label}
                </h3>
                <p className="font-sans text-[14px] text-brand-pacific-dusk/55 leading-relaxed">
                  {path.description}
                </p>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
