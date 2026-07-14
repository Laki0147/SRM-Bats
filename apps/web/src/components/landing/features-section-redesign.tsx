'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Truck, Award } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Master Craftsmanship',
    description: 'Every bat shaped by artisans with 20+ years of experience. Hand-selected willow, precision-balanced.',
    detail: 'English & Kashmir Willow',
    size: 'large', // 40% larger - dominant card
    position: 'top',
  },
  {
    icon: Shield,
    title: 'Custom Perfection',
    description: 'Weight, grip, balance, design - personalize every detail to match your playing style.',
    detail: 'Unlimited Customization',
    size: 'normal',
    position: 'middle',
  },
  {
    icon: Truck,
    title: 'Secure Delivery',
    description: 'Protected shipping with real-time tracking. Your bat arrives match-ready.',
    detail: 'Free Nationwide Shipping',
    size: 'normal',
    position: 'bottom',
  },
  {
    icon: Zap,
    title: 'Performance Tested',
    description: 'Each bat undergoes rigorous quality checks. Maximum power, perfect balance.',
    detail: 'Pro-Grade Standards',
    size: 'normal',
    position: 'top',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-32 bg-whites-500 relative overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 2px,
            rgba(139, 69, 19, 0.1) 4px
          )`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Left Aligned, Not Centered */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-2xl"
        >
          <div className="inline-block bg-leather-500 text-whites-500 px-4 py-2 text-sm font-bold tracking-wider uppercase mb-4">
            Why SRM Bats
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-carbon-500 mb-4">
            Crafted with
            <span className="block text-willow-500">Precision & Passion</span>
          </h2>
          <p className="text-xl text-carbon-400 leading-relaxed">
            Every detail matters. From wood selection to final polish, we obsess over quality.
          </p>
        </motion.div>

        {/* Staggered Grid - Breaking Traditional Layout */}
        <div className="grid grid-cols-12 gap-6 relative">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === 'large'

            // Staggered positioning
            const getGridPosition = () => {
              if (index === 0) return 'col-span-12 md:col-span-6 lg:col-span-7 row-span-2' // Large dominant card
              if (index === 1) return 'col-span-12 md:col-span-6 lg:col-span-5 md:translate-y-12'
              if (index === 2) return 'col-span-12 md:col-span-6 lg:col-span-5 md:-translate-y-8'
              if (index === 3) return 'col-span-12 md:col-span-6 lg:col-span-7'
              return 'col-span-12 md:col-span-6'
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${getGridPosition()} group relative`}
              >
                <div
                  className={`
                    bg-white border-2 border-carbon-200 p-8
                    transition-all duration-300
                    hover:border-willow-500 hover:shadow-2xl
                    hover:-translate-y-2
                    relative overflow-hidden
                    ${isLarge ? 'lg:p-12 min-h-[400px]' : 'min-h-[280px]'}
                  `}
                >
                  {/* Leather texture on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        rgba(165, 42, 42, 0.3) 2px,
                        rgba(165, 42, 42, 0.3) 4px
                      )`,
                    }}
                  />

                  {/* Icon - Different sizes */}
                  <div className="relative z-10">
                    <div
                      className={`
                        bg-willow-500 text-whites-500 inline-flex items-center justify-center mb-6
                        transition-transform duration-300 group-hover:scale-110
                        ${isLarge ? 'w-20 h-20' : 'w-16 h-16'}
                      `}
                    >
                      <Icon className={isLarge ? 'h-10 w-10' : 'h-8 w-8'} />
                    </div>

                    {/* Detail Badge */}
                    <div className="inline-block bg-field-500 text-whites-500 px-3 py-1 text-xs font-bold tracking-wider uppercase mb-4">
                      {feature.detail}
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-carbon-500 mb-4 ${isLarge ? 'text-3xl' : 'text-2xl'}`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-carbon-400 leading-relaxed ${isLarge ? 'text-lg' : 'text-base'}`}>
                      {feature.description}
                    </p>

                    {/* Hover reveal - Craftsmanship detail */}
                    {isLarge && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-carbon-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="text-sm text-carbon-400 mb-1">Wood Selection</div>
                            <div className="h-2 bg-carbon-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '95%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-willow-500"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-carbon-400 mb-1">Balance</div>
                            <div className="h-2 bg-carbon-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '98%' }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="h-full bg-willow-500"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Corner accent - breaks container */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-leather-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Breaking container boundary - Extended element */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 lg:ml-auto lg:mr-[-100px] max-w-2xl bg-carbon-500 text-whites-500 p-8 lg:p-12"
        >
          <div className="flex items-start space-x-6">
            <div className="text-6xl font-bold text-leather-500 font-mono">20+</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Years of Expertise</h4>
              <p className="text-whites-400 leading-relaxed">
                Our master craftsmen have dedicated their lives to perfecting the art of bat making.
                Every curve, every grain, every detail is carefully considered.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
