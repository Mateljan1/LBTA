import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import { BreadcrumbListSchema } from '@/app/schema'
import { getAllPostsMeta } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Tennis insights and behind-the-scenes notes from Andrew Mateljan and the LBTA coaching team. Movement, craft, community, and the work it takes.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Journal | Laguna Beach Tennis Academy',
    description: 'Tennis insights and behind-the-scenes notes from Andrew Mateljan and the LBTA coaching team.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy Journal' }],
  },
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Los_Angeles',
    }).format(new Date(iso + 'T12:00:00'))
  } catch {
    return iso
  }
}

export default async function BlogIndexPage() {
  const posts = await getAllPostsMeta()

  return (
    <>
      <BreadcrumbListSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Journal' },
      ]} />
      <section className="relative bg-gradient-to-b from-brand-morning-light to-white pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-narrow px-6 md:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Journal', href: '/blog' },
            ]}
          />
          <AnimatedSection>
            <p className="text-eyebrow text-brand-victoria-cove mb-4 tracking-[0.2em]">FROM THE ACADEMY</p>
            <h1 className="font-headline text-display font-light text-brand-deep-water mb-4">Journal</h1>
            <HorizonDivider className="mb-6 max-w-[120px]" />
            <p className="font-sans text-body-xl text-brand-pacific-dusk/80 max-w-prose leading-relaxed">
              Practical notes on camps, training structure, ratings, and how we think about the game — written for
              families and players deciding what comes next.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-spacing bg-white border-t border-black/5">
        <div className="container-narrow px-6 md:px-8">
          {posts.length === 0 ? (
            <p className="font-sans text-body-lg text-brand-pacific-dusk/70">New posts are coming soon.</p>
          ) : (
            <ul className="space-y-0 divide-y divide-black/8">
              {posts.map((post) => (
                <li key={post.slug} className="py-10 first:pt-0">
                  <AnimatedSection>
                    <article>
                      <time
                        dateTime={post.date}
                        className="text-eyebrow-sm text-brand-pacific-dusk/55 block mb-3"
                      >
                        {formatDate(post.date)}
                      </time>
                      <h2 className="font-headline text-headline-sm text-brand-deep-water mb-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-brand-victoria-cove transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="font-sans text-body-lg text-brand-pacific-dusk/75 max-w-prose mb-5 leading-relaxed">
                        {post.description}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center justify-center min-h-[48px] font-sans text-ui-sm font-medium tracking-[0.14em] uppercase text-brand-victoria-cove border border-brand-victoria-cove/35 px-6 rounded-[2px] transition-all duration-300 hover:border-brand-victoria-cove hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
                      >
                        Read article
                      </Link>
                    </article>
                  </AnimatedSection>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
