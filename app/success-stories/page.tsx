'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AnimatedSection from '@/components/AnimatedSection'
import VideoTestimonials from '@/components/VideoTestimonials'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import { Play, Quote, Star, ArrowRight } from 'lucide-react'
import siteStats from '@/data/site-stats.json'

const successStories = [
  {
    id: 'karue-sell',
    name: 'Karue Sell',
    title: 'ATP Tour Player',
    achievement: '#858 → #262 ATP Ranking',
    image: '/images/success-stories/karue-sell.webp',
    quote: "Andrew's movement-first approach transformed my game. The structured training and accountability pushed me to levels I didn't know I could reach.",
    story:
      'Karue trained at LBTA with Coach Andrew while rebuilding his professional game. From a ranking in the #800s on the ATP tour, he climbed to a career high of #262 — a jump that reflects sustained work on movement efficiency, patterns, and mental toughness under pressure.',
    videoId: 'karue-journey',
    featured: true,
  },
  {
    id: 'ryan-seggerman',
    name: 'Ryan Seggerman',
    title: 'ATP Tour Player',
    achievement: 'Career-high ATP singles #72',
    image: '/images/success-stories/ryan-seggerman.webp',
    quote:
      "When I'm home, LBTA is where I sharpen movement patterns before heading back on the road. The work here matches how I prepare on tour.",
    story:
      'Ryan Seggerman has trained at LBTA with Coach Andrew as part of his professional preparation. His career includes a career-high ATP singles ranking of #72, doubles success on tour, and Masters-level experience.',
    featured: true,
  },
  {
    id: 'henry-mateljan',
    name: 'Henry Mateljan',
    title: 'Junior Competitor',
    achievement: 'Age 9 · 4.6 UTR · Little Mo',
    image: '/images/success-stories/henry-mateljan-little-mo.webp',
    quote:
      'Little Mo was a special week—sharing that with Coach Andrew is something I will always remember.',
    story:
      'Henry is nine years old with a 4.6 UTR. He trains at LBTA with Coach Andrew and was recognized at the Little Mo tournament, supported by the Maureen Connolly Brinker Tennis Foundation—an important milestone in his junior competitive journey.',
    featured: true,
  },
  {
    id: 'olov',
    name: 'Olov',
    title: 'USTA National Competition',
    achievement: '4.0 → 5.0 · National events',
    image: '/images/success-stories/olov-usta.webp',
    quote:
      'The step up to 5.0 came from training that matches how I compete—structure in practice, clarity in matches.',
    story:
      'Olov moved from a 4.0 to a 5.0 USTA competitor with strong results in 5.0 tournaments. He continues to represent his age division at national-level events.',
    featured: true,
  },
]

/** Per-story focal points for `object-cover` cards (tune without changing assets). */
const successStoryImagePosition: Record<string, string> = {
  'karue-sell': '52% 42%',
  'ryan-seggerman': '50% 40%',
  'henry-mateljan': '50% 28%',
  olov: '50% 45%',
}

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
      <section className="relative min-h-[55vh] flex items-center justify-center py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/results/karue-sell-andrew-mateljan-coaching.webp"
            alt="On-court coaching at Laguna Beach Tennis Academy"
            fill
            className="object-cover object-center max-md:brightness-[0.88]"
            style={{ objectPosition: '50% 45%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 hero-scrim-branded" aria-hidden="true" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto text-white">
              <p className="font-sans text-[11px] text-white uppercase tracking-[2px] mb-4 text-shadow-hero-readable">
                Player Achievements
              </p>
              <h1 className="font-headline text-[40px] md:text-[56px] font-semibold text-brand-sandstone mb-6 leading-[1.1] text-shadow-hero-readable">
                Success Stories
              </h1>
              <p className="font-sans text-[17px] md:text-[18px] text-white leading-relaxed text-shadow-hero-readable max-md:text-white/95 md:text-white/90">
                From ATP tour players to juniors on the national stage — movement-first coaching with
                clear structure and accountability.
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
                <p className="font-headline text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  20+
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  D1 Placements
                </p>
              </div>
              <div>
                <p className="font-headline text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  {siteStats.trustStats.playersCount}
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  Players Trained
                </p>
              </div>
              <div>
                <p className="font-headline text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  {siteStats.trustStats.rating}
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-white/60 uppercase tracking-[1.5px]">
                  Google Rating
                </p>
              </div>
              <div>
                <p className="font-headline text-[48px] md:text-[64px] font-bold text-white leading-none mb-2">
                  {siteStats.trustStats.yearsExperience}
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
      <section className="bg-brand-morning-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16 md:space-y-24">
            {successStories.filter(s => s.featured).map((story, index) => (
              <AnimatedSection key={story.id} delay={index * 100}>
                <div
                  id={story.id}
                  className={`scroll-mt-24 md:scroll-mt-32 grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                    index % 2 === 1 ? 'md:order-2' : ''
                  }`}>
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: successStoryImagePosition[story.id] ?? '50% 45%' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {story.videoId && (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(story.videoId)}
                        aria-label={`Play video about ${story.name}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 md:h-8 md:w-8 text-brand-sunset-cliff ml-1" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="mb-4">
                      <span className="inline-block bg-brand-sunset-cliff/10 text-brand-sunset-cliff font-sans text-[12px] font-semibold uppercase tracking-[1.5px] px-3 py-1 rounded-full">
                        {story.title}
                      </span>
                    </div>
                    <h2 className="font-headline text-[32px] md:text-[40px] font-semibold text-black mb-2">
                      {story.name}
                    </h2>
                    <p className="font-sans text-[18px] md:text-[20px] text-brand-sunset-cliff font-medium mb-6">
                      {story.achievement}
                    </p>
                    
                    <blockquote className="relative mb-6">
                      <Quote className="absolute -left-2 -top-2 h-8 w-8 text-brand-sunset-cliff/20" />
                      <p className="font-headline text-[18px] md:text-[20px] text-black/80 italic leading-relaxed pl-6">
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

      {successStories.some((s) => !s.featured) && (
        <>
          <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection>
                <h2 className="font-headline text-[32px] md:text-[40px] font-semibold text-black mb-12 text-center">
                  More Player Journeys
                </h2>
              </AnimatedSection>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {successStories
                  .filter((s) => !s.featured)
                  .map((story, index) => (
                    <AnimatedSection
                      key={story.id}
                      delay={index * 100}
                      className={index === 0 ? 'md:col-span-2' : 'md:col-span-1'}
                    >
                      <div className="bg-brand-morning-light rounded-lg overflow-hidden h-full flex flex-col">
                        <div
                          className={`relative overflow-hidden flex-shrink-0 ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                        >
                          <Image
                            src={story.image}
                            alt={story.name}
                            fill
                            className="object-cover"
                            style={{ objectPosition: successStoryImagePosition[story.id] ?? '50% 45%' }}
                            sizes={
                              index === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'
                            }
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <span className="inline-block text-brand-sunset-cliff font-sans text-[12px] font-medium uppercase tracking-[1.5px] mb-2">
                            {story.title}
                          </span>
                          <h3 className="font-headline text-[24px] font-semibold text-black mb-2">
                            {story.name}
                          </h3>
                          <p className="font-sans text-[15px] text-black/60 mb-4">{story.achievement}</p>
                          <p className="font-headline text-[15px] text-black/80 italic">"{story.quote}"</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
              </div>
            </div>
          </section>
        </>
      )}

      <HorizonDivider />

      {/* Video Testimonials */}
      <VideoTestimonials />

      <HorizonDivider />

      {/* Testimonials Wall */}
      <section className="bg-lbta-beige py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-headline text-[32px] md:text-[40px] font-semibold text-black mb-4">
                What Players Say
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-brand-sunset-cliff fill-brand-sunset-cliff" />
                ))}
              </div>
              <p className="font-sans text-[15px] text-black/70">
                {siteStats.trustStats.rating} average from {siteStats.trustStats.reviewCount} Google reviews
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 50}>
                <div className="bg-white p-6 rounded-lg h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-brand-sunset-cliff fill-brand-sunset-cliff" />
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

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-headline text-[32px] md:text-[48px] font-medium text-white leading-[1.15] mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-8">
            Join {siteStats.trustStats.playersCount} players who have transformed their game at LBTA.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            Book Your Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </DarkSection>
    </>
  )
}
