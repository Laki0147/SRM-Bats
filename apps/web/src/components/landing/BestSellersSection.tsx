'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import Link from 'next/link';
import Image from 'next/image';

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
  {
    id: '1',
    name: 'The Sovereign',
    grade: 'Grade 1 Willow',
    size: 'Full Size',
    spot: 'Full Bow',
    price: 28500,
    rating: 5,
    fill: '#d2ae72',
    sideFill: '#aa8848',
    label: 'SOV',
    slug: 'the-sovereign',
  },
  {
    id: '2',
    name: 'The Artisan',
    grade: 'Grade 2 Willow',
    size: 'Full Size',
    spot: 'Mid Bow',
    price: 19500,
    rating: 4,
    fill: '#c8a060',
    sideFill: '#a08040',
    label: 'ART',
    slug: 'the-artisan',
  },
  {
    id: '3',
    name: 'The Pioneer',
    grade: 'Grade 1 Willow',
    size: 'Full Size',
    spot: 'High Mid Bow',
    price: 31000,
    rating: 5,
    fill: '#dfc07a',
    sideFill: '#b09050',
    label: 'PIO',
    slug: 'the-pioneer',
  },
  {
    id: '4',
    name: 'The Heritage',
    grade: 'Grade 1 Willow',
    size: 'Full Size',
    spot: 'Low Mid Bow',
    price: 24000,
    rating: 4,
    fill: '#e0c880',
    sideFill: '#c0a050',
    label: 'HER',
    slug: 'the-heritage',
  },
  {
    id: '5',
    name: 'The Maestro',
    grade: 'Grade 1 Willow',
    size: 'Full Size',
    spot: 'Full Bow',
    price: 38000,
    rating: 5,
    fill: '#d4b870',
    sideFill: '#b09040',
    label: 'MAE',
    slug: 'the-maestro',
  },
];

// Single hero product shot used across all best-seller cards.
const BEST_SELLER_IMAGE = '/bats/main.png';

function ProductCard({ product }: { product: BatProduct }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    setAdding(false);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(44,31,20,.14)' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="cursor-pointer overflow-hidden rounded-[18px] border"
        style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.1)' }}
      >
        {/* Image */}
        <div
          className="relative flex h-[220px] items-center justify-center"
          style={{ background: '#1c120a' }}
        >
          <Image
            src={BEST_SELLER_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 300px"
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition-all"
            style={{ background: 'rgba(242,235,224,.9)' }}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${wishlisted ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#6b6358]'}`}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-[14px] pb-[18px]">
          <div className="mb-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < product.rating ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#a09588] opacity-35'}`}
              />
            ))}
          </div>
          <h3
            className="font-display mb-2 text-[17px] font-bold leading-[1.2]"
            style={{ color: '#2c1f14' }}
          >
            {product.name}
          </h3>
          <div className="mb-3 flex flex-wrap gap-1">
            {[product.grade, product.size, product.spot].map((tag) => (
              <span
                key={tag}
                className="rounded-full px-[9px] py-[3px] font-body text-[10px] font-medium"
                style={{ background: 'rgba(139,94,60,.08)', color: '#5c3d2e' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div
              className="font-mono text-[16px] font-semibold"
              style={{ color: '#2c1f14', letterSpacing: '-.5px' }}
            >
              <span className="font-body text-[12px] font-medium" style={{ color: '#6b6358' }}>
                ₹
              </span>
              {product.price.toLocaleString('en-IN')}
            </div>
            <button
              onClick={(e) => void handleCart(e)}
              disabled={adding}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-all duration-200 disabled:opacity-60"
              style={{ background: adding ? '#5c3d2e' : '#8b5e3c' }}
              onMouseEnter={(e) => !adding && (e.currentTarget.style.background = '#5c3d2e')}
              onMouseLeave={(e) => !adding && (e.currentTarget.style.background = '#8b5e3c')}
            >
              <ShoppingBag className="h-4 w-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function BestSellersSection() {
  return (
    <section className="px-6 py-20 lg:px-[52px]" style={{ background: '#eed3a8' }}>
      <div className="mb-9 flex items-end justify-between">
        <div>
          <small
            className="font-sc mb-[6px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#8b5e3c', fontVariant: 'small-caps' }}
          >
            Top Picks
          </small>
          <h2
            className="font-display text-[34px] font-bold"
            style={{ color: '#2c1f14', letterSpacing: '-.3px' }}
          >
            Best Sellers
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-[5px] font-body text-[12px] font-semibold"
          style={{ color: '#8b5e3c' }}
        >
          View All Products →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((p, i) => (
          <ScrollAnimationWrapper key={p.id} delay={i * 0.07}>
            <ProductCard product={p} />
          </ScrollAnimationWrapper>
        ))}
      </div>
    </section>
  );
}
