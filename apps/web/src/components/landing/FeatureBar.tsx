'use client';

const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="#8b5e3c"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Individually Customised',
    sub: 'Every bat. Your game.',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="#8b5e3c"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Premium English Willow',
    sub: 'Grade 1 & 2 only',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="#8b5e3c" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: 'Perfectly Balanced',
    sub: 'Power meets control',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="#8b5e3c"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Match Ready',
    sub: 'Knocked & tested',
  },
];

export function FeatureBar() {
  return (
    <div
      className="border-b border-t"
      style={{ background: '#eed3a8', borderColor: 'rgba(196,149,106,.14)' }}
    >
      <div className="mx-auto grid max-w-[980px] grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="flex items-center gap-4 px-6 py-[22px]"
            style={{
              borderRight: i < features.length - 1 ? '1px solid rgba(196,149,106,.10)' : 'none',
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
              style={{ background: 'rgba(139,94,60,.09)' }}
            >
              {f.icon}
            </div>
            <div>
              <strong
                className="mb-[2px] block font-body text-[12px] font-bold"
                style={{ color: '#2c1f14' }}
              >
                {f.title}
              </strong>
              <span className="font-body text-[11px]" style={{ color: '#6b6358' }}>
                {f.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
