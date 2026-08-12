import type { Metadata } from 'next';
import { DevDocsLayout } from '@/components/dev-docs/DevDocsLayout';

// Hidden internal route: reachable by URL, kept out of search indexes and the
// site navbar. See apps/web/src/lib/dev-docs/README.md for how it stays in sync.
export const metadata: Metadata = {
  title: 'Developer Documentation · SRM Bats',
  description: 'Internal integration + database reference.',
  robots: { index: false, follow: false },
};

export default function DevDocsPage() {
  return <DevDocsLayout />;
}
