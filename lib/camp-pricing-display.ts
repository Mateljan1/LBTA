/**
 * Camp pricing copy for Spring Break vs other camps (single source).
 * Spring Break: 4-day Mon–Thu session + half-day drop-in rate — not a 5-day "week" or full-day drop-in.
 */

export function campMainPriceSuffix(campId: string): string {
  return campId === 'spring-break' ? 'session (Mon–Thu)' : 'week'
}

export function campPerDaySecondaryLine(campId: string, perDay: number): string {
  return campId === 'spring-break' ? `$${perDay} half-day drop-in` : `$${perDay}/day`
}

export function campModalSessionLabel(campId: string): string {
  return campId === 'spring-break' ? 'Mon–Thu session (4 days)' : 'Full Week'
}

export function campModalDropInLabel(campId: string): string {
  return campId === 'spring-break' ? 'Half-day drop-in' : 'Per Day'
}
