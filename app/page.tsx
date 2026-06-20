'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LISTINGS } from '@/lib/listings';
import { JOBS } from '@/lib/jobs';
import { ListingCard } from '@/components/ListingCard';
import { track } from '@/lib/analytics';

const pageWrap: React.CSSProperties = {
  maxWidth: 'var(--page-max-w)',
  margin: '0 auto',
  paddingLeft: 'var(--page-pad-x)',
  paddingRight: 'var(--page-pad-x)',
};

const HOME_SECTIONS = [
  { jobId: 'home-reno',      displayCategories: ['tools'],                    max: 4 },
  { jobId: 'backyard-party', displayCategories: ['party'],                    max: 4 },
  { jobId: 'camping-trip',   displayCategories: ['camping'],                  max: 4 },
  { jobId: 'music-events',   displayCategories: ['instruments', 'electronics'], max: 4 },
  { jobId: 'get-moving',     displayCategories: ['sports'],                   max: 4 },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    track('search_used', { query, category: 'all' });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: 'calc(100dvh - var(--nav-h))' }}>

      {/* Hero */}
      <div style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-10)' }}>
        <div style={pageWrap}>
          <div style={{ maxWidth: 'var(--hero-max-w)', margin: '0 auto' }}>
            <h1
              className="font-[family-name:var(--font-serif)] text-center mb-2"
              style={{
                fontSize: 'var(--h1-size)',
                fontWeight: 600,
                color: 'var(--brand-ink)',
                letterSpacing: 'var(--tracking-serif)',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              Borrow from a neighbour.
            </h1>
            <p className="text-center mb-6" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}>
              Tools, gear, and equipment — without buying.
            </p>

            <form onSubmit={handleSearch} className="w-full flex items-center gap-2">
              <div
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                }}
              >
                <Search size={16} strokeWidth={2} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to borrow?"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    style={{ color: 'var(--color-text-faint)', fontSize: 16, flexShrink: 0 }}
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 font-semibold transition-opacity hover:opacity-90"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-5)',
                  borderRadius: 'var(--r-badge)',
                  background: 'var(--color-action)',
                  color: '#FFFFFF',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Discovery sections */}
      <div style={{ paddingBottom: 'var(--space-12)' }}>
        {HOME_SECTIONS.map(({ jobId, displayCategories, max }) => {
          const job = JOBS.find((j) => j.id === jobId);
          if (!job) return null;

          const sectionListings = LISTINGS
            .filter((l) => displayCategories.includes(l.category))
            .slice(0, max);

          if (sectionListings.length === 0) return null;

          return (
            <div key={jobId} style={{ marginBottom: 'var(--space-10)' }}>
              <div style={pageWrap}>
                {/* Section header */}
                <div className="flex items-end justify-between" style={{ marginBottom: 'var(--space-5)' }}>
                  <div>
                    <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 'var(--space-2)' }}>
                      {job.emoji}
                    </div>
                    <h2
                      className="font-[family-name:var(--font-serif)]"
                      style={{
                        fontSize: 'var(--h2-size)',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        letterSpacing: 'var(--tracking-serif)',
                        lineHeight: 'var(--leading-snug)',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      {job.label}
                    </h2>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      {job.tagline}
                    </p>
                  </div>
                  <Link
                    href={`/search?job=${job.id}`}
                    className="flex items-center gap-1 shrink-0 ml-6 transition-opacity hover:opacity-70"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: 'var(--color-action)',
                      paddingBottom: 2,
                    }}
                    onClick={() => track('job_chip_clicked', { job: job.id })}
                  >
                    See all
                    <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                </div>

                {/* Listing grid */}
                <div
                  className="grid gap-5"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
                >
                  {sectionListings.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
