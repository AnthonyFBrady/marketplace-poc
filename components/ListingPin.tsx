'use client';

import { Marker } from 'react-map-gl/maplibre';
import Image from 'next/image';
import { Listing } from '@/lib/listings';

type Props = {
  listing: Listing;
  selected: boolean;
  onClick: (listing: Listing) => void;
};

export function ListingPin({ listing, selected, onClick }: Props) {
  return (
    <Marker
      latitude={listing.lat}
      longitude={listing.lng}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(listing);
      }}
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        style={{ transform: selected ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.15s ease' }}
      >
        {/* Photo thumbnail */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            border: selected ? '2.5px solid #FFFFFF' : '2px solid rgba(255,255,255,0.7)',
            boxShadow: selected ? 'var(--shadow-selected)' : 'var(--shadow-low)',
          }}
        >
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            fill
            sizes="48px"
            className="object-cover"
          />
          {/* Verified dot */}
          {listing.lister.verified && (
            <div
              style={{
                position: 'absolute',
                top: 3,
                right: 3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-action)',
                border: '1.5px solid #fff',
              }}
            />
          )}
        </div>
        {/* Price pill */}
        <div
          style={{
            marginTop: 4,
            background: selected ? 'var(--color-action)' : 'var(--brand-ink)',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
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
            marginTop: 0,
          }}
        />
      </div>
    </Marker>
  );
}
