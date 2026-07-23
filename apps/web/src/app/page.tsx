import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CollectionsSection } from '@/components/landing/CollectionsSection';
import { BestSellersSection } from '@/components/landing/BestSellersSection';
import { CraftSection } from '@/components/landing/CraftSection';
import { ReviewsSection } from '@/components/landing/ReviewsSection';
import { NewsletterSection } from '@/components/landing/NewsletterSection';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#f2ebe0' }}>
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
