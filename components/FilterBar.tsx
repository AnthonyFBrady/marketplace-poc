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

export function FilterBar({ filters, onChange }: Props) {
  const setCategory = (id: CategoryId | null) =>
    onChange({ ...filters, category: filters.category === id ? null : id });

  const toggleVerified = () => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });

  const setDistance = (km: number) => onChange({ ...filters, distanceKm: km });

  const clear = () =>
    onChange({ category: null, verifiedOnly: false, maxPrice: 200, distanceKm: 25 });

  return (
    <div
      className="sticky top-0 z-30 bg-[#FAFAF8]"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      {/* Category chips row */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[#2D6A4F] text-white shadow-sm'
                  : 'bg-white text-[#0F0F0E] hover:bg-[#F2F2EF]'
              )}
              style={{ border: active ? 'none' : '1px solid rgba(0,0,0,0.12)' }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div
          className="shrink-0 w-px h-6 mx-1"
          style={{ background: 'rgba(0,0,0,0.10)' }}
        />

        {/* Verified toggle */}
        <button
          onClick={toggleVerified}
          className={cn(
            'flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150',
            filters.verifiedOnly
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-[#525252] hover:bg-[#F2F2EF]'
          )}
          style={{ border: filters.verifiedOnly ? 'none' : '1px solid rgba(0,0,0,0.12)' }}
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
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150',
                  active
                    ? 'bg-[#0F0F0E] text-white'
                    : 'bg-white text-[#525252] hover:bg-[#F2F2EF]'
                )}
                style={{ border: active ? 'none' : '1px solid rgba(0,0,0,0.12)' }}
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
            className="flex items-center gap-1 shrink-0 text-xs text-[#2D6A4F] font-medium ml-2 hover:underline"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
