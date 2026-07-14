'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Filters {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
}

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const CATEGORIES = [
  { id: 'bats', label: 'Cricket Bats', count: 24 },
  { id: 'balls', label: 'Cricket Balls', count: 18 },
  { id: 'protection', label: 'Protection Gear', count: 32 },
  { id: 'clothing', label: 'Cricket Clothing', count: 45 },
  { id: 'accessories', label: 'Accessories', count: 28 },
]

const BRANDS = [
  { id: 'SRM', label: 'SRM', count: 42 },
  { id: 'SRM Pro', label: 'SRM Pro', count: 28 },
  { id: 'SRM Elite', label: 'SRM Elite', count: 18 },
  { id: 'SRM Youth', label: 'SRM Youth', count: 15 },
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-willow-200 pb-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-carbon-500">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-carbon-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-carbon-400" />
        )}
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  )
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleBrandToggle = (brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter((b) => b !== brandId)
      : [...filters.brands, brandId]
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  return (
    <div className="space-y-6 rounded-xl border border-willow-200 bg-white p-6 shadow-sm">
      {/* Categories */}
      <FilterSection title="Categories">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                className="border-willow-300 data-[state=checked]:bg-willow-600"
              />
              <label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer text-sm text-carbon-500 hover:text-willow-600"
              >
                {category.label}
              </label>
            </div>
            <span className="text-xs text-carbon-400">{category.count}</span>
          </div>
        ))}
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        {BRANDS.map((brand) => (
          <div key={brand.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={filters.brands.includes(brand.id)}
                onCheckedChange={() => handleBrandToggle(brand.id)}
                className="border-willow-300 data-[state=checked]:bg-willow-600"
              />
              <label
                htmlFor={`brand-${brand.id}`}
                className="cursor-pointer text-sm text-carbon-500 hover:text-willow-600"
              >
                {brand.label}
              </label>
            </div>
            <span className="text-xs text-carbon-400">{brand.count}</span>
          </div>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4">
          <Slider
            min={0}
            max={500}
            step={10}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="[&_[role=slider]]:bg-willow-600 [&_[role=slider]]:border-willow-600"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-carbon-500">
              ${filters.priceRange[0]}
            </span>
            <span className="text-carbon-400">to</span>
            <span className="font-medium text-carbon-500">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, inStock: checked as boolean })
            }
            className="border-willow-300 data-[state=checked]:bg-willow-600"
          />
          <label
            htmlFor="in-stock"
            className="cursor-pointer text-sm text-carbon-500 hover:text-willow-600"
          >
            In Stock Only
          </label>
        </div>
      </FilterSection>
    </div>
  )
}
