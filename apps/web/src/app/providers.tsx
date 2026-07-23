'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // No SessionProvider needed — using JWT-based auth via Zustand store.
  // reducedMotion="user" makes every framer-motion animation honour the
  // OS "reduce motion" setting (CSS media query alone can't stop JS motion).
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
