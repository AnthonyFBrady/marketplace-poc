'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useToast } from '@/components/ToastProvider';
import { track } from '@/lib/analytics';

export function Nav() {
  const { show } = useToast();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 shrink-0"
      style={{
        height: 'var(--nav-h)',
        background: 'var(--brand-bg)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Link href="/">
        <Logo size="md" />
      </Link>
      <button
        className="font-medium rounded-full transition-opacity hover:opacity-80"
        style={{
          height: 'var(--btn-h-sm)',
          padding: '0 var(--space-4)',
          fontSize: 'var(--text-sm)',
          background: 'var(--color-action)',
          color: '#FFFFFF',
        }}
        onClick={() => {
          track('list_gear_clicked');
          show('Listing your gear is coming soon — Borrow is in early access.');
        }}
      >
        List your gear
      </button>
    </header>
  );
}
