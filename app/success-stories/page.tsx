'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AnimatedSection from '@/components/AnimatedSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import { Play, Quote, Star, ArrowRight } from 'lucide-react'

const successStories = [
  {
    id: 'karue-sell',
    name: 'Karue Sell',
    title: 'ATP Tour Player',
    achievement: '#858 → #258 ATP Ranking',
    image: '/images/results/karue-training.webp',
    quote: "Andrew's movement-first approach transformed my game. The structured training and accountability pushed me to levels I didn't know I could reach.",
    story: "When Karue first came to LBTA, he was ranked #858 on the ATP tour. Through dedicated training focused on movement efficiency and mental toughness, he climbed to #258 - a 600+ position improvement that opened doors to main draw Grand Slam qualifiers.",
    videoId: 'karue-journey',
    featured: true,
  },
  {
    id: 'college-placements',
    name: 'D1 College Placements',
    title: '20+ Student Athletes',
    achievement: 'Full Scholarships Earned',
    image: '/images/community/community-3.webp',
    quote: "LBTA prepared me not just for college tennis, but for the discipline required to balance athletics and academics at the D1 level.",
    story: "Over the past 5 years, more than 20 LBTA students have earned Division 1 tennis scholarships. Our college prep program focuses on tournament strategy, mental resilience, and the recruiting process.",
    featured: true,
  },
  {
    id: 'adult-transformation',
    name: 'David Richardson',
    title: 'Adult Beginner Program',
    achievement: '4.0 USTA Rating in 18 Months',
    image: '/images/community/community-1.webp',
    quote: "At 45, I thought it was too late to learn tennis properly. Michelle and the team proved me wrong. I went from never holding a racquet to competing in USTA leagues.",
    story: "David joined our Adult Beginner program with zero tennis experience. Through consistent twice-weekly sessions and our progressive curriculum, he developed strong fundamentals and now competes in local USTA 4.0 leagues.",
    featured: false,
  },
  {
    id: 'junior-development',
    name: 'Emma Chen',
    title: 'Junior Development',
    achievement: 'Sectional Champion, Age 12',
    image: '/images/community/community-5.webp',
    quote: "Coach Andrew taught me that tennis is about more than winning - it's about how you handle challenges. That mindset helped me become a champion.",
    story: "Emma started at LBTA in our Orange Ball program at age 7. Through our junior pathway, she developed into a sectional champion, earning rankings that will support her college tennis aspirations.",
    featured: false,
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    program: 'Junior Development Parent',
    rating: 5,
    text: "Andrew's coaching transformed my son's game in just one season. The movement-first approach is unlike anything we've experienced.",
  },
  {
    name: 'Michael T.',
    program: 'High Performance',
    rating: 5,
    text: "The attention to detail and personalized approach at LBTA is exceptional. My daughter's ranking improved dramatically.",
  },
  {
    name: 'Jennifer L.',
    program: 'Adult Intermediate',
    rating: 5,
    text: "Finally found a program that takes adult players seriously. The coaching quality matches what the juniors receive.",
  },
  {
    name: 'Robert K.',
    program: 'Private Lessons',
    rating: 5,
    text: "The one-on-one attention helped me fix technique issues I'd had for 20 years. Worth every penny.",
  },
]

// Schema for success stories
const successStoriesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "LBTA Success Stories",
  "description": "Success stories and testimonials from Laguna Beach Tennis Academy players",
  "itemListElement": successStories.map((story, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": story.name
      },
      "reviewBody": story.quote,
      "itemReviewed": {
        "@type": "SportsOrganization",
        "name": "Laguna Beach Tennis Academy"
      }
    }
  }))
}

export default function SuccessStoriesPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <>
      <Script
        id="success-stories-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(successStoriesSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="pt-20 bg-white">
        <Breadcrumbs items={[{ label: 'Success Stories' }]} />
      </div>

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <p className="font-sans text-[11px] text-lbta-orange uppercase tracking-[2px] mb-4">
                Player Achievements
              </p>
              <h1 className="font-serif text-[40px] md:text-[56px] font-semibold text-black mb-6 leading-[1.1]">
                Success Stories
              </h1>
              <p className="font-sans text-[17px] md:text-[18px] text-black/70 leading-relaxed">
                From ATP tour players to adult beginners, see how LBTA's movement-first approach 
                transforms players at every level.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Results by Numbers */}
      <section className="bg-black py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              <div>
                <p className="font-serif text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  20+
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  D1 Placements
                </p>
              </div>
              <div>
                <p className="font-serif text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  500+
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  Players Trained
                </p>
              </div>
              <div>
                <p className="font-serif text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  5.0
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  Google Rating
                </p>
              </div>
              <div>
                <p className="font-serif text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  25+
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  Years Experience
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16 md:space-y-24">
            {successStories.filter(s => s.featured).map((story, index) => (
              <AnimatedSection key={story.id} delay={index * 100}>
                <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}>
                  {/* Image */}
                  <div className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                    index % 2 === 1 ? 'md:order-2' : ''
                  }`}>
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {story.videoId && (
                      <button
                        onClick={() => setActiveVideo(story.videoId)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 md:h-8 md:w-8 text-lbta-red ml-1" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="mb-4">
                      <span className="inline-block bg-lbta-orange/10 text-lbta-orange font-sans text-[12px] font-semibold uppercase tracking-[1.5px] px-3 py-1 rounded-full">
                        {story.title}
                      </span>
                    </div>
                    <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-black mb-2">
                      {story.name}
                    </h2>
                    <p className="font-sans text-[18px] md:text-[20px] text-lbta-orange font-medium mb-6">
                      {story.achievement}
                    </p>
                    
                    <blockquote className="relative mb-6">
                      <Quote className="absolute -left-2 -top-2 h-8 w-8 text-lbta-orange/20" />
                      <p className="font-serif text-[18px] md:text-[20px] text-black/80 italic leading-relaxed pl-6">
                        "{story.quote}"
                      </p>
                    </blockquote>
                    
                    <p className="font-sans text-[15px] text-black/70 leading-relaxed mb-6">
                      {story.story}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* More Stories Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-black mb-12 text-center">
              More Player Journeys
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.filter(s => !s.featured).map((story, index) => (
              <AnimatedSection key={story.id} delay={index * 100}>
                <div className="bg-[#FAF8F3] rounded-lg overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <span className="inline-block text-lbta-orange font-sans text-[12px] font-medium uppercase tracking-[1.5px] mb-2">
                      {story.title}
                    </span>
                    <h3 className="font-serif text-[24px] font-semibold text-black mb-2">
                      {story.name}
                    </h3>
                    <p className="font-sans text-[15px] text-black/60 mb-4">
                      {story.achievement}
                    </p>
                    <p className="font-serif text-[15px] text-black/80 italic">
                      "{story.quote}"
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <VideoTestimonials />

      {/* Testimonials Wall */}
      <section className="bg-[#F8E6BB] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-black mb-4">
                What Players Say
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-lbta-orange fill-lbta-orange" />
                ))}
              </div>
              <p className="font-sans text-[15px] text-black/70">
                5.0 average from 47 Google reviews
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 50}>
                <div className="bg-white p-6 rounded-lg h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-lbta-orange fill-lbta-orange" />
                    ))}
                  </div>
                  <p className="font-sans text-[14px] text-black/80 leading-relaxed flex-grow mb-4">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-sans text-[14px] font-semibold text-black">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-[12px] text-black/60">
                      {testimonial.program}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-white mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="font-sans text-[16px] md:text-[17px] text-white/80 mb-8">
              Join 500+ players who have transformed their game at LBTA.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[1.5px] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Book Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
