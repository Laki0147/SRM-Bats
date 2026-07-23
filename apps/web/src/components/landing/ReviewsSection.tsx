'use client';

import { motion } from 'framer-motion';

const reviews = [
  {
    text: 'The balance and pickup are perfect. SRM feels like a natural extension of my arm on the field.',
    name: 'Shubman Gill',
    role: 'Indian Cricketer',
    color: '#4a6a3a',
    bg: '#e4eedd',
  },
  {
    text: 'SRM bats are in a different league. Power, control and confidence — everything in one bat.',
    name: 'Ruturaj Gaikwad',
    role: 'Indian Cricketer',
    color: '#7a5030',
    bg: '#f0e8da',
  },
  {
    text: 'Outstanding quality and finish. You can feel the difference in every shot. Truly exceptional.',
    name: 'Marcus Stoinis',
    role: 'Australian All-Rounder',
    color: '#3a5878',
    bg: '#dde4ee',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 },
  }),
};

const stats = [
  { num: '125+', label: 'Years of Heritage' },
  { num: '50,000+', label: 'Bats Crafted' },
  { num: '4.9/5', label: 'Customer Rating' },
  { num: '95%', label: 'Repeat Customers' },
];

export function ReviewsSection() {
  return (
    <section className="px-6 py-20 lg:px-[52px]" style={{ background: '#eed3a8' }}>
      <div className="grid items-start gap-12 lg:grid-cols-[210px_1fr_190px]">
        {/* Left heading */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-sc mb-[10px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#8b5e3c', fontVariant: 'small-caps' }}
          >
            Trusted by Players
          </span>
          <h2
            className="font-display mb-4 text-[32px] font-bold leading-[1.2]"
            style={{ color: '#2c1f14' }}
          >
            Loved by Cricketers Worldwide
          </h2>
          <a
            href="/reviews"
            className="flex items-center gap-1 font-body text-[12px] font-semibold"
            style={{ color: '#8b5e3c' }}
          >
            View all reviews →
          </a>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.name}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0 24px 64px rgba(44,31,20,.14)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="flex h-full flex-col rounded-[18px] border p-6"
              style={{
                background: '#fff',
                borderColor: 'rgba(196,149,106,.11)',
                boxShadow: '0 2px 14px rgba(44,31,20,.06)',
              }}
            >
              <div
                className="font-display mb-2 text-[48px] italic leading-[.9] opacity-30"
                style={{ color: '#c4956a' }}
              >
                &quot;
              </div>
              <div className="mb-[10px] flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-[13px]" style={{ color: '#8b5e3c' }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="mb-4 flex-1 font-body text-[13px] italic leading-[1.7]"
                style={{ color: '#5c3d2e' }}
              >
                &quot;{rev.text}&quot;
              </p>
              <div
                className="flex items-center gap-[10px] border-t pt-[14px]"
                style={{ borderColor: 'rgba(196,149,106,.1)' }}
              >
                <div
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
                  style={{ background: rev.bg, borderColor: 'rgba(196,149,106,.2)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 38 38">
                    <circle cx="19" cy="14" r="7" fill={rev.color} />
                    <path d="M5 38 C5 28 33 28 33 38" fill={rev.color} />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-[14px] font-bold" style={{ color: '#2c1f14' }}>
                    {rev.name}
                  </div>
                  <div className="font-body text-[10px]" style={{ color: '#6b6358' }}>
                    {rev.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ball decoration */}
        <motion.div
          className="hidden overflow-hidden rounded-[18px] lg:block"
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <svg width="190" height="220" viewBox="0 0 190 220" fill="none">
            <rect width="190" height="220" rx="20" fill="#1c1008" />
            <rect x="0" y="155" width="190" height="65" fill="#182010" opacity=".85" />
            <circle cx="115" cy="120" r="56" fill="#6a1a14" />
            <path
              d="M75 102 Q94 86 115 94 Q136 102 155 92"
              stroke="#b08040"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M75 138 Q94 154 115 146 Q136 138 155 148"
              stroke="#b08040"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <rect x="18" y="75" width="16" height="110" rx="4" fill="#c4a060" opacity=".55" />
            <rect x="18" y="75" width="4" height="110" rx="2" fill="#a08040" opacity=".55" />
          </svg>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        className="mt-16 grid grid-cols-2 gap-8 border-b border-t py-12 md:grid-cols-4 lg:gap-12"
        style={{ borderColor: '#e8e3db' }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }),
            }}
            className="text-center"
          >
            <p
              className="font-stat mb-2 text-[42px] font-semibold lg:text-[48px]"
              style={{ color: '#8b5e3c' }}
            >
              {s.num}
            </p>
            <p
              className="font-body text-[14px] uppercase tracking-wider"
              style={{ color: '#a09588' }}
            >
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
