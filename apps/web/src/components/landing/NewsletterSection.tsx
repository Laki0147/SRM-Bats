'use client';

import { useState } from 'react';

const perks = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[15px] w-[15px]"
        stroke="#c4956a"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'First Pick',
    sub: 'Of match-grade clefts',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[15px] w-[15px]"
        stroke="#c4956a"
        strokeWidth={1.6}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Care & Knock-In',
    sub: 'Guides from the workshop',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[15px] w-[15px]"
        stroke="#c4956a"
        strokeWidth={1.6}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Player Stories',
    sub: 'From the SRM bench',
  },
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="px-6 py-14 lg:px-[52px]"
      style={{ background: '#2c1f14', borderTop: '1px solid rgba(196,149,106,.10)' }}
    >
      <div className="mx-auto grid max-w-[940px] items-center gap-12 md:grid-cols-[1fr_auto_200px]">
        {/* Left */}
        <div>
          <span
            className="font-sc mb-[10px] block text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            From the Workbench
          </span>
          <h3
            className="font-display text-[22px] font-bold italic leading-[1.4]"
            style={{ color: '#f2ebe0' }}
          >
            First pick of the bench &mdash; and the know-how to keep it.
          </h3>
        </div>

        {/* Form */}
        {submitted ? (
          <div
            className="rounded-[6px] px-6 py-4 font-body text-[13px] font-semibold"
            style={{
              color: '#c4956a',
              background: 'rgba(196,149,106,.1)',
              border: '1px solid rgba(196,149,106,.2)',
            }}
            role="status"
            aria-live="polite"
          >
            ✓ You&apos;re subscribed!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-w-[320px] overflow-hidden rounded-[6px] border"
            style={{ background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.09)' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-transparent px-5 py-[14px] font-body text-[13px] outline-none placeholder:opacity-60"
              style={{ color: '#f2ebe0', caretColor: '#c4956a' }}
            />
            <button
              type="submit"
              className="px-[22px] py-[14px] font-body text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors duration-200"
              style={{ background: '#8b5e3c', color: '#f2ebe0', borderRadius: '0 6px 6px 0' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#5c3d2e')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#8b5e3c')}
            >
              Subscribe
            </button>
          </form>
        )}

        {/* Perks */}
        <div className="flex flex-col gap-3">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-[11px]">
              <div
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px]"
                style={{ background: 'rgba(196,149,106,.1)' }}
              >
                {p.icon}
              </div>
              <div>
                <strong
                  className="block font-body text-[12px] font-bold"
                  style={{ color: '#e8d9c4' }}
                >
                  {p.title}
                </strong>
                <span className="font-body text-[10px]" style={{ color: '#a09588' }}>
                  {p.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
