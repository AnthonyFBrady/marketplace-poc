import Image from 'next/image';
import { Star, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Lister, getReviewLabel } from '@/lib/listings';
import { TrustBadge, getReviewBadge } from '@/components/TrustBadge';

type Props = {
  lister: Lister;
};

export function ListerProfile({ lister }: Props) {
  const reviewLabel = getReviewLabel(lister.reviewCount);
  const reviewBadge = getReviewBadge(lister.reviewCount);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="relative rounded-full overflow-hidden shrink-0"
          style={{ width: 56, height: 56, border: '2px solid rgba(0,0,0,0.08)' }}
        >
          <Image
            src={lister.avatar}
            alt={lister.name}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 16, fontWeight: 600, color: '#0F0F0E' }}>
              {lister.name}
            </span>
            {lister.verified && <TrustBadge variant="verified" size="md" />}
          </div>
          <div style={{ fontSize: 13, color: '#525252', marginTop: 2 }}>
            Member since {lister.memberSince}
          </div>
          <div
            className="flex items-center gap-3 mt-1 flex-wrap"
            style={{ fontSize: 13, color: '#525252' }}
          >
            <span>{lister.completedRentals} completed rentals</span>
            <span
              className="flex items-center gap-1"
              style={{ color: '#0F0F0E', fontWeight: 500 }}
            >
              <Star size={13} fill="#D4900F" stroke="none" />
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
        <div className="mb-3">
          <TrustBadge variant={reviewBadge} size="md" />
        </div>
      )}

      {/* Bio */}
      <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, marginBottom: 12 }}>
        {lister.bio}
      </p>

      {/* Stats */}
      <div
        className="flex items-center gap-4 flex-wrap py-3 mb-4"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-1.5" style={{ fontSize: 13, color: '#525252' }}>
          <Clock size={13} strokeWidth={2} style={{ color: '#2D6A4F' }} />
          {lister.responseTime}
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 13, color: '#525252' }}>
          <CheckCircle size={13} strokeWidth={2} style={{ color: '#2D6A4F' }} />
          {lister.responseRate}% response rate
        </div>
      </div>

      {/* Reviews */}
      {lister.reviews.length > 0 && (
        <div className="mb-4">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0F0F0E', marginBottom: 10 }}>
            What renters say
          </h4>
          <div className="flex flex-col gap-4">
            {lister.reviews.slice(0, 2).map((review, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      fill
                      sizes="28px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0F0F0E' }}>
                    {review.author}
                  </span>
                  <span style={{ fontSize: 12, color: '#737373' }}>{review.date}</span>
                  <span
                    className="ml-auto flex items-center gap-0.5"
                    style={{ fontSize: 12, color: '#0F0F0E' }}
                  >
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star key={s} size={10} fill="#D4900F" stroke="none" />
                    ))}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.6 }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message CTA */}
      <button
        className="flex items-center gap-2 w-full justify-center rounded-xl py-2.5 text-sm font-medium transition-colors"
        style={{
          border: '1.5px solid #2D6A4F',
          color: '#2D6A4F',
          background: 'transparent',
        }}
        onClick={() => alert('Messaging is coming soon. This is a POC.')}
      >
        <MessageCircle size={15} strokeWidth={2} />
        Message {lister.firstName}
      </button>
    </div>
  );
}
