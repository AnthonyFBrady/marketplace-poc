type Size = 'sm' | 'md' | 'lg';

const SIZE: Record<Size, { mark: number; text: number; gap: number; rx: number }> = {
  sm: { mark: 22, text: 16, gap: 7,  rx: 5  },
  md: { mark: 28, text: 20, gap: 9,  rx: 7  },
  lg: { mark: 38, text: 26, gap: 12, rx: 9  },
};

type Props = {
  size?: Size;
  markOnly?: boolean;
  className?: string;
};

export function Logo({ size = 'md', markOnly = false, className }: Props) {
  const s = SIZE[size];

  return (
    <span
      className={`inline-flex items-center ${className ?? ''}`}
      style={{ gap: s.gap }}
    >
      {/* Mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <rect width="40" height="40" rx={s.rx * (40 / s.mark)} fill="#2D6A4F" />
        <text
          x="20"
          y="28"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="24"
          fontWeight="600"
          fill="white"
          textAnchor="middle"
        >
          B
        </text>
      </svg>

      {/* Wordmark */}
      {!markOnly && (
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: s.text,
            fontWeight: 600,
            color: '#2D6A4F',
            letterSpacing: 'var(--tracking-serif)',
            lineHeight: 1,
          }}
        >
          Borrow
        </span>
      )}
    </span>
  );
}
