'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X, Star } from 'lucide-react'

interface VideoTestimonial {
  id: string
  name: string
  role: string
  outcome: string
  quote: string
  thumbnail: string
  vimeoId: string
  rating: number
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: 'mary',
    name: 'Mary',
    role: 'LBTA Parent',
    outcome: 'Transformed confidence on court',
    quote: "The coaching here goes beyond tennis. My child has grown so much in confidence and discipline.",
    thumbnail: '/images/community/community-3.webp',
    vimeoId: '1134930901',
    rating: 5,
  },
  {
    id: 'junior-testimonial',
    name: 'Junior Player Family',
    role: 'Junior Development Program',
    outcome: 'Tournament-ready in one season',
    quote: "The structured approach and supportive environment helped our son compete at a level we never expected.",
    thumbnail: '/images/community/community-5.webp',
    vimeoId: '1134930934',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    name: 'LBTA Family',
    role: 'Multi-Year Members',
    outcome: 'Life-long tennis skills',
    quote: "We've been with LBTA for years. The consistency and quality of coaching is unmatched in Orange County.",
    thumbnail: '/images/community/community-1.webp',
    vimeoId: '1134931000',
    rating: 5,
  },
  {
    id: 'fit4tennis',
    name: 'Fit4Tennis Player',
    role: 'Adult Program',
    outcome: 'Fitness meets technique',
    quote: "The combination of fitness training and tennis instruction has completely transformed my game.",
    thumbnail: '/images/community/community-2.webp',
    vimeoId: '533673494',
    rating: 5,
  },
]

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const openModal = (vimeoId: string) => {
    setActiveVideo(vimeoId)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveVideo(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      <section className="bg-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-white/50 mb-4">
              Real Transformations
            </p>
            <h2 className="font-serif text-[32px] md:text-[48px] font-light text-white leading-[1.1] mb-4">
              Hear From Our Players
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                ))}
              </div>
              <span className="font-sans text-[16px] text-white font-semibold">5.0</span>
              <span className="font-sans text-[14px] text-white/60">from 47 Google reviews</span>
            </div>
          </div>

          {/* Video Grid - 2x2 on desktop, 1 column on mobile */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {videoTestimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="group cursor-pointer"
                onClick={() => openModal(testimonial.vimeoId)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-5 bg-white/5">
                  <Image
                    src={testimonial.thumbnail}
                    alt={testimonial.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Outcome Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-sans text-[12px] font-semibold text-white">{testimonial.outcome}</span>
                    </div>
                  </div>

                  {/* Video indicator */}
                  <div className="absolute top-4 right-4">
                    <span className="font-sans text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1.5">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      Watch Video
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FBBC05] fill-[#FBBC05]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-[15px] md:text-[16px] text-white/80 italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div>
                    <p className="font-sans text-[14px] font-semibold text-white">{testimonial.name}</p>
                    <p className="font-sans text-[12px] text-white/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a 
              href="/success-stories"
              className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-white/70 hover:text-white transition-colors uppercase tracking-[2px]"
            >
              View All Success Stories
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-10 text-white/80 hover:text-white transition-colors p-2"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>
          
          {/* Video Container */}
          <div 
            className="relative w-full max-w-5xl aspect-video mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title="LBTA Testimonial Video"
            />
          </div>
        </div>
      )}
    </>
  )
}
