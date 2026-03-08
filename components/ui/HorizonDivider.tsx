/**
 * Brand Kit horizon line — signature gradient divider between sections.
 * Uses the same gradient as globals.css .horizon-line (victoria-cove → sunset-cliff → thousand-steps).
 */
export type HorizonDividerVariant = 'default' | 'thin'

interface HorizonDividerProps {
  variant?: HorizonDividerVariant
  className?: string
  /** Use as hr for semantics (default) or div for layout flexibility */
  as?: 'hr' | 'div'
}

export default function HorizonDivider({
  variant = 'default',
  className = '',
  as: Component = 'hr',
}: HorizonDividerProps) {
  const base = 'w-full border-0'
  const variantClass = variant === 'thin' ? 'horizon-line-thin' : 'horizon-line'
  const combined = [base, variantClass, className].filter(Boolean).join(' ')
  return <Component className={combined} aria-hidden="true" />
}
