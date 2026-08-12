'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface PremiumProductCardProps {
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

const PremiumProductCard = ({
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
}: PremiumProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <motion.div
      className="group relative bg-gradient-to-br from-[#fdfcfa] to-[#f9f7f4] rounded-[24px] overflow-hidden border border-[rgba(0,0,0,0.06)] hover:border-[#d4a574]/30 transition-all duration-400 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)]"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#f9f7f4] to-[#f3efe8] rounded-t-[24px]">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3efe8] via-[#ebe5dc] to-[#f3efe8] animate-shimmer" />
        )}

        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#b38585] to-[#9c6b6b] text-[#fdfcfa] text-xs font-semibold rounded-[8px] shadow-[0_4px_12px_rgba(179,133,133,0.30)] backdrop-blur-sm">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#7a9f7a] to-[#5a7f5a] text-[#fdfcfa] text-xs font-semibold rounded-[8px] shadow-[0_4px_12px_rgba(122,159,122,0.30)] backdrop-blur-sm">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 w-10 h-10 bg-[#fdfcfa]/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#fdfcfa] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-110 border border-[rgba(0,0,0,0.06)]"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isWishlisted ? 'fill-[#b38585] text-[#b38585]' : 'text-[#78716c]'
            }`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#292524]/80 via-[#292524]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 backdrop-blur-sm">
          <button
            className="w-full py-3 bg-[#fdfcfa] text-[#292524] font-semibold rounded-[12px] hover:bg-gradient-to-r hover:from-[#d4a574] hover:to-[#c4ad8a] hover:text-[#fdfcfa] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-[#292524]/60 backdrop-blur-sm flex items-center justify-center">
            <div className="px-4 py-2 bg-[#fdfcfa] rounded-[10px] text-sm font-semibold text-[#292524] shadow-[0_4px_12px_rgba(0,0,0,0.20)]">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="text-xs font-semibold text-[#d4a574] uppercase tracking-wider mb-2">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#292524] mb-2 line-clamp-2 leading-snug">
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
                    ? 'fill-[#d4a574] text-[#d4a574]'
                    : 'text-[#e8dcc8]'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-[#78716c]">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-[#d4a574] to-[#c4ad8a] bg-clip-text text-transparent">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-[#a8a29e] line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PremiumProductCard
