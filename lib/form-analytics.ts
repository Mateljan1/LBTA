// Form Analytics & A/B Testing
// Track conversion improvements for embedded AC forms vs original modal

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export interface FormAnalyticsEvent {
  eventName: string
  programId: string
  programName: string
  category: string
  formType: 'embedded' | 'modal'
  timestamp: number
  sessionId: string
  userId?: string
  metadata?: Record<string, any>
}

export interface ConversionFunnel {
  programView: number
  formStart: number
  formComplete: number
  formSubmit: number
  conversionRate: number
  completionRate: number
}

// Generate unique session ID for tracking user journey
export function generateSessionId(): string {
  return `lbta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get or create session ID from localStorage
export function getSessionId(): string {
  const existing = localStorage.getItem('lbta_session_id')
  if (existing) {
    return existing
  }
  
  const newSessionId = generateSessionId()
  localStorage.setItem('lbta_session_id', newSessionId)
  return newSessionId
}

// Track form analytics events
export function trackFormEvent(event: Omit<FormAnalyticsEvent, 'timestamp' | 'sessionId'>): void {
  const analyticsEvent: FormAnalyticsEvent = {
    ...event,
    timestamp: Date.now(),
    sessionId: getSessionId()
  }
  
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.eventName, {
      event_category: 'Registration Form',
      event_label: event.programName,
      program_id: event.programId,
      program_category: event.category,
      form_type: event.formType,
      session_id: analyticsEvent.sessionId,
      ...event.metadata
    })
  }
  
  // Store locally for A/B testing analysis
  const localEvents = JSON.parse(localStorage.getItem('lbta_form_events') || '[]')
  localEvents.push(analyticsEvent)
  
  // Keep only last 100 events to prevent localStorage bloat
  if (localEvents.length > 100) {
    localEvents.splice(0, localEvents.length - 100)
  }
  
  localStorage.setItem('lbta_form_events', JSON.stringify(localEvents))
  
  console.log('📊 LBTA Form Analytics:', analyticsEvent)
}

// A/B Testing - Determine which form type to show
export function getFormVariant(): 'embedded' | 'modal' {
  // For initial rollout, always use embedded forms
  // Later this can be changed to percentage-based testing
  const testPercentage = 100 // 100% embedded forms
  
  const userId = getSessionId()
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const userPercentile = hash % 100
  
  return userPercentile < testPercentage ? 'embedded' : 'modal'
}

// Track program card view
export function trackProgramView(programId: string, programName: string, category: string): void {
  trackFormEvent({
    eventName: 'program_viewed',
    programId,
    programName,
    category,
    formType: getFormVariant()
  })
}

// Track form start (when registration panel/modal opens)
export function trackFormStart(programId: string, programName: string, category: string, formType: 'embedded' | 'modal'): void {
  trackFormEvent({
    eventName: 'form_started',
    programId,
    programName,
    category,
    formType,
    metadata: {
      start_time: Date.now(),
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      user_agent: navigator.userAgent
    }
  })
}

// Track form field interaction
export function trackFormInteraction(programId: string, programName: string, category: string, formType: 'embedded' | 'modal', fieldName: string): void {
  trackFormEvent({
    eventName: 'form_field_interaction',
    programId,
    programName,
    category,
    formType,
    metadata: {
      field_name: fieldName,
      interaction_time: Date.now()
    }
  })
}

// Track form completion (all fields filled)
export function trackFormComplete(programId: string, programName: string, category: string, formType: 'embedded' | 'modal', timeToComplete: number): void {
  trackFormEvent({
    eventName: 'form_completed',
    programId,
    programName,
    category,
    formType,
    metadata: {
      completion_time: timeToComplete,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    }
  })
}

// Track form submission
export function trackFormSubmit(programId: string, programName: string, category: string, formType: 'embedded' | 'modal', successful: boolean): void {
  trackFormEvent({
    eventName: successful ? 'form_submitted_success' : 'form_submitted_error',
    programId,
    programName,
    category,
    formType,
    metadata: {
      submission_time: Date.now(),
      success: successful
    }
  })
}

// Track form abandonment
export function trackFormAbandon(programId: string, programName: string, category: string, formType: 'embedded' | 'modal', exitPoint: string): void {
  trackFormEvent({
    eventName: 'form_abandoned',
    programId,
    programName,
    category,
    formType,
    metadata: {
      exit_point: exitPoint,
      abandon_time: Date.now()
    }
  })
}

// Calculate conversion funnel metrics
export function getConversionFunnel(programId?: string, formType?: 'embedded' | 'modal'): ConversionFunnel {
  const events = JSON.parse(localStorage.getItem('lbta_form_events') || '[]') as FormAnalyticsEvent[]
  
  const filteredEvents = events.filter(event => 
    (!programId || event.programId === programId) &&
    (!formType || event.formType === formType)
  )
  
  const programViews = filteredEvents.filter(e => e.eventName === 'program_viewed').length
  const formStarts = filteredEvents.filter(e => e.eventName === 'form_started').length  
  const formCompletes = filteredEvents.filter(e => e.eventName === 'form_completed').length
  const formSubmits = filteredEvents.filter(e => e.eventName === 'form_submitted_success').length
  
  return {
    programView: programViews,
    formStart: formStarts,
    formComplete: formCompletes,
    formSubmit: formSubmits,
    conversionRate: programViews > 0 ? (formSubmits / programViews) * 100 : 0,
    completionRate: formStarts > 0 ? (formSubmits / formStarts) * 100 : 0
  }
}

// Get A/B test results comparison
export function getABTestResults(): {
  embedded: ConversionFunnel,
  modal: ConversionFunnel,
  improvement: number
} {
  const embeddedFunnel = getConversionFunnel(undefined, 'embedded')
  const modalFunnel = getConversionFunnel(undefined, 'modal')
  
  const improvement = modalFunnel.conversionRate > 0 
    ? ((embeddedFunnel.conversionRate - modalFunnel.conversionRate) / modalFunnel.conversionRate) * 100
    : 0
    
  return {
    embedded: embeddedFunnel,
    modal: modalFunnel,
    improvement
  }
}

// Export analytics data for external analysis
export function exportAnalyticsData(): FormAnalyticsEvent[] {
  return JSON.parse(localStorage.getItem('lbta_form_events') || '[]')
}

// Clear analytics data (for testing)
export function clearAnalyticsData(): void {
  localStorage.removeItem('lbta_form_events')
  localStorage.removeItem('lbta_session_id')
}

// Performance metrics for form loading
export function trackFormLoadTime(programId: string, formType: 'embedded' | 'modal', loadTime: number): void {
  trackFormEvent({
    eventName: 'form_load_time',
    programId,
    programName: 'Performance',
    category: 'Performance',
    formType,
    metadata: {
      load_time_ms: loadTime,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    }
  })
}

// Heatmap data collection for form interactions
export function trackFormHeatmap(programId: string, formType: 'embedded' | 'modal', element: string, x: number, y: number): void {
  trackFormEvent({
    eventName: 'form_heatmap_click',
    programId,
    programName: 'Heatmap',
    category: 'UX',
    formType,
    metadata: {
      element,
      click_x: x,
      click_y: y,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    }
  })
}
