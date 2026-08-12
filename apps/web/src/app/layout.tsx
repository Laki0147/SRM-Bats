import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { CricketBallCursor } from '@/components/ui/CricketBallCursor';
import { VariantSwitcher } from '@/components/VariantSwitcher';

// One sans (Inter) via next/font. The serif (Cormorant Garamond / SC) and
// mono (DM Mono) load via the @import in globals.css. Crimson Pro and Space
// Grotesk were retired — the page now runs on a single serif + one mono.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SRM Bats - Premium Custom Cricket Bats',
  description:
    'Shop premium custom cricket bats crafted with precision. Get 10% off your first order!',
  keywords: 'cricket bats, custom cricket bats, premium bats, English willow, Kashmir willow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CricketBallCursor />
        <NavigationProgress />
        <ScrollProgressBar />
        <Providers>
          {children}
          <VariantSwitcher />
        </Providers>
      </body>
    </html>
  );
}
