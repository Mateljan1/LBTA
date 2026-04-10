'use client'

import { useEffect, useState } from 'react'

/**
 * GHL (GoHighLevel) Conversation AI Chat Widget
 *
 * Renders the native GHL <chat-widget> custom element which connects to
 * GHL Conversation AI. All conversation threading, CRM logging, channel
 * state, and bot responses are handled by GHL natively.
 *
 * Requirements:
 *   - NEXT_PUBLIC_GHL_CHAT_WIDGET_LOCATION_ID env var must be set
 *   - GHL Conversation AI must be enabled on the GHL sub-account
 *   - The loader script is added in app/layout.tsx via next/script
 *
 * LBTA brand colors mapped to GHL CSS variables:
 *   --chat-widget-primary-color  -> deep-water
 *   --chat-widget-active-color   -> victoria-cove
 */

/** LBTA brand tokens applied to widget chrome */
const WIDGET_COLORS = {
  primary: 'rgb(15 34 55)',   // deep-water -- header, send button
  active: 'rgb(46 139 139)',  // victoria-cove -- active/focus accent
} as const

export default function ChatWidget() {
  const [locationId, setLocationId] = useState<string | null>(null)

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_LOCATION_ID
    if (id) setLocationId(id)
  }, [])

  // No location ID configured -- render nothing (graceful degradation)
  if (!locationId) return null

  return (
    // @ts-expect-error -- <chat-widget> is a GHL custom element, not in JSX intrinsics
    <chat-widget
      location-id={locationId}
      next-prompt-timer="0"
      style={{
        '--chat-widget-primary-color': WIDGET_COLORS.primary,
        '--chat-widget-active-color': WIDGET_COLORS.active,
      } as React.CSSProperties}
    />
  )
}
