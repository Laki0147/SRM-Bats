'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// Renders the home in the active design variant. `heritage` is the original
// composition (unchanged); `atelier` is the new editorial look. The switch is
// driven by the global VariantSwitcher via the design-variant context.
import { useDesignVariant } from '@/lib/design-variant';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CollectionsSection } from '@/components/landing/CollectionsSection';
import { BestSellersSection } from '@/components/landing/BestSellersSection';
import { CraftSection } from '@/components/landing/CraftSection';
import { ReviewsSection } from '@/components/landing/ReviewsSection';
import { NewsletterSection } from '@/components/landing/NewsletterSection';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { AtelierHome } from '@/components/v2/AtelierHome';

export function HomeExperience() {
  const { variant } = useDesignVariant();

  if (variant === 'atelier') return <AtelierHome />;

  return (
    <div className="min-h-screen" style={{ background: '#2c1f14' }}>
      <SiteNavbar activePath="/" />
      <main>
        <HeroSection />
        <CollectionsSection />
        <BestSellersSection />
        <CraftSection />
        <ReviewsSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  );
}
