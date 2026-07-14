'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Award, Users, Sparkles } from 'lucide-react'
import Image from 'next/image'

const PremiumHero = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Customers' },
    { icon: Award, value: '50+', label: 'Bat Models' },
    { icon: TrendingUp, value: '15+', label: 'Years Experience' },
  ]

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#fdfcfa] via-[#f9f7f4] to-[#f5f1ea]">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#d4a574]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-[#c4ad8a]/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4a574]/10 to-[#c4ad8a]/10 border border-[#d4a574]/20 text-[#d4a574] text-sm font-semibold rounded-full mb-6 shadow-[0_2px_8px_rgba(212,165,116,0.15)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              New Collection 2024
            </motion.div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#292524] leading-[1.1] mb-6">
              Handcrafted Cricket Bats
              <span className="block bg-gradient-to-r from-[#d4a574] to-[#c4ad8a] bg-clip-text text-transparent mt-2">
                For Champions
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-[#78716c] leading-relaxed mb-8 max-w-xl">
              Premium English willow bats, handmade by master craftsmen.
              Experience the perfect balance of power and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                className="group px-8 py-4 bg-gradient-to-r from-[#d4a574] to-[#c4ad8a] text-[#fdfcfa] font-semibold rounded-[14px] shadow-[0_4px_16px_rgba(212,165,116,0.30)] hover:shadow-[0_8px_28px_rgba(212,165,116,0.40)] transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-[#fdfcfa] text-[#292524] font-semibold rounded-[14px] border border-[rgba(0,0,0,0.10)] hover:border-[#d4a574]/30 hover:bg-[#f9f7f4] transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Collection
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[rgba(0,0,0,0.06)]">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#d4a574]/10 to-[#c4ad8a]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4 text-[#d4a574]" />
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-[#292524]">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-[#78716c]">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f9f7f4] to-[#f3efe8]" />
              <Image
                src="/images/hero/hero-stadium.svg"
                alt="Premium Cricket Bat"
                fill
                className="object-cover"
                priority
              />

              {/* Floating Price Badge */}
              <motion.div
                className="absolute top-8 right-8 px-6 py-4 bg-[#fdfcfa]/95 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-[#d4a574] to-[#c4ad8a] bg-clip-text text-transparent">
                  ₹12,999
                </div>
                <div className="text-sm text-[#78716c]">Starting from</div>
              </motion.div>
            </div>

            {/* Decorative Gradient */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#d4a574]/10 via-[#c4ad8a]/5 to-transparent rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PremiumHero
