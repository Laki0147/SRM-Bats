/**
 * Heritage Banner Component
 * Subtle "Since 1850" branding element
 * Premium signal through heritage storytelling
 */

import Link from 'next/link'

export function HeritageBanner() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container-premium">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label text-primary-foreground/80 mb-4">OUR HERITAGE</p>
            <h2 className="text-display-lg font-semibold mb-6">
              175 years of craftsmanship
            </h2>
            <p className="text-body text-primary-foreground/90 mb-8">
              Since 1850, SRM has been crafting cricket bats in Kashmir, passing down
              techniques through generations of master craftsmen. Each bat carries this legacy.
            </p>
            <Link
              href="/stories/heritage"
              className="inline-flex items-center gap-2 text-primary-foreground font-medium hover:underline"
            >
              Explore our story
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Timeline visualization */}
          <div className="relative">
            <div className="space-y-8">
              {[
                { year: '1850', event: 'SRM Founded in Kashmir' },
                { year: '1920', event: 'Spring handle innovation' },
                { year: '1975', event: 'International expansion' },
                { year: '2026', event: 'Modern craftsmanship meets tradition' },
              ].map((milestone, index) => (
                <div key={milestone.year} className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
                      <span className="text-small font-semibold">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-body text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
                      {milestone.event}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-primary-foreground/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
