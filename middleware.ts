import { auth } from './auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = nextUrl.pathname === '/' ||
                        nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard');

  // Allow all API auth routes
  if (isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && nextUrl.pathname.startsWith('/auth')) {
    return Response.redirect(new URL('/dashboard', nextUrl));
  }

  // Redirect non-logged-in users to login for protected routes
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
