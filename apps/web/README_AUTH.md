# Authentication Setup - SRM Bats E-commerce

## Overview

This document describes the authentication implementation using NextAuth.js v5 for the SRM Bats e-commerce platform.

## Files Created

### Core Authentication

1. **`src/lib/auth.ts`** - NextAuth configuration
   - Credentials provider setup
   - JWT session strategy
   - Callbacks for JWT and session management
   - User authorization logic

2. **`src/app/api/auth/[...nextauth]/route.ts`** - NextAuth API route handler

3. **`src/middleware.ts`** - Route protection middleware
   - Protects `/profile`, `/dashboard`, `/orders`, `/cart` routes
   - Redirects unauthenticated users to login

### Type Definitions

4. **`src/types/next-auth.d.ts`** - TypeScript type extensions
   - Extended Session interface with user ID and role
   - Extended User interface
   - Extended JWT interface

### Pages

5. **`src/app/login/page.tsx`** - Login page
   - Email/password form with validation
   - Error handling
   - Loading states
   - Link to registration page
   - Responsive design with Tailwind CSS

6. **`src/app/register/page.tsx`** - Registration page
   - Full name, email, password fields
   - Password strength validation
   - Confirm password matching
   - Error handling
   - Link to login page

7. **`src/app/profile/page.tsx`** - Protected profile page
   - Displays user information
   - Sign out functionality
   - Session status indicators
   - Quick action buttons

8. **`src/app/providers.tsx`** - SessionProvider wrapper

### Environment

9. **`.env.local`** - Environment variables (not committed to git)
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - NEXT_PUBLIC_API_URL

## Configuration Details

### Authentication Strategy

- **Provider**: Credentials (email/password)
- **Session**: JWT-based (stateless)
- **Session Duration**: 30 days
- **Password Hashing**: bcryptjs

### Protected Routes

The following routes require authentication:
- `/profile/*`
- `/dashboard/*`
- `/orders/*`
- `/cart/*`

### User Model

The session includes:
```typescript
{
  id: string;
  email: string;
  name: string;
  role: string;
}
```

## Setup Instructions

### 1. Install Dependencies

Already installed:
```bash
npm install next-auth@beta bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Environment Variables

Update `.env.local` with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-a-secret-key>
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Generate a secret key:**
```bash
openssl rand -base64 32
```

### 3. Update Root Layout

Wrap your app with the SessionProvider in `src/app/layout.tsx`:

```tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 4. Backend Integration

Update `src/lib/auth.ts`:

1. Replace the `getUserByEmail` function with your actual backend API call:
```typescript
async function getUserByEmail(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`);
  if (!response.ok) return null;
  return response.json();
}
```

2. Update the registration API call in `src/app/register/page.tsx`

## Testing Authentication

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   - Navigate to `http://localhost:3000/register`
   - Fill in the form with valid data
   - Submit and verify redirect to login

3. **Test Login:**
   - Navigate to `http://localhost:3000/login`
   - Enter credentials
   - Verify redirect to profile page

4. **Test Protected Routes:**
   - Try accessing `/profile` without logging in
   - Verify redirect to login page
   - Log in and verify access granted

5. **Test Session:**
   - Refresh the page while logged in
   - Verify session persists
   - Test sign out functionality

## Known Issues & TODOs

### Current Limitations

1. **Backend Integration**: The `getUserByEmail` function is a placeholder. You need to:
   - Implement actual API calls to your backend
   - Handle API errors properly
   - Add retry logic if needed

2. **Registration**: The registration endpoint needs to be implemented in your backend

3. **Password Reset**: Forgot password functionality is not yet implemented

### Next Steps

1. **Connect to Backend API**
   - Implement user authentication endpoints
   - Add password hashing on backend
   - Set up proper error responses

2. **Add OAuth Providers**
   - Google OAuth
   - GitHub OAuth
   - Facebook OAuth

3. **Enhance Security**
   - Add rate limiting
   - Implement CSRF protection
   - Add email verification
   - Implement 2FA

4. **Add Features**
   - Password reset flow
   - Email verification
   - Remember me functionality
   - Account deletion

## OAuth Integration Guide

To add OAuth providers (e.g., Google, GitHub):

### 1. Install Additional Dependencies

```bash
npm install @auth/core
```

### 2. Get OAuth Credentials

**Google:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**GitHub:**
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Create OAuth App
- Add callback URL: `http://localhost:3000/api/auth/callback/github`

### 3. Update Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Update Auth Configuration

Add providers to `src/lib/auth.ts`:

```typescript
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({ /* existing config */ }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  // ... rest of config
};
```

### 5. Update Login Page

Add OAuth buttons to `src/app/login/page.tsx`:

```tsx
<Button
  type="button"
  variant="outline"
  onClick={() => signIn("google", { callbackUrl })}
>
  Sign in with Google
</Button>

<Button
  type="button"
  variant="outline"
  onClick={() => signIn("github", { callbackUrl })}
>
  Sign in with GitHub
</Button>
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Secret Key**: Use a strong, randomly generated secret for `NEXTAUTH_SECRET`
3. **HTTPS**: Always use HTTPS in production
4. **Password Policy**: Enforce strong passwords (implemented in registration)
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Session Security**: JWT tokens are httpOnly and secure

## Troubleshooting

### Common Issues

1. **"NEXTAUTH_SECRET not set" error**
   - Ensure `.env.local` exists and contains `NEXTAUTH_SECRET`
   - Restart the development server

2. **Session not persisting**
   - Check that SessionProvider wraps your app
   - Verify NEXTAUTH_URL matches your app URL
   - Clear browser cookies and try again

3. **Redirect loop**
   - Check middleware configuration
   - Ensure login page is not in protected routes matcher

4. **TypeScript errors**
   - Ensure `src/types/next-auth.d.ts` is included in `tsconfig.json`
   - Restart TypeScript server in your IDE

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js v5 Migration Guide](https://authjs.dev/guides/upgrade-to-v5)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
