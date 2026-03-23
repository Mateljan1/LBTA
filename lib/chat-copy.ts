/**
 * Chat stub copy configuration
 * 
 * Prompt-native: All chat behavior strings live here. To change chat responses,
 * edit this file, not the route handler or component logic.
 * 
 * Future: If adding LLM, system prompts can live in this file or data/prompts/
 */

export const CHAT_COPY = {
  // Welcome message (shown when chat opens)
  welcome: `Hi! I'm the LBTA Assistant. I can help answer questions or point you to the right place.

This is a quick assistant; for detailed schedules and pricing, use the links below.

For immediate assistance, call us at (949) 534-0457 or use the contact form.

How can I help you today?`,

  // Success response (valid message received)
  success: `Thanks for reaching out. For the fastest response, call us at (949) 534-0457 or use the Contact form on this site. We'd love to hear from you.`,

  // Error responses
  errors: {
    rateLimit: `We're getting a lot of messages right now. Please call us at (949) 534-0457 or email info@lagunabeachtennisacademy.com.`,
    validation: `Please send a short message and we'll get back to you. You can also call (949) 534-0457.`,
    server: `We're having trouble right now. Please call us at (949) 534-0457 or email info@lagunabeachtennisacademy.com.`,
    processing: `We're having trouble processing your message. Please call us at (949) 534-0457 or email info@lagunabeachtennisacademy.com.`,
    network: `I'm having trouble connecting right now. Please call us directly at (949) 534-0457 or email info@lagunabeachtennisacademy.com`,
  },

  // Contact info (reused across messages)
  contact: {
    phone: '(949) 534-0457',
    email: 'info@lagunabeachtennisacademy.com',
  },
} as const

/**
 * Get a contextual reply based on message history and current page
 * 
 * Phase 3: Context injection - uses pathname and history to provide
 * more relevant responses without requiring LLM.
 */
export function getChatReply(options?: {
  pathname?: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}): string {
  const { pathname, history = [] } = options || {}
  
  // Pathname-aware context
  const pageContext = pathname ? getPageContext(pathname) : null
  
  // Use last 2 user messages for simple context (stub doesn't do semantic reasoning)
  const recentUserMessages = history
    .filter(m => m.role === 'user')
    .slice(-2)
    .map(m => m.content.toLowerCase())
  
  // Simple keyword matching for common intents (stub-grade)
  const hasBookingIntent = recentUserMessages.some(msg => 
    msg.includes('book') || msg.includes('trial') || msg.includes('schedule')
  )
  const hasPricingIntent = recentUserMessages.some(msg =>
    msg.includes('price') || msg.includes('cost') || msg.includes('fee')
  )
  const hasProgramIntent = recentUserMessages.some(msg =>
    msg.includes('program') || msg.includes('class') || msg.includes('lesson')
  )
  
  // Build contextual reply
  let reply: string = CHAT_COPY.success
  
  if (pageContext) {
    reply = `${pageContext}\n\n${CHAT_COPY.success}`
  } else if (hasBookingIntent) {
    reply = `I can help you book a trial! Visit our booking page or call ${CHAT_COPY.contact.phone} to schedule.\n\n${CHAT_COPY.success}`
  } else if (hasPricingIntent) {
    reply = `For pricing information, check our schedules page or call ${CHAT_COPY.contact.phone}.\n\n${CHAT_COPY.success}`
  } else if (hasProgramIntent) {
    reply = `We offer programs for all ages and levels. Check our schedules page or call ${CHAT_COPY.contact.phone} to discuss options.\n\n${CHAT_COPY.success}`
  }
  
  return reply
}

/**
 * Get page-specific context hints based on current route
 */
function getPageContext(pathname: string): string | null {
  if (pathname.startsWith('/schedules')) {
    return `You're viewing our schedules and programs.`
  }
  if (pathname.startsWith('/book')) {
    return `You're on our booking page.`
  }
  if (pathname.startsWith('/coaches')) {
    return `You're viewing our coaching team.`
  }
  if (pathname.startsWith('/programs')) {
    return `You're exploring our programs.`
  }
  if (pathname.startsWith('/contact')) {
    return `You're on our contact page.`
  }
  return null
}
