# Authentication Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Set Environment Variables

Edit `apps/web/.env.local`:

```bash
# Generate a secret key first:
openssl rand -base64 32
```

Then update `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret-here>
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 2: Start Development Server

```bash
cd apps/web
pnpm dev
```

### Step 3: Test Authentication

1. **Register:** http://localhost:3000/register
2. **Login:** http://localhost:3000/login
3. **Profile:** http://localhost:3000/profile (protected)

---

## 📝 What Was Installed

### Packages
- `next-auth@5.0.0-beta.31` - Authentication
- `bcryptjs@2.4.3` - Password hashing
- `@radix-ui/*` - UI primitives
- `lucide-react@0.314.0` - Icons

### Files Created (19 total)
- ✅ 5 core auth files
- ✅ 3 page components
- ✅ 7 UI components
- ✅ 1 utility file
- ✅ 3 documentation files

---

## ⚠️ Backend Integration Required

Update `src/lib/auth.ts` line 9-14 with your backend API:

```typescript
async function getUserByEmail(email: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`
  );
  if (!response.ok) return null;
  return response.json();
}
```

**Backend Endpoints Needed:**
1. `GET /api/users/email/:email` - Get user by email
2. `POST /api/auth/register` - Register new user

---

## 📚 Documentation

- **Detailed Guide:** `README_AUTH.md`
- **Setup Summary:** `SETUP_COMPLETE.md`
- **Full Report:** `../AUTHENTICATION_SETUP_REPORT_part1.md` + `part2.md`

---

## ✅ Features Included

- Email/password authentication
- JWT-based sessions (30 days)
- Protected routes
- Login & registration pages
- User profile page
- Mobile-responsive design
- Loading & error states
- TypeScript support
- Ready for OAuth (Google, GitHub, etc.)

---

## 🐛 Troubleshooting

**Session not working?**
- Check `NEXTAUTH_SECRET` is set
- Restart dev server
- Clear browser cookies

**TypeScript errors?**
- Restart TypeScript server
- Check `src/types/next-auth.d.ts` exists

**UI components not found?**
- Run `pnpm install`
- Check imports use `@/` prefix

---

**Need help?** See `README_AUTH.md` for comprehensive documentation.
