/**
 * Color Accessibility Utilities
 * WCAG 2.1 contrast ratio checker and color manipulation utilities
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calculate relative luminance
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3,
    passesAAALarge: ratio >= 4.5,
  };
}

/**
 * Get text color (black or white) based on background
 */
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#FFFFFF';

  const luminance = getLuminance(rgb);
  return luminance > 0.5 ? '#0D0D0D' : '#FFFFFF';
}

/**
 * Lighten a color by a percentage
 */
export function lighten(color: string, percent: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const amount = Math.round(2.55 * percent);
  const r = Math.min(255, rgb.r + amount);
  const g = Math.min(255, rgb.g + amount);
  const b = Math.min(255, rgb.b + amount);

  return rgbToHex(r, g, b);
}

/**
 * Darken a color by a percentage
 */
export function darken(color: string, percent: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const amount = Math.round(2.55 * percent);
  const r = Math.max(0, rgb.r - amount);
  const g = Math.max(0, rgb.g - amount);
  const b = Math.max(0, rgb.b - amount);

  return rgbToHex(r, g, b);
}

/**
 * Add alpha channel to hex color
 */
export function addAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255);
  return `${color}${a.toString(16).padStart(2, '0')}`;
}

/**
 * SRM Bats color palette with contrast checks
 */
export const srmBatsColors = {
  primary: {
    midnight: '#0D0D0D',
    rich: '#151515',
    charcoal: '#222222',
  },
  accent: {
    gold: '#C89B58',
    goldDark: '#A57A3D',
    goldLight: '#E8D2A8',
  },
  neutral: {
    white: '#FFFFFF',
    warmWhite: '#F8F6F3',
    softGray: '#E6E6E6',
    mediumGray: '#8B8B8B',
    darkGray: '#4A4A4A',
  },
  status: {
    success: '#3DBE6C',
    warning: '#F6B73C',
    danger: '#E04A4A',
    info: '#338DFF',
  },
};

/**
 * Validate all color combinations in the palette
 */
export function validateColorPalette() {
  const results: Record<string, ContrastResult> = {};

  // Light mode combinations
  results['gold-on-white'] = checkContrast(srmBatsColors.accent.gold, srmBatsColors.neutral.white);
  results['midnight-on-white'] = checkContrast(srmBatsColors.primary.midnight, srmBatsColors.neutral.white);
  results['white-on-midnight'] = checkContrast(srmBatsColors.neutral.white, srmBatsColors.primary.midnight);
  results['gold-on-midnight'] = checkContrast(srmBatsColors.accent.gold, srmBatsColors.primary.midnight);

  // Dark mode combinations
  results['goldLight-on-midnight'] = checkContrast(srmBatsColors.accent.goldLight, srmBatsColors.primary.midnight);
  results['white-on-rich'] = checkContrast(srmBatsColors.neutral.white, srmBatsColors.primary.rich);

  // Status colors
  results['success-on-white'] = checkContrast(srmBatsColors.status.success, srmBatsColors.neutral.white);
  results['warning-on-white'] = checkContrast(srmBatsColors.status.warning, srmBatsColors.neutral.white);
  results['danger-on-white'] = checkContrast(srmBatsColors.status.danger, srmBatsColors.neutral.white);
  results['info-on-white'] = checkContrast(srmBatsColors.status.info, srmBatsColors.neutral.white);

  return results;
}