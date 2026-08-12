# Premium Cricket Bats Landing Page - Heritage Atelier Design

## Overview

This is a production-ready, premium mobile-first landing page implementation based on the **Heritage Atelier** design concept (Concept 1 from the design system). The page features sophisticated animations, responsive design, and premium UI/UX patterns inspired by luxury brands like Hermès, Brunello Cucinelli, and Best Made Co.

## Design System: Heritage Atelier

### Color Palette

```css
/* Primary Colors */
--color-warm-cream: #F8F6F1       /* Main background */
--color-workshop-charcoal: #3A3935 /* Primary text */
--color-walnut-brown: #8B7355      /* Accents, CTAs */

/* Secondary Colors */
--color-canvas-beige: #E8E3DB      /* Section backgrounds */
--color-workshop-green: #7C8B7E    /* Success states */
--color-aged-brass: #B8956A        /* Premium highlights */

/* Text Colors */
--color-headings: #2A2825          /* Soft black */
--color-body: #5A5753              /* Warm gray */
--color-captions: #8B8781          /* Lighter gray */
```

### Typography

**Headings:** Crimson Pro (elegant serif with craftsmanship feel)
- Hero: 72px / 700 weight / -0.02em letter-spacing
- H2: 48px / 600 weight / -0.01em letter-spacing
- H3: 32px / 600 weight / normal letter-spacing

**Body:** Inter (refined sans-serif)
- Regular: 18px / 400 weight / 1.7 line-height
- Large: 22px / 400 weight / 1.6 line-height
- Small: 15px / 400 weight / 1.6 line-height

### Shadows (Soft & Realistic)

```css
/* Elevated elements */
box-shadow: 0 20px 60px rgba(58, 57, 53, 0.08), 0 8px 24px rgba(58, 57, 53, 0.04);

/* Subtle depth */
box-shadow: 0 4px 16px rgba(58, 57, 53, 0.03);

/* Interactive hover */
box-shadow: 0 28px 80px rgba(58, 57, 53, 0.12), 0 12px 32px rgba(58, 57, 53, 0.06);
```

## Component Architecture

### 1. PremiumHeader (`/components/landing/PremiumHeader.tsx`)

**Features:**
- Glossy, scroll-aware header with backdrop blur
- Smooth color transitions on scroll
- Responsive mobile menu with staggered animations
- Shopping cart with item count badge
- Touch-friendly on mobile

**Animations:**
- Background opacity: 0 → 0.95 on scroll
- Shadow intensifies on scroll
- Mobile menu: slide-in with staggered item animations
- Logo hover: subtle scale effect

**Responsive Breakpoints:**
- Mobile: < 1024px (hamburger menu)
- Desktop: ≥ 1024px (full navigation)

### 2. HeroSection (`/components/landing/HeroSection.tsx`)

**Features:**
- Full viewport height hero
- Asymmetric 40/60 layout (text/product)
- Floating product with subtle animation
- Eyebrow text with brand heritage
- Prominent CTA with gradient hover
- Craftsmanship badge
- Scroll indicator

**Animations:**
- Content: fade-in with stagger (0.2s delays)
- Product: gentle float (4s loop)
- CTA: scale + lift on hover
- Scroll indicator: bounce loop

**Mobile Optimization:**
- Stacked layout on mobile
- Touch-optimized button sizes (min 44px)
- Reduced font sizes for readability

### 3. FeaturesSection (`/components/landing/FeaturesSection.tsx`)

**Features:**
- Three-column grid layout
- Icon + title + description cards
- Individual hover animations
- Scroll-triggered reveals

**Animations:**
- Cards: lift on hover (-8px)
- Icons: scale + rotate on hover
- Links: slide arrow on hover
- Scroll reveal: fade-in with upward motion

**Responsive:**
- Mobile: Single column
- Tablet: Two columns
- Desktop: Three columns

### 4. ProductShowcase (`/components/landing/ProductShowcase.tsx`)

**Features:**
- Three premium product cards
- Star ratings
- Specifications display
- Hover overlay with CTA
- Image zoom on hover

**Animations:**
- Card: lift on hover (-12px)
- Image: scale 1.05 on hover
- Overlay: fade-in with button slide-up
- Shadow: intensifies on hover

**Responsive:**
- Mobile: Single column, full-width cards
- Tablet: Two columns
- Desktop: Three columns

### 5. TestimonialsSection (`/components/landing/TestimonialsSection.tsx`)

**Features:**
- Three testimonial cards
- Customer avatars with initials
- Quote styling with decorative quote icon
- Stats bar with key metrics

**Animations:**
- Cards: lift on hover
- Quote icon: scale-in on view
- Stats: count-up animation on view

**Stats Displayed:**
- 125+ Years of Heritage
- 50,000+ Bats Crafted
- 4.9/5 Customer Rating
- 95% Repeat Customers

### 6. CTASection (`/components/landing/CTASection.tsx`)

**Features:**
- Dark background with gradient overlays
- Two-column layout (CTA + Contact)
- Contact cards with hover effects
- Workshop hours display
- Craftsman quote

**Animations:**
- Buttons: scale + lift on hover
- Contact cards: slide-right on hover
- Background: subtle gradient animation

### 7. PremiumFooter (`/components/landing/PremiumFooter.tsx`)

**Features:**
- Newsletter subscription form
- Four-column link organization
- Social media links
- Brand information
- Legal links
- Craftsman quote

**Sections:**
- Shop
- Services
- Company
- Support

## Animation System

### Framer Motion Implementation

**ScrollAnimationWrapper** (`/components/landing/ScrollAnimationWrapper.tsx`)
- Reusable scroll-triggered animation wrapper
- Uses IntersectionObserver for performance
- Configurable delay and duration
- Once-only animation (no re-trigger)

**Animation Principles:**
1. **Smooth Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
2. **Performance:** GPU-accelerated transforms
3. **Staggered Reveals:** 0.1-0.15s delays between items
4. **Reduced Motion Support:** Respects user preferences

### Key Animation Patterns

```tsx
// Fade-in with upward motion
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}

// Hover lift
whileHover={{ y: -8, scale: 1.02 }}
transition={{ duration: 0.4 }}

// Scale on tap
whileTap={{ scale: 0.98 }}
```

## Responsive Strategy

### Mobile-First Approach

**Base Styles:** 320px+ (mobile)
```css
.text-display-xl {
  font-size: 56px; /* Mobile */
}

@media (min-width: 1024px) {
  .text-display-xl {
    font-size: 72px; /* Desktop */
  }
}
```

### Breakpoints

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1399px
- **Wide:** 1400px+

### Touch Optimization

- Minimum touch target: 44x44px (WCAG AAA)
- Increased spacing on mobile
- Larger tap areas for buttons
- Swipe-friendly carousels

## Performance Optimizations

### 1. GPU Acceleration

```css
.will-change-transform {
  will-change: transform;
}
```

### 2. Image Optimization

- Use Next.js `<Image>` component
- Lazy loading for below-fold images
- WebP format with fallbacks
- Responsive image sizes

### 3. Animation Performance

- Transform and opacity only (GPU-accelerated)
- `will-change` for animated elements
- IntersectionObserver for scroll triggers
- Debounced scroll handlers

### 4. Code Splitting

- Component-level code splitting
- Dynamic imports for heavy components
- Route-based splitting

## Accessibility

### WCAG 2.1 AA Compliance

1. **Color Contrast:**
   - Text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - All text meets standards

2. **Keyboard Navigation:**
   - All interactive elements focusable
   - Focus indicators visible
   - Logical tab order

3. **Screen Readers:**
   - Semantic HTML
   - ARIA labels for icons
   - Alt text for images

4. **Motion:**
   - `prefers-reduced-motion` support
   - Animations disabled when requested

## File Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main landing page
│   ├── globals.css          # Global styles + design system
│   └── landing/
│       └── page.tsx         # Alternative landing route
├── components/
│   └── landing/
│       ├── PremiumHeader.tsx
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── ProductShowcase.tsx
│       ├── TestimonialsSection.tsx
│       ├── CTASection.tsx
│       ├── PremiumFooter.tsx
│       └── ScrollAnimationWrapper.tsx
└── lib/
    └── design-system.ts     # Design tokens
```

## Usage

### Development

```bash
cd apps/web
pnpm install
pnpm dev
```

Visit: `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Customization Guide

### 1. Colors

Edit `apps/web/src/app/globals.css`:

```css
:root {
  --color-warm-cream: #YOUR_COLOR;
  --color-walnut-brown: #YOUR_COLOR;
  /* ... */
}
```

### 2. Typography

Edit `apps/web/src/app/layout.tsx`:

```tsx
import { YourFont } from 'next/font/google'

const yourFont = YourFont({
  subsets: ['latin'],
  variable: '--font-your-font',
})
```

### 3. Content

Edit component files directly:
- Hero text: `HeroSection.tsx`
- Features: `FeaturesSection.tsx`
- Products: `ProductShowcase.tsx`
- Testimonials: `TestimonialsSection.tsx`

### 4. Animations

Adjust in component files:

```tsx
transition={{
  duration: 0.6,  // Change duration
  delay: 0.2,     // Change delay
  ease: [0.4, 0, 0.2, 1]  // Change easing
}}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

## 