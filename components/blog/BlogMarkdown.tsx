import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="font-headline text-headline-sm text-brand-deep-water mt-12 mb-4 first:mt-0 scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-headline text-xl text-brand-pacific-dusk mt-10 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="font-sans text-body-lg text-brand-pacific-dusk/90 mb-5 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="font-sans text-body-lg text-brand-pacific-dusk/90 list-disc pl-6 mb-6 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="font-sans text-body-lg text-brand-pacific-dusk/90 list-decimal pl-6 mb-6 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-medium text-brand-pacific-dusk">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="section-quote border-l-4 border-brand-victoria-cove/80 pl-5 my-8 italic text-brand-pacific-dusk/85 font-sans text-body-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-brand-pacific-dusk/10" />,
  a: ({ href, children }) => {
    const base =
      'text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/40 hover:decoration-brand-victoria-cove transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm'
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={base}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} className={base} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img: ({ src, alt }) => {
    if (src?.startsWith('/')) {
      return (
        <span className="block my-8">
          <Image
            src={src}
            alt={alt ?? ''}
            width={1200}
            height={675}
            className="w-full h-auto rounded-[2px] border border-black/6"
            sizes="(max-width: 768px) 100vw, min(65ch, 100vw)"
          />
        </span>
      )
    }
    if (!src) return null
    /* External URLs: no width/height in markdown; next/image remotePatterns would be required per host. */
    return (
      // eslint-disable-next-line @next/next/no-img-element -- optional external figures in posts
      <img
        src={src}
        alt={alt ?? ''}
        className="w-full h-auto my-8 rounded-[2px] border border-black/6"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    )
  },
}

export default function BlogMarkdown({ source }: { source: string }) {
  return (
    <div className="max-w-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {source}
      </ReactMarkdown>
    </div>
  )
}
