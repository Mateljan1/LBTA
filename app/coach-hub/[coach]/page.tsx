import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ coach: string }>
}

/**
 * Default landing for /coach-hub/{coach} — redirect to the Today tab.
 * Preserves any existing bookmarks / login redirects pointing at /coach-hub/{coach}.
 */
export default async function PerCoachIndex({ params }: PageProps) {
  const { coach } = await params
  redirect(`/coach-hub/${(coach ?? '').toLowerCase()}/today`)
}
