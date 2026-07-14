'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

/**
 * Web Vitals Reporter Component
 * Initializes Web Vitals tracking on the client side
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals reporting
    reportWebVitals()
  }, [])

  // This component doesn't render anything
  return null
}
