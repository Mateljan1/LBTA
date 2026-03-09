/**
 * Brand Kit horizon line — signature gradient divider between sections.
 * Uses the same gradient as globals.css .horizon-line (victoria-cove → sunset-cliff → thousand-steps).
 */
export type HorizonDividerVariant = 'default' | 'thin'

interface HorizonDividerProps {
  variant?: HorizonDividerVariant
  className?: string
}

export default function HorizonDivider({
  variant = 'default',
  className = '',
}: HorizonDividerProps) {
  const base = 'w-full border-0'
  const variantClass = variant === 'thin' ? 'horizon-line-thin' : 'horizon-line'
  const combined = [base, variantClass, className].filter(Boolean).join(' ')
  return <hr className={combined} aria-hidden="true" />
}
