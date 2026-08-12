# SRM Bats - Premium Cricket Bat E-commerce Platform

> **Handmade Custom Cricket Bats | Premium Brand Experience**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-yellow)]()

---

## 🎯 Project Overview

**SRM Bats** is a premium e-commerce platform for a handmade custom cricket bat manufacturing business based in India. This is NOT a template website—it's a production-ready platform designed to create a memorable brand experience comparable to premium sports brands like Nike, Wilson, and Gray-Nicolls.

### Key Features
- 🏏 **Premium Animations**: Custom cricket ball cursor, cinematic hero, 3D product cards
- 🔄 **360° Product Views**: Interactive Three.js product viewer
- 💳 **Razorpay Integration**: Secure payment processing for Indian market
- 📱 **Mobile-First**: Optimized for mobile shopping experience
- ⚡ **Lightning Fast**: 95+ Lighthouse score, <2s page load
- 🎨 **AI-Generated Assets**: Professional product renders and lifestyle images
- 🔐 **Secure**: PCI DSS compliant, HTTPS, JWT authentication
- 📊 **Analytics**: GA4, GTM, Microsoft Clarity, Meta Pixel

---

## 📁 Project Structure

```
srm-bats/
├── apps/
│   ├── web/              # Next.js 14+ frontend (App Router)
│   └── api/              # NestJS backend
├── packages/
│   ├── database/         # Prisma schema & migrations
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configurations
├── docs/                 # Documentation
│   ├── PROJECT_ANALYSIS_part1.md
│   ├── PROJECT_ANALYSIS_part2.md
│   ├── IMPLEMENTATION_ROADMAP_part1.md
│   ├── IMPLEMENTATION_ROADMAP_part2.md
│   ├── PRISMA_SCHEMA_part1.prisma
│   └── PRISMA_SCHEMA_part2.prisma
└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- pnpm (recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd srm-bats

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

### Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payments
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Email
RESEND_API_KEY="your-resend-key"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion + GSAP + Three.js
- **State**: Zustand + React Server Components
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js v5

### Backend
- **Framework**: NestJS 10+
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Caching**: Redis
- **Queue**: BullMQ
- **API**: RESTful with OpenAPI/Swagger

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Better Stack

---

## 📚 Documentation

### Core Documents
1. **[Project Analysis Part 1](PROJECT_ANALYSIS_part1.md)** - Requirements, architecture, database design
2. **[Project Analysis Part 2](PROJECT_ANALYSIS_part2.md)** - Risk assessment, security, recommendations
3. **[Implementation Roadmap Part 1](IMPLEMENTATION_ROADMAP_part1.md)** - Week 1-8 detailed tasks
4. **[Implementation Roadmap Part 2](IMPLEMENTATION_ROADMAP_part2.md)** - Week 9-16 detailed tasks
5. **[Prisma Schema](PRISMA_SCHEMA_part1.prisma)** - Complete database schema

### Key Sections
- **Requirements**: See PROJECT_ANALYSIS_part1.md
- **Architecture**: See PROJECT_ANALYSIS_part1.md → Technical Architecture
- **Database Schema**: See PRISMA_SCHEMA files
- **Implementation Plan**: See IMPLEMENTATION_ROADMAP files
- **Risk Mitigation**: See PROJECT_ANALYSIS_part2.md → Risk Assessment

---

## 🎨 Design System

### Colors
```css
/* Primary - Cricket Green */
--primary: #22c55e

/* Secondary - Willow Wood */
--secondary: #eab308

/* Accent - Cricket Ball Red */
--accent: #ef4444
```

### Typography
- **Headings**: Inter Bold (700)
- **Body**: Inter Regular (400)
- **Display**: Bebas Neue

### Animation Principles
- **Easing**: Custom cubic-bezier for premium feel
- **Duration**: 0.3s micro, 0.6s transitions
- **Spring**: Natural physics-based animations

---

## 📦 Key Features

### Customer Features
- ✅ User authentication (Email, Google, Mobile OTP)
- ✅ Product catalog with advanced filtering
- ✅ 360° product viewer
- ✅ Shopping cart with animations
- ✅ Wishlist & product comparison
- ✅ Secure checkout with Razorpay
- ✅ Order tracking
- ✅ Product reviews & ratings
- ✅ Blog for cricket tips
- ✅ Coupon system

### Admin Features
- ✅ Complete dashboard
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Inventory tracking with alerts
- ✅ Customer management
- ✅ Coupon generation
- ✅ Review moderation
- ✅ Analytics & reports

### Premium UX
- ✅ Custom cricket ball cursor
- ✅ Cinematic hero with slow-motion video
- ✅ Animated loading screen
- ✅ 3D product card hover effects
- ✅ Flying cart animation
- ✅ Smooth page transitions
- ✅ Confetti on order success

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Docker
```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

---

## 📊 Performance Targets

- **Lighthouse Score**: 95+
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Core Web Vitals**: All green
- **Uptime**: 99.9%

---

## 🔒 Security

- ✅ HTTPS everywhere
- ✅ JWT with refresh tokens
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention (Prisma)
- ✅ Security headers (Helmet)
- ✅ Input validation (Zod)

---

## 🗓️ Timeline

**Total Duration**: 16-20 weeks

- **Weeks 1-2**: Foundation (setup, database, auth)
- **Weeks 3-4**: Core e-commerce (products, cart, checkout)
- **Weeks 5-6**: Admin dashboard
- **Weeks 7-8**: Enhanced features (reviews, coupons, blog)
- **Weeks 9-10**: Premium animations
- **Weeks 11-12**: SEO & performance
- **Weeks 13-14**: Testing & deployment
- **Weeks 15-16**: Polish & launch

---

## 🎯 Success Metrics

### Technical KPIs
- Lighthouse Score: 95+
- Page Load Time: <2s
- Error Rate: <0.1%
- Test Coverage: 80%+

### Business KPIs
- Conversion Rate: 2-3%
- Cart Abandonment: <70%
- Average Order Value: ₹8,000+
- Customer Retention: 30%+

---

## 🤝 Contributing

This is a proprietary project. For internal team members:

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
5. Code review required

---

## 📝 License

Proprietary - All rights reserved

---

## 📞 Support

- **Technical Issues**: [Internal Slack Channel]
- **Business Questions**: [Product Manager Email]
- **Emergency**: [On-call Phone]

---

## 🙏 Acknowledgments

- Design inspiration: Nike, Wilson, Gray-Nicolls
- Animation references: Awwwards, Dribbble
- Community support: Next.js, NestJS, Prisma communities

---

**Built with ❤️ for cricket lovers | SRM Bats**
