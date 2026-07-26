'use client';

import { motion } from 'framer-motion';

// Craft-specific marks — cleft, draw-knife, balance point, mallet, twine grip.
const steps = [
  {
    n: '01',
    name: 'Select the Cleft',
    desc: 'Grade 1 willow, hand-cleft and graded',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[22px] w-[22px]"
        stroke="#c4956a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="3" width="12" height="18" rx="1.5" />
        <path d="M10 4v16M14 4v16" opacity=".6" />
      </svg>
    ),
  },
  {
    n: '02',
    name: 'Shape & Draw',
    desc: 'Drawn to profile by the craftsman',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[22px] w-[22px]"
        stroke="#c4956a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17c6 0 10-3 13-6" />
        <path d="M2 15l3 4" />
        <path d="M16 11l3-3 3 3-3 3z" />
      </svg>
    ),
  },
  {
    n: '03',
    name: 'Press & Balance',
    desc: 'Pressed for power, tuned for pickup',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[22px] w-[22px]"
        stroke="#c4956a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 16h16" />
        <path d="M12 4v12" />
        <path d="M8 20l4-4 4 4z" />
      </svg>
    ),
  },
  {
    n: '04',
    name: 'Hand Knock-In',
    desc: '6+ hours of mallet work',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[22px] w-[22px]"
        stroke="#c4956a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="3" width="10" height="6" rx="1.5" />
        <path d="M10 9v5" />
        <path d="M7 21l6-6" />
      </svg>
    ),
  },
  {
    n: '05',
    name: 'Oil, Bind & Grip',
    desc: 'Finished, gripped and match-ready',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[22px] w-[22px]"
        stroke="#c4956a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 4h6l-1 5H10z" />
        <path d="M8 9h8M8 13h8M9 17h6" opacity=".7" />
        <path d="M11 20h2" />
      </svg>
    ),
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export function CraftSection() {
  return (
    <section
      id="craft"
      className="relative scroll-mt-[80px] overflow-hidden px-6 py-[104px] lg:px-[52px]"
      style={{ background: '#2c1f14' }}
    >
      {/* Willow-grain seam — the shop → story transition */}
      <div className="willow-seam absolute inset-x-0 top-0" aria-hidden />
      <div className="relative z-10 grid items-center gap-16 lg:grid-cols-[300px_1fr] lg:gap-[72px]">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-sc mb-[10px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            From Cleft to Crease
          </span>
          <h2
            className="font-display mb-4 text-[40px] font-bold leading-[1.12]"
            style={{ color: '#f2ebe0' }}
          >
            Five stages. One
            <br />
            <em style={{ fontStyle: 'italic', color: '#c4956a' }}>perfect middle.</em>
          </h2>
          <p className="mb-7 font-body text-[13.5px] leading-[1.75]" style={{ color: '#a09588' }}>
            A raw willow cleft becomes a match blade only after five deliberate stages — each done
            by hand, each unhurried. No shortcuts. No compromises.
          </p>
          <motion.a
            href="/products"
            whileHover={{ y: -2, background: 'rgba(196,149,106,.12)' }}
            whileTap={{ scale: 0.96 }}
            className="inline-block rounded-[6px] px-[26px] py-[11px] font-body text-[12px] font-semibold uppercase tracking-[1.5px] transition-all duration-200"
            style={{ color: '#c4956a', border: '1.5px solid rgba(196,149,106,.4)' }}
          >
            Shop the Range
          </motion.a>
        </motion.div>

        {/* Transformation timeline */}
        <motion.div
          className="willow-grain grid grid-cols-2 overflow-hidden rounded-[20px] border md:grid-cols-5"
          style={{ backgroundColor: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.07)' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              custom={i}
              variants={stepVariants}
              className="group relative overflow-hidden px-4 py-8 text-center"
              style={{
                borderRight: i < steps.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
              }}
            >
              {/* Ghosted chapter numeral */}
              <span
                className="font-display pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-[72px] font-bold leading-none"
                style={{ color: 'rgba(196,149,106,.07)' }}
                aria-hidden
              >
                {step.n}
              </span>

              <motion.div
                className="relative mx-auto mb-[14px] flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border"
                style={{ background: 'rgba(139,94,60,.14)', borderColor: 'rgba(196,149,106,.18)' }}
                whileHover={{
                  scale: 1.1,
                  borderColor: 'rgba(196,149,106,.45)',
                  background: 'rgba(139,94,60,.28)',
                }}
                transition={{ duration: 0.25 }}
              >
                {step.icon}
              </motion.div>
              <p
                className="font-sc mb-1 text-[9px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: '#8a7d6d', fontVariant: 'small-caps' }}
              >
                Stage {step.n}
              </p>
              <p
                className="font-display mb-1 text-[14px] font-bold leading-[1.15]"
                style={{ color: '#f2ebe0' }}
              >
                {step.name}
              </p>
              <p className="font-body text-[10px] leading-[1.55]" style={{ color: '#8a7d6d' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
