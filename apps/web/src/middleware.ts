import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/checkout',
  '/account',
  '/order-confirmation',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // We cannot access localStorage in middleware — the client-side stores handle
    // redirect in their own useEffect. Middleware simply passes through.
    // For server-side enforcement, use a cookie-based token instead.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/account/:path*',
    '/order-confirmation/:path*',
  ],
};
