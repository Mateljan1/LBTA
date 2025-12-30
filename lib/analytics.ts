// Google Analytics 4 Event Tracking Helper

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  }
}

// Pre-defined conversion events
export const events = {
  bookTraining: (location?: string) => {
    trackEvent('book_training_click', { 
      location: location || (typeof window !== 'undefined' ? window.location.pathname : ''),
      event_category: 'engagement',
      event_label: 'CTA Click'
    })
  },
  
  formSubmit: (formType: string) => {
    trackEvent('form_submission', { 
      form_type: formType,
      event_category: 'conversion',
      event_label: `${formType} Form Submitted`
    })
  },
  
  registerProgram: (programName: string, price?: number) => {
    trackEvent('register_program', { 
      program_name: programName,
      value: price || 0,
      currency: 'USD',
      event_category: 'conversion',
      event_label: 'Program Registration'
    })
  },
  
  newsletterSignup: () => {
    trackEvent('newsletter_signup', {
      event_category: 'engagement',
      event_label: 'Newsletter Subscribe'
    })
  },
  
  viewProgram: (programName: string) => {
    trackEvent('view_program', {
      program_name: programName,
      event_category: 'engagement',
      event_label: 'Program Details Viewed'
    })
  },
  
  expandAccordion: (category: string) => {
    trackEvent('expand_accordion', {
      accordion_name: category,
      event_category: 'engagement',
      event_label: 'Schedule Category Expanded'
    })
  }
}
