'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Award, Users } from 'lucide-react'
import Image from 'next/image'

const ModernHero = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Customers' },
    { icon: Award, value: '50+', label: 'Bat Models' },
    { icon: TrendingUp, value: '15+', label: 'Years Experience' },
  ]

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-cricket-green/10 text-cricket-green text-sm font-semibold rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              New Collection 2024
            </motion.span>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Handcrafted Cricket Bats
              <span className="block text-cricket-green mt-2">
                For Champions
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              Premium English willow bats, handmade by master craftsmen.
              Experience the perfect balance of power and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                className="group px-8 py-4 bg-cricket-green text-white font-semibold rounded-xl hover:bg-cricket-green-hover transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-cricket-green transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Collection
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-cricket-green" />
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero/hero-stadium.svg"
                alt="Premium Cricket Bat"
                fill
                className="object-cover"
                priority
              />

              {/* Floating Price Badge */}
              <motion.div
                className="absolute top-8 right-8 bg-white/95 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-2xl font-bold text-cricket-green">
                  ₹12,999
                </div>
                <div className="text-sm text-gray-600">Starting from</div>
              </motion.div>
            </div>

            {/* Decorative Gradient */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-cricket-green/10 to-transparent rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ModernHero
