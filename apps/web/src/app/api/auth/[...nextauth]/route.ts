import NextAuth, { type NextAuthConfig } from 'next-auth';
import { authOptions } from '@/lib/auth';

// next-auth v5 returns { handlers, auth, signIn, signOut } from NextAuth() —
// it is no longer itself a route handler, so the v4 pattern
// (`const handler = NextAuth(...); export { handler as GET }`) both fails
// Next's route type check and 500s at runtime.
//
// @/lib/auth still annotates authOptions with the v4 `NextAuthOptions` type,
// which v5 does not export, so that value widens to `any`. Assert the v5
// config type here so this module stays type-safe; migrating lib/auth.ts to
// NextAuthConfig properly belongs with the wider type-check backlog, and the
// live app authenticates through useAuthStore against the API, not next-auth.
//
// trustHost: v5 rejects requests from hosts it cannot verify, and this app is
// self-hosted behind a bare IP rather than on Vercel.
const config: NextAuthConfig = {
  ...(authOptions as NextAuthConfig),
  trustHost: true,
};

const { handlers } = NextAuth(config);

export const { GET, POST } = handlers;
