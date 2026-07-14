'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ShoppingCart, Heart, Star, Minus, Plus, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/app/products/page'

interface ProductQuickViewProps {
  product: Product
  onClose: () => void
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsAddingToCart(false)
    // Show success and close
    setTimeout(onClose, 1000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto',
            'rounded-2xl bg-white shadow-2xl',
            'animate-slide-up'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-carbon-500" />
          </button>

          <div className="grid gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
            {/* Image Section */}
            <div className="relative">
              <div className="sticky top-0">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-whites-100">
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br from-willow-100 to-whites-100 shimmer',
                      imageLoaded && 'opacity-0'
                    )}
                  />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={cn(
                      'object-cover transition-opacity duration-700',
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setImageLoaded(true)}
                  />

                  {/* Badges */}
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-leather-500 text-white shadow-lg">
                        Featured
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="bg-field-500 text-white shadow-lg">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>

                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <Badge variant="outline" className="bg-white text-carbon-500">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              {/* Brand */}
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-willow-600">
                {product.brand}
              </p>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-bold text-carbon-500 md:text-3xl">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-carbon-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-carbon-500">
                  {product.rating}
                </span>
                <span className="text-sm text-carbon-400">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-willow-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-carbon-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-field-500 text-white">
                      Save $
                      {(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="mb-6 text-carbon-500 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-field-500" />
                    <span className="font-medium text-field-600">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-leather-500" />
                    <span className="font-medium text-leather-600">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-carbon-500">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border-2 border-willow-200">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-3 transition-colors hover:bg-willow-50 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4 text-carbon-500" />
                      </button>
                      <span className="min-w-[3rem] text-center text-lg font-semibold text-carbon-500">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 transition-colors hover:bg-willow-50"
                      >
                        <Plus className="h-4 w-4 text-carbon-500" />
                      </button>
                    </div>
                    <span className="text-sm text-carbon-400">
                      ${(product.price * quantity).toFixed(2)} total
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={cn(
                    'flex-1 gap-2 rounded-xl py-6 text-base',
                    isAddingToCart && 'animate-pulse'
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isAddingToCart
                    ? 'Adding...'
                    : product.inStock
                      ? 'Add to Cart'
                      : 'Out of Stock'}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="h-auto rounded-xl border-2 p-4"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-all',
                      isWishlisted
                        ? 'fill-leather-500 text-leather-500'
                        : 'text-carbon-400'
                    )}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-auto rounded-xl border-2 p-4"
                >
                  <Share2 className="h-5 w-5 text-carbon-400" />
                </Button>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-2 rounded-xl bg-whites-50 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-carbon-500">
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm text-carbon-500">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-willow-500" />
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-willow-500" />
                    <span>Professional-grade performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-willow-500" />
                    <span>Tested by cricket professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-willow-500" />
                    <span>1-year warranty included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
