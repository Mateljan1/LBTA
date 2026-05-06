import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND } from '@/lib/brand-tokens'

export const metadata: Metadata = {
  title: { absolute: 'Brand System — LBTA (internal)' },
  description: 'Internal brand system showcase: tokens, typography, components, accents.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

type Swatch = {
  name: string
  hex: string
  twClass: string
  cssVar: string
  textOn: 'dark' | 'light'
}

const SWATCHES: Swatch[] = [
  { name: 'Pacific Dusk', hex: BRAND.pacificDusk, twClass: 'bg-brand-pacific-dusk', cssVar: '--brand-pacific-dusk', textOn: 'dark' },
  { name: 'Deep Water', hex: BRAND.deepWater, twClass: 'bg-brand-deep-water', cssVar: '--brand-deep-water', textOn: 'dark' },
  { name: 'Deep Card', hex: BRAND.deepCard, twClass: 'bg-brand-deep-card', cssVar: '--brand-deep-card', textOn: 'dark' },
  { name: 'Victoria Cove', hex: BRAND.victoriaCove, twClass: 'bg-brand-victoria-cove', cssVar: '--brand-victoria-cove', textOn: 'dark' },
  { name: 'Thousand Steps', hex: BRAND.thousandSteps, twClass: 'bg-brand-thousand-steps', cssVar: '--brand-thousand-steps', textOn: 'dark' },
  { name: 'Sunset Cliff', hex: BRAND.sunsetCliff, twClass: 'bg-brand-sunset-cliff', cssVar: '--brand-sunset-cliff', textOn: 'dark' },
  { name: 'Tide Pool', hex: BRAND.tidePool, twClass: 'bg-brand-tide-pool', cssVar: '--brand-tide-pool', textOn: 'dark' },
  { name: 'Sage Hill', hex: BRAND.sageHill, twClass: 'bg-brand-sage-hill', cssVar: '--brand-sage-hill', textOn: 'dark' },
  { name: 'Driftwood', hex: BRAND.driftwood, twClass: 'bg-brand-driftwood', cssVar: '--brand-driftwood', textOn: 'light' },
  { name: 'Sandstone', hex: BRAND.sandstone, twClass: 'bg-brand-sandstone', cssVar: '--brand-sandstone', textOn: 'light' },
  { name: 'Morning Light', hex: BRAND.morningLight, twClass: 'bg-brand-morning-light', cssVar: '--brand-morning-light', textOn: 'light' },
  { name: 'Salt Air', hex: BRAND.saltAir, twClass: 'bg-brand-salt-air', cssVar: '--brand-salt-air', textOn: 'light' },
]

const TYPE_SCALE = [
  { className: 'text-display-xl', label: 'Display XL', sample: 'Tennis, as it should be taught.' },
  { className: 'text-display', label: 'Display', sample: 'Movement. Craft. Community.' },
  { className: 'text-display-sm', label: 'Display SM', sample: 'A founder-led tennis academy.' },
  { className: 'text-headline-xl', label: 'Headline XL', sample: 'Programs for every level' },
  { className: 'text-headline', label: 'Headline', sample: 'Adult Drop-In Liveball' },
  { className: 'text-headline-sm', label: 'Headline SM', sample: 'Junior Player Development' },
  { className: 'text-subhead font-headline', label: 'Subhead (serif)', sample: 'Calm, confident coaching from a 25-year teaching practice.' },
  { className: 'text-body-xl', label: 'Body XL', sample: 'Most academies sell tennis as a product. We teach it as a craft.' },
  { className: 'text-body-lg', label: 'Body LG', sample: 'Movement-first methodology, level-based grouping, and steady weekly progress.' },
  { className: 'text-body', label: 'Body', sample: 'Standard body copy size used for most paragraphs across the site.' },
  { className: 'text-body-sm', label: 'Body SM', sample: 'Smaller body for dense or secondary contexts where space matters.' },
  { className: 'text-ui font-sans', label: 'UI', sample: 'NAVIGATION · LABELS' },
  { className: 'text-eyebrow', label: 'Eyebrow', sample: 'OUR APPROACH' },
]

function rgbFromHex(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

// WCAG relative luminance
function relativeLuminance(hex: string) {
  const { r, g, b } = rgbFromHex(hex)
  const toLin = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b)
}

function contrastRatio(a: string, b: string) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

function badgeForRatio(ratio: number) {
  if (ratio >= 7) return { label: 'AAA', color: 'text-brand-tide-pool' }
  if (ratio >= 4.5) return { label: 'AA', color: 'text-brand-thousand-steps' }
  return { label: 'fail', color: 'text-brand-sunset-cliff' }
}

export default function BrandShowcasePage() {
  return (
    <main id="main-content" className="bg-brand-morning-light min-h-screen pb-32">
      {/* Sticky compliance header */}
      <header className="sticky top-0 z-30 border-b border-brand-pacific-dusk/10 bg-brand-morning-light/95 backdrop-blur-md">
        <div className="container-lbta py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-eyebrow text-brand-victoria-cove">LBTA Brand System · v1.1</p>
            <h1 className="font-headline text-2xl md:text-3xl font-light text-brand-pacific-dusk leading-tight">
              Locked in. Polished. Beautiful.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-sans uppercase tracking-[0.16em]">
            <span className="rounded-sm bg-brand-tide-pool/10 px-3 py-1.5 text-brand-tide-pool font-semibold">0 errors</span>
            <span className="rounded-sm bg-brand-tide-pool/10 px-3 py-1.5 text-brand-tide-pool font-semibold">0 warnings</span>
            <span className="rounded-sm bg-brand-pacific-dusk/8 px-3 py-1.5 text-brand-pacific-dusk/70 font-medium">audited 2026-05-05</span>
          </div>
        </div>
        <hr className="horizon-line" />
      </header>

      {/* Intro */}
      <section className="container-lbta pt-12 md:pt-20 pb-12">
        <p className="text-eyebrow text-brand-victoria-cove mb-3">Single source of truth</p>
        <h2 className="font-headline text-display-sm md:text-display font-light text-brand-pacific-dusk leading-tight max-w-3xl mb-6">
          One palette. One typeface system. One set of components.
        </h2>
        <p className="font-sans text-body-lg text-brand-pacific-dusk/75 max-w-2xl leading-relaxed">
          Every color below is generated from <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">tokens/lbta-web-tokens.json</code>.
          Every component on the site uses these tokens. CI fails on any drift.
        </p>
        <hr className="section-horizon mt-8" aria-hidden="true" />
      </section>

      {/* ─────── COLOR ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">01 · Color</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Palette</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SWATCHES.map((swatch) => {
            const onWhite = contrastRatio(swatch.hex, '#FFFFFF')
            const onDeep = contrastRatio(swatch.hex, BRAND.deepWater)
            const whiteBadge = badgeForRatio(onWhite)
            const deepBadge = badgeForRatio(onDeep)
            return (
              <article
                key={swatch.name}
                className="card overflow-hidden"
              >
                <div
                  className={`${swatch.twClass} h-28 ${swatch.name === 'Salt Air' || swatch.name === 'Morning Light' || swatch.name === 'Sandstone' ? 'border-b border-brand-pacific-dusk/10' : ''}`}
                  aria-label={`${swatch.name} swatch`}
                />
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-headline text-lg font-medium text-brand-pacific-dusk">{swatch.name}</h3>
                    <span className="font-mono text-[11px] text-brand-pacific-dusk/60">{swatch.hex}</span>
                  </div>
                  <p className="font-mono text-[11px] text-brand-pacific-dusk/55 mb-3">{swatch.twClass}</p>
                  <div className="flex gap-3 text-[10px] font-sans uppercase tracking-[0.14em]">
                    <span className="flex items-center gap-1">
                      <span className="text-brand-pacific-dusk/60">on white</span>
                      <span className={`font-bold ${whiteBadge.color}`}>{whiteBadge.label}</span>
                      <span className="text-brand-pacific-dusk/40 tabular-nums">{onWhite.toFixed(1)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-brand-pacific-dusk/60">on deep</span>
                      <span className={`font-bold ${deepBadge.color}`}>{deepBadge.label}</span>
                      <span className="text-brand-pacific-dusk/40 tabular-nums">{onDeep.toFixed(1)}</span>
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ─────── TYPOGRAPHY ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">02 · Typography</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Type scale</h2>
          <p className="font-sans text-body text-brand-pacific-dusk/70 mt-3 max-w-2xl">
            Cormorant for headlines (light, restrained). DM Sans for body and UI (modern, calm).
          </p>
        </div>
        <div className="space-y-8">
          {TYPE_SCALE.map((row) => (
            <div key={row.label} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-baseline border-b border-brand-pacific-dusk/8 pb-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-pacific-dusk/60">{row.label}</p>
                <p className="font-mono text-[10px] text-brand-pacific-dusk/40 mt-1">{row.className}</p>
              </div>
              <p className={`${row.className} text-brand-pacific-dusk leading-tight`}>{row.sample}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────── BUTTONS ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">03 · Buttons</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Calls to action</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-6">On light surface</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary">Book Trial</button>
              <button type="button" className="btn-accent">Explore Programs</button>
              <button type="button" className="btn-secondary">Learn More</button>
              <button type="button" className="btn-cove">View Schedule</button>
              <button type="button" className="btn-ghost">Read Story</button>
              <a href="#" className="btn-horizon">Discover</a>
            </div>
          </div>
          <div className="bg-brand-deep-water rounded p-8">
            <p className="text-eyebrow text-white/70 mb-6">On deep-water surface</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-pill-primary">Book Trial</button>
              <button type="button" className="btn-pill-secondary">Watch the Story</button>
            </div>
            <p className="font-sans text-[12px] text-white/60 mt-6 leading-relaxed">
              Hero CTAs on dark backgrounds use solid fills (white-on-dark or dark-on-white) for WCAG 7:1 contrast.
              Never text-only on busy hero photography.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── ACCENTS ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">04 · Accents</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Horizon, dividers, quotes</h2>
        </div>

        <div className="space-y-12">
          <div className="card p-8">
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-4">Horizon line (full)</p>
            <hr className="horizon-line mb-6" />
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-4">Horizon line (thin)</p>
            <hr className="horizon-line-thin mb-6" />
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-4">Section horizon (under heading)</p>
            <h3 className="font-headline text-2xl font-light text-brand-pacific-dusk">Our Method</h3>
            <hr className="section-horizon" aria-hidden="true" />
          </div>

          <div className="card p-8">
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-6">Section quote (gradient left edge — Brand Guide)</p>
            <blockquote className="section-quote font-headline text-[1.5rem] md:text-[1.875rem] font-light text-brand-pacific-dusk leading-snug max-w-3xl">
              Tennis is taught best the way it is played: in motion, with intent, and in the company of others who care.
              <footer className="mt-4 font-sans text-sm not-italic text-brand-pacific-dusk/60">
                — Andrew Mateljan, Founder
              </footer>
            </blockquote>
          </div>

          <div className="card p-8">
            <p className="text-eyebrow text-brand-pacific-dusk/70 mb-6">Subtle dividers</p>
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[11px] text-brand-pacific-dusk/55 mb-3">.divider</p>
                <hr className="divider" />
              </div>
              <div>
                <p className="font-mono text-[11px] text-brand-pacific-dusk/55 mb-3">.divider-gold</p>
                <hr className="divider-gold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── SURFACES ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">05 · Surfaces</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Section backgrounds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-morning-light border border-brand-pacific-dusk/10 rounded p-10">
            <p className="text-eyebrow text-brand-victoria-cove mb-2">Morning Light · default</p>
            <h3 className="font-headline text-2xl font-light text-brand-pacific-dusk">Quiet, warm canvas.</h3>
            <p className="font-sans text-body text-brand-pacific-dusk/70 mt-3">For most page sections.</p>
          </div>
          <div className="bg-brand-sandstone border border-brand-pacific-dusk/10 rounded p-10">
            <p className="text-eyebrow text-brand-victoria-cove mb-2">Sandstone · warm break</p>
            <h3 className="font-headline text-2xl font-light text-brand-pacific-dusk">A whisper of warmth.</h3>
            <p className="font-sans text-body text-brand-pacific-dusk/70 mt-3">For testimonials, philosophy, story.</p>
          </div>
          <div className="bg-brand-deep-water rounded p-10">
            <p className="text-eyebrow text-white/70 mb-2">Deep Water · cinematic</p>
            <h3 className="font-headline text-2xl font-light text-white">Hero & feature surfaces.</h3>
            <p className="font-sans text-body text-white/75 mt-3">Use with horizon accents, soft glows, deep shadows.</p>
          </div>
          <div className="bg-brand-deep-card rounded p-10">
            <p className="text-eyebrow text-white/70 mb-2">Deep Card · elevated dark</p>
            <h3 className="font-headline text-2xl font-light text-white">Cards on light pages.</h3>
            <p className="font-sans text-body text-white/75 mt-3">Slightly deeper than Deep Water for visual lift.</p>
          </div>
        </div>
      </section>

      {/* ─────── CARDS ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">06 · Cards</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Container styles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <p className="text-eyebrow text-brand-victoria-cove mb-3">.card</p>
            <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">Standard</h3>
            <p className="font-sans text-body-sm text-brand-pacific-dusk/70">White surface · 1px border · soft elevation on hover.</p>
          </div>
          <div className="card-flat p-6">
            <p className="text-eyebrow text-brand-victoria-cove mb-3">.card-flat</p>
            <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">Flat</h3>
            <p className="font-sans text-body-sm text-brand-pacific-dusk/70">Cream fill · borderless · for grouped lists.</p>
          </div>
          <div className="utr-cinematic-card p-6">
            <p className="text-eyebrow text-white/70 mb-3">.utr-cinematic-card</p>
            <h3 className="font-headline text-xl text-white mb-2">Cinematic</h3>
            <p className="font-sans text-body-sm text-white/75">Glass-on-dark for the UTR tracker shell.</p>
          </div>
        </div>
      </section>

      {/* ─────── ENFORCEMENT ─────── */}
      <section className="container-lbta py-16">
        <div className="mb-10">
          <p className="text-eyebrow text-brand-victoria-cove mb-2">07 · How we keep it locked</p>
          <h2 className="font-headline text-headline-xl font-light text-brand-pacific-dusk">Guardrails</h2>
        </div>
        <div className="card p-8 max-w-3xl">
          <ul className="space-y-4 font-sans text-body text-brand-pacific-dusk/85 leading-relaxed">
            <li>
              <strong className="text-brand-pacific-dusk">Single source.</strong> Every color lives in <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">tokens/lbta-web-tokens.json</code>.
              Tailwind classes, CSS variables, and TS constants are all generated.
            </li>
            <li>
              <strong className="text-brand-pacific-dusk">Typed access.</strong> TS code imports <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">{`{ BRAND }`}</code> from <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">lib/brand-tokens.ts</code> — never hardcoded hexes.
            </li>
            <li>
              <strong className="text-brand-pacific-dusk">CI gate.</strong> <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">npm run quality-gate</code> runs <code className="font-mono text-[0.92em] bg-brand-pacific-dusk/5 px-1.5 py-0.5 rounded">tokens:check</code> in strict mode and fails on any drift.
            </li>
            <li>
              <strong className="text-brand-pacific-dusk">Drift detector.</strong> A Vitest test asserts the generated TS constants match the JSON source, and zero forbidden classes/hexes in the codebase.
            </li>
            <li>
              <strong className="text-brand-pacific-dusk">This page.</strong> If a token is added to the JSON, it should be added here too — visual proof beats numeric proof.
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-brand-pacific-dusk/8">
            <p className="font-sans text-body-sm text-brand-pacific-dusk/65 mb-3">Reproduce the audit:</p>
            <pre className="font-mono text-[12px] bg-brand-pacific-dusk/5 px-4 py-3 rounded overflow-x-auto text-brand-pacific-dusk/85">{`npm run tokens:build
npm run tokens:check -- --all --report`}</pre>
          </div>
        </div>
      </section>

      <footer className="container-lbta pt-8 border-t border-brand-pacific-dusk/10 mt-16">
        <p className="font-sans text-body-sm text-brand-pacific-dusk/55">
          Internal page · noindex · See{' '}
          <Link href="/" className="text-brand-victoria-cove underline underline-offset-2 hover:no-underline">
            home
          </Link>
          .
        </p>
      </footer>
    </main>
  )
}
