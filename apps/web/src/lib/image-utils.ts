/**
 * Image Optimization Utilities
 * Provides helper functions for responsive images, blur placeholders, and shimmer effects
 */

/**
 * Get responsive image sizes based on image type
 */
export const getImageSizes = (type: 'hero' | 'product' | 'thumbnail' | 'full') => {
  const sizeMap = {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw',
    product: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    full: '100vw',
  }
  return sizeMap[type]
}

/**
 * Generate blur data URL for image placeholders
 */
export const getBlurDataURL = (color = '#f3efe8') => {
  const svg = `
    <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" fill="${color}"/>
    </svg>
  `
  return `image/svg+xml;base64,${toBase64(svg)}`
}

/**
 * Generate shimmer effect SVG for loading states
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3efe8" offset="20%" />
      <stop stop-color="#ebe5dc" offset="50%" />
      <stop stop-color="#f3efe8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3efe8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

/**
 * Convert string to base64
 */
export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

/**
 * Get shimmer blur data URL
 */
export const getShimmerDataURL = (w: number, h: number) => {
  return `image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}

/**
 * Image quality presets
 */
export const imageQuality = {
  hero: 90,
  product: 85,
  thumbnail: 75,
  avatar: 80,
} as const

/**
 * Get optimized image props
 */
export const getOptimizedImageProps = (
  type: keyof typeof imageQuality,
  priority = false
) => ({
  quality: imageQuality[type],
  loading: priority ? 'eager' : ('lazy' as const),
  priority,
  placeholder: 'blur' as const,
  blurDataURL: getBlurDataURL(),
})
