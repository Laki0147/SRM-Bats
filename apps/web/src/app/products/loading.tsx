// Instant navigation feedback for /products (App Router Suspense fallback).
// Without this, the router sits on the previous page until the route is ready.
export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-5"
      style={{ background: '#2c1f14' }}
    >
      <div className="relative h-12 w-12" role="status" aria-label="Loading">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(196,149,106,.18)]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#c4956a]" />
      </div>
      <p
        className="font-sc text-[12px] uppercase tracking-[3px]"
        style={{ color: '#a09588', fontVariant: 'small-caps' }}
      >
        Loading the collection
      </p>
    </div>
  );
}
