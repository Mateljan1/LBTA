'use client'

import Link from 'next/link'
import Image from 'next/image'
import { events } from '@/lib/analytics'

export type HomeProgramCardProgram = {
  title: string
  link: string
  image: string
  imageAlt: string
  objectPosition?: string
  description: string
}

type Props = {
  program: HomeProgramCardProgram
  section: 'coaching' | 'play'
  imageSizes: string
}

export default function HomeProgramCardLink({ program, section, imageSizes }: Props) {
  return (
    <Link
      href={program.link}
      onClick={() => events.programCardClick(program.title, program.link, section)}
      className="group flex h-full flex-col overflow-hidden rounded-subtle border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.02)] transition-all duration-500 hover:border-black/10 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03)]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <Image
          src={program.image}
          alt={program.imageAlt}
          fill
          className="object-cover image-zoom"
          style={{ objectPosition: program.objectPosition ?? '50% 40%' }}
          sizes={imageSizes}
          quality={95}
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <h4 className="font-headline text-headline-sm font-light mb-2 group-hover:text-brand-pacific-dusk/70 transition-colors duration-300">
          {program.title}
        </h4>
        <p className="text-body text-lbta-slate flex-1">{program.description}</p>
      </div>
    </Link>
  )
}
