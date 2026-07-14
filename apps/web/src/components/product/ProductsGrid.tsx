'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';

// Static fallback data when API is unavailable
const STATIC_PRODUCTS = [
  { id: '1', slug: 'the-sovereign',  name: 'The Sovereign',  grade: 'Grade 1 English Willow', profile: 'Full Bow',      price: 28500, compareAtPrice: 32000, rating: 5, stock: 12, fill: '#d2ae72', sideFill: '#aa8848', label: 'SOV', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'Full Bow'}] },
  { id: '2', slug: 'the-artisan',    name: 'The Artisan',    grade: 'Grade 2 English Willow', profile: 'Mid Bow',       price: 19500, compareAtPrice: 22000, rating: 4, stock: 18, fill: '#c8a060', sideFill: '#a08040', label: 'ART', specifications: [{key:'Willow',value:'Grade 2 English Willow'},{key:'Profile',value:'Mid Bow'}] },
  { id: '3', slug: 'the-heritage',   name: 'The Heritage',   grade: 'Grade 1 English Willow', profile: 'Low Mid Bow',   price: 24000, compareAtPrice: 27500, rating: 5, stock: 8,  fill: '#dfc07a', sideFill: '#b09050', label: 'HER', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'Low Mid Bow'}] },
  { id: '4', slug: 'the-pioneer',    name: 'The Pioneer',    grade: 'Grade 1 English Willow', profile: 'High Mid Bow',  price: 31000, compareAtPrice: 35000, rating: 5, stock: 6,  fill: '#e0c880', sideFill: '#c0a050', label: 'PIO', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'High Mid Bow'}] },
  { id: '5', slug: 'the-reserve',    name: 'The Reserve',    grade: 'Grade 2 English Willow', profile: 'Traditional',   price: 13500, compareAtPrice: 16000, rating: 4, stock: 25, fill: '#d4b870', sideFill: '#b09040', label: 'RES', specifications: [{key:'Willow',value:'Grade 2 English Willow'},{key:'Profile',value:'Traditional'}] },
  { id: '6', slug: 'the-bespoke',    name: 'The Bespoke',    grade: 'Grade 1 English Willow', profile: 'Custom',        price: 42000, compareAtPrice: null,  rating: 5, stock: 5,  fill: '#c8a060', sideFill: '#a08040', label: 'BSP', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'Custom'}] },
  { id: '7', slug: 'the-centurion',  name: 'The Centurion',  grade: 'Grade 1 English Willow', profile: 'Mid Bow',       price: 26500, compareAtPrice: 30000, rating: 4, stock: 10, fill: '#dfc07a', sideFill: '#b09050', label: 'CEN', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'Mid Bow'}] },
  { id: '8', slug: 'the-maestro',    name: 'The Maestro',    grade: 'Grade 1 English Willow', profile: 'Full Bow',      price: 38000, compareAtPrice: 44000, rating: 5, stock: 4,  fill: '#d2ae72', sideFill: '#aa8848', label: 'MAE', specifications: [{key:'Willow',value:'Grade 1 English Willow'},{key:'Profile',value:'Full Bow'}] },
];

type ProductItem = typeof STATIC_PRODUCTS[0];

function BatCardSVG({ fill, sideFill, label }: { fill: string; sideFill: string; label: string }) {
  return (
    <svg width="90" height="220" viewBox="0 0 90 220" fill="none" className="drop-shadow-lg">
      <rect x="18" y="6" width="54" height="156" rx="10" fill={fill} />
      <rect x="18" y="6" width="9"  height="156" rx="5" fill={sideFill} />
      <rect x="63" y="6" width="9"  height="156" rx="5" fill={sideFill} />
      <rect x="24" y="54" width="42" height="52" rx="6" fill="#1e140c" opacity=".9" />
      <text x="45" y="77" textAnchor="middle" fontSize="9" fontWeight="900" fill="#c4956a" fontFamily="Georgia,serif" letterSpacing="2">SRM</text>
      <text x="45" y="92" textAnchor="middle" fontSize="5.5" fill="#4a3020" fontFamily="sans-serif" letterSpacing="2">{label}</text>
      <rect x="33" y="162" width="24" height="10" rx="3" fill="#987040" />
      <rect x="37" y="170" width="16" height="40" rx="3" fill="#2c1f14" />
      <ellipse cx="45" cy="212" rx="10" ry="5" fill="#1e140c" opacity=".5" />
    </svg>
  );
}

function ProductCard({ p, index }: { p: ProductItem; index: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const discount = p.compareAtPrice
    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
    : 0;

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(p.id, 1, {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        image: null,
      });
      setAdded(true);
      openCart();
      setTimeout(() => setAdded(false), 1500);
    } catch {}
    finally { setAdding(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${p.slug}`} className="block">
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 10px 36px rgba(44,31,20,.13)' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[20px] overflow-hidden border"
          style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.12)' }}
        >
          {/* Image */}
          <div className="relative h-[230px] flex items-center justify-center" style={{ background: '#f2ebe0' }}>
            <BatCardSVG fill={p.fill} sideFill={p.sideFill} label={p.label} />

            {/* Badges */}
            {discount > 0 && (
              <span className="absolute top-3 left-3 font-body text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: '#c4956a', color: '#2c1f14' }}>
                -{discount}%
              </span>
            )}
            {p.stock <= 5 && p.stock > 0 && (
              <span className="absolute top-3 left-3 font-body text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: 'rgba(155,35,53,.12)', color: '#9b2335' }}>
                Only {p.stock} left
              </span>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(242,235,224,.92)' }}
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#6b6358]'}`} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 pb-5">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < p.rating ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#a09588] opacity-25'}`} />
              ))}
            </div>

            <h3 className="font-display text-[18px] font-bold mb-1.5 leading-[1.2]" style={{ color: '#2c1f14' }}>
              {p.name}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[p.grade, p.profile].map(tag => (
                <span key={tag} className="font-body text-[10px] font-medium px-2.5 py-[3px] rounded-full"
                  style={{ background: 'rgba(139,94,60,.08)', color: '#5c3d2e' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Price + Cart */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[18px] font-semibold" style={{ color: '#2c1f14', letterSpacing: '-.5px' }}>
                  <span className="font-body text-[12px] font-medium mr-0.5" style={{ color: '#6b6358' }}>₹</span>
                  {p.price.toLocaleString('en-IN')}
                </div>
                {p.compareAtPrice && (
                  <div className="font-mono text-[12px] line-through" style={{ color: '#a09588' }}>
                    ₹{p.compareAtPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
              <button
                onClick={handleCart}
                aria-label="Add to cart"
                className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-200"
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
    </motion.div>
  );
}

const SORT_OPTIONS = [
  { label: 'Featured',    value: 'featured'   },
  { label: 'Price: Low',  value: 'price-asc'  },
  { label: 'Price: High', value: 'price-desc' },
  { label: 'Name A–Z',   value: 'name-asc'   },
];

export function ProductsGrid() {
  const [sort, setSort] = useState('featured');
  const [products, setProducts] = useState<ProductItem[]>(STATIC_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFromApi = async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.fetchAll({ limit: 24 });
        if (data.data && data.data.length > 0) {
          // Map API products to the card format
          const mapped: ProductItem[] = data.data.map((p: any, i: number) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            grade: p.specifications?.find((s: any) => s.key === 'Willow')?.value || 'English Willow',
            profile: p.specifications?.find((s: any) => s.key === 'Profile')?.value || '',
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            rating: 5,
            stock: p.stock,
            fill: STATIC_PRODUCTS[i % STATIC_PRODUCTS.length].fill,
            sideFill: STATIC_PRODUCTS[i % STATIC_PRODUCTS.length].sideFill,
            label: p.name.split(' ').pop()?.substring(0, 3).toUpperCase() || 'BAT',
            specifications: p.specifications || [],
          }));
          setProducts(mapped);
        }
      } catch {
        // Stay with static fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchFromApi();
  }, []);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name-asc')   return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <section className="py-12 px-6 lg:px-[52px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <p className="font-body text-[13px]" style={{ color: '#6b6358' }}>
          {sorted.length} bats
        </p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: '#8b5e3c' }} />
          <div className="flex gap-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className="font-body text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: sort === opt.value ? '#2c1f14' : 'rgba(139,94,60,.08)',
                  color:      sort === opt.value ? '#faf6f0'  : '#5c3d2e',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sorted.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
