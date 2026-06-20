import { notFound } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { getListingBySlug, LISTINGS } from '@/lib/listings';
import { getCategoryById } from '@/lib/categories';
import { ListingGallery } from '@/components/ListingGallery';
import { ListerProfile } from '@/components/ListerProfile';
import { TrustBadge } from '@/components/TrustBadge';
import { BookingPanel } from '@/components/BookingPanel';
import { MapPin, AlertCircle, X, Check } from 'lucide-react';
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
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-5 py-3"
        style={{ background: '#FAFAF8', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <span style={{ color: 'rgba(0,0,0,0.20)', fontSize: 16 }}>/</span>
        <span
          style={{ fontSize: 13, color: '#525252' }}
          className="line-clamp-1"
        >
          {listing.title}
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left column */}
          <div>
            <ListingGallery photos={listing.photos} title={listing.title} />

            <div className="mt-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className="text-sm px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(0,0,0,0.06)', color: '#525252' }}
                >
                  {category.emoji} {category.label}
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: '#737373' }}>
                  <MapPin size={13} strokeWidth={2} />
                  {listing.neighbourhood}, Toronto
                </span>
                {listing.popularThisWeek && <TrustBadge variant="popular" size="md" />}
              </div>

              <h1
                className="font-[family-name:var(--font-serif)] mb-4"
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: '#0F0F0E',
                  lineHeight: 'var(--leading-snug)',
                  letterSpacing: 'var(--tracking-serif)',
                }}
              >
                {listing.title}
              </h1>

              <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.75 }}>
                {listing.description}
              </p>
            </div>

            {/* Rules */}
            <div
              className="p-5 rounded-2xl"
              style={{ marginTop: 'var(--section-gap)', background: '#F2F2EF' }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0F0F0E', marginBottom: 10 }}>
                Item rules
              </h2>
              <ul className="flex flex-col gap-2">
                {listing.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ fontSize: 'var(--text-base)', color: '#525252' }}>
                    <AlertCircle size={14} strokeWidth={2} style={{ color: 'var(--color-neutral-icon)', marginTop: 3, flexShrink: 0 }} />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation */}
            <div className="mt-4 flex items-start gap-2" style={{ fontSize: 13, color: '#737373' }}>
              {listing.cancellationPolicy === 'flexible'
                ? <Check size={14} strokeWidth={2} style={{ color: '#2D6A4F', marginTop: 2 }} />
                : <X size={14} strokeWidth={2} style={{ color: '#D4900F', marginTop: 2 }} />
              }
              <span>
                <strong style={{ color: '#525252', textTransform: 'capitalize' }}>
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
                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: '#2D6A4F', listStyle: 'none' }}
                className="flex items-center justify-between"
              >
                How rental protection works
                <span style={{ fontSize: 12, fontWeight: 400 }}>+</span>
              </summary>
              <p style={{ fontSize: 'var(--text-base)', color: '#525252', lineHeight: 'var(--leading-relaxed)', marginTop: 10 }}>
                Borrow holds a refundable security deposit from renters at the time of booking. If the
                item is returned undamaged, the deposit is released within 48 hours. If there is a
                dispute, our team reviews photo evidence from both parties and mediates a fair resolution.
                For high-value items, we partner with Duuo by Co-operators for embedded insurance coverage.
              </p>
            </details>

            {/* Lister profile — mobile only */}
            <div className="lg:hidden mt-10 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0F0F0E', marginBottom: 16 }}>
                Meet {listing.lister.firstName}
              </h2>
              <ListerProfile lister={listing.lister} />
            </div>
          </div>

          {/* Right column — sticky booking panel (client component) */}
          <div className="hidden lg:block">
            <BookingPanel listing={listing} />
          </div>
        </div>
      </main>
    </div>
  );
}
