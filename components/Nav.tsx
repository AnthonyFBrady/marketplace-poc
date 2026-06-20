'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useToast } from '@/components/ToastProvider';
import { track } from '@/lib/analytics';
import { JOBS } from '@/lib/jobs';

function navMaxWidth(pathname: string): string {
  if (pathname === '/search') return 'none';
  if (pathname.startsWith('/items/') || pathname.startsWith('/rent/')) return 'var(--page-max-w-content)';
  return 'var(--page-max-w)';
}

const CHIP_DUET = [...JOBS, ...JOBS];

export function Nav() {
  const { show } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  const expandedOpen = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setScrolled(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    track('search_used', { query, category: 'all' });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <header
      className="sticky top-0 z-40 shrink-0"
      style={{
        background: 'var(--color-header-bg)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.09)' : 'none',
        transition: 'box-shadow 0.35s ease',
      }}
    >
      {/* Row 1: Logo | centered search pill | CTA + Account */}
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
        <Link href="/" style={{ flexShrink: 0 }}><Logo size="md" /></Link>

        {/* Centered search pill — always present on md+ screens */}
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center"
          style={{
            width: 'min(480px, calc(100% - 360px))',
            height: 48,
            background: 'var(--brand-surface)',
            border: '1px solid rgba(0,0,0,0.13)',
            borderRadius: 'var(--r-badge)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          <Search
            size={15}
            strokeWidth={2}
            style={{ marginLeft: 16, color: 'var(--color-text-faint)', flexShrink: 0 }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to borrow?"
            style={{
              flex: 1,
              padding: '0 12px',
              background: 'transparent',
              outline: 'none',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text)',
              border: 'none',
              height: '100%',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                color: 'var(--color-text-faint)',
                fontSize: 16,
                flexShrink: 0,
                lineHeight: 1,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                marginRight: 4,
              }}
            >
              ×
            </button>
          )}
          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.12)', flexShrink: 0 }} />
          {/* Submit */}
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--color-action)',
              flexShrink: 0,
              margin: 6,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Search size={14} strokeWidth={2.5} color="#FFFFFF" />
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            className="font-medium rounded-full transition-opacity hover:opacity-80 hidden sm:block"
            style={{
              height: 'var(--btn-h-sm)',
              padding: '0 var(--space-4)',
              fontSize: 'var(--text-sm)',
              background: 'var(--color-action)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
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
              cursor: 'pointer',
            }}
            onClick={() => show('Account settings are coming soon — Borrow is in early access.')}
            aria-label="Account menu"
          >
            <Menu size={15} strokeWidth={2} style={{ color: 'var(--color-text)', flexShrink: 0 }} />
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

      {/* Row 2: Job chip marquee — homepage only, collapses on first scroll */}
      {isHome && (
        <div
          style={{
            overflow: 'hidden',
            maxHeight: expandedOpen ? '52px' : '0',
            opacity: expandedOpen ? 1 : 0,
            borderTop: expandedOpen ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
            transition: 'max-height 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease, border-top-color 180ms ease',
            pointerEvents: expandedOpen ? 'auto' : 'none',
          }}
        >
          <div style={{ height: 52 }}>
            <div
              style={{
                maxWidth: navMaxWidth(pathname),
                margin: '0 auto',
                height: 52,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  width: 'max-content',
                  animation: 'marquee 28s linear infinite',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
                }}
              >
                {CHIP_DUET.map((job, i) => (
                  <button
                    key={`${job.id}-${i}`}
                    onClick={() => {
                      track('job_chip_clicked', { job: job.id });
                      router.push(`/search?job=${job.id}`);
                    }}
                    style={{
                      height: 'var(--btn-h-sm)',
                      padding: '0 14px',
                      borderRadius: 'var(--r-badge)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: 'var(--brand-surface)',
                      color: 'var(--color-text)',
                      border: '1px solid rgba(0,0,0,0.10)',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{job.emoji}</span>
                    <span>{job.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
