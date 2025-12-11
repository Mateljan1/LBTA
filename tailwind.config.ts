import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LBTA Production Spec Colors - Cinematic Homepage
        lbta: {
          // PRIMARY COLORS (Production Spec)
          orange: '#F8A121',      // Primary accent - Production spec
          red: '#F04E23',         // Accent CTA - Production spec
          beige: '#F8E6BB',       // Soft beige background - Production spec
          black: '#000000',       // Text primary
          white: '#FFFFFF',       // Pure white
          
          // LEGACY COLORS (backwards compatibility for other pages)
          primary: '#1A1A1A',     
          secondary: '#6B6B6B',   
          coral: '#E8956F',       
          'coral-dark': '#D67D5A',
          bone: '#FDFCFA',        
          sand: '#F4EDE4',        
          charcoal: '#2B2B2B',    
        },
        vylo: {
          orange: '#F26522',      // VYLO brand distinct color
        },
      },
      fontFamily: {
        // LBTA Final Font Stack (Playfair Display + Work Sans)
        // NO Space Grotesk - causes accessibility bugs
        headline: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Work Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        accent: ['Work Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Blueprint Typography System (Exact Scales)
        'display': ['clamp(48px, 9vw, 84px)', { lineHeight: '0.95', letterSpacing: '-0.5px', fontWeight: '300' }],
        'headline': ['clamp(40px, 6vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'headline-md': ['clamp(36px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'headline-sm': ['clamp(32px, 4vw, 48px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'subhead': ['clamp(28px, 3.5vw, 32px)', { lineHeight: '1.2', letterSpacing: '-0.2px', fontWeight: '400' }],
        'subhead-sm': ['clamp(24px, 3vw, 28px)', { lineHeight: '1.2', letterSpacing: '-0.2px', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'body': ['18px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'eyebrow': ['11px', { lineHeight: '1.4', letterSpacing: '2px', fontWeight: '400' }],
      },
      spacing: {
        // Blueprint Spacing System (12px base unit)
        '15': '60px',    // 12 × 5
        '18': '72px',    // 12 × 6
        '20': '80px',    // 12 × 6.67
        '22': '88px',    // Custom
        '24': '96px',    // 12 × 8
        '26': '104px',   // Custom
        '28': '112px',   // Custom
        '30': '120px',   // 12 × 10 (Blueprint outer margins)
        '36': '144px',   // 12 × 12
        '40': '160px',   // 12 × 13.33 (Blueprint section spacing medium)
        '48': '192px',   // 12 × 16
        '60': '240px',   // 12 × 20 (Blueprint section padding desktop)
        '72': '288px',   // 12 × 24
      },
      maxWidth: {
        'prose': '65ch',
        'narrow': '45rem',
        'reading': '72ch',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 1.2s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
        'mega-wide': '0.25em',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,0.08)',
        hover: '0 4px 16px rgba(0,0,0,0.12)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      aspectRatio: {
        hero: '21 / 9',
        section: '3 / 2',
        mobile: '4 / 3',
      },
    },
  },
  plugins: [],
}
export default config

