'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

export interface ZigzagBlock {
  imageSrc: string
  imageAlt: string
  content: ReactNode
  imageSizes?: string
}

export interface ZigzagSectionProps {
  blocks: ZigzagBlock[]
  /** Section background (e.g. bg-brand-sandstone) */
  className?: string
  /** Optional section title rendered above blocks */
  title?: ReactNode
}

/**
 * Alternating image/content blocks (zigzag). Image left then right then left…
 * Stacks on mobile: image then content per block. Use for Camps story blocks.
 */
export default function ZigzagSection({
  blocks,
  className = '',
  title,
}: ZigzagSectionProps) {
  return (
    <section className={className}>
      <div className="container-lbta">
        {title}
        <div className="space-y-16 md:space-y-24">
          {blocks.map((block, i) => {
            const imageOnRight = i % 2 === 1
            return (
              <div
                key={i}
                className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-subtle ${imageOnRight ? 'md:order-2' : 'md:order-1'}`}
                >
                  <Image
                    src={block.imageSrc}
                    alt={block.imageAlt}
                    fill
                    className="object-cover image-zoom"
                    style={{ objectPosition: '50% 50%' }}
                    sizes={block.imageSizes ?? '(max-width: 768px) 100vw, 50vw'}
                    quality={90}
                  />
                </div>
                <div
                  className={`flex flex-col justify-center ${imageOnRight ? 'md:order-1' : 'md:order-2'}`}
                >
                  {block.content}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
