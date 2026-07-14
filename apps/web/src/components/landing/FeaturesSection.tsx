'use client';

import { motion } from 'framer-motion';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { Award, Users, Wrench } from 'lucide-react';

const features = [
  {
    icon: Award,
    label: 'Premium Willow',
    title: 'Hand-Selected Grade 1 English Willow',
    description:
      'Each bat begins with carefully selected willow, graded for grain count and quality. Our craftsmen inspect every cleft personally.',
    link: 'Learn about willow grading',
    color: '#8B7355',
  },
  {
    icon: Users,
    label: 'Expert Coaching',
    title: 'Learn from the Masters',
    description:
      'Former international players guide you through technique refinement and match strategy with personalized coaching sessions.',
    link: 'View coaching programs',
    color: '#7C8B7E',
  },
  {
    icon: Wrench,
    label: 'Custom Fitting',
    title: 'Your Perfect Bat',
    description:
      'Weight, balance, grip thickness—we help you find the exact specifications for your playing style and technique.',
    link: 'Start fitting guide',
    color: '#B8956A',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-32 lg:py-40 bg-white relative overflow-hidden">
      {/* Subtle background texture */}
      {/* Texture overlay removed - caused build error */}

      <div className="container relative mx-auto px-8 lg:px-20">
        {/* Section Header */}
        <ScrollAnimationWrapper className="max-w-2xl mb-20">
          <p className="text-[15px] uppercase tracking-[0.1em] text-[#8B7355] font-medium mb-4">
            The SRM Difference
          </p>
          <h2 className="font-crimson text-[42px] lg:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#2A2825]">
            Craftsmanship Meets Performance
          </h2>
        </ScrollAnimationWrapper>

        {/* Features Grid - Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="group relative bg-[#FAF8F5] rounded-lg p-10 h-full"
                style={{
                  border: '1px solid rgba(139, 115, 85, 0.12)',
                  boxShadow: '0 8px 32px rgba(58, 57, 53, 0.06)',
                }}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${feature.color}15`,
                  }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: feature.color }}
                  />
                </motion.div>

                {/* Label */}
                <p
                  className="text-[13px] uppercase tracking-[0.08em] font-medium mb-3"
                  style={{ color: feature.color }}
                >
                  {feature.label}
                </p>

                {/* Title */}
                <h3 className="font-crimson text-[28px] font-semibold text-[#2A2825] mb-4 leading-[1.3]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.6] text-[#5A5753] mb-6">
                  {feature.description}
                </p>

                {/* Link */}
                <motion.a
                  href="#"
                  className="inline-flex items-center gap-2 text-[15px] font-medium group-hover:gap-3 transition-all"
                  style={{ color: feature.color }}
                >
                  <span>{feature.link}</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.a>

                {/* Hover Effect Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    boxShadow: '0 20px 60px rgba(58, 57, 53, 0.12)',
                  }}
                />
              </motion.div>
            </ScrollAnimationWrapper>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <ScrollAnimationWrapper delay={0.4} className="mt-24 text-center">
          <div className="inline-flex items-center gap-4">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#8B7355]/30" />
            <p className="text-[14px] text-[#8B8781] italic">
              Over 125 years of excellence
            </p>
            <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#8B7355]/30" />
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
