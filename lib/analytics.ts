/**
 * Google Analytics 4 event tracking utilities for LBTA.
 * Wraps `window.gtag` with type-safe helpers for conversion
 * and engagement events used across the site.
 */

/**
 * Send a custom GA4 event. No-ops on the server or when gtag is unavailable.
 * @param eventName - GA4 event name (snake_case by convention)
 * @param parameters - Arbitrary key/value pairs forwarded to gtag
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  }
}

/** Pre-defined GA4 conversion and engagement events for LBTA. */
export const events = {
  /** Fires when a user clicks any "Book a Trial" / "Book Training" CTA. */
  bookTraining: (location?: string) => {
    trackEvent('book_training_click', { 
      location: location || (typeof window !== 'undefined' ? window.location.pathname : ''),
      event_category: 'engagement',
      event_label: 'CTA Click'
    })
  },
  
  /** Fires on successful form submission (contact, booking, newsletter, etc.). */
  formSubmit: (formType: string) => {
    trackEvent('form_submission', { 
      form_type: formType,
      event_category: 'conversion',
      event_label: `${formType} Form Submitted`
    })
  },
  
  /** Fires when a user completes program registration via the modal. */
  registerProgram: (programName: string, price?: number) => {
    trackEvent('register_program', { 
      program_name: programName,
      value: price || 0,
      currency: 'USD',
      event_category: 'conversion',
      event_label: 'Program Registration'
    })
  },
  
  /** Fires when a user subscribes to the LBTA newsletter. */
  newsletterSignup: () => {
    trackEvent('newsletter_signup', {
      event_category: 'engagement',
      event_label: 'Newsletter Subscribe'
    })
  },
  
  /** Fires when a user views program detail (schedule accordion, program page). */
  viewProgram: (programName: string) => {
    trackEvent('view_program', {
      program_name: programName,
      event_category: 'engagement',
      event_label: 'Program Details Viewed'
    })
  },
  
  /** Fires when a user expands a schedule accordion section. */
  expandAccordion: (category: string) => {
    trackEvent('expand_accordion', {
      accordion_name: category,
      event_category: 'engagement',
      event_label: 'Schedule Category Expanded'
    })
  }
}
