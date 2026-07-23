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
  profile: string;
  price: number;
  rating: number;
  reviews: number;
  // Per-product imagery. Defaults to the hero shot until distinct
  // photography exists; hoverImage cross-fades in when it differs.
  image: string;
  hoverImage: string;
}

const HERO_SHOT = '/bats/main.png';

const products: BatProduct[] = [
  {
    id: '1',
    name: 'The Sovereign',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Full Bow',
    price: 28500,
    rating: 4.9,
    reviews: 128,
    image: HERO_SHOT,
    hoverImage: HERO_SHOT,
    slug: 'the-sovereign',
  },
  {
    id: '2',
    name: 'The Artisan',
    grade: 'Grade 2',
    size: 'Short Handle',
    profile: 'Mid Bow',
    price: 19500,
    rating: 4.7,
    reviews: 86,
    image: HERO_SHOT,
    hoverImage: HERO_SHOT,
    slug: 'the-artisan',
  },
  {
    id: '3',
    name: 'The Pioneer',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'High Mid Bow',
    price: 31000,
    rating: 5.0,
    reviews: 64,
    image: HERO_SHOT,
    hoverImage: HERO_SHOT,
    slug: 'the-pioneer',
  },
  {
    id: '4',
    name: 'The Heritage',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Low Mid Bow',
    price: 24000,
    rating: 4.8,
    reviews: 152,
    image: HERO_SHOT,
    hoverImage: HERO_SHOT,
    slug: 'the-heritage',
  },
  {
    id: '5',
    name: 'The Maestro',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Full Bow',
    price: 38000,
    rating: 5.0,
    reviews: 41,
    image: HERO_SHOT,
    hoverImage: HERO_SHOT,
    slug: 'the-maestro',
  },
];

function ProductCard({ product }: { product: BatProduct }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    setAdding(false);
  };

  const distinctHover = product.hoverImage !== product.image;

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <motion.div
        whileHover={{
          y: -5,
          borderColor: 'rgba(196,149,106,.5)',
          boxShadow: '0 18px 44px rgba(20,12,6,.5)',
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer overflow-hidden rounded-[16px] border"
        style={{ background: '#3d2b1f', borderColor: 'rgba(196,149,106,.18)' }}
      >
        {/* Image — full-bleed hero shot with gentle in-frame zoom on hover */}
        <div className="relative h-[220px] overflow-hidden" style={{ background: '#1c120a' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 300px"
            className="object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
          />
          {/* Cross-fade layer — only meaningful once a distinct hoverImage exists */}
          {distinctHover && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 300px"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Grade — solid accent chip (dominant in the pill hierarchy) */}
          <span
            className="font-sc absolute left-3 top-3 rounded-[5px] px-[9px] py-[3px] text-[10px] font-bold uppercase tracking-[1.5px]"
            style={{ background: '#8b5e3c', color: '#f2ebe0', fontVariant: 'small-caps' }}
          >
            {product.grade}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[6px] transition-all"
            style={{ background: 'rgba(242,235,224,.9)' }}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${wishlisted ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#6b6358]'}`}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-[14px] pb-[18px]">
          {/* Rating figure + count (one gold star, not five muddy ones) */}
          <div className="mb-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-[#c4956a] text-[#c4956a]" />
            <span className="font-stat text-[12px] font-semibold" style={{ color: '#e8d9c4' }}>
              {product.rating.toFixed(1)}
            </span>
            <span className="font-body text-[11px]" style={{ color: '#a09588' }}>
              ({product.reviews})
            </span>
          </div>

          <h3
            className="font-display mb-[6px] text-[18px] font-bold leading-[1.2]"
            style={{ color: '#f2ebe0' }}
          >
            {product.name}
          </h3>

          {/* Meta — hairline supporting text, subordinate to the grade chip */}
          <p className="mb-3 font-body text-[11px]" style={{ color: '#a09588' }}>
            {product.size} · {product.profile}
          </p>

          <div className="flex items-center justify-between">
            <div
              className="font-display text-[20px] font-semibold"
              style={{ color: '#f2ebe0', letterSpacing: '-.3px' }}
            >
              <span className="font-body text-[12px] font-medium" style={{ color: '#a09588' }}>
                ₹
              </span>
              {product.price.toLocaleString('en-IN')}
            </div>
            <button
              onClick={(e) => void handleCart(e)}
              disabled={adding}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-[6px] transition-all duration-200 disabled:opacity-60"
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
    <section
      className="px-6 py-20 lg:px-[52px]"
      style={{ background: '#221711', borderTop: '1px solid rgba(196,149,106,.10)' }}
    >
      <div className="mb-9 flex items-end justify-between">
        <div>
          <small
            className="font-sc mb-[6px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            Most Chosen
          </small>
          <h2
            className="font-display text-[34px] font-bold"
            style={{ color: '#f2ebe0', letterSpacing: '-.3px' }}
          >
            The bats players keep coming back for.
          </h2>
        </div>
        <Link
          href="/products"
          className="flex shrink-0 items-center gap-[5px] font-body text-[12px] font-semibold"
          style={{ color: '#c4956a' }}
        >
          Browse every blade →
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
