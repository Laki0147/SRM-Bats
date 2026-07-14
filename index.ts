/**
 * SRM Bats GSAP Animation System
 * Main entry point for all animations
 *
 * @version 1.0.0
 * @author SRM Bats Development Team
 */

// ============================================================================
// CORE ANIMATIONS
// ============================================================================

export {
  // Configuration
  ANIMATION_CONFIG,

  // Hero Animations
  useHeroBatAnimation,

  // Card Animations
  useCardAnimation,
  useCardHoverAnimation,

  // Image Animations
  useImageZoomAnimation,

  // Button Animations
  useMagneticButton,
  useButtonHoverAnimation,

  // Navigation Animations
  useNavigationAnimation,

  // Product Animations
  useProductCardAnimation,

  // Utility Animations
  useTextRevealAnimation,
  useCounterAnimation,
  useFadeInAnimation,
  useSlideInAnimation,

  // Cleanup
  cleanupAnimations,
  refreshScrollTrigger,
  createBatchScrollTrigger,
} from './gsap-animations_part1';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // Configuration
  ANIMATION_DEFAULTS,
  SCROLL_DEFAULTS,

  // Accessibility
  prefersReducedMotion,
  animateIfAllowed,

  // Scroll Utilities
  getScrollProgress,
  smoothScrollTo,
  pinElement,

  // Animation Helpers
  createReveal,
  createStagger,
  createParallax,
  createScaleOnScroll,

  // Hover Effects
  createHoverLift,
  createTiltEffect,

  // Text Animations
  splitText,
  animateTextReveal,
  createTypewriter,

  // Loading & Transitions
  createPageTransition,
  createLoader,

  // Cleanup
  killAnimations,
  killAllScrollTriggers,
  refreshAllScrollTriggers,
  cleanupAll,

  // Debug
  enableScrollTriggerMarkers,
  logActiveAnimations,
} from './gsap-utils_part1';

// ============================================================================
// ADVANCED ANIMATIONS
// ============================================================================

export {
  // Scroll Effects
  useHorizontalScroll,
  useRevealMask,
  useScrollProgress,

  // Cursor Effects
  useCustomCursor,
  useMagneticCursor,

  // Loading Animations
  usePageLoadAnimation,
  useSkeletonAnimation,

  // Morphing
  useSVGMorph,
  useFormattedCounter,

  // 3D Effects
  useCardFlip,
  use3DCube,

  // Particle Effects
  useFloatingParticles,

  // Special Effects
  useTextGlitch,
} from './gsap-advanced-animations_part1';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { TweenVars, Timeline } from 'gsap';
export type { ScrollTriggerVars } from 'gsap/ScrollTrigger';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import * as coreAnimations from './gsap-animations_part1';
import * as utilities from './gsap-utils_part1';
import * as advancedAnimations from './gsap-advanced-animations_part1';

export default {
  ...coreAnimations,
  ...utilities,
  ...advancedAnimations,
};
