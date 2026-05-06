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
  const compactImagePositionBySlug: Record<string, string> = {
    'peter-defrantz': '50% 16%',
    'andrew-mateljan': '50% 20%',
    'allison-cronk': '50% 16%',
  }
  const compactImagePosition = (coach.slug && compactImagePositionBySlug[coach.slug]) || coach.imagePosition || '50% 24%'
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
        <p className="font-sans text-eyebrow font-semibold text-brand-pacific-dusk/60 uppercase mb-1.5">
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
      <div className="relative flex h-full w-full max-w-[332px] flex-col overflow-hidden rounded-xl border border-black/[0.08] border-l-[2px] border-l-brand-victoria-cove/42 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_7px_20px_rgba(27,58,92,0.045)] transition-[box-shadow] duration-500 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:shadow-[0_2px_9px_rgba(0,0,0,0.045),0_12px_26px_rgba(27,58,92,0.065)]">
        {/* Inset photo well: headshot isn’t glued to the card edge; ring + soft shadow read as editorial frame */}
        <div className="shrink-0 px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3.5 sm:pt-3.5">
          {/* Portrait window with tighter crop keeps cards elegant and less oversized. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[11px] bg-brand-morning-light ring-1 ring-black/[0.07] shadow-[0_1px_8px_rgba(27,58,92,0.06),inset_0_1px_0_rgba(255,255,255,0.45)]">
            <Image
              src={coachImageSrc(coach.image)}
              alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-[0.985]"
              style={{ objectPosition: compactImagePosition }}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 300px"
              quality={95}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-black/[0.05] px-4 py-4 sm:px-5 sm:py-5">
          <div className="shrink-0">
            <p className="mb-1.5 font-sans text-eyebrow-sm font-semibold uppercase leading-tight text-brand-pacific-dusk/55 line-clamp-2">
              {coach.title}
            </p>
            {hasBioLink ? (
              <Link href={`/coaches/${coach.slug}`} className="group/link inline-block rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
                <h3 className="font-headline text-[18px] font-medium tracking-[-0.02em] text-brand-pacific-dusk transition-colors group-hover/link:text-brand-victoria-cove sm:text-[19px]">
                  {coach.name}
                </h3>
              </Link>
            ) : (
              <h3 className="font-headline text-[18px] font-medium tracking-[-0.02em] text-brand-pacific-dusk sm:text-[19px]">
                {coach.name}
              </h3>
            )}
            <p className="mb-3 font-sans text-[11px] leading-relaxed text-brand-pacific-dusk/72 line-clamp-2 sm:text-[12px]">
              {coach.specialization}
            </p>
          </div>

          <p className="min-h-0 flex-1 font-sans text-[13px] leading-[1.5] text-brand-pacific-dusk/82 line-clamp-3 sm:text-[13px]">
            {shortBio}
          </p>

          <div className="mt-auto flex flex-col gap-4 border-t border-black/[0.06] pt-4 sm:pt-5">
            <div className="flex flex-wrap gap-1.5">
              {coach.credentials.map((cred, i) => (
                <span
                  key={`${cred}-${i}`}
                  className="max-w-full rounded-full border border-black/[0.06] bg-brand-morning-light/90 px-2 py-1 font-sans text-[10px] leading-tight tracking-[0.02em] text-brand-pacific-dusk/78"
                >
                  {cred}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {hasBioLink && (
                <Link
                  href={`/coaches/${coach.slug}`}
                  className="inline-flex min-h-[46px] w-full min-w-0 items-center justify-center gap-2 rounded-[2px] border border-brand-victoria-cove/30 bg-white/80 px-4 py-2.5 font-sans text-eyebrow-sm font-semibold uppercase text-brand-victoria-cove transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
                >
                  View full bio
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              )}
              <Link
                href={bookHref}
                className="inline-flex min-h-[46px] w-full min-w-0 items-center justify-center rounded-[2px] bg-black px-4 py-2.5 text-center font-sans text-eyebrow-sm font-semibold uppercase text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
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
      <div className="relative h-full w-full flex flex-col sm:flex-row sm:items-stretch overflow-hidden rounded-2xl border border-black/[0.08] border-l-[3px] border-l-brand-victoria-cove/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_rgba(27,58,92,0.07)] transition-[box-shadow] duration-500 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_24px_56px_rgba(27,58,92,0.09)]">
        {/* Photo column: padded well + framed portrait (matches stacked Meet the Team) */}
        <div className="flex w-full shrink-0 flex-col px-4 pb-4 pt-4 sm:w-[min(100%,348px)] sm:max-w-[348px] sm:flex-none sm:justify-center sm:self-stretch sm:px-5 sm:py-5 sm:pb-5 lg:w-[min(100%,360px)] lg:max-w-[360px]">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-brand-morning-light ring-1 ring-black/[0.08] shadow-[0_2px_14px_rgba(27,58,92,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]">
            <Image
              src={coachImageSrc(coach.image)}
              alt={`${coach.name}, ${coach.title} at Laguna Beach Tennis Academy`}
              fill
              className="object-contain object-top transition-opacity duration-300 group-hover:opacity-[0.98]"
              sizes="(max-width: 639px) 92vw, 320px"
              quality={95}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-black/[0.05] px-5 py-6 sm:border-t-0 sm:border-l sm:border-black/[0.05] sm:px-8 sm:py-7 lg:pr-10">
          <div className="shrink-0">
            <p className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/55 uppercase mb-2 line-clamp-2 leading-tight">
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

          <p className="min-h-0 flex-1 font-sans text-[14px] leading-[1.65] text-brand-pacific-dusk/82 line-clamp-4 sm:text-[15px] sm:line-clamp-[5]">
            {shortBio}
          </p>

          <div className="mt-auto flex flex-col gap-6 border-t border-black/[0.06] pt-6 sm:pt-7">
            <div className="flex flex-wrap gap-2">
              {coach.credentials.map((cred, i) => (
                <span
                  key={`${cred}-${i}`}
                  className="max-w-full rounded-full border border-black/[0.06] bg-brand-morning-light/90 px-3 py-1.5 font-sans text-[10px] leading-tight tracking-[0.02em] text-brand-pacific-dusk/78 sm:text-[11px]"
                >
                  {cred}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {hasBioLink && (
                <Link
                  href={`/coaches/${coach.slug}`}
                  className="inline-flex min-h-[48px] w-full min-w-0 items-center justify-center gap-2 rounded-[2px] border border-brand-victoria-cove/30 bg-white/80 px-4 py-2.5 font-sans text-eyebrow font-semibold uppercase text-brand-victoria-cove transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
                >
                  View full bio
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              )}
              <Link
                href={bookHref}
                className="inline-flex min-h-[48px] w-full min-w-0 items-center justify-center rounded-[2px] bg-black px-4 py-2.5 text-center font-sans text-eyebrow font-semibold uppercase text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
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
          <p className="font-sans text-eyebrow font-semibold text-brand-pacific-dusk/60 uppercase mb-3">
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
