'use client';

import { useEffect, useRef, useState } from 'react';
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

type Section = {
  jobId: string;
  displayCategories: string[];
  offset?: number;
};

const HOME_SECTIONS: Section[] = [
  { jobId: 'home-reno',      displayCategories: ['tools']                      },
  { jobId: 'backyard-party', displayCategories: ['party']                      },
  { jobId: 'camping-trip',   displayCategories: ['camping']                    },
  { jobId: 'music-events',   displayCategories: ['instruments', 'electronics'] },
  { jobId: 'get-moving',     displayCategories: ['sports']                     },
  { jobId: 'spring-clean',   displayCategories: ['tools'],          offset: 3  },
  { jobId: 'host-a-show',    displayCategories: ['electronics', 'party']       },
];

export default function HomePage() {
  const [sectionsVisible, setSectionsVisible] = useState(2);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionsVisible >= HOME_SECTIONS.length) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionsVisible(v => Math.min(v + 2, HOME_SECTIONS.length));
        }
      },
      { rootMargin: '400px' }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [sectionsVisible]);

  return (
    <div style={{ background: 'var(--brand-bg)', minHeight: 'calc(100dvh - var(--nav-h))', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {HOME_SECTIONS.slice(0, sectionsVisible).map(({ jobId, displayCategories, offset = 0 }) => {
        const job = JOBS.find(j => j.id === jobId);
        if (!job) return null;

        const sectionListings = LISTINGS
          .filter(l => displayCategories.includes(l.category))
          .slice(offset);

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
                {sectionListings.map(l => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Sentinel — triggers loading the next batch of sections */}
      {sectionsVisible < HOME_SECTIONS.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </div>
  );
}
