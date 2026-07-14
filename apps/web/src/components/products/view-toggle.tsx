'use client'

import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-xl border-2 border-willow-200 bg-white p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          'gap-2 rounded-lg transition-all',
          view === 'grid'
            ? 'bg-willow-100 text-willow-700 hover:bg-willow-100 hover:text-willow-700'
            : 'text-carbon-400 hover:text-carbon-600'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          'gap-2 rounded-lg transition-all',
          view === 'list'
            ? 'bg-willow-100 text-willow-700 hover:bg-willow-100 hover:text-willow-700'
            : 'text-carbon-400 hover:text-carbon-600'
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  )
}
