/**
 * The Grain Visualizer Component
 * Unique cricket-specific feature: Educational willow grain showcase
 * Teaches buyers about willow grading through macro photography
 */

import { Card } from '@/components/ui/card'

interface GrainGrade {
  grade: string
  grainCount: string
  priceRange: string
  description: string
}

const grainGrades: GrainGrade[] = [
  {
    grade: 'Grade 1',
    grainCount: '6-8 grains',
    priceRange: '£450+',
    description: 'Premium English Willow with straight, evenly-spaced grains. Maximum performance and aesthetics.',
  },
  {
    grade: 'Grade 2',
    grainCount: '5-6 grains',
    priceRange: '£280-£450',
    description: 'High-quality willow with minor cosmetic variations. Excellent performance characteristics.',
  },
  {
    grade: 'Grade 3',
    grainCount: '4-5 grains',
    priceRange: '£150-£280',
    description: 'Quality Kashmir Willow. Ideal for club-level play and practice sessions.',
  },
]

export function GrainVisualizer() {
  return (
    <section className="section-spacing bg-muted">
      <div className="container-premium">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-label text-primary mb-4">WILLOW EDUCATION</p>
          <h2 className="text-display-lg font-semibold mb-6">
            Understand your willow
          </h2>
          <p className="text-body text-muted-foreground">
            The grain pattern reveals the quality and performance characteristics of each bat.
            Learn what makes premium willow exceptional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {grainGrades.map((grade, index) => (
            <Card
              key={grade.grade}
              className="overflow-hidden bg-background hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            >
              {/* Macro photography placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/10 relative overflow-hidden">
                {/* Simulated grain lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-3 w-full px-8">
                    {Array.from({ length: parseInt(grade.grainCount) }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1 bg-primary/30 rounded-full transform group-hover:scale-105 transition-transform"
                        style={{ width: `${80 + Math.random() * 20}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                  <p className="text-label text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW DETAILS
                  </p>
                </div>
              </div>

              {/* Grade information */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-display-sm font-semibold">{grade.grade}</h3>
                  <span className="text-label text-primary">{grade.grainCount}</span>
                </div>
                <p className="text-body text-muted-foreground">{grade.description}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-small font-medium text-foreground">{grade.priceRange}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="text-primary font-medium hover:underline inline-flex items-center gap-2"
          >
            Learn more about willow grading
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
          </a>
        </div>
      </div>
    </section>
  )
}
