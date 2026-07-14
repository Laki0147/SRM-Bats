'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ─── Trail dot count ─────────────────────────────────────── */
const TRAIL_COUNT = 8;

export function CricketBallCursor() {
  const ballRef   = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    /* ── only on non-touch devices ── */
    if (typeof window === 'undefined' || window.matchMedia('(pointer:coarse)').matches) return;

    /* ── hide native cursor everywhere ── */
    document.documentElement.style.cursor = 'none';

    const ball  = ballRef.current!;
    const glow  = glowRef.current!;
    const trail = trailRefs.current;

    /* ── live position & velocity ── */
    let mx = -200, my = -200;   // current mouse
    let px = -200, py = -200;   // previous mouse (for velocity)
    let vx = 0,    vy = 0;      // velocity
    let rotation = 0;           // cumulative rotation degrees
    let isHovering = false;

    /* ── move ball instantly with GSAP ticker ── */
    gsap.set(ball, { x: -200, y: -200 });
    gsap.set(glow, { x: -200, y: -200 });
    trail.forEach(t => gsap.set(t, { x: -200, y: -200 }));

    /* ── mouse move ── */
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    /* ── GSAP ticker drives everything ── */
    const tick = () => {
      /* velocity (smoothed) */
      const dvx = mx - px;
      const dvy = my - py;
      vx = vx * 0.7 + dvx * 0.3;
      vy = vy * 0.7 + dvy * 0.3;
      px = mx;
      py = my;

      const speed = Math.sqrt(vx * vx + vy * vy);

      /* rotation — proportional to speed, axis = perpendicular to movement */
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      rotation += speed * 1.1;  // degrees per frame scaled by speed

      /* ball position & rotation */
      gsap.set(ball, {
        x: mx,
        y: my,
        rotation: rotation,
        scale: isHovering ? 1.35 : 1 + Math.min(speed * 0.018, 0.18),
      });

      /* glow intensity scales with speed */
      const glowOpacity = Math.min(0.55 + speed * 0.025, 0.85);
      const glowBlur    = 16 + speed * 1.2;
      gsap.set(glow, {
        x: mx,
        y: my,
        opacity: glowOpacity,
        scale:   isHovering ? 1.6 : 1 + Math.min(speed * 0.022, 0.35),
        filter:  `blur(${glowBlur}px)`,
      });

      /* trail dots — each lags behind the next */
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        const prev = trail[i - 1];
        const cur  = trail[i];
        const pt   = gsap.getProperty(prev, 'x') as number;
        const pb   = gsap.getProperty(prev, 'y') as number;
        gsap.set(cur, {
          x: gsap.utils.interpolate(gsap.getProperty(cur, 'x') as number, pt, 0.28),
          y: gsap.utils.interpolate(gsap.getProperty(cur, 'y') as number, pb, 0.28),
          opacity: (1 - i / TRAIL_COUNT) * 0.32 * Math.min(speed / 8, 1),
          scale:   (1 - i / TRAIL_COUNT) * 0.65,
        });
      }
      /* first trail dot chases ball */
      gsap.set(trail[0], {
        x: gsap.utils.interpolate(gsap.getProperty(trail[0], 'x') as number, mx, 0.45),
        y: gsap.utils.interpolate(gsap.getProperty(trail[0], 'y') as number, my, 0.45),
        opacity: Math.min(speed / 12, 1) * 0.38,
        scale:   0.68,
      });
    };
    gsap.ticker.add(tick);

    /* ── hover detection — buttons, links, product cards, bat SVGs ── */
    const HOVER_SEL = 'a, button, [role="button"], .group, svg';

    const onEnter = () => {
      isHovering = true;
      gsap.to(ball, { scale: 1.35, duration: 0.3, ease: 'back.out(1.5)' });
      gsap.to(glow, { scale: 1.7, opacity: 0.9, duration: 0.3 });
    };
    const onLeave = () => {
      isHovering = false;
      gsap.to(ball, { scale: 1,   duration: 0.25, ease: 'power2.out' });
      gsap.to(glow, { scale: 1,   opacity: 0.55,  duration: 0.25 });
    };

    /* delegate via capture so it works on dynamic content too */
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SEL)) onEnter();
    };
    const onMouseOut  = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SEL)) onLeave();
    };
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout',  onMouseOut);

    /* ── hide cursor when it leaves the window ── */
    const onLeaveDoc = () => {
      gsap.to([ball, glow], { opacity: 0, duration: 0.2 });
      trail.forEach(t => gsap.set(t, { opacity: 0 }));
    };
    const onEnterDoc = () => gsap.to([ball, glow], { opacity: 1, duration: 0.2 });
    document.addEventListener('mouseleave', onLeaveDoc);
    document.addEventListener('mouseenter', onEnterDoc);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseout',   onMouseOut);
      document.removeEventListener('mouseleave', onLeaveDoc);
      document.removeEventListener('mouseenter', onEnterDoc);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* ── Motion trail dots ── */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRefs.current[i] = el; }}
          className="pointer-events-none fixed top-0 left-0 z-[9998]"
          style={{
            width:  28,
            height: 28,
            marginLeft: -14,
            marginTop:  -14,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,149,106,0.7) 0%, rgba(180,30,20,0.45) 55%, transparent 100%)',
            transform: 'translate(-200px, -200px)',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* ── Glow halo ── */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width:  56,
          height: 56,
          marginLeft: -28,
          marginTop:  -28,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,60,40,0.55) 0%, rgba(196,149,106,0.30) 45%, transparent 75%)',
          filter: 'blur(16px)',
          transform: 'translate(-200px, -200px)',
          willChange: 'transform, opacity, filter',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Cricket ball cursor ── */}
      <div
        ref={ballRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{
          width:  38,
          height: 38,
          marginLeft: -19,
          marginTop:  -19,
          transform: 'translate(-200px, -200px)',
          willChange: 'transform',
          filter: 'drop-shadow(0 0 8px rgba(200,50,30,0.65)) drop-shadow(0 0 3px rgba(196,149,106,0.5))',
        }}
      >
        <img
          src="/cursor-ball.png"
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />
      </div>
    </>
  );
}
