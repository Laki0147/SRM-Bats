import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ProductsGrid } from '@/components/product/ProductsGrid';

export default function ProductsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar activePath="/products" />
      <main>
        {/* Hero band */}
        <div className="py-16 px-6 text-center" style={{ background: '#2c1f14' }}>
          <span className="block font-sc text-[11px] tracking-[4px] uppercase mb-3" style={{ color: '#c4956a', fontVariant: 'small-caps' }}>
            Our Collection
          </span>
          <h1 className="font-display text-[42px] lg:text-[56px] font-bold mb-4" style={{ color: '#f2ebe0', letterSpacing: '-1px' }}>
            All Cricket Bats
          </h1>
          <p className="font-body text-[14px] max-w-[480px] mx-auto" style={{ color: '#a09588' }}>
            Every bat is individually handcrafted from premium English Willow. No two are exactly alike.
          </p>
        </div>
        <ProductsGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
