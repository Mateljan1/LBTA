import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import BlogMarkdown from '@/components/blog/BlogMarkdown'
import { BlogArticleSchema } from '@/app/schema'
import { getAllPostsMeta, getPostBySlug, getPostSlugs } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return { title: 'Article' }
  }
  const canonical = `/blog/${slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      url: `https://lagunabeachtennisacademy.com${canonical}`,
    },
  }
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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const allMeta = await getAllPostsMeta()
  const ix = allMeta.findIndex((p) => p.slug === slug)
  const prev = ix >= 0 ? allMeta[ix + 1] : undefined
  const next = ix > 0 ? allMeta[ix - 1] : undefined

  return (
    <>
      <BlogArticleSchema
        title={post.title}
        description={post.description}
        slug={post.slug}
        datePublished={post.date}
        dateModified={post.updated ?? post.date}
        authorName={post.author}
      />

      <article>
        <header className="relative bg-gradient-to-b from-brand-morning-light to-white pt-32 md:pt-40 pb-12 md:pb-16">
          <div className="container-narrow px-6 md:px-8">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Journal', href: '/blog' },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
            />
            <AnimatedSection>
              <p className="text-eyebrow text-brand-victoria-cove mb-4 tracking-[0.2em]">JOURNAL</p>
              <h1 className="font-headline text-display font-light text-brand-deep-water mb-4 max-w-[22ch] md:max-w-none">
                {post.title}
              </h1>
              <HorizonDivider className="mb-6 max-w-[120px]" />
              <p className="font-sans text-body-xl text-brand-pacific-dusk/80 max-w-prose leading-relaxed mb-6">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-body-sm text-brand-pacific-dusk/60">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>·</span>
                <span>{post.author}</span>
              </div>
            </AnimatedSection>
          </div>
        </header>

        <div className="section-spacing bg-white border-t border-black/5">
          <div className="container-narrow px-6 md:px-8">
            <AnimatedSection>
              <BlogMarkdown source={post.content} />
            </AnimatedSection>

            {(prev || next) && (
              <nav
                className="mt-16 pt-12 border-t border-black/8 flex flex-col sm:flex-row gap-8 sm:justify-between"
                aria-label="Adjacent articles"
              >
                {prev ? (
                  <div>
                    <p className="text-eyebrow-sm text-brand-pacific-dusk/50 mb-2">Previous</p>
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="font-headline text-headline-sm text-brand-deep-water hover:text-brand-victoria-cove transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm inline-block max-w-[280px]"
                    >
                      {prev.title}
                    </Link>
                  </div>
                ) : (
                  <span />
                )}
                {next ? (
                  <div className="sm:text-right">
                    <p className="text-eyebrow-sm text-brand-pacific-dusk/50 mb-2">Next</p>
                    <Link
                      href={`/blog/${next.slug}`}
                      className="font-headline text-headline-sm text-brand-deep-water hover:text-brand-victoria-cove transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm inline-block max-w-[280px] sm:ml-auto"
                    >
                      {next.title}
                    </Link>
                  </div>
                ) : null}
              </nav>
            )}

            <div className="mt-14">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center min-h-[48px] font-sans text-ui-sm font-medium tracking-[0.14em] uppercase bg-black text-white px-8 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                All journal posts
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
