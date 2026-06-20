'use client';

import { Marker } from 'react-map-gl/maplibre';
import { Listing } from '@/lib/listings';
import { getCategoryById } from '@/lib/categories';
import { track } from '@/lib/analytics';

type Props = {
  listing: Listing;
  selected: boolean;
  onClick: (listing: Listing) => void;
};

export function ListingPin({ listing, selected, onClick }: Props) {
  const category = getCategoryById(listing.category);

  return (
    <Marker
      latitude={listing.lat}
      longitude={listing.lng}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        track('map_pin_clicked', { listing_id: listing.id });
        onClick(listing);
      }}
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        style={{
          transform: selected ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.15s ease',
          filter: selected ? 'drop-shadow(0 4px 8px rgba(45,106,79,0.30))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.18))',
        }}
      >
        {/* Category emoji circle */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: selected ? 'var(--color-action)' : '#FFFFFF',
            border: selected ? '2px solid #FFFFFF' : '1.5px solid rgba(0,0,0,0.12)',
            fontSize: 16,
            lineHeight: 1,
            position: 'relative',
          }}
        >
          {category.emoji}
          {/* Verified dot */}
          {listing.lister.verified && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: selected ? '#FFFFFF' : 'var(--color-action)',
                border: '1.5px solid #fff',
              }}
            />
          )}
        </div>

        {/* Price pill */}
        <div
          style={{
            marginTop: 3,
            background: selected ? 'var(--color-action)' : 'var(--brand-ink)',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}
        >
          ${listing.dailyRate}/day
        </div>

        {/* Caret */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `5px solid ${selected ? 'var(--color-action)' : 'var(--brand-ink)'}`,
          }}
        />
      </div>
    </Marker>
  );
}
