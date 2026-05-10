'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { events } from '@/lib/analytics'

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

const FEATURED_HOME_COUNT = 3

export type VideoTestimonialsVariant = 'featured' | 'carousel'

type Props = {
  /** Homepage: three-up grid + “More stories”. Success stories: full carousel. */
  variant?: VideoTestimonialsVariant
}

const vimeoSrc = (id: string) =>
  `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`

function VimeoIframe({
  testimonial,
  onLoad,
}: {
  testimonial: VideoTestimonial
  onLoad?: () => void
}) {
  return (
    <iframe
      src={vimeoSrc(testimonial.vimeoId)}
      className="absolute inset-0 w-full h-full"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      allowFullScreen
      title={`${testimonial.name} - ${testimonial.role}`}
      loading="lazy"
      onLoad={onLoad}
    />
  )
}

/** Defers Vimeo network + third-party cookies until the card is near the viewport (Lighthouse / INP). */
function DeferredVimeoIframe({
  testimonial,
  onLoad,
}: {
  testimonial: VideoTestimonial
  onLoad?: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const root = wrapRef.current
    if (!root) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true)
          obs.disconnect()
        }
      },
      { rootMargin: '160px 0px', threshold: 0.01 }
    )
    obs.observe(root)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {load ? (
        <VimeoIframe testimonial={testimonial} onLoad={onLoad} />
      ) : (
        <div
          className="absolute inset-0 bg-black/55"
          aria-hidden
        />
      )}
    </div>
  )
}

function FeaturedHomeTestimonials() {
  const featured = videoTestimonials.slice(0, FEATURED_HOME_COUNT)

  return (
    <section className="bg-black py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/65 mb-4">
            Player Stories
          </p>
          <h2 className="font-headline text-[28px] md:text-[40px] font-light text-white leading-[1.15]">
            Hear from our community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {featured.map((testimonial, index) => (
            <div key={testimonial.id} className="flex flex-col">
              <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
                <DeferredVimeoIframe
                  testimonial={testimonial}
                  onLoad={() => events.videoTestimonialEmbed(testimonial.name, index)}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-sans text-[14px] font-medium text-white">{testimonial.name}</p>
                <p className="font-sans text-[12px] text-white/65">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-14 flex justify-center">
          <Link
            href="/success-stories"
            onClick={() => events.moreStoriesClick()}
            className="inline-flex min-h-[48px] items-center justify-center px-8 py-3 rounded-[2px] border border-white/25 text-white font-sans text-sm font-medium tracking-[2.5px] uppercase transition-all duration-300 hover:border-white/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
          >
            More stories
          </Link>
        </div>
      </div>
    </section>
  )
}

function CarouselTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

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

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 8000)
    return () => clearInterval(interval)
  }, [isPaused, totalSlides])

  return (
    <section
      className="bg-black py-16 md:py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/65 mb-4">
            Player Stories
          </p>
          <h2 className="font-headline text-[28px] md:text-[40px] font-light text-white leading-[1.15]">
            Hear from our community
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={prevSlide}
            className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {videoTestimonials.map((testimonial, slideIndex) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
                    {slideIndex === currentIndex ? (
                      <VimeoIframe
                        testimonial={testimonial}
                        onLoad={() => events.videoTestimonialEmbed(testimonial.name, slideIndex)}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/50" aria-hidden />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-sans text-[14px] font-medium text-white">{testimonial.name}</p>
                    <p className="font-sans text-[12px] text-white/65">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prevSlide}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {videoTestimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function VideoTestimonials({ variant = 'carousel' }: Props) {
  if (variant === 'featured') {
    return <FeaturedHomeTestimonials />
  }
  return <CarouselTestimonials />
}
