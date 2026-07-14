'use client';

import { PremiumHeader } from '@/components/landing/PremiumHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { PremiumFooter } from '@/components/landing/PremiumFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <PremiumHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductShowcase />
        <TestimonialsSection />
        <CTASection />
      </main>
      <PremiumFooter />
    </div>
  );
}
