'use client';

import Image from 'next/image';
import { Star, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Lister, getReviewLabel } from '@/lib/listings';
import { TrustBadge, getReviewBadge } from '@/components/TrustBadge';
import { useToast } from '@/components/ToastProvider';

type Props = {
  lister: Lister;
};

export function ListerProfile({ lister }: Props) {
  const { show } = useToast();
  const reviewLabel = getReviewLabel(lister.reviewCount);
  const reviewBadge = getReviewBadge(lister.reviewCount);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4" style={{ marginBottom: 'var(--space-4)' }}>
        <div
          className="relative rounded-full overflow-hidden shrink-0"
          style={{
            width: 'var(--avatar-detail)',
            height: 'var(--avatar-detail)',
            border: '2px solid rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src={lister.avatar}
            alt={lister.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: '#0F0F0E' }}>
              {lister.name}
            </span>
            {lister.verified && <TrustBadge variant="verified" size="md" />}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: 4 }}>
            Member since {lister.memberSince}
          </div>
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: 4 }}
          >
            <span>{lister.completedRentals} completed rentals</span>
            <span
              className="flex items-center gap-1"
              style={{ color: '#0F0F0E', fontWeight: 500 }}
            >
              <Star size={13} fill="var(--color-star)" stroke="none" />
              {lister.rating.toFixed(1)}
              <span style={{ color: '#737373', fontWeight: 400 }}>
                ({lister.reviewCount})
                {reviewLabel && ` · ${reviewLabel}`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Badges row */}
      {reviewBadge && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <TrustBadge variant={reviewBadge} size="md" />
        </div>
      )}

      {/* Bio */}
      <p
        style={{
          fontSize: 'var(--text-base)',
          color: '#525252',
          lineHeight: 'var(--leading-normal)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {lister.bio}
      </p>

      {/* Stats */}
      <div
        className="flex items-center gap-6 flex-wrap"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          padding: 'var(--space-4) 0',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>
          <Clock size={13} strokeWidth={2} style={{ color: 'var(--color-action)' }} />
          {lister.responseTime}
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>
          <CheckCircle size={13} strokeWidth={2} style={{ color: 'var(--color-action)' }} />
          {lister.responseRate}% response rate
        </div>
      </div>

      {/* Reviews */}
      {lister.reviews.length > 0 && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h4
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: '#0F0F0E',
              marginBottom: 'var(--space-3)',
            }}
          >
            What renters say
          </h4>
          <div className="flex flex-col gap-4">
            {lister.reviews.slice(0, 2).map((review, i) => (
              <div key={i}>
                <div className="flex items-center gap-2" style={{ marginBottom: 'var(--row-gap)' }}>
                  <div
                    className="relative rounded-full overflow-hidden shrink-0"
                    style={{ width: 'var(--avatar-review)', height: 'var(--avatar-review)' }}
                  >
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: '#0F0F0E' }}>
                    {review.author}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>{review.date}</span>
                  <span className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star key={s} size={10} fill="var(--color-star)" stroke="none" />
                    ))}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: '#525252',
                    lineHeight: 'var(--leading-normal)',
                  }}
                >
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message CTA */}
      <button
        className="flex items-center gap-2 w-full justify-center font-medium transition-colors"
        style={{
          height: 'var(--btn-h)',
          borderRadius: 'var(--r-badge)',
          border: '1.5px solid var(--color-action)',
          color: 'var(--color-action)',
          background: 'transparent',
          fontSize: 'var(--text-sm)',
        }}
        onClick={() => show(`Messaging is coming soon — Borrow is in early access.`)}
      >
        <MessageCircle size={15} strokeWidth={2} />
        Message {lister.firstName}
      </button>
    </div>
  );
}
