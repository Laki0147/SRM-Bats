'use client'

import ModernProductCard from './ModernProductCard'

interface Product {
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

interface ModernProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
}

const ModernProductGrid = ({ products, title, subtitle }: ModernProductGridProps) => {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {subtitle && (
              <p className="text-cricket-green font-semibold mb-2">{subtitle}</p>
            )}
            {title && (
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ModernProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModernProductGrid
