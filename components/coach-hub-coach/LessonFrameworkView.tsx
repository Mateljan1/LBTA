import Link from 'next/link'
import type {
  LessonFramework,
  BlockTypeMeta,
} from '@/lib/lesson-plan-types'

interface Props {
  framework: LessonFramework
  coachSlug: string
}

const ACCENT_BG: Record<BlockTypeMeta['accent'], string> = {
  'pacific-dusk': 'bg-brand-pacific-dusk',
  'victoria-cove': 'bg-brand-victoria-cove',
  'thousand-steps': 'bg-brand-thousand-steps',
  'tide-pool': 'bg-brand-tide-pool',
}

export default function LessonFrameworkView({ framework, coachSlug }: Props) {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 pb-24">
      <BackLink coachSlug={coachSlug} />
      <Hero />

      <SchemaBlocks blocks={framework.blocks} />

      <Section title="Block 1 — Movement Warm-up library">
        <p className="text-sm text-brand-pacific-dusk leading-relaxed mb-4">
          <strong className="font-semibold text-brand-deep-water">
            Universal opener:
          </strong>{' '}
          {framework.warmupLibrary.universalOpener}
        </p>
        <div className="space-y-4">
          {framework.warmupLibrary.byAge.map((band) => (
            <div key={band.label} className="bg-brand-sandstone rounded-[10px] p-4">
              <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/65 mb-2">
                {band.label}
              </p>
              <ul className="text-sm text-brand-deep-water space-y-1 list-disc pl-5">
                {band.drills.map((drill) => (
                  <li key={drill}>{drill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Block 2 — Craft Block topics">
        <h3 className="font-headline text-[20px] text-brand-deep-water mb-3 mt-2">
          Stroke fundamentals
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/15">
                <th className="text-left py-2 pl-4 sm:pl-3 font-sans text-eyebrow-sm text-brand-pacific-dusk/65 font-semibold">
                  Stroke
                </th>
                <th className="text-left py-2 pr-4 sm:pr-3 font-sans text-eyebrow-sm text-brand-pacific-dusk/65 font-semibold">
                  Sub-foci
                </th>
              </tr>
            </thead>
            <tbody>
              {framework.craftLibrary.strokeFundamentals.map((s) => (
                <tr key={s.stroke} className="border-b border-black/6">
                  <td className="py-2.5 pl-4 sm:pl-3 font-semibold text-brand-deep-water whitespace-nowrap">
                    {s.stroke}
                  </td>
                  <td className="py-2.5 pr-4 sm:pr-3 text-brand-pacific-dusk/85">
                    {s.subFoci}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-headline text-[20px] text-brand-deep-water mt-7 mb-3">
          {framework.craftLibrary.tactical.title}
        </h3>
        <ul className="text-sm text-brand-pacific-dusk space-y-1.5 list-disc pl-5">
          {framework.craftLibrary.tactical.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="font-headline text-[20px] text-brand-deep-water mt-7 mb-3">
          {framework.craftLibrary.mental.title}
        </h3>
        <ul className="text-sm text-brand-pacific-dusk space-y-1.5 list-disc pl-5">
          {framework.craftLibrary.mental.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Block 3 — Live-ball / game-based formats">
        <ul className="space-y-3 list-none p-0">
          {framework.liveBallFormats.map((f) => (
            <li
              key={f.name}
              className="bg-white rounded-[10px] border border-black/8 p-4"
            >
              <p className="font-semibold text-brand-deep-water mb-1">
                {f.name}
              </p>
              <p className="text-sm text-brand-pacific-dusk/80">
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Block 4 — Review + Homework templates">
        <ul className="space-y-3 list-none p-0">
          {framework.reviewTemplates.map((t) => (
            <li
              key={t.title}
              className="bg-white rounded-[10px] border border-black/8 p-4"
            >
              <p className="font-sans text-eyebrow-sm text-brand-victoria-cove mb-1.5">
                {t.title}
              </p>
              <p className="text-sm text-brand-pacific-dusk/85 italic">
                &ldquo;{t.body}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Variants">
        <ul className="space-y-3 list-none p-0">
          {framework.variants.map((v) => (
            <li
              key={v.variant}
              className="bg-brand-sandstone rounded-[10px] p-4"
            >
              <p className="font-semibold text-brand-deep-water mb-1">
                {v.variant}
              </p>
              <p className="text-sm text-brand-pacific-dusk/85">{v.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <SourceFooter source={framework.source} />
    </div>
  )
}

function BackLink({ coachSlug }: { coachSlug: string }) {
  return (
    <Link
      href={`/coach-hub/${coachSlug}/lesson-plans`}
      className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-brand-victoria-cove hover:text-brand-pacific-dusk mb-6 focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-sm"
    >
      <span aria-hidden="true">←</span> Back to library
    </Link>
  )
}

function Hero() {
  return (
    <header className="pt-2 pb-6 mb-6 border-b border-black/8">
      <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
        Framework reference
      </p>
      <h1 className="font-headline font-light text-brand-deep-water leading-[1.05] tracking-[-0.02em] text-[clamp(28px,6vw,42px)] mb-3">
        The LBTA 4-block lesson schema.
      </h1>
      <p className="text-base text-brand-pacific-dusk/85 leading-relaxed max-w-[640px]">
        Every LBTA lesson — Academy, Private, Junior Pathway — follows this
        4-block structure. Blocks are non-negotiable; minute splits adjust by
        age and length.
      </p>
    </header>
  )
}

function SchemaBlocks({ blocks }: { blocks: BlockTypeMeta[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-10">
      {blocks.map((block, i) => (
        <article
          key={block.id}
          className="bg-white rounded-[12px] border border-black/8 overflow-hidden"
        >
          <div className={['h-1.5 w-full', ACCENT_BG[block.accent]].join(' ')} />
          <div className="p-4">
            <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mb-1">
              Block {i + 1}
            </p>
            <h3 className="font-headline text-[18px] text-brand-deep-water leading-tight mb-2">
              {block.label}
            </h3>
            <p className="text-[12px] text-brand-pacific-dusk/55 font-medium tabular-nums mb-2">
              {block.defaultMinutes} min default
            </p>
            <p className="text-sm text-brand-pacific-dusk/85 leading-snug">
              {block.purpose}
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="font-headline text-[24px] text-brand-deep-water leading-tight tracking-[-0.01em] mb-5 pb-2 border-b border-black/8">
        {title}
      </h2>
      {children}
    </section>
  )
}

function SourceFooter({ source }: { source?: string }) {
  if (!source) return null
  return (
    <footer className="mt-8 pt-5 border-t border-black/8">
      <p className="font-sans text-[11px] text-brand-pacific-dusk/50 leading-snug">
        Sourced from <span className="font-mono">{source}</span>
      </p>
    </footer>
  )
}
