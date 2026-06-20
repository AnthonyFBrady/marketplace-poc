import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getCategoryById, CategoryId } from '@/lib/categories';
import { getListingsByCategory } from '@/lib/listings';
import { ListingCard } from '@/components/ListingCard';

type Props = { params: Promise<{ category: string; city: string }> };

const VALID_CITIES = ['toronto'];

export async function generateStaticParams() {
  return CATEGORIES.flatMap((cat) =>
    VALID_CITIES.map((city) => ({ category: cat.id, city }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { category, city } = await params;
  const cat = getCategoryById(category as CategoryId);
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `Rent ${cat.label.toLowerCase()} in ${cityLabel} — Borrow`,
    description: `Find ${cat.label.toLowerCase()} to rent from verified neighbours in ${cityLabel}. ${cat.description}. Daily and weekly rates from real people near you.`,
  };
}

const pageWrap: React.CSSProperties = {
  maxWidth: 'var(--page-max-w-content)',
  margin: '0 auto',
  paddingLeft: 'var(--page-pad-x)',
  paddingRight: 'var(--page-pad-x)',
};

export default async function CategoryCityPage({ params }: Props) {
  const { category, city } = await params;

  if (!VALID_CITIES.includes(city)) notFound();
  if (!CATEGORIES.find((c) => c.id === category)) notFound();

  const cat = getCategoryById(category as CategoryId);
  const listings = getListingsByCategory(category as CategoryId);
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: '100vh' }}>
      <main style={{ ...pageWrap, paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>

        {/* Hero */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>{cat.emoji}</div>
          <h1
            className="font-[family-name:var(--font-serif)]"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-3)',
              letterSpacing: 'var(--tracking-serif)',
              lineHeight: 'var(--leading-snug)',
            }}
          >
            Rent {cat.label.toLowerCase()} in {cityLabel}
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', maxWidth: 'var(--hero-max-w)', lineHeight: 'var(--leading-relaxed)' }}>
            Borrow {cat.label.toLowerCase()} from verified neighbours in {cityLabel}. No membership.
            No long-term commitment. Just the stuff you need, when you need it.
          </p>
        </div>

        {/* Category nav */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ marginBottom: 'var(--space-8)' }}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/rent/${c.id}/${city}`}
              className="flex items-center gap-1.5 shrink-0 transition-all"
              style={{
                height: 'var(--btn-h-sm)',
                padding: '0 14px',
                borderRadius: 'var(--r-badge)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                background: c.id === category ? 'var(--color-action)' : '#FFFFFF',
                color: c.id === category ? '#FFFFFF' : 'var(--color-text)',
                border: c.id === category ? 'none' : '1px solid rgba(0,0,0,0.12)',
              }}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', marginBottom: 'var(--space-5)' }}>
          {listings.length} {cat.label.toLowerCase()} available in {cityLabel}
        </p>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginBottom: 'var(--section-gap)' }}>
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--brand-surface)', borderTop: '3px solid var(--color-action)' }}
        >
          <h2
            className="font-[family-name:var(--font-serif)]"
            style={{ fontSize: 'var(--h2-size)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-6)' }}
          >
            How Borrow works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find what you need',
                desc: `Browse verified ${cat.label.toLowerCase()} from real neighbours near you. Filter by distance, date, and price.`,
              },
              {
                step: '02',
                title: 'Request to borrow',
                desc: 'Send a request to the lister. Most respond within an hour. A refundable deposit is held until you return the item.',
              },
              {
                step: '03',
                title: 'Pick up and go',
                desc: "Meet your neighbour, pick up the item, and return it when you're done. Leave a review to help the community.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div
                  className="font-[family-name:var(--font-serif)]"
                  style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-action)', opacity: 0.4, marginBottom: 'var(--space-2)' }}
                >
                  {step}
                </div>
                <h3 style={{ fontSize: 'var(--h4-size)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
