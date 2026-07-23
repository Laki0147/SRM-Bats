'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Editorial spec line — real, verifiable craft facts (no invented stats)
const spec = ['Grade 1 English Willow', 'Air-dried 18 months', 'Hand-knocked 6+ hrs', '2lb 8oz'];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  /* ── scroll-based parallax ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // video moves slightly slower than scroll (parallax)
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  // content drifts up and fades as user scrolls away
  const contentY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-14%']);
  const contentOp = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  // overlay darkens on scroll so content stays readable
  const overlayOp = useTransform(scrollYProgress, [0, 0.4], [1, 1.4]);
  // scale down slightly on scroll (cinematic zoom-out feel)
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // smooth all transforms with spring physics
  const smoothVideoY = useSpring(videoY, { stiffness: 80, damping: 20 });
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 20 });
  const smoothContentOp = useSpring(contentOp, { stiffness: 80, damping: 20 });

  /* ── slow motion on video load ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.72; // cinematic slow-motion feel
    const onReady = () => setVideoReady(true);
    v.addEventListener('canplaythrough', onReady);
    return () => v.removeEventListener('canplaythrough', onReady);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center overflow-hidden"
      style={{
        height: '100vh',
        minHeight: 640,
        paddingTop: 140,
        paddingBottom: 56,
        background: '#1c140c',
      }}
    >
      {/* ── VIDEO LAYER (parallax) ── */}
      <motion.div
        className="absolute inset-0 h-full w-full"
        style={{ y: smoothVideoY, scale: videoScale }}
      >
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Fallback gradient (shown until video loads) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg,#1c140c 0%,#2c1f14 35%,#3d2b1f 60%,#1c140c 100%)',
            opacity: videoReady ? 0 : 1,
            transition: 'opacity 1.2s ease',
          }}
        />

        {/* Warm colour grade over video */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'rgba(92,61,46,.14)', mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* ── CINEMATIC OVERLAYS ── */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: overlayOp }}>
        {/* left-to-right gradient so text is always readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `
            linear-gradient(90deg,rgba(22,14,8,.90) 0%,rgba(22,14,8,.62) 40%,rgba(22,14,8,.14) 68%,transparent 100%),
            linear-gradient(0deg,rgba(22,14,8,.72) 0%,transparent 44%),
            linear-gradient(180deg,rgba(22,14,8,.36) 0%,transparent 24%)`,
          }}
        />
      </motion.div>

      {/* ── CONTENT (parallax + cursor offset) ── */}
      <motion.div
        className="relative z-10 max-w-[600px] px-6 lg:px-[52px]"
        style={{ y: smoothContentY, opacity: smoothContentOp }}
      >
        {/* Headline — letters staggered */}
        <motion.h1
          className="font-display mb-4 font-bold leading-[1.02]"
          style={{
            fontSize: 'clamp(36px,5.4vw,60px)',
            color: '#f2ebe0',
            textShadow: '0 2px 28px rgba(22,14,8,.45)',
          }}
        >
          {['Six Hours', 'of Knocking.'].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.28 + i * 0.14 }}
            >
              {line}
            </motion.span>
          ))}
          <motion.em
            className="block"
            style={{ color: '#c4956a', fontStyle: 'italic' }}
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.56 }}
          >
            One Perfect Middle.
          </motion.em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.62 }}
          className="mb-7 max-w-[420px] font-body text-[15px] leading-[1.8]"
          style={{ color: 'rgba(228,217,196,.85)', textShadow: '0 1px 8px rgba(22,14,8,.5)' }}
        >
          Grade 1 English Willow. Hand-selected, air-dried 18 months. Shaped by master craftsmen.
          Knocked-in and match-ready for your centuries.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.74 }}
          className="mb-9 flex flex-wrap gap-3"
        >
          <motion.a
            href="/products"
            whileHover={{ y: -2, boxShadow: '0 14px 32px rgba(139,94,60,.45)' }}
            whileTap={{ scale: 0.96 }}
            className="cursor-pointer rounded-[6px] px-[30px] py-[14px] font-body text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors duration-200"
            style={{
              background: '#8b5e3c',
              color: '#f2ebe0',
              boxShadow: '0 6px 20px rgba(139,94,60,.30)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#5c3d2e')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#8b5e3c')}
          >
            Find Your Bat
          </motion.a>
          <motion.a
            href="/about"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="cursor-pointer rounded-[6px] px-[30px] py-[14px] font-body text-[12px] font-semibold uppercase tracking-[1.5px] transition-all duration-200"
            style={{
              background: 'transparent',
              color: '#e8d9c4',
              border: '1.5px solid rgba(232,217,196,.30)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c4956a';
              e.currentTarget.style.color = '#c4956a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232,217,196,.30)';
              e.currentTarget.style.color = '#e8d9c4';
            }}
          >
            Visit Our Workshop
          </motion.a>
        </motion.div>

        {/* Spec line — editorial, hairline-divided craft facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.86 }}
          className="flex flex-wrap items-center gap-x-[14px] gap-y-2 border-t pt-5"
          style={{ borderColor: 'rgba(196,149,106,.20)', maxWidth: 460 }}
        >
          {spec.map((s, i) => (
            <span key={s} className="flex items-center gap-x-[14px]">
              <span
                className="font-sc text-[11px] uppercase tracking-[2px]"
                style={{ color: '#a09588' }}
              >
                {s}
              </span>
              {i < spec.length - 1 && (
                <span
                  aria-hidden
                  className="text-[11px]"
                  style={{ color: 'rgba(196,149,106,.45)' }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-[10px] [@media(max-height:700px)]:hidden"
        style={{ opacity: smoothContentOp }}
      >
        <motion.div
          className="h-px"
          style={{ background: '#c4956a', opacity: 0.55 }}
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 2, duration: 0.8 }}
        />
        <span
          className="font-sc text-[9px] font-semibold uppercase tracking-[3px]"
          style={{ color: '#a09588' }}
        >
          Scroll to explore
        </span>
        {/* bouncing chevron */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M2 4l5 5 5-5"
            stroke="#c4956a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".7"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
