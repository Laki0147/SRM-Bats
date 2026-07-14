'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Truck, Award } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Premium Quality',
    description: 'Handcrafted from the finest English and Kashmir willow for superior performance.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Shield,
    title: 'Custom Design',
    description: 'Personalize every detail - weight, grip, design, and branding to match your style.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Fast and secure delivery to your doorstep with tracking on all orders.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Award,
    title: 'Expert Craftsmanship',
    description: '20+ years of experience crafting bats for professionals and enthusiasts.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
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
            Why Choose <span className="gradient-text">SRM Bats</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine traditional craftsmanship with modern technology to create the perfect bat for you.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all hover-lift">
                  <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
