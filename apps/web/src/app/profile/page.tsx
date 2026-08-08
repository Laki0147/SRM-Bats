import { redirect } from 'next/navigation';

// Legacy next-auth profile screen (retired). The heritage account area lives at
// /account/profile. This page imported uninstalled shadcn/@radix-ui components
// that broke the dev build when visited, so redirect to the real profile route.
export default function ProfilePage(): never {
  redirect('/account/profile');
}
