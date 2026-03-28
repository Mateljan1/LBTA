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
  },

  /** Homepage hero primary (Book a Trial) or secondary (schedule & pricing). */
  heroCta: (variant: 'primary' | 'secondary', href: string) => {
    trackEvent('hero_cta_click', {
      cta_variant: variant,
      link_url: href,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      event_category: 'engagement',
      event_label: variant === 'primary' ? 'Hero Book Trial' : 'Hero Schedule',
    })
  },

  /** Homepage program grid cards (coaching vs match play groups). */
  programCardClick: (title: string, href: string, section: 'coaching' | 'play') => {
    trackEvent('program_card_click', {
      program_title: title,
      link_url: href,
      program_section: section,
      event_category: 'engagement',
      event_label: title,
    })
  },

  /** Tel: links — distinguish placement for CRO. */
  phoneClick: (location: string) => {
    trackEvent('phone_click', {
      location,
      event_category: 'engagement',
      event_label: 'Phone',
    })
  },

  /** Homepage bottom CTA trial form — first interaction. */
  homepageTrialFormStart: () => {
    trackEvent('homepage_trial_form_start', {
      event_category: 'engagement',
      event_label: 'Homepage CTA Form',
    })
  },

  /** Vimeo embed finished loading (proxy for engagement; true “play” needs Player API). */
  videoTestimonialEmbed: (name: string, index: number) => {
    trackEvent('video_testimonial_embed', {
      testimonial_name: name,
      embed_index: index,
      event_category: 'engagement',
      event_label: name,
    })
  },

  /** Featured grid “More stories” → /success-stories */
  moreStoriesClick: () => {
    trackEvent('more_stories_click', {
      link_url: '/success-stories',
      event_category: 'engagement',
      event_label: 'More stories',
    })
  },

  /** Mobile sticky bar — book link, optional secondary, or phone icon. */
  stickyCta: (kind: 'book' | 'secondary' | 'phone', href?: string) => {
    trackEvent('sticky_cta_click', {
      sticky_action: kind,
      link_url: href ?? '',
      event_category: 'engagement',
      event_label: kind === 'phone' ? 'Sticky phone' : 'Sticky CTA',
    })
  },
}
