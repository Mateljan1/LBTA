'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

export interface MasonryImageItem {
  src: string
  alt: string
  /** Optional span for CSS grid: default varies by position to create staggered look */
  span?: 'small' | 'medium' | 'large'
  /** Optional focal point for object-fit cover (e.g. wide photos in varied grid cells) */
  objectPosition?: string
}

export interface MasonryGridProps {
  items: MasonryImageItem[]
  /** Optional wrapper class (e.g. section padding) */
  className?: string
  /** Optional header content above the grid */
  header?: ReactNode
  /** Image sizes attribute for next/image */
  sizes?: string
  /** Quality for next/image (default 95) */
  quality?: number
}

/**
 * Staggered/masonry-style grid using CSS Grid with varied row spans.
 * No horizontal scroll on mobile; grid stacks with vertical flow.
 * Use for community (8–12 images) so it feels organic, not uniform 2×3.
 */
export default function MasonryGrid({
  items,
  className = '',
  header,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  quality = 95,
}: MasonryGridProps) {
  return (
    <div className={className}>
      {header}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[minmax(120px,1fr)]"
        style={{
          gridAutoFlow: 'dense',
        }}
        role="list"
      >
        {items.map((item, i) => {
          const appliedSpan = item.span ?? (i === 0 || i === 5 ? 'large' : 'small')
          const gridClass =
            appliedSpan === 'large'
              ? 'col-span-2 row-span-2'
              : appliedSpan === 'medium'
                ? 'col-span-2 row-span-1'
                : 'col-span-1 row-span-1'
          const isLarge = appliedSpan === 'large'
          return (
            <div
              key={`${item.src}-${i}`}
              className={`relative overflow-hidden rounded-subtle min-h-[140px] md:min-h-[180px] ${gridClass}`}
              role="listitem"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover image-zoom"
                style={{ objectPosition: item.objectPosition ?? '50% 36%' }}
                sizes={isLarge ? '(max-width: 640px) 100vw, 50vw' : sizes}
                quality={quality}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
