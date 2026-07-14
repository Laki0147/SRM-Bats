'use client'

import { useEffect, useState } from 'react'

/**
 * Full-screen loading overlay shown on initial page load.
 * Hides once BOTH the hero video AND the cursor ball image are loaded,
 * or after a 6-second safety timeout — whichever comes first.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let videoReady = false
    let cursorReady = false

    const dismiss = () => {
      if (fadeOut) return
      setFadeOut(true)
      setTimeout(() => setVisible(false), 600) // wait for fade transition
    }

    const check = () => {
      if (videoReady && cursorReady) dismiss()
    }

    // ── Watch the hero video ──────────────────────────────────────
    const watchVideo = () => {
      const video = document.querySelector<HTMLVideoElement>('video[src="/hero-video.mp4"]')
      if (!video) {
        // video not in DOM yet — retry shortly
        setTimeout(watchVideo, 100)
        return
      }
      if (video.readyState >= 3) {
        // already buffered enough
        videoReady = true
        check()
      } else {
        video.addEventListener('canplaythrough', () => {
          videoReady = true
          check()
        }, { once: true })
      }
    }
    watchVideo()

    // ── Watch the cursor ball image ───────────────────────────────
    const img = new Image()
    img.src = '/cursor-ball.png'
    if (img.complete) {
      cursorReady = true
      check()
    } else {
      img.onload = () => { cursorReady = true; check() }
      img.onerror = () => { cursorReady = true; check() } // don't block on error
    }

    // ── Safety timeout — never block longer than 6 s ──────────────
    const timer = setTimeout(dismiss, 6000)

    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#1c140c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Loading GIF */}
      <img
        src="/loading-animation.gif"
        alt="Loading…"
        style={{ width: 120, height: 120, objectFit: 'contain' }}
      />

      {/* Brand name */}
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: 13,
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: 'rgba(196,149,106,0.7)',
      }}>
        SRM Bats
      </div>
    </div>
  )
}
