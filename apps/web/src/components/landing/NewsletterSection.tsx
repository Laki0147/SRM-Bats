'use client';

import { useState } from 'react';

const perks = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-[15px] h-[15px]" stroke="#c4956a" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Early Access',
    sub: 'New Collections',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-[15px] h-[15px]" stroke="#c4956a" strokeWidth={1.6}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Exclusive Offers',
    sub: 'Members Only',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-[15px] h-[15px]" stroke="#c4956a" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Expert Tips',
    sub: 'From the Pros',
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
    <div className="py-14 px-6 lg:px-[52px]" style={{ background: '#3d2b1f' }}>
      <div className="max-w-[940px] mx-auto grid md:grid-cols-[1fr_auto_200px] gap-12 items-center">
        {/* Left */}
        <div>
          <span className="font-sc block text-[11px] font-semibold tracking-[4px] uppercase mb-[10px]" style={{ color: '#c4956a', fontVariant: 'small-caps' }}>
            Join the SRM Family
          </span>
          <h3 className="font-display text-[22px] font-bold italic leading-[1.4]" style={{ color: '#f2ebe0' }}>
            Exclusive offers, new arrivals &amp; cricket insights.
          </h3>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="font-body text-[13px] font-semibold py-4 px-6 rounded-full" style={{ color: '#c4956a', background: 'rgba(196,149,106,.1)', border: '1px solid rgba(196,149,106,.2)' }}>
            ✓ You're subscribed!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex rounded-full overflow-hidden min-w-[320px] border"
            style={{ background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.09)' }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-[14px] bg-transparent outline-none font-body text-[13px] placeholder:opacity-60"
              style={{ color: '#f2ebe0', caretColor: '#c4956a' }}
            />
            <button
              type="submit"
              className="font-body font-semibold text-[11px] tracking-[1.5px] uppercase px-[22px] py-[14px] transition-colors duration-200"
              style={{ background: '#8b5e3c', color: '#f2ebe0', borderRadius: '0 100px 100px 0' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#5c3d2e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#8b5e3c')}
            >
              Subscribe
            </button>
          </form>
        )}

        {/* Perks */}
        <div className="flex flex-col gap-3">
          {perks.map(p => (
            <div key={p.title} className="flex items-center gap-[11px]">
              <div className="w-[34px] h-[34px] shrink-0 rounded-[8px] flex items-center justify-center" style={{ background: 'rgba(196,149,106,.1)' }}>
                {p.icon}
              </div>
              <div>
                <strong className="font-body block text-[12px] font-bold" style={{ color: '#e8d9c4' }}>{p.title}</strong>
                <span className="font-body text-[10px]" style={{ color: '#a09588' }}>{p.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
