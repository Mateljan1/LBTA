import Link from 'next/link'

export default function CoachHubPage() {
  return (
    <div className="min-h-screen bg-brand-morning-light flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-headline text-brand-pacific-dusk text-2xl mb-4">
          Coach Hub
        </h1>
        <p className="font-sans text-brand-pacific-dusk/70 text-sm mb-6">
          Plan generator and resources will be available here.
        </p>
        <Link
          href="/api/coach-hub/logout"
          className="font-sans text-sm text-brand-victoria-cove underline focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded"
        >
          Sign out
        </Link>
      </div>
    </div>
  )
}
