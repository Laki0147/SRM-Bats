import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GrainVisualizer } from '@/components/cricket/grain-visualizer'
import { HeritageBanner } from '@/components/cricket/heritage-banner'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section: "The Craftsman's Workshop" - Asymmetric, Product-First */}
        <section className="relative min-h-[85vh] bg-muted overflow-hidden">
          {/* Background: Workshop atmosphere (placeholder for authentic photography) */}
          <div className="absolute inset-0 bg-gradient-to-br from-cream/30 to-muted" />

          <div className="container-premium relative z-10 h-full min-h-[85vh] flex items-center">
            <div className="grid md:grid-cols-5 gap-12 items-center w-full">
              {/* Left: Text Content (40% - 2 columns) */}
              <div className="md:col-span-2 space-y-6">
                <p className="text-label text-primary">SINCE 1850</p>
                <h1 className="text-display-xl font-semibold leading-tight">
                  Hand-Crafted English Willow
                </h1>
                <p className="text-body text-muted-foreground">
                  Each bat is a unique masterpiece, shaped by craftsmen who understand the game.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">Explore Collection</Button>
                  <Button size="lg" variant="outline">Our Story</Button>
                </div>
              </div>

              {/* Right: Product Hero (60% - 3 columns) */}
              <div className="md:col-span-3 relative">
                {/* Floating product with depth */}
                <div className="product-float bat-angle">
                  {/* Placeholder: Replace with actual bat photography */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <p className="text-label text-primary">FEATURED BAT IMAGE</p>
                  </div>
                </div>
                {/* Product detail callout */}
                <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur p-6 rounded-lg shadow-lg max-w-xs">
                  <p className="text-label text-primary mb-2">KASHMIR WILLOW PRO</p>
                  <p className="text-small text-muted-foreground">Grade 1 • 2.9-2.11 lbs • Mid Profile</p>
                  <p className="text-display-sm font-semibold mt-2">£189</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section: Staggered, Asymmetric Layout - Breaking the Grid */}
        <section className="section-spacing bg-background">
          <div className="container-premium">
            <div className="max-w-2xl mb-16">
              <p className="text-label text-primary mb-4">THE SRM DIFFERENCE</p>
              <h2 className="text-display-lg font-semibold">
                Craftsmanship meets performance
              </h2>
            </div>

            {/* Asymmetric staggered grid - NOT standard 3-column */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Feature 1: Dominant card (larger) */}
              <div className="md:col-span-7 md:row-span-2">
                <div className="bg-muted rounded-lg overflow-hidden h-full">
                  {/* Placeholder for macro photography of willow grain */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <p className="text-label text-primary">WILLOW GRAIN MACRO</p>
                  </div>
                  <div className="p-8">
                    <p className="text-label text-primary mb-3">PREMIUM WILLOW</p>
                    <h3 className="text-display-md font-semibold mb-4">
                      Hand-selected Grade 1 English Willow
                    </h3>
                    <p className="text-body text-muted-foreground mb-6">
                      Each bat begins with carefully selected willow, graded for grain count and quality. Our craftsmen inspect every cleft personally.
                    </p>
                    <a href="#" className="text-primary font-medium hover:underline">
                      Learn about willow grading →
                    </a>
                  </div>
                </div>
              </div>

              {/* Feature 2: Staggered below */}
              <div className="md:col-span-5">
                <div className="bg-background border border-border rounded-lg p-8 h-full">
                  <p className="text-label text-secondary mb-3">EXPERT COACHING</p>
                  <h3 className="text-display-sm font-semibold mb-4">
                    Learn from the masters
                  </h3>
                  <p className="text-body text-muted-foreground mb-6">
                    Former international players guide you through technique refinement and match strategy.
                  </p>
                  <a href="#" className="text-primary font-medium hover:underline">
                    View coaching programs →
                  </a>
                </div>
              </div>

              {/* Feature 3: Staggered below */}
              <div className="md:col-span-5">
                <div className="bg-cream/50 rounded-lg p-8 h-full">
                  <p className="text-label text-accent mb-3">CUSTOM FITTING</p>
                  <h3 className="text-display-sm font-semibold mb-4">
                    Your perfect bat
                  </h3>
                  <p className="text-body text-muted-foreground mb-6">
                    Weight, balance, grip thickness—we help you find the exact specifications for your playing style.
                  </p>
                  <a href="#" className="text-primary font-medium hover:underline">
                    Start fitting guide →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grain Visualizer: Unique cricket-specific educational feature */}
        <GrainVisualizer />

        {/* Heritage Banner: Storytelling and brand authority */}
        <HeritageBanner />
      </main>
      <Footer />
    </div>
  )
}
