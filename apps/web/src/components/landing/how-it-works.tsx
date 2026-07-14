'use client'

import { motion } from 'framer-motion'
import { Search, Palette, ShoppingBag, Truck } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse & Select',
    description: 'Explore our collection of premium cricket bats from top brands.',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: Palette,
    title: 'Customize',
    description: 'Personalize your bat with custom weight, grip, and design options.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: ShoppingBag,
    title: 'Order',
    description: 'Complete your purchase with secure payment and get instant confirmation.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: Truck,
    title: 'Receive',
    description: 'Get your custom bat delivered to your doorstep with tracking.',
    color: 'from-red-400 to-red-600',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your perfect cricket bat in 4 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-blue-400 via-purple-400 to-red-400 opacity-30" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover-lift relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
