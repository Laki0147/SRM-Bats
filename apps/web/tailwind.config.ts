import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Soft Color System
        // Warm Neutral Backgrounds
        'cream-50': '#fdfcfa',
        'cream-100': '#f9f7f4',
        'cream-200': '#f3efe8',
        'sand-100': '#f5f1ea',
        'sand-200': '#ebe5dc',

        // Warm Charcoal (Soft Blacks)
        'charcoal-900': '#1c1917',
        'charcoal-800': '#292524',
        'charcoal-700': '#3f3a37',
        'charcoal-600': '#57534e',

        // Soft Text Colors
        'text-primary': '#292524',
        'text-secondary': '#78716c',
        'text-muted': '#a8a29e',

        // Premium Gold (Muted & Sophisticated)
        'premium-gold': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#d4a574',
          500: '#b8925f',
          600: '#9c7a4a',
        },

        // Natural Willow Wood Tones
        'willow-premium': {
          50: '#faf8f5',
          100: '#f0e8d8',
          200: '#e8dcc8',
          300: '#d9c6a8',
          400: '#c4ad8a',
        },

        // Soft Leather (Muted Burgundy)
        'leather-premium': {
          50: '#fef2f2',
          100: '#fce7e7',
          200: '#f5d5d5',
          300: '#d4a5a5',
          400: '#b38585',
          500: '#9c6b6b',
        },

        // Muted Field Green
        'field-premium': {
          50: '#f6faf6',
          100: '#e8f3e8',
          200: '#d4e8d4',
          300: '#a8c9a8',
          400: '#7a9f7a',
          500: '#5a7f5a',
        },

        // Legacy Colors (for compatibility)
        background: '#fdfcfa',
        surface: '#f9f7f4',
        'accent-bg': '#f6faf6',
        'cricket-green': {
          DEFAULT: '#7a9f7a',
          hover: '#5a7f5a',
          light: '#a8c9a8',
        },
        'willow-gold': '#d4a574',
        'leather-red': '#b38585',
        'field-green': '#7a9f7a',
        'border-light': 'rgba(0, 0, 0, 0.06)',
        'border-medium': 'rgba(0, 0, 0, 0.10)',
        divider: 'rgba(0, 0, 0, 0.06)',

        // Legacy Cricket Material Palette (kept for compatibility)
        willow: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4c0a0',
          400: '#b89968',
          500: '#8B4513',
          600: '#723810',
          700: '#5a2c0d',
          800: '#42200a',
          900: '#2a1407',
        },
        leather: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fdc8c8',
          300: '#f99999',
          400: '#f26666',
          500: '#A52A2A',
          600: '#8b2323',
          700: '#711c1c',
          800: '#571515',
          900: '#3d0f0f',
        },
        field: {
          50: '#f5f7f4',
          100: '#e8ede6',
          200: '#d1dbcc',
          300: '#a8bfa0',
          400: '#7d9973',
          500: '#4C6E42',
          600: '#3d5835',
          700: '#2f4429',
          800: '#22301e',
          900: '#151c13',
        },
        whites: {
          50: '#fefefe',
          100: '#fcfcfb',
          200: '#f9f9f7',
          300: '#f7f7f3',
          400: '#f6f6ef',
          500: '#F5F5DC',
          600: '#d4d4bd',
          700: '#b3b39e',
          800: '#92927f',
          900: '#717160',
        },
        carbon: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#2D2D2D',
          600: '#242424',
          700: '#1b1b1b',
          800: '#121212',
          900: '#090909',
        },
        primary: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4c0a0',
          400: '#b89968',
          500: '#8B4513',
          600: '#723810',
          700: '#5a2c0d',
          800: '#42200a',
          900: '#2a1407',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fdc8c8',
          300: '#f99999',
          400: '#f26666',
          500: '#A52A2A',
          600: '#8b2323',
          700: '#711c1c',
          800: '#571515',
          900: '#3d0f0f',
        },
        accent: {
          50: '#f5f7f4',
          100: '#e8ede6',
          200: '#d1dbcc',
          300: '#a8bfa0',
          400: '#7d9973',
          500: '#4C6E42',
          600: '#3d5835',
          700: '#2f4429',
          800: '#22301e',
          900: '#151c13',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        crimson: ['var(--font-crimson)', 'serif'],
        // New design system fonts (loaded via globals.css @import)
        display: ['"Cormorant Garamond"', '"Cormorant"', 'Georgia', 'serif'],
        body: ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', '"Fira Code"', 'monospace'],
        sc: ['"Cormorant SC"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 48px rgba(0, 0, 0, 0.12)',
        'float': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'premium': '0 12px 32px rgba(0, 0, 0, 0.10), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'premium-lg': '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08)',
        'gold': '0 8px 24px rgba(212, 165, 116, 0.25), 0 4px 12px rgba(212, 165, 116, 0.15)',
        'warm': '0 8px 24px rgba(196, 173, 138, 0.20), 0 4px 12px rgba(196, 173, 138, 0.12)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #fdfcfa 0%, #f9f7f4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4a574 0%, #c4ad8a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'lift': 'lift 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
