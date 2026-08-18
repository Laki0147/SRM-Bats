import type { Metadata } from 'next';
import { Inter, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WebVitalsReporter } from '@/components/WebVitalsReporter';

// Optimize Inter font - only load weights we need
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true, // Reduce CLS
  weight: ['400', '500', '600', '700'],
});

// Optimize Crimson Pro font
const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SRM Bats - Premium Custom Cricket Bats',
  description:
    'Shop premium custom cricket bats crafted with precision. Get 10% off your first order!',
  keywords: 'cricket bats, custom cricket bats, premium bats, English willow, Kashmir willow',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#fdfcfa',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical hero image */}
        <link rel="preload" as="image" href="/images/hero/hero-stadium.svg" type="image/svg+xml" />

        {/* Inline critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS */
              *{box-sizing:border-box;margin:0;padding:0}
              html{-webkit-text-size-adjust:100%;font-family:system-ui,sans-serif;scroll-behavior:smooth}
              body{background:#fdfcfa;color:#292524;line-height:1.5;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
              .bg-cream-50{background-color:#fdfcfa}
              .text-charcoal-900{color:#1c1917}
              .min-h-screen{min-height:100vh}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <WebVitalsReporter />
        </Providers>
      </body>
    </html>
  );
}
