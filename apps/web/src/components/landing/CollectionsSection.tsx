'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const collections = [
  { title: 'English Willow',  sub: 'Premium Grade 1',   fill: '#d2ae72', sideFill: '#aa8848', label: 'GRADE 1'   },
  { title: 'Kashmir Willow',  sub: 'Best for Practice', fill: '#c8a060', sideFill: '#a08040', label: 'KASHMIR'   },
  { title: "Players Edition", sub: 'For Professionals', fill: '#dfc07a', sideFill: '#b09050', label: 'PLAYERS ED.'},
  { title: 'Junior Bats',     sub: 'Future Champions',  fill: '#d4b870', sideFill: '#b09040', label: 'JUNIOR'    },
  { title: "Women's Bats",    sub: 'Power. Precision.', fill: '#e0c07a', sideFill: '#c0a050', label: "WOMEN'S"   },
];

function BatSVG({ fill, sideFill, label }: { fill: string; sideFill: string; label: string }) {
  return (
    <svg viewBox="0 0 210 292" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="210" height="292" fill="#1c120a" />
      <rect x="55" y="14" width="100" height="218" rx="12" fill={fill} />
      <rect x="55" y="14" width="13"  height="218" rx="5"  fill={sideFill} />
      <rect x="142" y="14" width="13" height="218" rx="5"  fill={sideFill} />
      {[78, 91, 105, 119, 132].map(x => (
        <line key={x} x1={x} y1="22" x2={x} y2="224" stroke="#a88030" strokeWidth=".5" strokeDasharray="3 6" opacity=".5" />
      ))}
      <rect x="63" y="82" width="84" height="84" rx="7" fill="#140e08" opacity=".9" />
      <text x="105" y="122" textAnchor="middle" fontSize="16" fontWeight="900" fill="#c4956a" fontFamily="Georgia,serif" letterSpacing="3">SRM</text>
      <text x="105" y="140" textAnchor="middle" fontSize="6.5" fill="#4a3020" fontFamily="sans-serif" letterSpacing="3">{label}</text>
      <rect x="83" y="232" width="44" height="16" rx="4" fill="#9a7838" />
      <rect x="91" y="246" width="28" height="32" rx="4" fill="#2c1f14" />
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function CollectionsSection() {
  return (
    <section className="py-20 px-6 lg:px-[52px]" style={{ background: '#3d2b1f' }}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="block font-sc text-[11px] font-semibold tracking-[4px] uppercase mb-[10px]"
          style={{ color: '#c4956a', fontVariant: 'small-caps' }}>
          Our Collections
        </span>
        <h2 className="font-display text-[38px] font-bold" style={{ color: '#f2ebe0', letterSpacing: '-.3px' }}>
          Crafted for Every Player
        </h2>
        <p className="font-body text-[13px] mt-2" style={{ color: '#a09588' }}>
          Handcrafted bats, customised for players who demand the best.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {collections.map((col) => (
          <motion.div key={col.title} variants={cardVariants}>
            <Link
              href="/products"
              className="block relative rounded-[28px] overflow-hidden cursor-pointer group"
              style={{ aspectRatio: '0.72', background: '#5c3d2e' }}
            >
              {/* Bat */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.04, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <BatSVG fill={col.fill} sideFill={col.sideFill} label={col.label} />
              </motion.div>

              {/* Gradient */}
              <div className="absolute inset-0 rounded-[28px]" style={{
                background: 'linear-gradient(to top,rgba(28,16,8,.92) 0%,rgba(28,16,8,.18) 55%,transparent 100%)'
              }} />

              {/* Hover shine */}
              <motion.div
                className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg,rgba(196,149,106,.06) 0%,transparent 60%)' }}
              />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-[18px]">
                <h3 className="font-display text-[17px] font-bold italic mb-[1px]" style={{ color: '#f2ebe0' }}>
                  {col.title}
                </h3>
                <p className="font-body text-[11px] mb-[10px]" style={{ color: '#a09588' }}>{col.sub}</p>
                <motion.span
                  className="font-sc text-[10px] font-semibold tracking-[2px] uppercase inline-flex items-center gap-1"
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
