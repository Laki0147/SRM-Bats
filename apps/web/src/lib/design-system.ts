/**
 * Heritage Atelier Design System
 * Premium cricket bats e-commerce - Concept 1
 */

export const colors = {
  // Primary Colors
  warmCream: '#F8F6F1',
  workshopCharcoal: '#3A3935',
  walnutBrown: '#8B7355',

  // Secondary Colors
  canvasBeige: '#E8E3DB',
  workshopGreen: '#7C8B7E',
  agedBrass: '#B8956A',

  // Text Colors
  headings: '#2A2825',
  body: '#5A5753',
  captions: '#8B8781',
} as const;

export const typography = {
  // Headings (Freight Display Pro alternative: Crimson Pro)
  heading: {
    hero: {
      fontSize: '72px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '48px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '32px',
      fontWeight: 600,
      letterSpacing: 'normal',
      lineHeight: 1.3,
    },
  },
  // Body (Suisse Intl alternative: Inter)
  body: {
    regular: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.7,
    },
    large: {
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    small: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
} as const;

export const shadows = {
  // Soft & Realistic shadows
  elevated: '0 20px 60px rgba(58, 57, 53, 0.08), 0 8px 24px rgba(58, 57, 53, 0.04)',
  subtle: '0 4px 16px rgba(58, 57, 53, 0.03)',
  hover: '0 28px 80px rgba(58, 57, 53, 0.12), 0 12px 32px rgba(58, 57, 53, 0.06)',
  product: {
    main: '0 40px 80px rgba(58, 57, 53, 0.15)',
    ambient: '0 20px 40px rgba(58, 57, 53, 0.08)',
  },
  card: {
    resting: '0 8px 32px rgba(58, 57, 53, 0.06)',
    hover: '0 20px 60px rgba(58, 57, 53, 0.12)',
  },
  button: '0 8px 24px rgba(139, 115, 85, 0.25)',
  buttonHover: '0 12px 32px rgba(139, 115, 85, 0.35)',
} as const;

export const spacing = {
  section: {
    vertical: '160px',
    verticalLarge: '200px',
  },
  container: {
    maxWidth: '1400px',
    padding: '80px',
  },
  hero: {
    vertical: '120px',
    horizontal: '80px',
  },
  card: {
    gap: '48px',
    padding: '40px',
  },
} as const;

export const animations = {
  // Smooth, premium transitions
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  durations: {
    fast: 300,
    medium: 400,
    slow: 600,
  },
} as const;

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1400px',
} as const;
