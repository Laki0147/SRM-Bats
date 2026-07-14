'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/app/products/page'

interface ProductCardProps {
  product: Product
  view?: 'grid' | 'list'
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, view = 'grid', onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsAddingToCart(false)
    // Show success feedback
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  if (view === 'list') {
    return (
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          'hover:shadow-xl hover:-translate-y-1',
          'bg-white border-willow-200'
        )}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-whites-100 sm:w-48">
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br from-willow-100 to-whites-100',
                imageLoaded && 'opacity-0'
              )}
            />
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-all duration-700',
                'group-hover:scale-110',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {product.featured && (
              <Badge className="absolute left-3 top-3 bg-leather-500 text-white">
                Featured
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="absolute right-3 top-3 bg-field-500 text-white">
                Sale
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="outline" className="bg-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-willow-600">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-semibold text-carbon-500 line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                <button
                  onClick={handleWishlist}
                  className="rounded-full p-2 transition-colors hover:bg-willow-50"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isWishlisted
                        ? 'fill-leather-500 text-leather-500'
                        : 'text-carbon-300'
                    )}
                  />
                </button>
              </div>

              <p className="mb-3 text-sm text-carbon-400 line-clamp-2">
                {product.description}
              </p>

              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-carbon-500">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-carbon-400">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-willow-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-carbon-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuickView}
                  className="hover:bg-willow-50 hover:text-willow-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={cn(
                    'gap-2',
                    isAddingToCart && 'animate-pulse'
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-2',
        'bg-white border-willow-200 rounded-2xl'
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-whites-100">
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
            'object-cover transition-all duration-700',
            'group-hover:scale-110 group-hover:rotate-2',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-leather-500 text-white shadow-lg">
              Featured
            </Badge>
          )}
          {product.originalPrice && (
            <Badge className="bg-field-500 text-white shadow-lg">
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              )}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm',
            'transition-all duration-300',
            'hover:scale-110 hover:bg-white'
          )}
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-all duration-300',
              isWishlisted
                ? 'scale-110 fill-leather-500 text-leather-500'
                : 'text-carbon-400'
            )}
          />
        </button>

        {/* Quick Actions - Show on Hover */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-3',
            'translate-y-full transition-transform duration-300',
            'group-hover:translate-y-0',
            'bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm'
          )}
        >
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickView}
              className="flex-1 gap-2 border-white/20 bg-white/90 text-carbon-500 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Badge variant="outline" className="bg-white text-carbon-500">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-willow-600">
          {product.brand}
        </p>
        <h3 className="mb-2 text-base font-semibold text-carbon-500 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-carbon-500">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-carbon-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-willow-600">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-carbon-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className={cn(
            'w-full gap-2 rounded-xl',
            isAddingToCart && 'animate-pulse'
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {isAddingToCart ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  )
}
