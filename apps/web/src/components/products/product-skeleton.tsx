'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProductSkeletonProps {
  view: 'grid' | 'list'
  count?: number
}

export function ProductSkeleton({ view, count = 6 }: ProductSkeletonProps) {
  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        view === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1'
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} view={view} />
      ))}
    </div>
  )
}

function SkeletonCard({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <Card className="overflow-hidden border-willow-200 bg-white">
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-willow-100 to-whites-100 sm:w-48" />

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
            <div className="space-y-3">
              <div className="h-3 w-20 animate-pulse rounded bg-willow-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-willow-200" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-willow-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-willow-100" />
              </div>
              <div className="h-4 w-32 animate-pulse rounded bg-willow-200" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="h-8 w-24 animate-pulse rounded bg-willow-200" />
              <div className="flex gap-2">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-willow-100" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-willow-200" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-willow-200 bg-white">
      {/* Image skeleton */}
      <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-willow-100 to-whites-100" />

      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-willow-200" />
        <div className="h-5 w-full animate-pulse rounded bg-willow-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-willow-200" />
        <div className="h-7 w-28 animate-pulse rounded bg-willow-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-willow-200" />
      </div>
    </Card>
  )
}
