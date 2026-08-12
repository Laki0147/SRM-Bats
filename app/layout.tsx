import type { Metadata } from 'next'
import { Inter, Crimson_Pro } from 'next/font/google'
import './globals.css'

// Primary font: Inter for headings and body (Apple/Rapha pattern)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Heritage font: Crimson Pro for quotes and storytelling
const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const meta Metadata = {
  title: 'SRM Bats - Hand-Crafted English Willow Cricket Bats',
  description: 'Premium cricket equipment crafted from the finest English willow. Expert coaching and custom fitting services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
