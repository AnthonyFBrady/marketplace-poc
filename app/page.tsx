'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Map } from 'lucide-react';
import Link from 'next/link';
import { LISTINGS } from '@/lib/listings';
import { CATEGORIES, CategoryId } from '@/lib/categories';
import { ListingCard } from '@/components/ListingCard';
import { track } from '@/lib/analytics';

const pageWrap: React.CSSProperties = {
  maxWidth: 'var(--page-max-w)',
  margin: '0 auto',
  paddingLeft: 'var(--page-pad-x)',
  paddingRight: 'var(--page-pad-x)',
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return LISTINGS.filter((l) => {
      if (category && l.category !== category) return false;
      if (q) {
        const haystack = `${l.title} ${l.description} ${l.category} ${l.neighbourhood}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [category, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    track('search_used', { query, category: category ?? 'all' });
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (id: CategoryId) => {
    const next = category === id ? null : id;
    setCategory(next);
    track('filter_applied', { category: next ?? 'all' });
  };

  const mapHref = `/search${category ? `?category=${category}` : ''}`;

  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: 'calc(100dvh - var(--nav-h))' }}>

      {/* ── Hero ── */}
      <div style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-8)' }}>
        <div style={pageWrap}>
          <div
            className="flex flex-col items-center"
            style={{ maxWidth: 'var(--hero-max-w)', margin: '0 auto' }}
          >
            <h1
              className="font-[family-name:var(--font-serif)] text-center mb-2"
              style={{
                fontSize: 'var(--h1-size)',
                fontWeight: 600,
                color: 'var(--brand-ink)',
                letterSpacing: 'var(--tracking-serif)',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              Borrow from a neighbour.
            </h1>
            <p
              className="text-center mb-6"
              style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}
            >
              Tools, gear, and equipment — without buying.
            </p>

            <form onSubmit={handleSearch} className="w-full flex items-center gap-2">
              <div
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                }}
              >
                <Search size={16} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to borrow?"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    style={{ color: 'var(--color-text-faint)', fontSize: 16, flexShrink: 0 }}
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 font-semibold transition-opacity hover:opacity-90"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-5)',
                  borderRadius: 'var(--r-badge)',
                  background: 'var(--color-action)',
                  color: '#FFFFFF',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Category chips ── */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={pageWrap}>
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-1.5 shrink-0 transition-all duration-150"
                  style={{
                    height: 'var(--btn-h-sm)',
                    padding: '0 14px',
                    borderRadius: 'var(--r-badge)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: active ? 'var(--color-action)' : '#FFFFFF',
                    color: active ? '#FFFFFF' : 'var(--color-text)',
                    border: active ? 'none' : '1px solid rgba(0,0,0,0.12)',
                    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Listing grid ── */}
      <div
        style={{
          ...pageWrap,
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-10)',
        }}
      >
        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} in Toronto
          </span>
          <Link
            href={mapHref}
            className="flex items-center gap-1.5 font-medium transition-opacity hover:opacity-70"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-action)' }}
          >
            <Map size={14} strokeWidth={2} />
            View on map
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span style={{ fontSize: 36, marginBottom: 12 }}>🔍</span>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}>
              Nothing matched. Try a different category.
            </p>
          </div>
        ) : (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
          >
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
