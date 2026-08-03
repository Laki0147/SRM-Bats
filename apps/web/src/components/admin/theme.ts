/**
 * Shared heritage-light design tokens for the admin CMS.
 * Mirrors the storefront "docs" recipe so the panel feels part of the brand.
 */
export const T = {
  bg: '#faf6f0',
  surface: '#f7f2ea',
  surfaceAlt: '#fdfbf7',
  ink: '#2c1f14',
  body: '#6b6358',
  muted: '#a09588',
  accent: '#8b5e3c',
  accentLight: '#c4956a',
  line: 'rgba(139,94,60,.18)',
  lineSoft: 'rgba(44,31,20,.07)',
  success: '#2d6a4f',
  successBg: 'rgba(45,106,79,.1)',
  danger: '#9b2335',
  dangerBg: 'rgba(155,35,53,.08)',
  warn: '#b8860b',
  warnBg: 'rgba(184,134,11,.1)',
} as const;

// Shared input styling (matches account/profile fields).
export const fieldCls =
  'w-full px-3 py-2.5 rounded-[10px] border text-[13px] font-body outline-none transition-all focus:border-[#8b5e3c] focus:ring-1 focus:ring-[rgba(139,94,60,.15)]';
export const fieldStyle = {
  borderColor: 'rgba(139,94,60,.2)',
  background: '#fdfbf7',
  color: '#2c1f14',
} as const;

// Primary (filled) button surface.
export const btnPrimary = { background: '#2c1f14', color: '#faf6f0' } as const;
