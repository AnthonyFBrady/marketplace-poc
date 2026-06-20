'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: 'calc(100dvh - var(--nav-h))',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: 'var(--h3-size)',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Something went wrong
      </p>
      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-6)',
          maxWidth: 320,
        }}
      >
        We had trouble loading this page.
      </p>
      <button
        onClick={reset}
        style={{
          height: 'var(--btn-h-sm)',
          padding: '0 var(--space-5)',
          borderRadius: 'var(--r-badge)',
          background: 'var(--color-action)',
          color: '#FFFFFF',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
        }}
      >
        Try again
      </button>
    </div>
  );
}
