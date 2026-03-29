import Link from 'next/link'
import Image from 'next/image'
import { coachImageSrc, type Coach } from '@/lib/coaches-data'

interface CoachCardProps {
  coach: Coach
  /** 'featured' = large image + long bio; 'grid' = standard card; 'compact' = team section (small image, truncated bio) */
  variant?: 'featured' | 'grid' | 'compact'
  /** compact only: image-on-top for 2-column Meet the Team grid */
  compactStacked?: boolean
}

/** Truncate bio for compact cards — word boundary, fits ~4 lines with line-clamp-4. */
function truncateBio(bio: string, maxLen = 200): string {
  const match = bio.match(/^[^.!?]*[.!?]/)
  if (match?.[0] && match[0].length <= maxLen + 40) return match[0].trim()
  if (bio.length <= maxLen) return bio
  const at = bio.slice(0, maxLen).lastIndexOf(' ')
  return `${at > 0 ? bio.slice(0, at) : bio.slice(0, maxLen)}…`
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CoachCard({ coach, variant = 'grid', compactStacked = false }: CoachCardProps) {
  const hasBioLink = coach.slug != null
  const firstName = coach.name.split(' ')[0] ?? coach.name
  const bookHref = hasBioLink ? `/book?type=private&coach=${coach.slug}` : '/book'
  const cardContent = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden shrink-0">
        <Image
          src={coachImageSrc(coach.image)}
          alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: coach.imagePosition }}
          sizes={variant === 'featured' ? '(max-width: 1024px) 100vw, 40vw' : '(max-width: 768px) 100vw, 50vw'}
          quality={95}
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
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {hasBioLink && (
            <Link
              href={`/coaches/${coach.slug}`}
              className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold text-brand-victoria-cove uppercase tracking-wider min-h-[48px] py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-[2px]"
            >
              View full bio
              <ChevronRight />
            </Link>
          )}
          <Link
            href={bookHref}
            className="inline-flex items-center justify-center font-sans text-[11px] font-semibold bg-black text-white uppercase tracking-wider min-h-[48px] px-5 py-2 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:bg-gray-800 transition-colors"
          >
            Book with {firstName}
          </Link>
        </div>
      </div>
    </>
  )

  if (variant === 'compact' && compactStacked) {
    const shortBio = truncateBio(coach.bio ?? '', 220)
    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] border-l-[3px] border-l-brand-victoria-cove/45 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_rgba(27,58,92,0.07)] transition-[box-shadow] duration-500 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_24px_56px_rgba(27,58,92,0.09)]">
        {/* Source headshots are 800×1000 (4:5). Full-width frame + object-cover = edge-to-edge, no side letterboxing. */}
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-t-2xl bg-brand-morning-light">
          <Image
            src={coachImageSrc(coach.image)}
            alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
            fill
            className="object-cover transition-transform duration-[450ms] motion-safe:group-hover:scale-[1.01]"
            style={{ objectPosition: coach.imagePosition }}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
            quality={95}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6">
          <div className="shrink-0">
            <p className="mb-2 font-sans text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-brand-pacific-dusk/55 line-clamp-2">
              {coach.title}
            </p>
            {hasBioLink ? (
              <Link href={`/coaches/${coach.slug}`} className="group/link inline-block rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
                <h3 className="font-headline text-[20px] font-medium tracking-[-0.02em] text-brand-pacific-dusk transition-colors group-hover/link:text-brand-victoria-cove sm:text-[22px]">
                  {coach.name}
                </h3>
              </Link>
            ) : (
              <h3 className="font-headline text-[20px] font-medium tracking-[-0.02em] text-brand-pacific-dusk sm:text-[22px]">
                {coach.name}
              </h3>
            )}
            <p className="mb-4 font-sans text-[12px] leading-relaxed text-brand-pacific-dusk/72 line-clamp-2 sm:text-[13px]">
              {coach.specialization}
            </p>
          </div>

          <p className="font-sans text-[14px] leading-[1.6] text-brand-pacific-dusk/82 line-clamp-4 sm:text-[15px]">
            {shortBio}
          </p>

          <div className="mt-auto flex flex-col gap-4 border-t border-black/[0.07] pt-5">
            <div className="flex flex-wrap gap-2">
              {coach.credentials.map((cred, i) => (
                <span
                  key={`${cred}-${i}`}
                  className="max-w-full rounded-full border border-black/[0.06] bg-brand-morning-light/90 px-2.5 py-1 font-sans text-[10px] leading-tight tracking-[0.02em] text-brand-pacific-dusk/78 sm:text-[11px]"
                >
                  {cred}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              {hasBioLink && (
                <Link
                  href={`/coaches/${coach.slug}`}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[2px] border border-brand-victoria-cove/30 bg-white/80 px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-victoria-cove transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[140px]"
                >
                  View full bio
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              )}
              <Link
                href={bookHref}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[2px] bg-black px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[160px]"
              >
                Book with {firstName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    const shortBio = truncateBio(coach.bio ?? '', 280)
    return (
      <div className="relative h-full w-full flex flex-col sm:flex-row sm:items-stretch overflow-hidden rounded-2xl border border-black/[0.07] border-l-[3px] border-l-brand-victoria-cove/45 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_rgba(27,58,92,0.07)] transition-[box-shadow] duration-500 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_24px_56px_rgba(27,58,92,0.09)]">
        {/* 4:5 matches 800×1000 assets; full column width, cover = no wasted side bars */}
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-brand-morning-light sm:w-[320px] sm:max-w-[320px] sm:shrink-0 lg:w-[340px] lg:max-w-[340px]">
          <Image
            src={coachImageSrc(coach.image)}
            alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
            fill
            className="object-cover sm:transition-transform sm:duration-[450ms] motion-safe:sm:group-hover:scale-[1.01]"
            style={{ objectPosition: coach.imagePosition }}
            sizes="(max-width: 639px) 100vw, 340px"
            quality={95}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 px-5 py-6 sm:px-8 sm:py-7 lg:pr-10">
          <div className="shrink-0">
            <p className="font-sans text-[10px] font-semibold text-brand-pacific-dusk/55 uppercase tracking-[0.14em] mb-2 line-clamp-2 leading-tight">
              {coach.title}
            </p>
            {hasBioLink ? (
              <Link href={`/coaches/${coach.slug}`} className="group/link inline-block rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
                <h3 className="font-headline text-[21px] sm:text-[24px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em] group-hover/link:text-brand-victoria-cove transition-colors">
                  {coach.name}
                </h3>
              </Link>
            ) : (
              <h3 className="font-headline text-[21px] sm:text-[24px] font-medium text-brand-pacific-dusk mb-2 tracking-[-0.02em]">
                {coach.name}
              </h3>
            )}
            <p className="font-sans text-[12px] sm:text-[13px] leading-relaxed text-brand-pacific-dusk/72 mb-5 line-clamp-2 sm:line-clamp-none">
              {coach.specialization}
            </p>
          </div>

          <p className="font-sans text-[14px] sm:text-[15px] text-brand-pacific-dusk/82 leading-[1.65] line-clamp-4 sm:line-clamp-[5]">
            {shortBio}
          </p>

          <div className="mt-auto pt-6 border-t border-black/[0.07] flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {coach.credentials.map((cred, i) => (
                <span
                  key={`${cred}-${i}`}
                  className="font-sans text-[10px] sm:text-[11px] text-brand-pacific-dusk/78 tracking-[0.02em] px-3 py-1.5 bg-brand-morning-light/90 rounded-full border border-black/[0.06] leading-tight max-w-full"
                >
                  {cred}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
              {hasBioLink && (
                <Link
                  href={`/coaches/${coach.slug}`}
                  className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 font-sans text-[11px] font-semibold text-brand-victoria-cove uppercase tracking-[0.18em] min-h-[48px] px-6 py-2.5 rounded-[2px] border border-brand-victoria-cove/30 bg-white/80 hover:bg-brand-morning-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 sm:min-w-[148px]"
                >
                  View full bio
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Link>
              )}
              <Link
                href={bookHref}
                className="inline-flex flex-1 sm:flex-initial items-center justify-center font-sans text-[11px] font-semibold bg-black text-white uppercase tracking-[0.18em] min-h-[48px] px-7 py-2.5 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:bg-gray-800 transition-colors sm:min-w-[168px]"
              >
                Book with {firstName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className="grid lg:grid-cols-[minmax(0,0.38fr)_1fr] gap-8 md:gap-12 items-start bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="relative aspect-[3/4] w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none">
          <Image
            src={coachImageSrc(coach.image)}
            alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
            fill
            className="object-cover"
            style={{ objectPosition: coach.imagePosition }}
            sizes="(max-width: 1024px) 100vw, 360px"
            quality={95}
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
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {hasBioLink && (
              <Link
                href={`/coaches/${coach.slug}`}
                className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold text-brand-victoria-cove uppercase tracking-wider min-h-[48px] py-2 px-0 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
              >
                View full bio
                <ChevronRight />
              </Link>
            )}
            <Link
              href={bookHref}
              className="inline-flex items-center justify-center font-sans text-[11px] font-semibold bg-black text-white uppercase tracking-wider min-h-[48px] px-6 py-2 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:bg-gray-800 transition-colors"
            >
              Book with {firstName}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (hasBioLink) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        {cardContent}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group">
      {cardContent}
    </div>
  )
}
