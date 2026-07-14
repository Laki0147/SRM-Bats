'use client';

import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] origin-left"
      style={{
        scaleX,
        height: '2.5px',
        background: 'linear-gradient(90deg, #8b5e3c 0%, #c4956a 50%, #e8d9c4 100%)',
        boxShadow: '0 0 8px rgba(196,149,106,.6)',
      }}
    />
  );
}
