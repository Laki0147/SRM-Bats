import { redirect } from 'next/navigation';

// Legacy next-auth register screen (retired). The live app registers through
// the "Sign up" tab of the login modal in the site navbar. This page pulled in
// uninstalled shadcn/@radix-ui components that broke the dev build when
// visited, so redirect to the home page where the modal lives.
export default function RegisterPage(): never {
  redirect('/');
}
