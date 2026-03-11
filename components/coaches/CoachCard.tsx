import Link from 'next/link'
import Image from 'next/image'
import type { Coach } from '@/lib/coaches-data'

interface CoachCardProps {
  coach: Coach
  /** 'featured' = large image + long bio (Robert); 'grid' = standard card */
  variant?: 'featured' | 'grid'
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CoachCard({ coach, variant = 'grid' }: CoachCardProps) {
  const hasBioLink = coach.slug != null
  const cardContent = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden shrink-0">
        <Image
          src={coach.image}
          alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: coach.imagePosition }}
          sizes={variant === 'featured' ? '(max-width: 1024px) 100vw, 40vw' : '(max-width: 768px) 100vw, 50vw'}
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="font-headline text-[16px] text-white italic">
            &ldquo;{coach.quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="p-6 md:p-7 flex flex-col min-h-0 flex-1">
        <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.1em] mb-1.5">
          {coach.title}
        </p>
        <h3 className="font-headline text-[22px] md:text-[24px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.01em] group-hover:text-brand-victoria-cove">
          {coach.name}
        </h3>
        <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-3">
          {coach.specialization}
        </p>
        {coach.availability && (
          <p className="font-sans text-[12px] text-brand-pacific-dusk/50 italic mb-3">
            {coach.availability}
          </p>
        )}
        <p className="font-sans text-[14px] text-brand-pacific-dusk/80 leading-[1.7] mb-4 flex-1">
          {coach.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {coach.credentials.map((cred) => (
            <span
              key={cred}
              className="font-sans text-[10px] text-brand-pacific-dusk/70 px-2.5 py-1 bg-brand-morning-light rounded-full border border-black/5"
            >
              {cred}
            </span>
          ))}
        </div>
        {hasBioLink && (
          <span className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold text-brand-victoria-cove mt-4 uppercase tracking-wider min-h-[48px] py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-victoria-cove focus-within:ring-offset-2 rounded-[2px]">
            View full bio
            <ChevronRight />
          </span>
        )}
      </div>
    </>
  )

  if (variant === 'featured') {
    return (
      <div className="grid lg:grid-cols-[minmax(0,0.38fr)_1fr] gap-8 md:gap-12 items-start bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="relative aspect-[3/4] w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none">
          <Image
            src={coach.image}
            alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
            fill
            className="object-cover"
            style={{ objectPosition: coach.imagePosition }}
            sizes="(max-width: 1024px) 100vw, 360px"
            quality={90}
          />
        </div>
        <div className="p-8 md:p-10 lg:py-12 flex flex-col justify-center min-h-0 text-left">
          <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/60 uppercase tracking-[0.15em] mb-3">
            {coach.title}
          </p>
          {hasBioLink ? (
            <Link href={`/coaches/${coach.slug}`} className="block group rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
              <h3 className="font-headline text-[28px] md:text-[36px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.01em] group-hover:text-brand-victoria-cove transition-colors">
                {coach.name}
              </h3>
            </Link>
          ) : (
            <h3 className="font-headline text-[28px] md:text-[36px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.01em]">
              {coach.name}
            </h3>
          )}
          <p className="font-sans text-[14px] text-brand-pacific-dusk/70 mb-6">
            {coach.specialization}
          </p>
          <p className="font-sans text-[15px] text-brand-pacific-dusk leading-[1.8] mb-6">
            {coach.bio}
          </p>
          <blockquote className="section-quote py-4 pl-6 mb-6">
            <p className="font-headline text-[18px] text-brand-pacific-dusk italic leading-snug">
              &ldquo;{coach.quote}&rdquo;
            </p>
          </blockquote>
          <div className="flex flex-wrap gap-2">
            {coach.credentials.map((cred) => (
            <span
              key={cred}
              className="font-sans text-[11px] text-brand-pacific-dusk/70 px-3 py-1.5 bg-brand-sandstone rounded-full"
            >
                {cred}
              </span>
            ))}
          </div>
          {hasBioLink && (
            <Link
              href={`/coaches/${coach.slug}`}
              className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold text-brand-victoria-cove mt-6 uppercase tracking-wider min-h-[48px] py-2 px-0 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              View full bio
              <ChevronRight />
            </Link>
          )}
        </div>
      </div>
    )
  }

  if (hasBioLink) {
    return (
      <Link href={`/coaches/${coach.slug}`} className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group">
      {cardContent}
    </div>
  )
}
