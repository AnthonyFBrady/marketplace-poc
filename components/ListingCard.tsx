'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Flame } from 'lucide-react';
import { Listing } from '@/lib/listings';

type Props = {
  listing: Listing;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
};

export function ListingCard({ listing, highlighted, onHover }: Props) {
  return (
    <Link
      href={`/items/${listing.slug}`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className="block group"
      style={{ cursor: 'pointer' }}
    >
      {/* Photo — square, rounded, fills full card width */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          borderRadius: 'var(--r-card)',
          marginBottom: 10,
          outline: highlighted ? '2px solid var(--color-action)' : 'none',
          outlineOffset: 2,
        }}
      >
        <Image
          src={listing.photos[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) calc(50vw - 24px), (max-width: 1024px) calc(33vw - 24px), 310px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {listing.popularThisWeek && (
          <div
            className="absolute top-2.5 left-2.5 flex items-center gap-1"
            style={{
              background: 'rgba(0,0,0,0.58)',
              color: '#FFFFFF',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              padding: '3px 8px 3px 6px',
              borderRadius: 'var(--r-badge)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Flame size={11} strokeWidth={2.2} />
            Popular this week
          </div>
        )}
      </div>

      {/* Text — no background, sits on page bg */}
      <div style={{ paddingLeft: 2, paddingRight: 2 }}>
        {/* Neighbourhood + rating */}
        <div className="flex items-center justify-between" style={{ marginBottom: 3 }}>
          <span
            className="truncate"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginRight: 8 }}
          >
            {listing.neighbourhood}
          </span>
          <span className="flex items-center shrink-0" style={{ gap: 3 }}>
            <Star size={11} fill="var(--color-star)" stroke="none" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
              {listing.lister.rating.toFixed(1)}
            </span>
          </span>
        </div>

        {/* Title */}
        <p
          className="line-clamp-1"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
            lineHeight: 'var(--leading-snug)',
            marginBottom: 3,
          }}
        >
          {listing.title}
        </p>

        {/* Price */}
        <p style={{ fontSize: 'var(--text-sm)' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>${listing.dailyRate}</span>
          <span style={{ color: 'var(--color-text-muted)' }}> /day</span>
        </p>
      </div>
    </Link>
  );
}
