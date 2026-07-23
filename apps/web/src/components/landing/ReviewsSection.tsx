'use client';

import { motion } from 'framer-motion';

const reviews = [
  {
    text: 'The balance and pickup are perfect. SRM feels like a natural extension of my arm on the field.',
    name: 'Shubman Gill',
    role: 'Indian Cricketer',
  },
  {
    text: 'SRM bats are in a different league. Power, control and confidence — everything in one bat.',
    name: 'Ruturaj Gaikwad',
    role: 'Indian Cricketer',
  },
  {
    text: 'Outstanding quality and finish. You can feel the difference in every shot. Truly exceptional.',
    name: 'Marcus Stoinis',
    role: 'Australian All-Rounder',
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

// Supporting facts — one dominant heritage lead, the rest as quiet captions
const support = [
  { num: '50,000+', label: 'Bats shaped by hand' },
  { num: '6+ hrs', label: 'Knock-in on every blade' },
  { num: '4.9 / 5', label: 'Across 2,400 reviews' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function ReviewsSection() {
  return (
    <section
      className="px-6 py-20 lg:px-[52px]"
      style={{ background: '#221711', borderTop: '1px solid rgba(196,149,106,.10)' }}
    >
      <div className="grid items-start gap-12 lg:grid-cols-[210px_1fr]">
        {/* Left heading */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-sc mb-[10px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            Player Voices
          </span>
          <h2
            className="font-display mb-4 text-[32px] font-bold leading-[1.2]"
            style={{ color: '#f2ebe0' }}
          >
            From those who bat for a living.
          </h2>
          <a
            href="/reviews"
            className="flex items-center gap-1 font-body text-[12px] font-semibold"
            style={{ color: '#c4956a' }}
          >
            Read every review →
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
              whileHover={{ y: -10, boxShadow: '0 24px 64px rgba(20,12,6,.45)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="flex h-full flex-col rounded-[18px] border p-6"
              style={{
                background: '#3d2b1f',
                borderColor: 'rgba(196,149,106,.18)',
                boxShadow: '0 2px 14px rgba(20,12,6,.35)',
              }}
            >
              <div
                className="font-display mb-2 text-[48px] italic leading-[.9] opacity-30"
                style={{ color: '#c4956a' }}
              >
                &quot;
              </div>
              <div className="mb-[10px] flex gap-1" role="img" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} aria-hidden className="text-[13px]" style={{ color: '#c4956a' }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="mb-4 flex-1 font-body text-[13px] italic leading-[1.7]"
                style={{ color: '#e8d9c4' }}
              >
                &quot;{rev.text}&quot;
              </p>
              <div
                className="flex items-center gap-[11px] border-t pt-[14px]"
                style={{ borderColor: 'rgba(196,149,106,.18)' }}
              >
                <div
                  className="font-sc flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[13px] font-bold tracking-[1px]"
                  style={{
                    background: 'rgba(196,149,106,.12)',
                    borderColor: 'rgba(196,149,106,.3)',
                    color: '#d9ad82',
                  }}
                  aria-hidden
                >
                  {initials(rev.name)}
                </div>
                <div>
                  <div className="font-display text-[14px] font-bold" style={{ color: '#f2ebe0' }}>
                    {rev.name}
                  </div>
                  <div className="font-body text-[10px]" style={{ color: '#a09588' }}>
                    {rev.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Heritage band — one dominant lead, quiet supporting captions */}
      <motion.div
        className="mt-16 flex flex-col gap-10 border-t pt-12 md:flex-row md:items-center md:gap-16"
        style={{ borderColor: 'rgba(196,149,106,.18)' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Lead */}
        <div className="shrink-0">
          <p
            className="font-stat text-[64px] font-semibold leading-none"
            style={{ color: '#c4956a' }}
          >
            1901
          </p>
          <p
            className="font-sc mt-2 text-[11px] uppercase tracking-[3px]"
            style={{ color: '#a09588' }}
          >
            Crafting willow since
          </p>
        </div>
        {/* Supporting captions */}
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
          {support.map((s) => (
            <div
              key={s.label}
              className="border-l pl-4"
              style={{ borderColor: 'rgba(196,149,106,.22)' }}
            >
              <p className="font-stat text-[22px] font-semibold" style={{ color: '#e8d9c4' }}>
                {s.num}
              </p>
              <p className="mt-1 font-body text-[12px] leading-[1.5]" style={{ color: '#a09588' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
