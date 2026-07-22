import type { Metadata } from 'next';
import { Inter, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { CricketBallCursor } from '@/components/ui/CricketBallCursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  style: ['normal', 'italic'],
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
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}>
        <CricketBallCursor />
        <ScrollProgressBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
