'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Sparkles, Wrench, Sun, Mountain, Music, Bike, Film } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useToast } from '@/components/ToastProvider';
import { track } from '@/lib/analytics';
import { JOBS } from '@/lib/jobs';

type NavState = 'expanded' | 'scrolled' | 'search-open';

function navMaxWidth(pathname: string): string {
  if (pathname === '/search') return 'none';
  if (pathname.startsWith('/items/') || pathname.startsWith('/rent/')) return 'var(--page-max-w-content)';
  return 'var(--page-max-w)';
}

const CHIP_DUET = [...JOBS, ...JOBS];

const JOB_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  'spring-clean':   Sparkles,
  'home-reno':      Wrench,
  'backyard-party': Sun,
  'camping-trip':   Mountain,
  'music-events':   Music,
  'get-moving':     Bike,
  'host-a-show':    Film,
};

export function Nav() {
  const { show } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [navState, setNavState] = useState<NavState>(isHome ? 'expanded' : 'scrolled');
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mount — enable portal + correct for existing scroll position
  useEffect(() => {
    setMounted(true);
    if (isHome && window.scrollY > 8) setNavState('scrolled');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      setNavState(prev => {
        if (prev === 'search-open') return prev;
        return window.scrollY > 8 ? 'scrolled' : (isHome ? 'expanded' : 'scrolled');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Route change — reset
  useEffect(() => {
    setNavState(isHome && window.scrollY <= 8 ? 'expanded' : 'scrolled');
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navState === 'search-open') setNavState('scrolled');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navState]);

  // Auto-focus search input when search-open
  useEffect(() => {
    if (navState === 'search-open') {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [navState]);

  const isExpanded = navState !== 'scrolled';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNavState('scrolled');
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    track('search_used', { query, category: 'all' });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 shrink-0"
        style={{
          background: 'var(--color-header-bg)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: navState === 'scrolled' ? '0 2px 16px rgba(0,0,0,0.09)' : 'none',
          transition: 'box-shadow 0.35s ease',
        }}
      >
        {/* Row 1 — logo | chips OR pill (center) | actions */}
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

          {/* Chips marquee — visible when expanded or search-open */}
          <div
            className="absolute left-1/2 -translate-x-1/2 hidden md:block"
            style={{
              width: 'min(600px, calc(100% - 380px))',
              overflow: 'hidden',
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? 'auto' : 'none',
              transition: 'opacity 250ms ease',
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
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
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
                  {(() => { const Icon = JOB_ICONS[job.id]; return Icon ? <Icon size={14} strokeWidth={1.75} /> : null; })()}
                  <span>{job.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact search pill — visible when scrolled */}
          <button
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center"
            onClick={() => setNavState('search-open')}
            style={{
              gap: 10,
              height: 48,
              padding: '0 6px 0 16px',
              borderRadius: 'var(--r-badge)',
              background: 'var(--brand-surface)',
              border: '1px solid rgba(0,0,0,0.13)',
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              opacity: isExpanded ? 0 : 1,
              pointerEvents: isExpanded ? 'none' : 'auto',
              transition: 'opacity 250ms ease',
            }}
          >
            <Search size={15} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
            <span>What do you want to borrow?</span>
            <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.12)', margin: '0 2px' }} />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--color-action)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Search size={14} strokeWidth={2.5} color="#FFFFFF" />
            </div>
          </button>

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

        {/* Row 2 — large search bar (visible when expanded or search-open) */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? '88px' : '0',
            opacity: isExpanded ? 1 : 0,
            borderTop: isExpanded ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
            transition: 'max-height 280ms ease, opacity 240ms ease, border-top-color 200ms ease',
            pointerEvents: isExpanded ? 'auto' : 'none',
          }}
        >
          <div
            style={{
              maxWidth: navMaxWidth(pathname),
              margin: '0 auto',
              paddingLeft: 'var(--page-pad-x)',
              paddingRight: 'var(--page-pad-x)',
              paddingTop: 'var(--space-3)',
              paddingBottom: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full"
              style={{
                maxWidth: 680,
                height: 56,
                background: 'var(--brand-surface)',
                border: '1px solid rgba(0,0,0,0.13)',
                borderRadius: 'var(--r-badge)',
                boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
              }}
            >
              <Search
                size={16}
                strokeWidth={2}
                style={{ marginLeft: 20, color: 'var(--color-text-faint)', flexShrink: 0 }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="What do you want to borrow?"
                style={{
                  flex: 1,
                  padding: '0 14px',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'var(--text-base)',
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
                    fontSize: 18,
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
              <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.12)', flexShrink: 0 }} />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'var(--color-action)',
                  flexShrink: 0,
                  margin: 7,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Search size={16} strokeWidth={2.5} color="#FFFFFF" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Overlay — portal to body, behind header (z-38 < z-40) */}
      {mounted && navState === 'search-open' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 38,
            background: 'rgba(0,0,0,0.28)',
            cursor: 'pointer',
          }}
          onClick={() => setNavState('scrolled')}
        />,
        document.body
      )}
    </>
  );
}
