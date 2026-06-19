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

export default async function CategoryCityPage({ params }: Props) {
  const { category, city } = await params;

  if (!VALID_CITIES.includes(city)) notFound();
  if (!CATEGORIES.find((c) => c.id === category)) notFound();

  const cat = getCategoryById(category as CategoryId);
  const listings = getListingsByCategory(category as CategoryId);
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-5 py-3"
        style={{ background: '#FAFAF8', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-serif)]"
          style={{ fontSize: 20, fontWeight: 600, color: '#2D6A4F', letterSpacing: '-0.02em' }}
        >
          Borrow
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="text-4xl mb-3">{cat.emoji}</div>
          <h1
            className="font-[family-name:var(--font-serif)]"
            style={{ fontSize: 34, fontWeight: 600, color: '#0F0F0E', marginBottom: 10 }}
          >
            Rent {cat.label.toLowerCase()} in {cityLabel}
          </h1>
          <p style={{ fontSize: 16, color: '#525252', maxWidth: 560, lineHeight: 1.7 }}>
            Borrow {cat.label.toLowerCase()} from verified neighbours in {cityLabel}. No membership.
            No long-term commitment. Just the stuff you need, when you need it.
          </p>
        </div>

        {/* Category nav */}
        <div className="flex gap-2 overflow-x-auto mb-8 no-scrollbar">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/rent/${c.id}/${city}`}
              className="flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: c.id === category ? '#2D6A4F' : 'white',
                color: c.id === category ? 'white' : '#0F0F0E',
                border: c.id === category ? 'none' : '1px solid rgba(0,0,0,0.12)',
              }}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: 14, color: '#737373', marginBottom: 20 }}>
          {listings.length} {cat.label.toLowerCase()} available in {cityLabel}
        </p>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl p-8"
          style={{ background: '#F2F2EF', borderTop: '3px solid #2D6A4F' }}
        >
          <h2
            className="font-[family-name:var(--font-serif)]"
            style={{ fontSize: 22, fontWeight: 600, color: '#0F0F0E', marginBottom: 24 }}
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
                desc: 'Meet your neighbour, pick up the item, and return it when you\'re done. Leave a review to help the community.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div
                  className="font-[family-name:var(--font-serif)]"
                  style={{ fontSize: 32, fontWeight: 700, color: '#2D6A4F', opacity: 0.4, marginBottom: 8 }}
                >
                  {step}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F0F0E', marginBottom: 6 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
