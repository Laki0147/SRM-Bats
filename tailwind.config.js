/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Canela', 'Playfair Display', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        numbers: ['Space Grotesk', 'monospace'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['2.625rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h4': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h5': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
      },
      lineHeight: {
        hero: '1.1',
        heading: '1.2',
        tight: '1.4',
        body: '1.6',
      },
      colors: {
        // Primary Colors
        primary: {
          midnight: '#0D0D0D',
          rich: '#151515',
          charcoal: '#222222',
          DEFAULT: '#0D0D0D',
        },
        // Accent Colors
        accent: {
          gold: '#C89B58',
          'gold-dark': '#A57A3D',
          'gold-light': '#E8D2A8',
          DEFAULT: '#C89B58',
        },
        // Neutral Colors
        neutral: {
          white: '#FFFFFF',
          'warm-white': '#F8F6F3',
          'soft-gray': '#E6E6E6',
          'medium-gray': '#8B8B8B',
          'dark-gray': '#4A4A4A',
          DEFAULT: '#8B8B8B',
        },
        // Status Colors
        status: {
          success: '#3DBE6C',
          warning: '#F6B73C',
          danger: '#E04A4A',
          info: '#338DFF',
        },
        // Semantic Aliases
        success: '#3DBE6C',
        warning: '#F6B73C',
        danger: '#E04A4A',
        error: '#E04A4A',
        info: '#338DFF',
      },
      backgroundColor: {
        'primary': 'var(--color-primary)',
        'accent': 'var(--color-accent)',
      },
      textColor: {
        'primary': 'var(--color-text-primary)',
        'secondary': 'var(--color-text-secondary)',
        'accent': 'var(--color-accent)',
      },
      borderColor: {
        'primary': 'var(--color-border-primary)',
        'accent': 'var(--color-accent)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};