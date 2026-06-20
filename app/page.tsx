'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { LISTINGS, Listing } from '@/lib/listings';
import { ListingCard } from '@/components/ListingCard';
import { FilterBar, Filters } from '@/components/FilterBar';
import { distanceKm } from '@/lib/utils';

const MapView = dynamic(() => import('@/components/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => <Skeleton width="100%" height="100%" radius={0} />,
});

const TORONTO = { lat: 43.6532, lng: -79.3832 };

const defaultFilters: Filters = {
  category: null,
  verifiedOnly: false,
  maxPrice: 200,
  distanceKm: 25,
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return LISTINGS.filter((l) => {
      if (filters.category && l.category !== filters.category) return false;
      if (filters.verifiedOnly && !l.lister.verified) return false;
      if (l.dailyRate > filters.maxPrice) return false;
      const km = distanceKm(TORONTO.lat, TORONTO.lng, l.lat, l.lng);
      if (km > filters.distanceKm) return false;
      if (q) {
        const haystack = `${l.title} ${l.description} ${l.category} ${l.neighbourhood}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters, query]);

  const handleSelect = (listing: Listing | null) => {
    setSelectedId(listing?.id ?? null);
    if (listing) {
      const el = document.getElementById(`card-${listing.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - var(--nav-h))', overflow: 'hidden' }}>
      {/* Filter bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* List panel — desktop */}
        <div
          className="hidden md:flex flex-col"
          style={{ width: 380, borderRight: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}
        >
          {/* Search */}
          <div className="px-4 pt-3 pb-2 shrink-0">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: 'var(--brand-surface)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <Search size={15} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ color: 'var(--color-text-faint)', fontSize: 13, flexShrink: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 pb-2 shrink-0">
            <span style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} in Toronto
            </span>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <span style={{ fontSize: 32, marginBottom: 12 }}>🔍</span>
                <p style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>
                  Nothing matched. Try a different search or clear your filters.
                </p>
              </div>
            ) : (
              <div className="flex flex-col p-4 pt-1" style={{ gap: 'var(--card-gap)' }}>
                {filtered.map((l) => (
                  <div key={l.id} id={`card-${l.id}`}>
                    <ListingCard
                      listing={l}
                      highlighted={l.id === selectedId}
                      onHover={setHoveredId}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            listings={filtered}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelect}
          />

          {/* Mobile search */}
          <div className="md:hidden absolute top-3 left-3 right-3 z-10">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{
                background: 'rgba(250,250,248,0.96)',
                border: '1px solid rgba(0,0,0,0.10)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Search size={15} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ color: 'var(--color-text-faint)', fontSize: 16 }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Mobile card strip */}
          <div
            className="md:hidden absolute bottom-0 left-0 right-0 pb-4 pt-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(250,250,248,0.97) 55%, transparent)' }}
          >
            <div
              className="flex gap-3 px-4 overflow-x-auto no-scrollbar pointer-events-auto"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {filtered.map((l) => (
                <div
                  key={l.id}
                  style={{ width: 260, flexShrink: 0, scrollSnapAlign: 'start' }}
                >
                  <ListingCard
                    listing={l}
                    highlighted={l.id === selectedId}
                    onHover={setHoveredId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
