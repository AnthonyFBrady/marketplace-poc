'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => {
      if (filters.category && l.category !== filters.category) return false;
      if (filters.verifiedOnly && !l.lister.verified) return false;
      if (l.dailyRate > filters.maxPrice) return false;
      const km = distanceKm(TORONTO.lat, TORONTO.lng, l.lat, l.lng);
      if (km > filters.distanceKm) return false;
      return true;
    });
  }, [filters]);

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
          <span
            className="font-[family-name:var(--font-serif)]"
            style={{ fontSize: 22, fontWeight: 600, color: '#2D6A4F', letterSpacing: '-0.02em' }}
          >
            Borrow
          </span>
          <span
            className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' }}
          >
            Toronto
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 13, color: '#525252' }}>
            {filtered.length} items near you
          </span>
          <button
            className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
            style={{
              background: '#2D6A4F',
              color: '#FFFFFF',
              border: 'none',
            }}
            onClick={() => alert('Listing your item is coming soon.')}
          >
            List your stuff
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* List panel (desktop) */}
        <div
          className="hidden md:flex flex-col overflow-y-auto"
          style={{ width: 380, borderRight: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
              <span style={{ fontSize: 32, marginBottom: 12 }}>🔍</span>
              <p style={{ fontSize: 15, color: '#525252' }}>
                No items match your filters. Try broadening your search.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {filtered.map((l) => (
                <div
                  key={l.id}
                  id={`card-${l.id}`}
                  onClick={() => setSelectedId(l.id)}
                >
                  <ListingCard
                    listing={l}
                    highlighted={l.id === selectedId}
                    onHover={setHoveredId}
                  />
                </div>
              ))}
              <p
                className="text-center py-4"
                style={{ fontSize: 12, color: '#737373' }}
              >
                {filtered.length} items in Toronto
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            listings={filtered}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelect}
          />

          {/* Mobile: listing cards in bottom sheet style */}
          <div
            className="md:hidden absolute bottom-0 left-0 right-0 overflow-x-auto flex gap-3 p-4 pb-6 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(250,250,248,0.98) 60%, transparent)' }}
          >
            <div className="flex gap-3 pointer-events-auto">
              {filtered.map((l) => (
                <div key={l.id} style={{ width: 260, flexShrink: 0 }}>
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
