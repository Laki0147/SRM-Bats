"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // No SessionProvider needed — using JWT-based auth via Zustand store
  return <>{children}</>;
}
