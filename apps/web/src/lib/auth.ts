/**
 * next-auth credentials config.
 *
 * NOTE: every lint exemption below stems from ONE unfixed problem — this file
 * annotates the config with the v4 `NextAuthOptions` type, which next-auth v5
 * does not export. The annotation therefore resolves to `any`, and every
 * property access inside the callbacks becomes an "unsafe" access. The real fix
 * is migrating this file to `NextAuthConfig` (v5 also changes the authorize()
 * return contract), which is tracked with the wider type-check backlog rather
 * than done here — nothing in the running app calls next-auth, since login goes
 * through useAuthStore against the API directly.
 *
 * The sibling lib/api.ts carries the same exemptions for the same reason.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// This module's authorize() runs on the SERVER, where a relative URL has no
// base to resolve against. NEXT_PUBLIC_API_URL is now the relative same-origin
// path used by the browser (`/backend`), so server-side calls must use the
// internal absolute address of the api container instead.
const API_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Invalid email or password');
        }

        const data = await response.json();

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.firstName
            ? `${data.user.firstName}${data.user.lastName ? ' ' + data.user.lastName : ''}`
            : data.user.email,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
