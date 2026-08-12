'use client';

// Live design-variant switch: lets the site render two distinct visual worlds
// so they can be compared on the running site. `heritage` is the existing
// look (default, unchanged); `atelier` is the new editorial "specimen" look.
// Persisted to localStorage and mirrored to <html data-variant> for CSS hooks.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type DesignVariant = 'heritage' | 'atelier';
const STORAGE_KEY = 'srm_design_variant';

interface VariantContext {
  variant: DesignVariant;
  setVariant: (v: DesignVariant) => void;
  ready: boolean;
}

const Ctx = createContext<VariantContext>({
  variant: 'heritage',
  setVariant: () => undefined,
  ready: false,
});

export function DesignVariantProvider({ children }: { children: ReactNode }) {
  // Default to `heritage` so SSR + first paint match the existing look (no flash
  // for the common case). Stored preference is applied on mount.
  const [variant, setV] = useState<DesignVariant>('heritage');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: DesignVariant = 'heritage';
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'atelier') stored = 'atelier';
    } catch {
      /* storage blocked — keep default */
    }
    setV(stored);
    document.documentElement.dataset.variant = stored;
    setReady(true);
  }, []);

  const setVariant = (v: DesignVariant) => {
    setV(v);
    document.documentElement.dataset.variant = v;
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ variant, setVariant, ready }}>{children}</Ctx.Provider>;
}

export function useDesignVariant(): VariantContext {
  return useContext(Ctx);
}
