import { notFound } from 'next/navigation';
import { getListingBySlug, LISTINGS } from '@/lib/listings';
import { getCategoryById } from '@/lib/categories';
import { ListingGallery } from '@/components/ListingGallery';
import { ListerProfile } from '@/components/ListerProfile';
import { TrustBadge } from '@/components/TrustBadge';
import { BookingPanel } from '@/components/BookingPanel';
import { MapPin, AlertCircle, X, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: `${listing.title} — Borrow`,
    description: listing.description,
  };
}

const POLICY_COPY = {
  flexible: 'Full refund if cancelled 24 hours before pickup.',
  moderate: 'Full refund if cancelled 3 days before pickup.',
  strict: 'No refund within 5 days of pickup.',
};

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const category = getCategoryById(listing.category);

  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: '100vh' }}>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70 mb-6 block"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left column */}
          <div>
            <ListingGallery photos={listing.photos} title={listing.title} />

            <div className="mt-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className="text-sm px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--color-text-muted)' }}
                >
                  {category.emoji} {category.label}
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-faint)' }}>
                  <MapPin size={13} strokeWidth={2} />
                  {listing.neighbourhood}, Toronto
                </span>
                {listing.popularThisWeek && <TrustBadge variant="popular" size="md" />}
              </div>

              <h1
                className="font-[family-name:var(--font-serif)] mb-4"
                style={{
                  fontSize: 'var(--h1-size)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 'var(--leading-snug)',
                  letterSpacing: 'var(--tracking-serif)',
                }}
              >
                {listing.title}
              </h1>

              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                {listing.description}
              </p>
            </div>

            {/* Rules */}
            <div
              className="p-5 rounded-2xl"
              style={{ marginTop: 'var(--section-gap)', background: 'var(--brand-surface)' }}
            >
              <h2 style={{ fontSize: 'var(--h4-size)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>
                Item rules
              </h2>
              <ul className="flex flex-col gap-2">
                {listing.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}>
                    <AlertCircle size={14} strokeWidth={2} style={{ color: 'var(--color-neutral-icon)', marginTop: 3, flexShrink: 0 }} />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation */}
            <div className="mt-4 flex items-start gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
              {listing.cancellationPolicy === 'flexible'
                ? <Check size={14} strokeWidth={2} style={{ color: 'var(--color-action)', marginTop: 2 }} />
                : <X size={14} strokeWidth={2} style={{ color: 'var(--color-warning)', marginTop: 2 }} />
              }
              <span>
                <strong style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                  {listing.cancellationPolicy} cancellation:
                </strong>{' '}
                {POLICY_COPY[listing.cancellationPolicy]}
              </span>
            </div>

            {/* How protection works */}
            <details
              className="p-5 rounded-2xl cursor-pointer"
              style={{
                marginTop: 'var(--section-gap)',
                background: 'var(--color-action-tint)',
                border: '1px solid rgba(45,106,79,0.12)',
              }}
            >
              <summary
                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-action)', listStyle: 'none' }}
                className="flex items-center justify-between"
              >
                How rental protection works
                <span style={{ fontSize: 12, fontWeight: 400 }}>+</span>
              </summary>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginTop: 10 }}>
                Borrow holds a refundable security deposit from renters at the time of booking. If the
                item is returned undamaged, the deposit is released within 48 hours. If there is a
                dispute, our team reviews photo evidence from both parties and mediates a fair resolution.
                For high-value items, we partner with Duuo by Co-operators for embedded insurance coverage.
              </p>
            </details>

            {/* Lister profile — mobile only */}
            <div className="lg:hidden mt-10 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 'var(--h4-size)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>
                Meet {listing.lister.firstName}
              </h2>
              <ListerProfile lister={listing.lister} />
            </div>
          </div>

          {/* Right column — sticky booking panel */}
          <div className="hidden lg:block">
            <BookingPanel listing={listing} />
          </div>
        </div>
      </main>
    </div>
  );
}
