'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface ModernProductCardProps {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  inStock?: boolean
}

const ModernProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  inStock = true,
}: ModernProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-300"
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        )}

        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-leather-red text-white text-xs font-semibold rounded-lg shadow-lg">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-field-green text-white text-xs font-semibold rounded-lg shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? 'fill-leather-red text-leather-red' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-full py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-cricket-green hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-gray-900">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-willow-gold text-willow-gold'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ModernProductCard
