import Link from 'next/link'
import type { LessonPlan, ProgramFamilyMeta } from '@/lib/lesson-plan-types'
import { PROGRAM_FAMILIES } from '@/lib/lesson-plan-types'

interface Props {
  plan: LessonPlan
  coachSlug: string
}

const ACCENT_BORDER: Record<ProgramFamilyMeta['accent'], string> = {
  'pacific-dusk': 'border-l-brand-pacific-dusk',
  'victoria-cove': 'border-l-brand-victoria-cove',
  'thousand-steps': 'border-l-brand-thousand-steps',
  'tide-pool': 'border-l-brand-tide-pool',
  'sunset-cliff': 'border-l-brand-sunset-cliff',
}

export default function LessonPlanCard({ plan, coachSlug }: Props) {
  const meta = PROGRAM_FAMILIES.find((f) => f.id === plan.program)
  const accentClass = meta ? ACCENT_BORDER[meta.accent] : 'border-l-black/20'

  return (
    <Link
      href={`/coach-hub/${coachSlug}/lesson-plans/${plan.id}`}
      className={[
        'group block bg-white rounded-[14px] border border-black/8 border-l-4',
        accentClass,
        'p-5 shadow-[0_1px_0_rgba(27,58,92,0.04)]',
        'transition-all duration-200',
        'hover:border-black/15 hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(27,58,92,0.04),0_8px_24px_-8px_rgba(27,58,92,0.10)]',
        'focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="font-sans text-eyebrow-sm text-brand-victoria-cove">
          {meta?.label ?? plan.program}
          {plan.ageBand ? (
            <span className="text-brand-pacific-dusk/50 ml-1.5 normal-case tracking-normal">
              · {plan.ageBand}
            </span>
          ) : null}
        </span>
        <span className="font-sans text-[11px] text-brand-pacific-dusk/55 font-medium tabular-nums whitespace-nowrap">
          {plan.durationMin} min
        </span>
      </div>
      <h3 className="font-headline font-normal text-[20px] leading-tight text-brand-deep-water tracking-[-0.01em] mb-2 group-hover:text-brand-pacific-dusk transition-colors">
        {plan.title}
      </h3>
      <p className="text-sm text-brand-pacific-dusk/75 leading-snug mb-3">
        {plan.focus}
      </p>
      {plan.theme ? (
        <p className="font-headline italic text-[15px] leading-snug text-brand-pacific-dusk/65 pl-3 border-l-2 border-brand-thousand-steps/40">
          {plan.theme}
        </p>
      ) : null}
    </Link>
  )
}
