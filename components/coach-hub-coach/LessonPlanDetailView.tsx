import Link from 'next/link'
import type {
  LessonPlan,
  LessonBlock,
  BlockItem,
  BlockTypeMeta,
} from '@/lib/lesson-plan-types'
import { BLOCK_TYPES, PROGRAM_FAMILIES } from '@/lib/lesson-plan-types'

interface Props {
  plan: LessonPlan
  coachSlug: string
}

const ACCENT_LEFT_BORDER: Record<BlockTypeMeta['accent'], string> = {
  'pacific-dusk': 'border-l-brand-pacific-dusk',
  'victoria-cove': 'border-l-brand-victoria-cove',
  'thousand-steps': 'border-l-brand-thousand-steps',
  'tide-pool': 'border-l-brand-tide-pool',
}

const ACCENT_TEXT: Record<BlockTypeMeta['accent'], string> = {
  'pacific-dusk': 'text-brand-pacific-dusk',
  'victoria-cove': 'text-brand-victoria-cove',
  'thousand-steps': 'text-brand-thousand-steps',
  'tide-pool': 'text-brand-tide-pool',
}

export default function LessonPlanDetailView({ plan, coachSlug }: Props) {
  const programMeta = PROGRAM_FAMILIES.find((f) => f.id === plan.program)
  const totalMinutes = plan.blocks.reduce((sum, b) => sum + b.minutes, 0)

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-24">
      <BackLink coachSlug={coachSlug} />
      <Hero
        plan={plan}
        programLabel={programMeta?.label}
        totalMinutes={totalMinutes}
      />
      {plan.theme ? <ThemeCard theme={plan.theme} /> : null}
      <div className="space-y-6">
        {plan.blocks.map((block, i) => (
          <BlockCard key={`${block.type}-${i}`} block={block} index={i} />
        ))}
      </div>
      {plan.homework ? <HomeworkCard homework={plan.homework} /> : null}
      <SourceFooter source={plan.source} />
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

function Hero({
  plan,
  programLabel,
  totalMinutes,
}: {
  plan: LessonPlan
  programLabel?: string
  totalMinutes: number
}) {
  return (
    <header className="pt-2 pb-6 mb-6 border-b border-black/8">
      <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
        {programLabel ?? plan.program}
        {plan.ageBand ? (
          <span className="text-brand-pacific-dusk/50 ml-2 normal-case tracking-normal">
            · {plan.ageBand}
          </span>
        ) : null}
      </p>
      <h1 className="font-headline font-light text-brand-deep-water leading-[1.05] tracking-[-0.02em] text-[clamp(30px,7vw,46px)] mb-3">
        {plan.title}
      </h1>
      <p className="text-base text-brand-pacific-dusk leading-relaxed mb-4 max-w-[640px]">
        {plan.focus}
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-pacific-dusk/80">
        <span>
          <strong className="font-semibold text-brand-deep-water">
            {plan.durationMin}
          </strong>{' '}
          min total
        </span>
        <span>
          <strong className="font-semibold text-brand-deep-water">
            {plan.blocks.length}
          </strong>{' '}
          blocks
        </span>
        {totalMinutes !== plan.durationMin ? (
          <span className="text-brand-pacific-dusk/55">
            ({totalMinutes} min in blocks)
          </span>
        ) : null}
      </div>
    </header>
  )
}

function ThemeCard({ theme }: { theme: string }) {
  return (
    <section className="bg-brand-sandstone rounded-[14px] p-5 mb-6">
      <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mb-2">
        Theme
      </p>
      <p className="font-headline italic text-[20px] leading-snug text-brand-deep-water">
        {theme}
      </p>
    </section>
  )
}

function BlockCard({ block, index }: { block: LessonBlock; index: number }) {
  const meta = BLOCK_TYPES.find((b) => b.id === block.type)
  const accent = meta?.accent ?? 'pacific-dusk'

  return (
    <section
      className={[
        'bg-white rounded-[14px] border border-black/8 border-l-4 overflow-hidden',
        ACCENT_LEFT_BORDER[accent],
      ].join(' ')}
    >
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-black/6">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span
            className={[
              'font-sans text-eyebrow-sm tabular-nums',
              ACCENT_TEXT[accent],
            ].join(' ')}
          >
            Block {index + 1} · {meta?.label ?? block.type}
          </span>
          <span className="font-sans text-[12px] text-brand-pacific-dusk/55 font-medium tabular-nums whitespace-nowrap">
            {block.minutes} min
          </span>
        </div>
        {block.focus ? (
          <h2 className="font-headline font-normal text-[22px] leading-tight text-brand-deep-water tracking-[-0.01em]">
            {block.focus}
          </h2>
        ) : null}
      </div>
      <ul className="divide-y divide-black/6 list-none p-0">
        {block.items.map((item, i) => (
          <ItemRow key={`${item.name}-${i}`} item={item} />
        ))}
      </ul>
    </section>
  )
}

function ItemRow({ item }: { item: BlockItem }) {
  return (
    <li className="px-5 sm:px-6 py-4">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <p className="font-semibold text-[15px] text-brand-deep-water leading-snug">
          {item.name}
        </p>
        {item.min ? (
          <span className="font-sans text-[11px] text-brand-pacific-dusk/55 font-medium tabular-nums whitespace-nowrap">
            {item.min} min
          </span>
        ) : null}
      </div>
      {item.cue ? (
        <p className="font-headline italic text-[16px] leading-snug text-brand-pacific-dusk pl-3 border-l-2 border-brand-thousand-steps/50 my-2">
          {item.cue}
        </p>
      ) : null}
      {item.why ? (
        <p className="text-[13px] text-brand-pacific-dusk/65 font-medium">
          {item.why}
        </p>
      ) : null}
    </li>
  )
}

function HomeworkCard({ homework }: { homework: string }) {
  return (
    <section className="bg-brand-deep-water text-white rounded-[14px] p-5 mt-6">
      <p className="font-sans text-eyebrow-sm text-white/55 mb-2">
        Homework
      </p>
      <p className="text-base text-white/95 leading-snug">{homework}</p>
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
