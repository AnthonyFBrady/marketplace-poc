'use client';

import { Listing } from '@/lib/listings';
import { ListerProfile } from '@/components/ListerProfile';

type Props = {
  listing: Listing;
};

export function BookingPanel({ listing }: Props) {
  return (
    <div
      className="sticky top-20 rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 2px 20px rgba(0,0,0,0.10)',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span style={{ fontSize: 26, fontWeight: 700, color: '#0F0F0E' }}>
            ${listing.dailyRate}
          </span>
          <span style={{ fontSize: 14, color: '#737373' }}>/day</span>
        </div>
        {listing.weeklyRate && (
          <div style={{ fontSize: 13, color: '#525252', marginTop: 2 }}>
            ${listing.weeklyRate}/week · save{' '}
            {Math.round(100 - (listing.weeklyRate / (listing.dailyRate * 7)) * 100)}%
          </div>
        )}
        <div style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>
          + ${listing.deposit} refundable deposit
        </div>
      </div>

      {/* Date placeholder */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1.5px solid rgba(0,0,0,0.14)' }}
      >
        <div className="grid grid-cols-2">
          <div className="p-3" style={{ borderRight: '1px solid rgba(0,0,0,0.10)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#737373', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              From
            </div>
            <div style={{ fontSize: 14, color: '#525252', marginTop: 2 }}>Add date</div>
          </div>
          <div className="p-3">
            <div style={{ fontSize: 10, fontWeight: 600, color: '#737373', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              To
            </div>
            <div style={{ fontSize: 14, color: '#525252', marginTop: 2 }}>Add date</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        className="w-full rounded-xl py-3.5 font-semibold text-base transition-opacity hover:opacity-90"
        style={{ background: '#2D6A4F', color: '#FFFFFF' }}
        onClick={() => alert('Booking is coming soon. This is a POC.')}
      >
        Request to Borrow
      </button>
      <p className="text-center" style={{ fontSize: 12, color: '#737373', marginTop: -8 }}>
        You won&apos;t be charged yet
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.08)' }} />

      {/* Lister */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F0F0E', marginBottom: 14 }}>
          Meet {listing.lister.firstName}
        </h3>
        <ListerProfile lister={listing.lister} />
      </div>
    </div>
  );
}
