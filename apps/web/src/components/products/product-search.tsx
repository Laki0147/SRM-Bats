'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
  resultsCount?: number
}

export function ProductSearch({ value, onChange, resultsCount }: ProductSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'relative flex items-center transition-all duration-200',
          isFocused && 'scale-[1.02]'
        )}
      >
        <Search
          className={cn(
            'absolute left-3 h-5 w-5 transition-colors',
            isFocused ? 'text-willow-600' : 'text-carbon-400'
          )}
        />
        <Input
          type="text"
          placeholder="Search products, brands, categories..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'h-12 pl-10 pr-10 text-base',
            'rounded-xl border-2',
            'transition-all duration-200',
            isFocused
              ? 'border-willow-400 shadow-lg ring-4 ring-willow-100'
              : 'border-willow-200',
            'placeholder:text-carbon-300'
          )}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 rounded-full p-1 transition-colors hover:bg-willow-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-carbon-400" />
          </button>
        )}
      </div>

      {/* Results count - show when searching */}
      {value && resultsCount !== undefined && (
        <div className="mt-2 text-sm text-carbon-400">
          {resultsCount === 0
            ? 'No results found'
            : `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} found`}
        </div>
      )}
    </div>
  )
}
