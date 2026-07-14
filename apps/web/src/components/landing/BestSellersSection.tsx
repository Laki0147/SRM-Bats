'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import Link from 'next/link';

interface BatProduct {
  id: string;
  slug: string;
  name: string;
  grade: string;
  size: string;
  spot: string;
  price: number;
  rating: number;
  fill: string;
  sideFill: string;
  label: string;
}

const products: BatProduct[] = [
  { id: '1', name: 'The Sovereign',   grade: 'Grade 1 Willow', size: 'Full Size',    spot: 'Full Bow',     price: 28500, rating: 5, fill: '#d2ae72', sideFill: '#aa8848', label: 'SOV'   , slug: 'the-sovereign'  },
  { id: '2', name: 'The Artisan',     grade: 'Grade 2 Willow', size: 'Full Size',    spot: 'Mid Bow',      price: 19500, rating: 4, fill: '#c8a060', sideFill: '#a08040', label: 'ART'   , slug: 'the-artisan'    },
  { id: '3', name: 'The Pioneer',     grade: 'Grade 1 Willow', size: 'Full Size',    spot: 'High Mid Bow', price: 31000, rating: 5, fill: '#dfc07a', sideFill: '#b09050', label: 'PIO'   , slug: 'the-pioneer'   },
  { id: '4', name: 'The Heritage',    grade: 'Grade 1 Willow', size: 'Full Size',    spot: 'Low Mid Bow',  price: 24000, rating: 4, fill: '#e0c880', sideFill: '#c0a050', label: 'HER'   , slug: 'the-heritage'  },
  { id: '5', name: 'The Maestro',     grade: 'Grade 1 Willow', size: 'Full Size',    spot: 'Full Bow',     price: 38000, rating: 5, fill: '#d4b870', sideFill: '#b09040', label: 'MAE'   , slug: 'the-maestro'   },
];

function MiniProductSVG({ fill, sideFill, label }: { fill: string; sideFill: string; label: string }) {
  return (
    <svg width="76" height="190" viewBox="0 0 76 190" fill="none" className="drop-shadow-lg">
      <rect x="16" y="4" width="44" height="136" rx="8" fill={fill} />
      <rect x="16" y="4" width="7" height="136" rx="4" fill={sideFill} />
      <rect x="53" y="4" width="7" height="136" rx="4" fill={sideFill} />
      <rect x="20" y="46" width="36" height="46" rx="5" fill="#1e140c" opacity=".9" />
      <text x="38" y="66" textAnchor="middle" fontSize="8" fontWeight="900" fill="#c4956a" fontFamily="Georgia,serif" letterSpacing="1">SRM</text>
      <text x="38" y="80" textAnchor="middle" fontSize="5" fill="#4a3020" fontFamily="sans-serif" letterSpacing="1.5">{label}</text>
      <rect x="27" y="140" width="22" height="9" rx="3" fill="#987040" />
      <rect x="31" y="148" width="14" height="34" rx="3" fill="#2c1f14" />
      <ellipse cx="38" cy="184" rx="8" ry="4" fill="#1e140c" />
    </svg>
  );
}

function ProductCard({ product }: { product: BatProduct }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await new Promise(r => setTimeout(r, 500));
    setAdding(false);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block">
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(44,31,20,.14)' }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[18px] overflow-hidden border cursor-pointer"
      style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.1)' }}
    >
      {/* Image */}
      <div className="relative h-[188px] flex items-center justify-center" style={{ background: '#f2ebe0' }}>
        <MiniProductSVG fill={product.fill} sideFill={product.sideFill} label={product.label} />
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(242,235,224,.9)' }}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#6b6358]'}`} />
        </button>
      </div>

      {/* Body */}
      <div className="p-[14px] pb-[18px]">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#a09588] opacity-35'}`} />
          ))}
        </div>
        <h3 className="font-display text-[17px] font-bold mb-2 leading-[1.2]" style={{ color: '#2c1f14' }}>{product.name}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {[product.grade, product.size, product.spot].map(tag => (
            <span key={tag} className="font-body text-[10px] font-medium px-[9px] py-[3px] rounded-full" style={{ background: 'rgba(139,94,60,.08)', color: '#5c3d2e' }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-[16px] font-semibold" style={{ color: '#2c1f14', letterSpacing: '-.5px' }}>
            <span className="font-body text-[12px] font-medium" style={{ color: '#6b6358' }}>₹</span>
            {product.price.toLocaleString('en-IN')}
          </div>
          <button
            onClick={handleCart}
            disabled={adding}
            aria-label="Add to cart"
          className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-200 disabled:opacity-60"
            style={{ background: adding ? '#5c3d2e' : '#8b5e3c' }}
            onMouseEnter={e => !adding && (e.currentTarget.style.background = '#5c3d2e')}
            onMouseLeave={e => !adding && (e.currentTarget.style.background = '#8b5e3c')}
          >
            <ShoppingBag className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

export function BestSellersSection() {
  return (
    <section className="py-20 px-6 lg:px-[52px]" style={{ background: '#faf6f0' }}>
      <div className="flex items-end justify-between mb-9">
        <div>
          <small className="font-sc block text-[11px] font-semibold tracking-[4px] uppercase mb-[6px]" style={{ color: '#8b5e3c', fontVariant: 'small-caps' }}>
            Top Picks
          </small>
          <h2 className="font-display text-[34px] font-bold" style={{ color: '#2c1f14', letterSpacing: '-.3px' }}>
            Best Sellers
          </h2>
        </div>
        <Link href="/products" className="font-body text-[12px] font-semibold flex items-center gap-[5px]" style={{ color: '#8b5e3c' }}>
          View All Products →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((p, i) => (
          <ScrollAnimationWrapper key={p.id} delay={i * 0.07}>
            <ProductCard product={p} />
          </ScrollAnimationWrapper>
        ))}
      </div>
    </section>
  );
}
