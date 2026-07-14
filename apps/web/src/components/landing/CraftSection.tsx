'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    n: '01', name: 'Select Willow', desc: 'Premium willow hand-picked',
    icon: <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="#c4956a" strokeWidth={1.5} strokeLinecap="round"><path d="M12 2a7 7 0 0 1 7 7c0 4-3 7-7 9-4-2-7-5-7-9a7 7 0 0 1 7-7z"/></svg>,
  },
  {
    n: '02', name: 'Handcraft', desc: 'Shaped by master craftsmen',
    icon: <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="#c4956a" strokeWidth={1.5} strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    n: '03', name: 'Balance', desc: 'Tuned for every player',
    icon: <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="#c4956a" strokeWidth={1.5}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>,
  },
  {
    n: '04', name: 'Knock & Test', desc: 'Prepped for match play',
    icon: <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="#c4956a" strokeWidth={1.5} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    n: '05', name: 'Match Ready', desc: 'Ready to dominate',
    icon: <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="#c4956a" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"/><path d="M9 12l2 2 4-4"/></svg>,
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 36 },
  show:   (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // subtle background parallax shift
  const blobX = useTransform(scrollYProgress, [0, 1], ['-20%', '10%']);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <section ref={sectionRef} className="py-[88px] px-6 lg:px-[52px] relative overflow-hidden" style={{ background: '#2c1f14' }}>
      {/* Animated blob */}
      <motion.div
        className="absolute -top-[100px] -right-[80px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(92,61,46,.32) 0%,transparent 65%)', x: blobX, y: blobY }}
      />

      <div className="relative z-10 grid lg:grid-cols-[300px_1fr] gap-16 lg:gap-[72px] items-center">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-sc block text-[11px] font-semibold tracking-[4px] uppercase mb-[10px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}>
            Our Craftsmanship
          </span>
          <h2 className="font-display text-[40px] font-bold leading-[1.12] mb-4" style={{ color: '#f2ebe0' }}>
            Crafted with Precision.<br />
            <em style={{ fontStyle: 'italic', color: '#c4956a' }}>Played with Passion.</em>
          </h2>
          <p className="font-body text-[13.5px] leading-[1.75] mb-7" style={{ color: '#a09588' }}>
            Every SRM bat goes through a meticulous process to ensure the perfect
            balance, power, and durability. No shortcuts. No compromises.
          </p>
          <motion.a
            href="/process"
            whileHover={{ y: -2, background: 'rgba(196,149,106,.12)' }}
            whileTap={{ scale: 0.96 }}
            className="inline-block font-body font-semibold text-[12px] tracking-[1.5px] uppercase px-[26px] py-[11px] rounded-full transition-all duration-200"
            style={{ color: '#c4956a', border: '1.5px solid rgba(196,149,106,.4)' }}
          >
            Our Process
          </motion.a>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 rounded-[28px] overflow-hidden border py-8"
          style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.07)' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              custom={i}
              variants={stepVariants}
              className="text-center px-3 relative group"
              style={{ borderRight: i < steps.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}
            >
              {i < steps.length - 1 && (
                <span className="hidden md:block absolute right-[-9px] top-5 text-[16px]" style={{ color: '#6b6358' }}>›</span>
              )}
              <motion.div
                className="w-[52px] h-[52px] rounded-full mx-auto mb-[14px] flex items-center justify-center border"
                style={{ background: 'rgba(139,94,60,.14)', borderColor: 'rgba(196,149,106,.18)' }}
                whileHover={{ scale: 1.12, borderColor: 'rgba(196,149,106,.45)', background: 'rgba(139,94,60,.28)' }}
                transition={{ duration: 0.25 }}
              >
                {step.icon}
              </motion.div>
              <p className="font-sc text-[9px] font-semibold tracking-[1.5px] uppercase mb-1" style={{ color: '#6b6358', fontVariant: 'small-caps' }}>
                Step {step.n}
              </p>
              <p className="font-display text-[14px] font-bold mb-1" style={{ color: '#f2ebe0' }}>{step.name}</p>
              <p className="font-body text-[10px] leading-[1.55]" style={{ color: '#6b6358' }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
