'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useToast } from '@/components/ToastProvider';
import { track } from '@/lib/analytics';

function navMaxWidth(pathname: string): string {
  if (pathname === '/search') return 'none';
  if (pathname.startsWith('/items/') || pathname.startsWith('/rent/')) return 'var(--page-max-w-content)';
  return 'var(--page-max-w)';
}

export function Nav() {
  const { show } = useToast();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (isHome) setPillVisible(window.scrollY > 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    setPillVisible(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-40 shrink-0"
      style={{
        background: 'var(--brand-bg)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          position: 'relative',
          maxWidth: navMaxWidth(pathname),
          margin: '0 auto',
          height: 'var(--nav-h)',
          paddingLeft: 'var(--page-pad-x)',
          paddingRight: 'var(--page-pad-x)',
        }}
      >
        <Link href="/"><Logo size="md" /></Link>

        {/* Collapsing search pill — homepage only, appears when scrolled past hero */}
        <Link
          href="/search"
          className="absolute left-1/2 flex items-center gap-2"
          style={{
            transform: `translateX(-50%) translateY(${pillVisible ? '0' : '-6px'})`,
            opacity: pillVisible ? 1 : 0,
            pointerEvents: pillVisible ? 'auto' : 'none',
            transition: 'opacity 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            height: 'var(--btn-h-sm)',
            padding: '0 var(--space-4)',
            borderRadius: 'var(--r-badge)',
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.14)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}
          onClick={() => track('nav_search_pill_clicked')}
        >
          <Search size={13} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
          What do you want to borrow?
        </Link>

        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            className="font-medium rounded-full transition-opacity hover:opacity-80 hidden sm:block"
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

          <button
            className="flex items-center transition-all duration-200 hover:shadow-md"
            style={{
              height: 'var(--btn-h-sm)',
              paddingLeft: 'var(--space-3)',
              paddingRight: 4,
              borderRadius: 'var(--r-badge)',
              border: '1px solid rgba(0,0,0,0.14)',
              background: '#FFFFFF',
              gap: 'var(--space-2)',
            }}
            onClick={() => show('Account settings are coming soon — Borrow is in early access.')}
            aria-label="Account menu"
          >
            <Menu
              size={15}
              strokeWidth={2}
              style={{ color: 'var(--color-text)', flexShrink: 0 }}
            />
            <div
              className="relative rounded-full overflow-hidden shrink-0"
              style={{
                width: 'var(--avatar-card)',
                height: 'var(--avatar-card)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Image
                src="https://i.pravatar.cc/56?img=12"
                alt="Account"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
