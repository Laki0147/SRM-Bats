'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const HERO_SHOT = '/bats/main.png';

interface Collection {
  title: string;
  sub: string;
  // Per-collection imagery; defaults to the hero shot until distinct art exists.
  image: string;
}

const collections: Collection[] = [
  { title: 'English Willow', sub: 'Premium Grade 1', image: HERO_SHOT },
  { title: 'Kashmir Willow', sub: 'Best for Practice', image: HERO_SHOT },
  { title: "Players' Edition", sub: 'For Professionals', image: HERO_SHOT },
  { title: 'Junior Bats', sub: 'Future Champions', image: HERO_SHOT },
  { title: "Women's Bats", sub: 'Power. Precision.', image: HERO_SHOT },
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
    <section className="relative px-6 py-20 lg:px-[52px]" style={{ background: '#2c1f14' }}>
      {/* Willow-grain seam — the hero → shop transition */}
      <div className="willow-seam absolute inset-x-0 top-0" aria-hidden />

      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="mb-[10px] flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-8" style={{ background: 'rgba(196,149,106,.4)' }} />
          <span
            className="font-sc text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            By Willow &amp; Player
          </span>
          <span aria-hidden className="h-px w-8" style={{ background: 'rgba(196,149,106,.4)' }} />
        </span>
        <h2
          className="font-display text-[38px] font-bold"
          style={{ color: '#f2ebe0', letterSpacing: '-.3px' }}
        >
          A blade for every hand at the crease.
        </h2>
        <p className="mt-2 font-body text-[13px]" style={{ color: '#a09588' }}>
          From first-innings juniors to Grade 1 match blades — each range shaped to its player.
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
              className="group relative block cursor-pointer overflow-hidden rounded-[16px] border"
              style={{
                aspectRatio: '0.72',
                background: '#5c3d2e',
                borderColor: 'rgba(196,149,106,.16)',
              }}
            >
              {/* Image — gentle in-frame zoom on hover */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 1024px) 50vw, 240px"
                className="object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
              />

              {/* Readability gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top,rgba(28,16,8,.92) 0%,rgba(28,16,8,.18) 55%,transparent 100%)',
                }}
              />

              {/* Gold border warm-up on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: 'inset 0 0 0 1.5px rgba(196,149,106,.55)' }}
              />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-[18px]">
                <h3
                  className="font-display mb-[1px] text-[17px] font-bold"
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
