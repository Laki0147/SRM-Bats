'use client';

import { motion } from 'framer-motion';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The craftsmanship is extraordinary. You can feel the quality in every stroke. This bat has transformed my game.',
    author: 'James Richardson',
    role: 'County Cricket Player',
    location: 'Yorkshire, England',
  },
  {
    quote:
      'After 30 years of cricket, I can honestly say this is the finest bat I have ever used. The balance is perfection.',
    author: 'Rajesh Kumar',
    role: 'Club Captain',
    location: 'Mumbai, India',
  },
  {
    quote:
      'The attention to detail is remarkable. From the grain selection to the finishing, everything speaks of true mastery.',
    author: 'Michael Chen',
    role: 'Cricket Coach',
    location: 'Melbourne, Australia',
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-32 lg:py-40">
      {/* Paper texture */}
      {/* Texture overlay removed - caused build error */}

      <div className="container relative mx-auto px-8 lg:px-20">
        {/* Section Header */}
        <ScrollAnimationWrapper className="mx-auto mb-20 max-w-3xl text-center">
          <p className="mb-4 text-[15px] font-medium uppercase tracking-[0.1em] text-[#8B7355]">
            Testimonials
          </p>
          <h2 className="font-crimson text-[42px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#2A2825] lg:text-[48px]">
            Trusted by Players Worldwide
          </h2>
        </ScrollAnimationWrapper>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="group relative flex h-full flex-col rounded-lg bg-[#FAF8F5] p-8 lg:p-10"
                style={{
                  border: '1px solid rgba(139, 115, 85, 0.08)',
                  boxShadow: '0 8px 32px rgba(58, 57, 53, 0.06)',
                }}
              >
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.15 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-6 top-6"
                >
                  <Quote className="h-16 w-16 text-[#8B7355]" />
                </motion.div>

                {/* Quote Text */}
                <blockquote className="font-crimson relative z-10 mb-8 flex-1 text-[20px] italic leading-[1.6] text-[#2A2825] lg:text-[22px]">
                  “{testimonial.quote}”
                </blockquote>

                {/* Author Info */}
                <div className="relative z-10 flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#B8956A] to-[#8B7355] text-lg font-semibold text-white">
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div>
                    <p className="mb-1 text-[16px] font-semibold text-[#2A2825]">
                      {testimonial.author}
                    </p>
                    <p className="text-[14px] text-[#8B8781]">{testimonial.role}</p>
                    <p className="text-[13px] text-[#8B8781]">{testimonial.location}</p>
                  </div>
                </div>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent" />

                {/* Hover Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: '0 20px 60px rgba(58, 57, 53, 0.12)',
                  }}
                />
              </motion.div>
            </ScrollAnimationWrapper>
          ))}
        </div>

        {/* Stats Bar */}
        <ScrollAnimationWrapper delay={0.3} className="mt-20">
          <div className="grid grid-cols-2 gap-8 border-b border-t border-[#E8E3DB] py-12 md:grid-cols-4 lg:gap-12">
            {[
              { number: '125+', label: 'Years of Heritage' },
              { number: '50,000+', label: 'Bats Crafted' },
              { number: '4.9/5', label: 'Customer Rating' },
              { number: '95%', label: 'Repeat Customers' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-stat mb-2 text-[42px] font-semibold text-[#8B7355] lg:text-[48px]">
                  {stat.number}
                </p>
                <p className="text-[14px] uppercase tracking-wider text-[#8B8781]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
