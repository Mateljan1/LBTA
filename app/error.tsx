'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-headline font-bold text-brand-pacific-dusk mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-brand-pacific-dusk text-white rounded hover:bg-brand-deep-water transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 border border-brand-pacific-dusk text-brand-pacific-dusk rounded hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Return home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
