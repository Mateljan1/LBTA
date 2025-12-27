'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface BlurImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  blurDataURL?: string
}

// Simple blur placeholder for lazy-loaded images
export default function BlurImage({ 
  className = '', 
  alt,
  blurDataURL,
  ...props 
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Default blur placeholder - a subtle gray gradient
  const defaultBlur = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+'
  
  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Actual image */}
      <Image
        {...props}
        alt={alt}
        className={`
          ${className}
          transition-opacity duration-500 ease-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={() => setIsLoaded(true)}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || defaultBlur}
      />
    </div>
  )
}

// Shimmer effect for loading states
export function ImageShimmer({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${className}`}
    >
      <div 
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}

