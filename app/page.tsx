'use client';

import { ArrowRight } from 'lucide-react';
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
  { jobId: 'home-reno',      displayCategories: ['tools'],                      max: 4 },
  { jobId: 'backyard-party', displayCategories: ['party'],                      max: 4 },
  { jobId: 'camping-trip',   displayCategories: ['camping'],                    max: 4 },
  { jobId: 'music-events',   displayCategories: ['instruments', 'electronics'], max: 4 },
  { jobId: 'get-moving',     displayCategories: ['sports'],                     max: 4 },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: 'calc(100dvh - var(--nav-h))', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
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
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div className="flex items-baseline" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                  <h2
                    className="font-[family-name:var(--font-serif)]"
                    style={{
                      fontSize: 'var(--h2-size)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      letterSpacing: 'var(--tracking-serif)',
                      lineHeight: 'var(--leading-snug)',
                    }}
                  >
                    {job.label}
                  </h2>
                  <Link
                    href={`/search?job=${job.id}`}
                    className="flex items-center gap-1 shrink-0 transition-opacity hover:opacity-70"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: 'var(--color-action)',
                    }}
                    onClick={() => track('job_chip_clicked', { job: job.id })}
                  >
                    See all
                    <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {job.tagline}
                </p>
              </div>

              <div
                className="grid"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}
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
  );
}
