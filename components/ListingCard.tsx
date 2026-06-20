'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
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
      className="block rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: '#FFFFFF',
        boxShadow: highlighted
          ? '0 4px 20px rgba(45,106,79,0.18), 0 0 0 2px #2D6A4F'
          : '0 1px 4px rgba(0,0,0,0.08)',
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
          <div className="absolute top-2 left-2">
            <TrustBadge variant="popular" size="sm" />
          </div>
        )}
        <div
          className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#525252', backdropFilter: 'blur(4px)' }}
        >
          {category.emoji} {category.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3
          className="font-[family-name:var(--font-serif)] leading-snug line-clamp-2 mb-1"
          style={{ fontSize: 14, color: '#0F0F0E', fontWeight: 500 }}
        >
          {listing.title}
        </h3>

        {/* Price + neighbourhood */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <div className="flex items-baseline gap-1.5">
            <span style={{ fontSize: 16, fontWeight: 600, color: '#D4900F' }}>
              ${listing.dailyRate}
            </span>
            <span style={{ fontSize: 12, color: '#737373' }}>/day</span>
            {listing.weeklyRate && (
              <span style={{ fontSize: 11, color: '#525252' }}>
                · ${listing.weeklyRate}/wk
              </span>
            )}
          </div>
          <span
            className="shrink-0 flex items-center gap-0.5"
            style={{ fontSize: 11, color: '#737373', whiteSpace: 'nowrap' }}
          >
            <MapPin size={10} strokeWidth={2} />
            {listing.neighbourhood}
          </span>
        </div>

        {/* Lister row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
            <Image
              src={listing.lister.avatar}
              alt={listing.lister.firstName}
              fill
              sizes="20px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span style={{ fontSize: 12, color: '#525252' }}>{listing.lister.firstName}</span>
          {listing.lister.verified && <TrustBadge variant="verified" size="sm" />}
          <span
            className="flex items-center gap-0.5 ml-auto"
            style={{ fontSize: 12, color: '#0F0F0E', fontWeight: 500 }}
          >
            <Star size={11} fill="#D4900F" stroke="none" />
            {listing.lister.rating.toFixed(1)}
            <span style={{ color: '#737373', fontWeight: 400, marginLeft: 2 }}>
              ({listing.lister.reviewCount})
            </span>
          </span>
        </div>

        {/* Label row */}
        {(label || listing.availableWeekends) && (
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
                  fontSize: 11,
                  color: '#525252',
                  background: 'rgba(0,0,0,0.05)',
                  padding: '2px 7px',
                  borderRadius: 999,
                }}
              >
                Weekends available
              </span>
            )}
          </div>
        )}

        {/* Response time */}
        <div
          className="flex items-center gap-1 mt-2 pt-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#737373', fontSize: 11 }}
        >
          <Clock size={10} strokeWidth={2} />
          {listing.lister.responseTime}
        </div>
      </div>
    </Link>
  );
}
