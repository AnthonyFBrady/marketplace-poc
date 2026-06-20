'use client';

import { Listing } from '@/lib/listings';
import { ListerProfile } from '@/components/ListerProfile';

type Props = {
  listing: Listing;
};

export function BookingPanel({ listing }: Props) {
  return (
    <div
      className="sticky top-20 flex flex-col"
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--r-panel)',
        boxShadow: 'var(--shadow-panel)',
        border: '1px solid rgba(0,0,0,0.08)',
        padding: 'var(--space-6)',
        gap: 'var(--space-5)',
      }}
    >
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-price)' }}>
            ${listing.dailyRate}
          </span>
          <span style={{ fontSize: 'var(--text-sm)', color: '#737373' }}>/day</span>
        </div>
        {listing.weeklyRate && (
          <div style={{ fontSize: 'var(--text-sm)', color: '#525252', marginTop: 2 }}>
            ${listing.weeklyRate}/week · save{' '}
            {Math.round(100 - (listing.weeklyRate / (listing.dailyRate * 7)) * 100)}%
          </div>
        )}
        <div style={{ fontSize: 'var(--text-sm)', color: '#737373', marginTop: 4 }}>
          + ${listing.deposit} refundable deposit
        </div>
      </div>

      {/* Date placeholder */}
      <div
        className="overflow-hidden"
        style={{ borderRadius: 'var(--r-input)', border: '1.5px solid rgba(0,0,0,0.14)' }}
      >
        <div className="grid grid-cols-2">
          <div className="p-3" style={{ borderRight: '1px solid rgba(0,0,0,0.10)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#737373', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>
              From
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: '#525252', marginTop: 2 }}>Add date</div>
          </div>
          <div className="p-3">
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#737373', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>
              To
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: '#525252', marginTop: 2 }}>Add date</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div>
        <button
          className="w-full font-semibold transition-opacity hover:opacity-90"
          style={{
            height: 'var(--btn-h)',
            borderRadius: 'var(--r-badge)',
            background: 'var(--color-action)',
            color: '#FFFFFF',
            fontSize: 'var(--text-base)',
          }}
          onClick={() => alert('Booking is coming soon. This is a POC.')}
        >
          Request to Borrow
        </button>
        <p className="text-center" style={{ fontSize: 'var(--text-xs)', color: '#737373', marginTop: 'var(--space-2)' }}>
          You won&apos;t be charged yet
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.08)' }} />

      {/* Lister */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: '#0F0F0E', marginBottom: 'var(--space-4)' }}>
          Meet {listing.lister.firstName}
        </h3>
        <ListerProfile lister={listing.lister} />
      </div>
    </div>
  );
}
