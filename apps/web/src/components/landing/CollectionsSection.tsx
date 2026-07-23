'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Single hero product shot used across all collection cards.
const COLLECTION_IMAGE = '/bats/main.png';

const collections = [
  {
    title: 'English Willow',
    sub: 'Premium Grade 1',
    fill: '#d2ae72',
    sideFill: '#aa8848',
    label: 'GRADE 1',
  },
  {
    title: 'Kashmir Willow',
    sub: 'Best for Practice',
    fill: '#c8a060',
    sideFill: '#a08040',
    label: 'KASHMIR',
  },
  {
    title: 'Players Edition',
    sub: 'For Professionals',
    fill: '#dfc07a',
    sideFill: '#b09050',
    label: 'PLAYERS ED.',
  },
  {
    title: 'Junior Bats',
    sub: 'Future Champions',
    fill: '#d4b870',
    sideFill: '#b09040',
    label: 'JUNIOR',
  },
  {
    title: "Women's Bats",
    sub: 'Power. Precision.',
    fill: '#e0c07a',
    sideFill: '#c0a050',
    label: "WOMEN'S",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function CollectionsSection() {
  return (
    <section
      className="px-6 py-20 lg:px-[52px]"
      style={{ background: '#2c1f14', borderTop: '1px solid rgba(196,149,106,.10)' }}
    >
      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="font-sc mb-[10px] block text-[11px] font-semibold uppercase tracking-[4px]"
          style={{ color: '#c4956a', fontVariant: 'small-caps' }}
        >
          Our Collections
        </span>
        <h2
          className="font-display text-[38px] font-bold"
          style={{ color: '#f2ebe0', letterSpacing: '-.3px' }}
        >
          Crafted for Every Player
        </h2>
        <p className="mt-2 font-body text-[13px]" style={{ color: '#a09588' }}>
          Handcrafted bats, customised for players who demand the best.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {collections.map((col) => (
          <motion.div key={col.title} variants={cardVariants}>
            <Link
              href="/products"
              className="group relative block cursor-pointer overflow-hidden rounded-[28px]"
              style={{ aspectRatio: '0.72', background: '#5c3d2e' }}
            >
              {/* Bat */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.04, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={COLLECTION_IMAGE}
                  alt={col.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 240px"
                  className="object-cover"
                />
              </motion.div>

              {/* Gradient */}
              <div
                className="absolute inset-0 rounded-[28px]"
                style={{
                  background:
                    'linear-gradient(to top,rgba(28,16,8,.92) 0%,rgba(28,16,8,.18) 55%,transparent 100%)',
                }}
              />

              {/* Hover shine */}
              <motion.div
                className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg,rgba(196,149,106,.06) 0%,transparent 60%)',
                }}
              />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-[18px]">
                <h3
                  className="font-display mb-[1px] text-[17px] font-bold italic"
                  style={{ color: '#f2ebe0' }}
                >
                  {col.title}
                </h3>
                <p className="mb-[10px] font-body text-[11px]" style={{ color: '#a09588' }}>
                  {col.sub}
                </p>
                <motion.span
                  className="font-sc inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[2px]"
                  style={{ color: '#c4956a', fontVariant: 'small-caps' }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  Explore →
                </motion.span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
