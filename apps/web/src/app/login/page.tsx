import { redirect } from 'next/navigation';

// Legacy next-auth login screen (retired). The live app authenticates through
// the login modal in the site navbar — a JWT flow backed by `useAuthStore`, not
// next-auth. This page imported shadcn/@radix-ui components that aren't
// installed, which broke the dev build for the whole app whenever it was
// visited. Send anyone who lands here to the home page, where the "Login"
// button opens the real sign-in modal.
export default function LoginPage(): never {
  redirect('/');
}
