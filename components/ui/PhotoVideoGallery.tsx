'use client'

import { useState, useRef, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Static imports for build-time optimization (images are 13-27MB each)
import courtSetting from '../../public/photos/LBCOURTSETTING.webp'
import videoRoom from '../../public/photos/VideoAnalysisRoom.webp'
import gymSetting from '../../public/photos/GymSetting.webp'
import oncourtTraining from '../../public/photos/OncourtTraining.webp'
import courtSettingWide from '../../public/photos/Court setting.png'

// Gallery items - Premium facility photos
const galleryItems = [
  {
    src: courtSetting,
    alt: 'Championship tennis courts in Laguna Beach',
    caption: 'Championship Courts',
  },
  {
    src: videoRoom,
    alt: 'Video analysis room for player development',
    caption: 'Analytics Lab',
  },
  {
    src: gymSetting,
    alt: 'State-of-the-art training facility',
    caption: 'Performance Center',
  },
  {
    src: oncourtTraining,
    alt: 'On-court training session',
    caption: 'Training in Action',
  },
  {
    src: courtSettingWide,
    alt: 'Laguna Beach tennis facility with ocean views',
    caption: 'The Courts',
  }
]

interface PhotoVideoGalleryProps {
  className?: string
}

export default function PhotoVideoGallery({ className = '' }: PhotoVideoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-advance gallery
  useEffect(() => {
    if (autoplay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryItems.length)
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoplay])

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length)
    setAutoplay(false)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
    setAutoplay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoplay(false)
  }

  const currentItem = galleryItems[currentIndex]

  return (
    <div className={`relative group ${className}`}>
      {/* Main Gallery Display */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-black">
        {/* Image */}
        <Image
          src={currentItem.src}
          alt={currentItem.alt}
          fill
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className="object-cover transition-all duration-1000 ease-out"
          priority={currentIndex === 0}
          placeholder="blur"
        />

        {/* Navigation Controls - Always visible */}
        <button
          onClick={prevItem}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextItem}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Caption */}
        <div className="absolute bottom-6 left-6">
          <div className="bg-white/15 backdrop-blur-md rounded px-4 py-2.5">
            <p className="text-white font-sans text-sm tracking-wide font-light">
              {currentItem.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center gap-2.5 mt-6">
        {galleryItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-lbta-charcoal' 
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
