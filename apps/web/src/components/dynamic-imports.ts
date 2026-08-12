/**
 * Dynamic Imports for Code Splitting
 * Lazy load heavy components to reduce initial bundle size
 */

import dynamic from 'next/dynamic'

// Lazy load Framer Motion components (only when needed)
export const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
)

export const MotionButton = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.button),
  { ssr: false }
)

export const MotionSection = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.section),
  { ssr: false }
)

// Lazy load heavy sections with loading states
export const FeaturesSection = dynamic(
  () => import('@/components/landing/FeaturesSection').then((mod) => mod.FeaturesSection),
  {
    loading: () => (
      <div className="h-96 bg-cream-100 animate-pulse rounded-xl" />
    ),
    ssr: true,
  }
)

export const TestimonialsSection = dynamic(
  () => import('@/components/landing/TestimonialsSection').then((mod) => mod.TestimonialsSection),
  {
    loading: () => (
      <div className="h-96 bg-cream-100 animate-pulse rounded-xl" />
    ),
    ssr: true,
  }
)

export const CTASection = dynamic(
  () => import('@/components/landing/CTASection').then((mod) => mod.CTASection),
  {
    loading: () => (
      <div className="h-64 bg-cream-100 animate-pulse rounded-xl" />
    ),
    ssr: true,
  }
)

// Lazy load product quick view (modal - only loads when opened)
export const ProductQuickView = dynamic(
  () => import('@/components/products/product-quick-view'),
  {
    loading: () => null,
    ssr: false,
  }
)

// Lazy load product filters (below the fold)
export const ProductFilters = dynamic(
  () => import('@/components/products/product-filters'),
  {
    loading: () => (
      <div className="h-64 bg-cream-100 animate-pulse rounded-xl" />
    ),
    ssr: true,
  }
)

// Lazy load product sort (below the fold)
export const ProductSort = dynamic(
  () => import('@/components/products/product-sort'),
  {
    loading: () => (
      <div className="h-12 bg-cream-100 animate-pulse rounded-xl" />
    ),
    ssr: true,
  }
)
