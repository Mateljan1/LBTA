'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface WhyChooseImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc: string
}

/**
 * Renders an image with fallback when the primary src fails (e.g. 404).
 * Used for Why Choose section so missing assets never break the section.
 */
export default function WhyChooseImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: WhyChooseImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (!failed) {
      setFailed(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  )
}
