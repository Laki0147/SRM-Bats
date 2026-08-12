import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Server-side helper to get the current session
 * Use in Server Components and Server Actions
 */
export async function getSession() {
  return await auth();
}

/**
 * Server-side helper to get the current user
 * Use in Server Components and Server Actions
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Server-side helper to require authentication
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return session;
}

/**
 * Server-side helper to check if user is authenticated
 * Returns boolean without redirecting
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}
