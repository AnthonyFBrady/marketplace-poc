'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LISTINGS, Listing } from '@/lib/listings';
import { ListingCard } from '@/components/ListingCard';
import { FilterBar, Filters } from '@/components/FilterBar';
import { distanceKm } from '@/lib/utils';

const MapView = dynamic(() => import('@/components/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#E8E8E4' }}
    >
      <span style={{ color: '#737373', fontSize: 14 }}>Loading map...</span>
    </div>
  ),
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
    <div className="flex flex-col" style={{ height: '100dvh', overflow: 'hidden' }}>
      {/* Nav */}
      <header
        className="flex items-center justify-between px-5 py-3 shrink-0 z-40"
        style={{ background: '#FAFAF8', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <Logo size="md" />
          <span
            className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-action-tint)', color: 'var(--color-action)' }}
          >
            Toronto
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block" style={{ fontSize: 13, color: '#525252' }}>
            {filtered.length} items near you
          </span>
          <button
            className="font-medium rounded-full transition-opacity hover:opacity-80"
            style={{
              height: 'var(--btn-h-sm)',
              padding: '0 16px',
              fontSize: 'var(--text-sm)',
              background: '#2D6A4F',
              color: '#FFFFFF',
            }}
            onClick={() => alert('Listing your item is coming soon.')}
          >
            List your gear
          </button>
        </div>
      </header>

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
              style={{ background: '#F2F2EF', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <Search size={15} strokeWidth={2} style={{ color: '#737373', flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 'var(--text-base)', color: '#0F0F0E' }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ color: '#737373', fontSize: 13, flexShrink: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 pb-2 shrink-0">
            <span style={{ fontSize: 12, color: '#737373' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} in Toronto
            </span>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <span style={{ fontSize: 32, marginBottom: 12 }}>🔍</span>
                <p style={{ fontSize: 15, color: '#525252' }}>
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
          <div
            className="md:hidden absolute top-3 left-3 right-3 z-10"
          >
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{
                background: 'rgba(250,250,248,0.96)',
                border: '1px solid rgba(0,0,0,0.10)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Search size={15} strokeWidth={2} style={{ color: '#737373', flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 'var(--text-base)', color: '#0F0F0E' }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ color: '#737373', fontSize: 16 }}>
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
