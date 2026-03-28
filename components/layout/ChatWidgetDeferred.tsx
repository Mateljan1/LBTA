'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
  loading: () => null,
})

/** Mount chat after first scroll or ~4s — keeps main thread and LCP path lighter. */
const REVEAL_MS = 4000

export default function ChatWidgetDeferred() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let cancelled = false
    const reveal = () => {
      if (!cancelled) setShow(true)
    }
    const t = window.setTimeout(reveal, REVEAL_MS)
    window.addEventListener('scroll', reveal, { passive: true, once: true })
    return () => {
      cancelled = true
      window.clearTimeout(t)
      window.removeEventListener('scroll', reveal)
    }
  }, [])

  if (!show) return null
  return <ChatWidget />
}
