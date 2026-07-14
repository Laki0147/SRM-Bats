'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>Premium Cricket Equipment</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">Custom Cricket Bats</span>
              <br />
              <span className="text-gray-900">Built for Champions</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Handcrafted with precision. Designed for performance.
              Create your perfect bat with our expert customization.
            </p>

            {/* Registration Incentive Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-4 rounded-xl shadow-lg"
            >
              <p className="text-lg font-semibold flex items-center">
                🎉 Sign up now and get <span className="text-2xl font-bold mx-2">10% OFF</span> your first order!
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover-lift"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/custom">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary-600 text-primary-600 hover:bg-primary-50 text-lg px-8 py-6 rounded-xl"
                >
                  Customize Your Bat
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-medium">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <span>1000+ Happy Customers</span>
              <div className="h-4 w-px bg-gray-300" />
              <span>Free Shipping</span>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Floating Animation Container */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Main Bat Image Placeholder */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl shadow-2xl overflow-hidden">
                {/* SVG Cricket Bat Illustration */}
                <svg
                  viewBox="0 0 400 600"
                  className="w-full h-full p-12"
                  fill="none"
                >
                  {/* Bat Blade */}
                  <rect
                    x="120"
                    y="50"
                    width="160"
                    height="400"
                    rx="20"
                    fill="#d4a574"
                    stroke="#8b6f47"
                    strokeWidth="4"
                  />
                  {/* Bat Handle */}
                  <rect
                    x="160"
                    y="430"
                    width="80"
                    height="120"
                    rx="40"
                    fill="#4a5568"
                  />
                  {/* Grip Lines */}
                  {[450, 470, 490, 510, 530].map((y, i) => (
                    <line
                      key={i}
                      x1="160"
                      y1={y}
                      x2="240"
                      y2={y}
                      stroke="#2d3748"
                      strokeWidth="3"
                    />
                  ))}
                  {/* Brand Name */}
                  <text
                    x="200"
                    y="250"
                    textAnchor="middle"
                    fill="#8b6f47"
                    fontSize="48"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    SRM
                  </text>
                </svg>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent-500/20 rounded-full blur-2xl"
              />
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-8 -left-4 bg-white rounded-xl shadow-xl p-4 glass"
            >
              <div className="text-3xl font-bold text-primary-600">1000+</div>
              <div className="text-sm text-gray-600">Bats Sold</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 -right-4 bg-white rounded-xl shadow-xl p-4 glass"
            >
              <div className="text-3xl font-bold text-secondary-600">4.9★</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
