# SRM Bats — Design System

> Heritage-craft e-commerce for premium cricket bats. Platform: **web**.
> This document records the incumbent design language and the Impeccable
> elevation pass on branch `feature/impeccable-redesign-2026-07-26`.

## Design principle

The store sells hand-made objects, so the interface should feel **made, not generated**: warm materials, restrained motion, real typographic hierarchy, and craft in the details. Emphasis comes from **weight, size, and space** — never from gradient fills, glass, or decorative shadow.

---

## Foundations (single source of truth)

### Color — heritage palette

Semantic tokens live in `tailwind.config.ts` under `heritage.*` and as CSS vars in `globals.css`. Use these; do **not** reach for the legacy `willow/leather/field/carbon/primary/...` palettes (retained only for backward-compat — see Roadmap).

| Role                      | Token                                 | Hex       |
| ------------------------- | ------------------------------------- | --------- |
| Ink / headings            | `heritage.text.primary` (`--soil`)    | `#2c1f14` |
| Body text                 | `heritage.text.secondary` (`--stone`) | `#6b6358` |
| Muted text                | `heritage.text.muted` (`--ash`)       | `#a09588` |
| Primary accent            | `heritage.bronze` (`--terracotta`)    | `#8b5e3c` |
| Secondary accent          | `heritage.gold` (`--sand`)            | `#c4956a` |
| Page background           | `heritage.background` (`--parchment`) | `#f2ebe0` |
| Surface                   | `heritage.surface` (`--warm-white`)   | `#f7f2ea` |
| Card                      | `heritage.card` (`--cream`)           | `#faf6f0` |
| Border                    | `heritage.border` (`--linen`)         | `#e8d9c4` |
| Dark canvas (landing/nav) | `--soil`                              | `#2c1f14` |

Contrast: body/placeholder ≥ 4.5:1, large text ≥ 3:1. On the dark canvas, secondary text is tinted from the palette (`ash`/`linen`), never neutral gray.

### Type

- **Display / headings:** Cormorant Garamond (`font-display`) — tracking floor `-0.02em`, balanced headings.
- **Body / UI:** Inter (`font-body`, via `next/font`).
- **Small-caps kickers:** Cormorant SC (`font-sc`).
- **Data / measurement:** DM Mono (`font-mono`) — used for prices, specs, and figures, not as a "technical" costume.
- Scale utilities: `.text-display-xl/lg/md`, `.text-body-lg/body/sm`. Body measure target 65–75ch.

### Spacing, radius, elevation, motion

- **Spacing:** 4/8-based; sections use `.section-spacing`; page gutters via `.container-premium` (max 1400px).
- **Radius:** rectangular-with-slight-curve — `button: 6px`, `product: 20px`, `card: 24px`. No pill-shaped CTAs.
- **Elevation:** warm-tinted shadows with real offset + blur (`ds-card`, `ds-hero`, `.shadow-subtle/-elevated`). No zero-offset colored halos.
- **Motion:** exponential ease-out from an already-visible default; one authored moment per section, not an identical entrance everywhere. `prefers-reduced-motion` is respected globally.

### Signature

The **willow-grain** motif (`.willow-seam`, `.willow-grain`) — faint vertical wood-grain at major section seams and one panel. It is the single material through-line and should stay sparing.

---

## Components (in-use)

- **Navigation:** `components/landing/SiteNavbar` (dark, fixed, blur-backed) + `SiteFooter`.
- **Home (`/`):** `HeroSection → CollectionsSection → BestSellersSection → CraftSection → ReviewsSection → NewsletterSection`.
- **Buttons:** `.btn-primary` (bronze fill, lift-on-hover, `:active` press) / `.btn-secondary` (outline → fill).
- **Cards:** `.card-premium`.
- Interior pages (`/products`, `/cart`, `/checkout`, `/account/*`) style inline with heritage hexes.

> Note: `/landing` is an **alternate** composition using `PremiumHeader/PremiumFooter/ProductShowcase/FeaturesSection/TestimonialsSection/CTASection`. The canonical home is `/`.

---

## Impeccable elevation pass — changes made

1. **Removed dead duplicates** (7 files): `hero-section`, `features-section`, `how-it-works`, `testimonials-section`, `hero-section-redesign`, `features-section-redesign`, `FeatureBar` — all had 0 imports and carried the only `.glass`/`.gradient-text` usage.
2. **Removed AI-slop utilities:** `.glass` (glassmorphism) and `.gradient-text` — craft-floor bans; unused after (1).
3. **Accessibility — cursor:** the site-wide forced `cursor: none` (custom cricket cursor) now (a) only applies with `prefers-reduced-motion: no-preference`, and (b) keeps a real cursor on `input/textarea/select` and pointer affordances on links/buttons, so forms stay usable.
4. **Button craft:** dropped `scale(1.02)`-on-hover (a generated tell); lift-only hover + a real `:active` press state.
5. **Navbar a11y:** `aria-current` on the active link, `aria-haspopup`/`aria-expanded` + `role="menu"` on the account menu, and dismissal on outside-click / `Escape`.

**Verification:** Impeccable's mechanical detector reports **0 anti-patterns** across `landing`, `products`, `product`, `cart`, `checkout`. Type-check is clean for all touched files.

---

## Roadmap (optional, prioritized — not yet done)

Deeper work worth a dedicated pass, each verifiable per-surface:

1. **Token consolidation:** migrate remaining components off the legacy palettes onto `heritage.*`, then delete the dead palettes from `tailwind.config.ts` (large, mechanical, needs per-reference verification).
2. **Forms:** unify field styling, inline validation on blur, visible labels + helper text across checkout/auth.
3. **States:** consistent skeleton/loading, empty, and error states across product/cart/orders.
4. **Product surfaces:** gallery, spec table (DM Mono figures), and add-to-cart affordance polish on `/products/[slug]`.
5. **Responsive audit:** verify 375 / 768 / 1024 / 1440 for overflow, type scaling, and 44px touch targets.
6. **Perf:** image `sizes`/priority, route-level code-split of heavy 3D/animation deps on the landing hero.

No functional/routing/API/checkout behavior was changed by this pass.
