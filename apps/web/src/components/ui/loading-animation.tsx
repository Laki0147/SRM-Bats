'use client'

import { motion } from 'framer-motion'

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative w-64 h-64">
        {/* Cricket Bat */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ rotate: -45, x: -20 }}
          animate={{ rotate: 45, x: 20 }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Bat blade */}
            <rect
              x="30"
              y="10"
              width="20"
              height="50"
              rx="2"
              fill="#d4a574"
              stroke="#8b6f47"
              strokeWidth="2"
            />
            {/* Bat handle */}
            <rect
              x="35"
              y="55"
              width="10"
              height="20"
              rx="5"
              fill="#4a5568"
            />
            {/* Grip lines */}
            <line x1="35" y1="58" x2="45" y2="58" stroke="#2d3748" strokeWidth="1" />
            <line x1="35" y1="62" x2="45" y2="62" stroke="#2d3748" strokeWidth="1" />
            <line x1="35" y1="66" x2="45" y2="66" stroke="#2d3748" strokeWidth="1" />
            <line x1="35" y1="70" x2="45" y2="70" stroke="#2d3748" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Cricket Ball */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{
            y: [-100, -120],
            x: [0, 150],
            opacity: [1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeOut',
            times: [0, 1],
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#dc2626" />
            {/* Seam lines */}
            <path
              d="M7 8 Q 12 12 17 8"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M7 16 Q 12 12 17 16"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* Trail effect for the ball */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <div className="w-6 h-6 rounded-full bg-red-500/30" />
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <p className="text-lg font-semibold text-primary-600">Loading...</p>
        </motion.div>
      </div>
    </div>
  )
}
