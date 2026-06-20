'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, Flame } from 'lucide-react';
import { Listing, getReviewLabel } from '@/lib/listings';
import { TrustBadge } from '@/components/TrustBadge';
import { getCategoryById } from '@/lib/categories';

type Props = {
  listing: Listing;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
};

export function ListingCard({ listing, highlighted, onHover }: Props) {
  const label = getReviewLabel(listing.lister.reviewCount);
  const category = getCategoryById(listing.category);

  return (
    <Link
      href={`/items/${listing.slug}`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className="block overflow-hidden transition-all duration-200"
      style={{
        borderRadius: 'var(--r-card)',
        background: '#FFFFFF',
        boxShadow: highlighted ? 'var(--shadow-selected)' : 'var(--shadow-low)',
        transform: highlighted ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Photo */}
      <div className="relative w-full" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image
          src={listing.photos[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover"
          unoptimized
        />
        {listing.popularThisWeek && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1"
            style={{
              background: 'rgba(0,0,0,0.60)',
              color: '#FFFFFF',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              padding: '3px 8px 3px 6px',
              borderRadius: 'var(--r-badge)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Flame size={11} strokeWidth={2.2} />
            Popular this week
          </div>
        )}
        <div
          className="absolute top-2 right-2 flex items-center"
          style={{
            background: 'rgba(255,255,255,0.92)',
            color: '#525252',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: 'var(--r-badge)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {category.emoji} {category.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--card-padding)' }}>
        {/* Title */}
        <h3
          className="font-[family-name:var(--font-serif)] line-clamp-2"
          style={{
            fontSize: 'var(--text-md)',
            color: '#0F0F0E',
            fontWeight: 500,
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--tracking-serif)',
            marginBottom: 'var(--row-gap)',
          }}
        >
          {listing.title}
        </h3>

        {/* Price + neighbourhood */}
        <div
          className="flex items-baseline justify-between gap-2"
          style={{ marginBottom: 'var(--row-gap)' }}
        >
          <div className="flex items-baseline gap-1.5">
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-price)' }}>
              ${listing.dailyRate}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>/day</span>
            {listing.weeklyRate && (
              <span style={{ fontSize: 'var(--text-xs)', color: '#525252' }}>
                · ${listing.weeklyRate}/wk
              </span>
            )}
          </div>
          <span
            className="shrink-0 flex items-center gap-0.5"
            style={{ fontSize: 'var(--text-xs)', color: '#737373', whiteSpace: 'nowrap' }}
          >
            <MapPin size={10} strokeWidth={2} />
            {listing.neighbourhood}
          </span>
        </div>

        {/* Lister row */}
        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 'var(--row-gap)' }}>
          <div
            className="relative rounded-full overflow-hidden shrink-0"
            style={{ width: 'var(--avatar-card)', height: 'var(--avatar-card)' }}
          >
            <Image
              src={listing.lister.avatar}
              alt={listing.lister.firstName}
              fill
              sizes="28px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>{listing.lister.firstName}</span>
          {listing.lister.verified && <TrustBadge variant="verified" size="sm" />}
          <span
            className="flex items-center gap-0.5 ml-auto"
            style={{ fontSize: 'var(--text-sm)', color: '#0F0F0E', fontWeight: 500 }}
          >
            <Star size={11} fill="var(--color-star)" stroke="none" />
            {listing.lister.rating.toFixed(1)}
            <span style={{ color: '#737373', fontWeight: 400, marginLeft: 2 }}>
              ({listing.lister.reviewCount})
            </span>
          </span>
        </div>

        {/* Label row */}
        {(label || listing.availableWeekends) && (
          <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 'var(--row-gap)' }}>
            {label && (
              <TrustBadge
                variant={
                  label === 'Community favourite'
                    ? 'community'
                    : label === 'Established'
                    ? 'established'
                    : 'trusted'
                }
                size="sm"
              />
            )}
            {listing.availableWeekends && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-signal)',
                  background: 'var(--color-signal-tint)',
                  padding: '2px 7px',
                  borderRadius: 'var(--r-badge)',
                  fontWeight: 500,
                }}
              >
                Weekends available
              </span>
            )}
          </div>
        )}

        {/* Response time */}
        <div
          className="flex items-center gap-1"
          style={{
            paddingTop: 'var(--row-gap)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            color: 'var(--color-neutral-icon)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <Clock size={10} strokeWidth={2} />
          {listing.lister.responseTime}
        </div>
      </div>
    </Link>
  );
}
