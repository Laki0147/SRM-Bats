# Theme System Documentation

## Overview
The SRM Bats e-commerce site uses a centralized theme system for easy color customization. All theme colors are defined in ONE location for easy maintenance and future theme switching.

---

## Where to Change Theme Colors

### Primary Location: `tailwind.config.ts`

**File Path:** `C:\new-project\apps\web\tailwind.config.ts`

All colors are defined in the `theme.extend.colors` section:

```typescript
colors: {
  // Primary: Cricket Green (pitch/field)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    // ... more shades
    500: '#22c55e',  // Main green - CHANGE THIS
    600: '#16a34a',
    // ... more shades
  },
  // Secondary: Cricket Ball Red
  secondary: {
    // Similar structure
    500: '#ef4444',  // Main red - CHANGE THIS
  },
  // Accent: Royal Blue
  accent: {
    500: '#3b82f6',  // Main blue - CHANGE THIS
  },
}
```

### Secondary Location: `globals.css`

**File Path:** `C:\new-project\apps\web\src\app\globals.css`

CSS custom properties for runtime values:

```css
:root {
  --color-primary: 34 197 94;        /* RGB values for primary */
  --color-secondary: 239 68 68;      /* RGB values for secondary */
  --color-accent: 59 130 246;        /* RGB values for accent */
}
```

---

## Current Theme: Cricket-Inspired

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Green** | `#22c55e` | Main brand color, buttons, links |
| **Secondary Red** | `#ef4444` | Cricket ball, accents, alerts |
| **Accent Blue** | `#3b82f6` | Team colors, highlights |
| **Wood Tones** | `#78716c` | Bat handle, neutral elements |

### Design Inspiration
- 🏏 **Green:** Cricket pitch/field
- 🔴 **Red:** Cricket ball
- 🔵 **Blue:** Team jerseys
- 🪵 **Wood:** Bat craftsmanship

---

## How to Change Theme

### Option 1: Quick Color Swap (5 minutes)

1. **Open** `tailwind.config.ts`
2. **Find** the main color values (marked with `// Main green`, etc.)
3. **Replace** with your brand colors:
   ```typescript
   primary: {
     500: '#YOUR_PRIMARY_COLOR',
   }
   ```
4. **Update** `globals.css` RGB values to match
5. **Restart** dev server: `pnpm dev`

### Option 2: Full Palette Customization (15 minutes)

1. **Generate** a full color palette using a tool like:
   - [Tailwind Color Generator](https://uicolors.app/create)
   - [Coolors](https://coolors.co/)

2. **Replace** entire color objects in `tailwind.config.ts`

3. **Update** CSS variables in `globals.css`

4. **Test** all pages to ensure contrast ratios meet WCAG AA standards

---

## Color Usage Guidelines

### Primary Color (Green)
- Main CTAs ("Shop Now", "Add to Cart")
- Active navigation items
- Success messages
- Primary buttons

### Secondary Color (Red)
- Sale badges
- Urgent notifications
- Delete actions
- Cricket ball elements

### Accent Color (Blue)
- Links
- Info messages
- Secondary buttons
- Hover states

### Neutral Colors (Gray/Wood)
- Text
- Borders
- Backgrounds
- Disabled states

---

## Accessibility Notes

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Lighthouse
- axe DevTools

---

## Components Using Theme Colors

### Direct Usage (via Tailwind classes)
- `bg-primary-600` - Primary background
- `text-primary-600` - Primary text
- `border-primary-600` - Primary border
- `hover:bg-primary-700` - Hover state

### Components with Theme Integration
1. **Header** - Logo colors, navigation
2. **Hero Section** - Gradient text, buttons
3. **Product Cards** - Hover effects, badges
4. **Buttons** - All button variants
5. **Forms** - Focus states, validation
6. **Footer** - Brand colors

---

## Future Enhancements

### Dark Mode
Dark mode support is prepared in `globals.css`:
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme colors */
  }
}
```

### Theme Switcher
To add a theme switcher:
1. Create theme configurations in a separate file
2. Use React Context or Zustand for theme state
3. Apply theme classes dynamically
4. Store preference in localStorage

---

## Troubleshooting

### Colors Not Updating?
1. **Restart dev server** - Tailwind needs to rebuild
2. **Clear `.next` cache** - `rm -rf .next`
3. **Check syntax** - Ensure valid hex/RGB values
4. **Verify imports** - Component imports `globals.css`

### Contrast Issues?
1. **Use lighter shades** for backgrounds (50-100)
2. **Use darker shades** for text (700-900)
3. **Test with tools** mentioned above
4. **Adjust opacity** if needed

---

## Quick Reference

### Files to Edit for Theme Changes
```
C:\new-project\apps\web\
├── tailwind.config.ts          ← PRIMARY: All color definitions
└── src\app\globals.css         ← SECONDARY: CSS variables
```

### No Changes Needed In
- Individual component files
- Page files
- Layout files

All components automatically use the centralized theme!

---

**Last Updated:** July 13, 2026  
**Theme Version:** 1.0 - Cricket Inspired  
**Status:** Production Ready
