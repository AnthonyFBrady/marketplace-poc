import { Suspense } from 'react';
import { SearchView } from '@/components/SearchView';
import { Skeleton } from '@/components/Skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search — Borrow',
  description: 'Find tools, gear, and equipment to borrow near you in Toronto.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: 'calc(100dvh - var(--nav-h))' }}>
          <Skeleton width="100%" height="100%" radius={0} />
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
