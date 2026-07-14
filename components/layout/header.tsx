import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Header: "The Minimal Expert" Navigation Pattern
 * Inspired by Apple/Rapha - flat hierarchy, no dropdowns
 * 4 main sections: Bats, Accessories, Craft, Stories
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
      <div className="container-premium flex h-20 items-center justify-between">
        {/* Logo: Cricket bat silhouette + Typography */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Placeholder for cricket bat icon/silhouette */}
            <div className="w-8 h-8 bg-primary rounded-sm transform rotate-45 transition-transform group-hover:rotate-[50deg]" />
            <div>
              <span className="text-xl font-semibold text-foreground tracking-tight">SRM BATS</span>
              <span className="block text-micro text-muted-foreground">Since 1850</span>
            </div>
          </Link>

          {/* Flat navigation - no dropdowns */}
          <nav className="hidden md:flex gap-8">
            <Link
              href="/bats"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Bats
            </Link>
            <Link
              href="/accessories"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Accessories
            </Link>
            <Link
              href="/craft"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Craft
            </Link>
            <Link
              href="/stories"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Stories
            </Link>
          </nav>
        </div>

        {/* Right utilities - minimal */}
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hidden md:block">
            Search
          </button>
          <Link href="/auth/login" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/cart">
            <Button size="sm" variant="ghost" className="relative">
              Cart
              {/* Cart count badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-micro rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
