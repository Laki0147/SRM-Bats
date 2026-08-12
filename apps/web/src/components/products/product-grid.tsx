'use client'

import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'
import type { Product } from '@/app/products/page'

interface ProductGridProps {
  products: Product[]
  view: 'grid' | 'list'
  onQuickView?: (product: Product) => void
}

export function ProductGrid({ products, view, onQuickView }: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        view === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1'
      )}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both',
          }}
        >
          <ProductCard
            product={product}
            view={view}
            onQuickView={onQuickView}
          />
        </div>
      ))}
    </div>
  )
}
