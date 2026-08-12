'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Top-of-page progress bar for App Router soft navigations.
 *
 * Next.js does client-side navigation, so the browser's native reload/progress
 * indicator never fires — clicking a link feels like "nothing happens, then the
 * page swaps". This bar fills that gap: it starts the instant an internal link
 * is clicked (or back/forward is used) and completes when the new route commits
 * (`usePathname` changes). A safety timeout guarantees it never sticks if a
 * navigation resolves without a pathname change (e.g. query-only) or is aborted.
 *
 * Styled to match ScrollProgressBar so the two read as one design language.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  const inFlight = useRef(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

  useEffect(() => {
    const start = () => {
      if (inFlight.current) return; // a navigation is already animating
      inFlight.current = true;

      if (hide.current) clearTimeout(hide.current);
      setActive(true);
      setProgress(8);

      stopTrickle();
      trickle.current = setInterval(() => {
        // Ease toward 90% and hold — the last 10% lands when the route commits.
        setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
      }, 180);

      // Never let the bar hang if the route resolves without a pathname change.
      if (safety.current) clearTimeout(safety.current);
      safety.current = setTimeout(finish, 8000);
    };

    const finish = () => {
      if (!inFlight.current) return;
      inFlight.current = false;
      stopTrickle();
      if (safety.current) clearTimeout(safety.current);
      setProgress(100);
      hide.current = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 280);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (anchor.hasAttribute('download')) return;

      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same page (only a hash or identical URL) → no navigation happens.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }
      start();
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', start);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', start);
      stopTrickle();
      if (hide.current) clearTimeout(hide.current);
      if (safety.current) clearTimeout(safety.current);
    };
  }, []);

  // The new route has committed — complete the bar. Guarded so it ignores the
  // initial mount (no navigation was in flight then).
  useEffect(() => {
    if (!inFlight.current) return;
    inFlight.current = false;
    stopTrickle();
    if (safety.current) clearTimeout(safety.current);
    setProgress(100);
    hide.current = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 280);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300]"
      style={{
        width: `${progress}%`,
        height: '3px',
        opacity: active ? 1 : 0,
        background: 'linear-gradient(90deg, #8b5e3c 0%, #c4956a 50%, #e8d9c4 100%)',
        boxShadow: '0 0 10px rgba(196,149,106,.7)',
        transition: 'width 180ms ease-out, opacity 300ms ease-out',
      }}
    />
  );
}
