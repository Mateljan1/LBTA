'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface VideoTestimonial {
  id: string
  name: string
  role: string
  vimeoId: string
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: 'mary',
    name: 'Mary',
    role: 'LBTA Parent',
    vimeoId: '1134930901',
  },
  {
    id: 'junior-testimonial',
    name: 'Junior Player Family',
    role: 'Junior Development',
    vimeoId: '1134930934',
  },
  {
    id: 'testimonial-3',
    name: 'LBTA Family',
    role: 'Multi-Year Members',
    vimeoId: '1134931000',
  },
  {
    id: 'fit4tennis',
    name: 'Fit4Tennis Player',
    role: 'Adult Program',
    vimeoId: '533673494',
  },
]

export default function VideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const totalSlides = videoTestimonials.length

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const nextSlide = () => {
    const next = (currentIndex + 1) % totalSlides
    goToSlide(next)
  }

  const prevSlide = () => {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides
    goToSlide(prev)
  }

  // Auto-advance slides (paused when user interacts)
  const [isPaused, setIsPaused] = useState(false)
  
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 8000) // 8 seconds per slide
    return () => clearInterval(interval)
  }, [currentIndex, isPaused])

  return (
    <section 
      className="bg-black py-16 md:py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/50 mb-4">
            Player Stories
          </p>
          <h2 className="font-serif text-[28px] md:text-[40px] font-light text-white leading-[1.15]">
            Hear from our community
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slides Container */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-lg"
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {videoTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0"
                >
                  {/* Video Embed - Clean, no overlay */}
                  <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://player.vimeo.com/video/${testimonial.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      allowFullScreen
                      title={`${testimonial.name} - ${testimonial.role}`}
                    />
                  </div>
                  
                  {/* Minimal Caption */}
                  <div className="mt-4 text-center">
                    <p className="font-sans text-[14px] font-medium text-white">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-[12px] text-white/50">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {videoTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
