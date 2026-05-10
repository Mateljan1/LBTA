'use client'

import Image, { ImageProps } from 'next/image'
import { ReactNode } from 'react'

export interface SplitSectionProps {
  /** Image source (required for image side) */
  imageSrc?: string
  imageAlt?: string
  imageSizes?: string
  imageClassName?: string
  imagePriority?: boolean
  /** 'left' | 'right' — which side the image is on */
  imageSide: 'left' | 'right'
  /** Content for the non-image side */
  children: ReactNode
  /** Optional overlay over image (e.g. gradient) */
  imageOverlay?: ReactNode
  /** Section background */
  className?: string
  /** Minimum height on desktop (e.g. min-h-[50vh]) */
  minHeight?: string
}

/**
 * Reusable 50/50 split section: image on one side, content on the other.
 * Stacks on mobile (image first, then content). Use for founder, Why Choose, zigzag blocks.
 * When imageSrc is set, pass a meaningful imageAlt for accessibility.
 */
export default function SplitSection({
  imageSrc,
  imageAlt = '',
  imageSizes = '(max-width: 768px) 100vw, 50vw',
  imageClassName = 'object-cover',
  imagePriority = false,
  imageSide,
  imageOverlay,
  children,
  className = '',
  minHeight = 'min-h-0',
}: SplitSectionProps) {
  const imageBlock =
    imageSrc &&
    (
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden rounded-subtle">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={imageClassName}
          sizes={imageSizes}
          priority={imagePriority}
          quality={80}
          style={{ objectPosition: '50% 50%' }}
        />
        {imageOverlay}
      </div>
    )

  return (
    <section className={className}>
      <div
        className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${minHeight} md:min-h-[400px]`}
        style={{ scrollMarginTop: '6rem' }}
      >
        {imageSide === 'left' && imageBlock}
        <div className="relative z-10">{children}</div>
        {imageSide === 'right' && imageBlock}
      </div>
    </section>
  )
}
