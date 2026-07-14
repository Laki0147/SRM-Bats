'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-whites-500">
      {/* Cricket Field Texture Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(76, 110, 66, 0.3) 3px,
            rgba(76, 110, 66, 0.3) 6px
          )`,
        }}
      />

      {/* Leather Texture Overlay */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(165, 42, 42, 0.05) 2px,
            rgba(165, 42, 42, 0.05) 4px
          )`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-12 gap-4 min-h-screen items-center py-20">

          {/* LEFT SIDE - Text Content (Asymmetric) */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-1 space-y-6 pt-20 lg:pt-0">
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <div className="bg-leather-500 text-whites-500 px-4 py-2 text-sm font-bold tracking-wider uppercase">
                Handcrafted Excellence
              </div>
            </motion.div>

            {/* Main Headline - Organic, Not Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-carbon-500">
                <span className="block">Custom</span>
                <span className="block text-willow-500">Cricket Bats</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-normal text-carbon-400">
                  Crafted for Champions
                </span>
              </h1>
            </motion.div>

            {/* Description - Wraps Organically */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-carbon-400 leading-relaxed max-w-md"
            >
              Every bat tells a story. Handpicked English & Kashmir willow,
              shaped by master craftsmen with 20+ years of expertise.
            </motion.p>

            {/* Registration Incentive - Scoreboard Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-carbon-500 text-whites-500 p-6 border-l-4 border-leather-500"
            >
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-bold text-leather-500">10%</span>
                <div>
                  <p className="text-sm uppercase tracking-wide opacity-80">First Order Discount</p>
                  <p className="text-lg font-semibold">Sign up today</p>
                </div>
              </div>
            </motion.div>

            {/* CTAs - Asymmetric Placement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-willow-500 hover:bg-willow-600 text-whites-500 text-lg px-8 py-6 transition-all hover:translate-y-[-2px] shadow-lg"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/custom">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-carbon-500 text-carbon-500 hover:bg-carbon-500 hover:text-whites-500 text-lg px-8 py-6 transition-all"
                >
                  Custom Design
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators - Minimal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center space-x-6 pt-6 text-sm text-carbon-400"
            >
              <div className="flex items-center space-x-2">
                <span className="text-leather-500 text-xl">★★★★★</span>
                <span className="font-medium">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-carbon-300" />
              <span>1000+ Satisfied Players</span>
              <div className="h-4 w-px bg-carbon-300" />
              <span>Free Delivery</span>
            </motion.div>
          </div>

          {/* RIGHT SIDE - CRICKET BAT HERO (Diagonal 45°) */}
          <div className="col-span-12 lg:col-span-7 relative h-[600px] lg:h-screen">
            {/* Ball Trajectory Path */}
            <motion.svg
              className="absolute top-10 right-20 w-64 h-64 opacity-20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
              viewBox="0 0 200 200"
            >
              <motion.path
                d="M 10 190 Q 80 80 190 10"
                stroke="#A52A2A"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
              />
            </motion.svg>

            {/* Stumps Silhouette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute bottom-20 left-10 hidden lg:block"
            >
              <svg width="60" height="100" viewBox="0 0 60 100" fill="#2D2D2D">
                <rect x="5" y="0" width="8" height="80" rx="2" />
                <rect x="26" y="0" width="8" height="80" rx="2" />
                <rect x="47" y="0" width="8" height="80" rx="2" />
                <rect x="0" y="5" width="60" height="3" rx="1" />
                <rect x="0" y="15" width="60" height="3" rx="1" />
              </svg>
            </motion.div>

            {/* MAIN BAT - Diagonal 45° Rotation */}
            <motion.div
              initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 45, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transformOrigin: 'center center',
              }}
            >
              {/* Cricket Bat SVG - Large and Detailed */}
              <svg
                width="400"
                height="700"
                viewBox="0 0 400 700"
                className="drop-shadow-2xl"
              >
                {/* Wood grain texture effect */}
                <defs>
                  <pattern id="woodGrain" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#8B4513" />
                    <path d="M0,10 Q5,8 10,10 T20,10" stroke="#723810" strokeWidth="0.5" fill="none" opacity="0.3" />
                    <path d="M0,15 Q5,13 10,15 T20,15" stroke="#5a2c0d" strokeWidth="0.5" fill="none" opacity="0.2" />
                  </pattern>
                  <linearGradient id="batGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B4513" />
                    <stop offset="50%" stopColor="#b89968" />
                    <stop offset="100%" stopColor="#8B4513" />
                  </linearGradient>
                </defs>

                {/* Bat Blade - Willow Wood */}
                <rect
                  x="120"
                  y="50"
                  width="160"
                  height="450"
                  rx="25"
                  fill="url(#woodGrain)"
                  stroke="#5a2c0d"
                  strokeWidth="3"
                />

                {/* Sweet Spot Marker */}
                <ellipse
                  cx="200"
cy="280"
                  rx="50"
                  ry="80"
                  fill="none"
                  stroke="#5a2c0d"
                  strokeWidth="2"
                  opacity="0.4"
                />

                {/* Brand Logo Area */}
                <text
                  x="200"
                  y="250"
                  textAnchor="middle"
                  fill="#5a2c0d"
                  fontSize="48"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  SRM
                </text>

                {/* Bat Handle - Rubber Grip */}
                <rect
                  x="160"
                  y="480"
                  width="80"
                  height="180"
                  rx="40"
                  fill="#2D2D2D"
                />

                {/* Grip Lines */}
                {[500, 520, 540, 560, 580, 600, 620, 640].map((y, i) => (
                  <line
                    key={i}
                    x1="160"
                    y1={y}
                    x2="240"
                    y2={y}
                    stroke="#1b1b1b"
                    strokeWidth="3"
                  />
                ))}

                {/* Handle End Cap */}
                <ellipse
                  cx="200"
                  cy="660"
                  rx="40"
                  ry="15"
                  fill="#A52A2A"
                />
              </svg>
            </motion.div>

            {/* Cricket Ball - Animated */}
            <motion.div
              initial={{ x: -100, y: -100, opacity: 0 }}
              animate={{
                x: [0, 150, 300],
                y: [0, -50, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute top-20 right-40"
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#A52A2A" />
                <path
                  d="M10 12 Q 20 20 30 12"
                  stroke="#F5F5DC"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M10 28 Q 20 20 30 28"
                  stroke="#F5F5DC"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* Floating Stats - Authentic Cricket Scoreboard Style */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute top-20 left-10 bg-carbon-500 text-whites-500 p-4 border-l-4 border-leather-500"
            >
              <div className="text-4xl font-bold font-mono">1000+</div>
              <div className="text-sm uppercase tracking-wide opacity-80">Bats Crafted</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 }}
              className="absolute bottom-32 right-10 bg-willow-500 text-whites-500 p-4 border-l-4 border-leather-500"
            >
              <div className="text-4xl font-bold font-mono">4.9★</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Rating</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

