'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { track } from '@/lib/analytics';

type Props = {
  photos: string[];
  title: string;
};

export function ListingGallery({ photos, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActive((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActive((i) => (i + 1) % photos.length);

  return (
    <>
      {/* Main gallery */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#E8E8E4]" style={{ aspectRatio: '16/10' }}>
        <Image
          src={photos[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover cursor-zoom-in"
          onClick={() => {
            track('gallery_opened', { photo_count: photos.length });
            setLightbox(true);
          }}
        />

        {/* Nav buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 1px 6px rgba(0,0,0,0.16)' }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 1px 6px rgba(0,0,0,0.16)' }}
              aria-label="Next photo"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Counter */}
        <div
          className="absolute bottom-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
        >
          {active + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative rounded-lg overflow-hidden transition-all duration-150 flex-1"
              style={{
                aspectRatio: '1/1',
                maxWidth: 72,
                outline: i === active ? '2px solid var(--color-action)' : '2px solid transparent',
                outlineOffset: 1,
                opacity: i === active ? 1 : 0.65,
              }}
            >
              <Image
                src={photo}
                alt={`Photo ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div
            className="relative"
            style={{ width: 'min(90vw, 900px)', aspectRatio: '4/3' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[active]}
              alt={title}
              fill
              sizes="90vw"
              className="object-contain"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
