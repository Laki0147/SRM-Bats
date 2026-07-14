'use client'

import { useEffect } from 'react'

export function CricketCursor() {
  useEffect(() => {
    // Create cursor trail effect
    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.left = `${e.clientX}px`
      trail.style.top = `${e.clientY}px`
      document.body.appendChild(trail)

      // Remove trail after animation
      setTimeout(() => {
        trail.remove()
      }, 500)
    }

    document.addEventListener('mousemove', handleMouseMove)

    // Add trail styles
    const style = document.createElement('style')
    style.textContent = `
      .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.6);
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 0.5s ease-out forwards;
        transform: translate(-50%, -50%);
      }

      @keyframes trailFade {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      style.remove()
    }
  }, [])

  return null
}
