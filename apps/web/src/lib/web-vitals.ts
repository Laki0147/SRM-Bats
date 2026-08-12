/**
 * Web Vitals Monitoring
 * Track and report Core Web Vitals metrics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals'

interface AnalyticsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

/**
 * Send metric to analytics endpoint
 */
function sendToAnalytics(metric: Metric) {
  const analyticsMetric: AnalyticsMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  }

  const body = JSON.stringify(analyticsMetric)
  const url = '/api/analytics/web-vitals'

  // Use sendBeacon if available (more reliable)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    // Fallback to fetch with keepalive
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      // Silently fail - don't disrupt user experience
      console.error('Failed to send analytics:', error)
    })
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', analyticsMetric)
  }
}

/**
 * Initialize Web Vitals reporting
 */
export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics) // Cumulative Layout Shift
    onFID(sendToAnalytics) // First Input Delay (legacy)
    onFCP(sendToAnalytics) // First Contentful Paint
    onLCP(sendToAnalytics) // Largest Contentful Paint
    onTTFB(sendToAnalytics) // Time to First Byte
    onINP(sendToAnalytics) // Interaction to Next Paint (new)
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error)
  }
}

/**
 * Get rating color for visualization
 */
export function getRatingColor(rating: 'good' | 'needs-improvement' | 'poor') {
  const colors = {
    good: '#0cce6b',
    'needs-improvement': '#ffa400',
    poor: '#ff4e42',
  }
  return colors[rating]
}

/**
 * Get threshold for each metric
 */
export function getMetricThresholds(name: string) {
  const thresholds: Record<string, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  }
  return thresholds[name] || { good: 0, poor: 0 }
}
