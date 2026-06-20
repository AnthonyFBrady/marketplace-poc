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
  const [pillVisible, setPillVisible] = useState(false);
  const [query, setQuery] = useState('');

  const expandedOpen = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 8;
      setScrolled(s);
      if (isHome) setPillVisible(window.scrollY > 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    setScrolled(false);
    setPillVisible(false);
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
        background: 'var(--brand-bg)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Row 1: logo + compact pill + actions */}
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

        {/* Compact search pill — appears after scrolling on homepage */}
        <button
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
            cursor: 'pointer',
          }}
          onClick={() => {
            track('nav_search_pill_clicked');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Search size={13} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
          What do you want to borrow?
        </button>

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
            <Menu size={15} strokeWidth={2} style={{ color: 'var(--color-text)', flexShrink: 0 }} />
            <div
              className="relative rounded-full overflow-hidden shrink-0"
              style={{
                width: 'var(--avatar-card)',
                height: 'var(--avatar-card)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Image src="https://i.pravatar.cc/56?img=12" alt="Account" fill sizes="28px" className="object-cover" />
            </div>
          </button>
        </div>
      </div>

      {/* Expandable section: chip marquee + search bar (homepage only, collapses on scroll) */}
      {isHome && (
        <div
          style={{
            overflow: 'hidden',
            maxHeight: expandedOpen ? '116px' : '0',
            opacity: expandedOpen ? 1 : 0,
            transition: 'max-height 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 260ms ease',
            pointerEvents: expandedOpen ? 'auto' : 'none',
          }}
        >
          {/* Job chip marquee */}
          <div style={{ height: 52, display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                width: 'max-content',
                paddingLeft: 'var(--space-2)',
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
                    background: '#FFFFFF',
                    color: 'var(--color-text)',
                    border: '1px solid rgba(0,0,0,0.12)',
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

          {/* Search bar */}
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 'var(--page-pad-x)',
              paddingRight: 'var(--page-pad-x)',
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                width: '100%',
                maxWidth: 'var(--hero-max-w)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '0 var(--space-4)',
                  height: 44,
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  borderRadius: 'var(--r-badge)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <Search size={15} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to borrow?"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    outline: 'none',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text)',
                    border: 'none',
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    style={{ color: 'var(--color-text-faint)', fontSize: 16, flexShrink: 0, lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                style={{
                  height: 44,
                  padding: '0 var(--space-5)',
                  borderRadius: 'var(--r-badge)',
                  background: 'var(--color-action)',
                  color: '#FFFFFF',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: 'none',
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
