'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand-50 to-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-display font-light text-clay-300 mb-6">
          404
        </h1>
        <h2 className="text-display-sm heading-display mb-6">
          Page Not Found
        </h2>
        <p className="body-text text-clay-600 mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on course.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

