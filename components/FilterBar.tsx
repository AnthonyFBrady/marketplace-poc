'use client';

import { ShieldCheck, X } from 'lucide-react';
import { CATEGORIES, CategoryId } from '@/lib/categories';
import { cn } from '@/lib/utils';

export type Filters = {
  category: CategoryId | null;
  verifiedOnly: boolean;
  maxPrice: number;
  distanceKm: number;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const DISTANCES = [1, 5, 10, 25] as const;

const isDefault = (f: Filters) =>
  f.category === null && !f.verifiedOnly && f.maxPrice === 200 && f.distanceKm === 25;

const chipBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
  borderRadius: 'var(--r-badge)',
  height: 'var(--btn-h-sm)',
  padding: '0 14px',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  transition: 'all 0.15s',
  cursor: 'pointer',
};

export function FilterBar({ filters, onChange }: Props) {
  const setCategory = (id: CategoryId | null) =>
    onChange({ ...filters, category: filters.category === id ? null : id });

  const toggleVerified = () => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });

  const setDistance = (km: number) => onChange({ ...filters, distanceKm: km });

  const clear = () =>
    onChange({ category: null, verifiedOnly: false, maxPrice: 200, distanceKm: 25 });

  return (
    <div
      className="sticky top-0 z-30"
      style={{ background: '#FAFAF8', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                ...chipBase,
                background: active ? '#2D6A4F' : '#FFFFFF',
                color: active ? '#FFFFFF' : '#0F0F0E',
                border: active ? 'none' : '1px solid rgba(0,0,0,0.12)',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div
          className="shrink-0 w-px h-5 mx-1"
          style={{ background: 'rgba(0,0,0,0.10)' }}
        />

        {/* Verified toggle */}
        <button
          onClick={toggleVerified}
          style={{
            ...chipBase,
            background: filters.verifiedOnly ? '#2D6A4F' : '#FFFFFF',
            color: filters.verifiedOnly ? '#FFFFFF' : '#525252',
            border: filters.verifiedOnly ? 'none' : '1px solid rgba(0,0,0,0.12)',
            boxShadow: filters.verifiedOnly ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
          }}
        >
          <ShieldCheck size={14} strokeWidth={2} />
          Verified only
        </button>

        {/* Distance pills */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {DISTANCES.map((km) => {
            const active = filters.distanceKm === km;
            return (
              <button
                key={km}
                onClick={() => setDistance(km)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  borderRadius: 'var(--r-badge)',
                  height: 28,
                  padding: '0 10px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                  background: active ? '#0F0F0E' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#525252',
                  border: active ? 'none' : '1px solid rgba(0,0,0,0.12)',
                }}
              >
                {km === 25 ? 'Any' : `${km} km`}
              </button>
            );
          })}
        </div>

        {/* Clear */}
        {!isDefault(filters) && (
          <button
            onClick={clear}
            className="flex items-center gap-1 shrink-0 font-medium hover:underline"
            style={{ fontSize: 'var(--text-xs)', color: '#2D6A4F', marginLeft: 8 }}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
