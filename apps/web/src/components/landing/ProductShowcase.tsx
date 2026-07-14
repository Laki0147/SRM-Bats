'use client';

import { motion } from 'framer-motion';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { Star } from 'lucide-react';

const products = [
  {
    collection: 'Heritage Collection',
    model: 'Master Craftsman Pro',
    description:
      'Grade 1 English willow with 9-12 straight grains. Perfect balance for aggressive stroke play.',
    price: '£495',
    weight: '2lb 8oz - 2lb 10oz',
    profile: 'Mid-High',
    rating: 5,
  },
  {
    collection: 'Professional Series',
    model: 'Tournament Elite',
    description:
      'Competition-grade willow selected for international standards. Exceptional ping and durability.',
    price: '£395',
    weight: '2lb 9oz - 2lb 11oz',
    profile: 'Mid',
    rating: 5,
  },
  {
    collection: 'Classic Range',
    model: 'County Champion',
    description:
      'Premium Kashmir willow with traditional shape. Ideal for club cricket and serious amateurs.',
    price: '£245',
    weight: '2lb 7oz - 2lb 9oz',
    profile: 'Mid-Low',
    rating: 4,
  },
];

export function ProductShowcase() {
  return (
    <section className="py-32 lg:py-40 bg-[#F8F6F1] relative overflow-hidden">
      {/* Canvas texture */}
      {/* Texture overlay removed - caused build error */}

      <div className="container relative mx-auto px-8 lg:px-20">
        {/* Section Header */}
        <ScrollAnimationWrapper className="max-w-3xl mb-20">
          <p className="text-[15px] uppercase tracking-[0.1em] text-[#8B7355] font-medium mb-4">
            Our Collections
          </p>
          <h2 className="font-crimson text-[42px] lg:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#2A2825] mb-6">
            Bats That Define Excellence
          </h2>
          <p className="text-[18px] leading-[1.7] text-[#5A5753]">
            Every bat in our collection represents the pinnacle of traditional
            craftsmanship, built to perform at the highest level.
          </p>
        </ScrollAnimationWrapper>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {products.map((product, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="group bg-[#FAF8F5] rounded-lg overflow-hidden h-full flex flex-col"
                style={{
                  border: '1px solid rgba(139, 115, 85, 0.12)',
                  boxShadow: '0 8px 32px rgba(58, 57, 53, 0.06)',
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-[#E8E3DB] to-[#F8F6F1] overflow-hidden">
                  {/* Workshop background */}
                  <div className="absolute inset-0 bg-[url('/images/workshop-texture.jpg')] bg-cover bg-center opacity-10" />

                  {/* Bat placeholder */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="relative w-full h-full flex items-center justify-center p-8"
                  >
                    <div className="w-24 h-full bg-gradient-to-b from-[#B8956A] to-[#8B7355] rounded-full opacity-20" />
                  </motion.div>

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-[#2A2825]/60 via-transparent to-transparent flex items-end justify-center pb-8"
                  >
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="px-6 py-3 bg-white text-[#2A2825] text-[14px] font-medium rounded-lg"
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-10 flex-1 flex flex-col">
                  {/* Collection Name */}
                  <p className="text-[13px] uppercase tracking-[0.08em] text-[#8B7355] font-medium mb-3">
                    {product.collection}
                  </p>

                  {/* Model Name */}
                  <h3 className="font-crimson text-[28px] font-semibold text-[#2A2825] mb-3 leading-[1.3]">
                    {product.model}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < product.rating ? '#B8956A' : 'none'}
                        stroke={i < product.rating ? '#B8956A' : '#D1D5DB'}
                      />
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-[15px] leading-[1.6] text-[#5A5753] mb-6 flex-1">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-[#E8E3DB]">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#8B8781]">Weight</span>
                      <span className="text-[#2A2825] font-medium">
                        {product.weight}
                      </span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#8B8781]">Profile</span>
                      <span className="text-[#2A2825] font-medium">
                        {product.profile}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-crimson text-[32px] font-semibold text-[#8B7355]">
                      {product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 border-2 border-[#8B7355] text-[#8B7355] text-[14px] font-medium rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>

                {/* Hover shadow effect */}
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

        {/* View All Button */}
        <ScrollAnimationWrapper delay={0.3} className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-[#8B7355] text-white text-[16px] font-medium rounded-lg"
            style={{
              boxShadow: '0 8px 24px rgba(139, 115, 85, 0.25)',
            }}
          >
            View Full Collection
          </motion.button>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
