type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, { text: number }> = {
  sm: { text: 16 },
  md: { text: 20 },
  lg: { text: 26 },
  xl: { text: 32 },
};

type Props = {
  size?: Size;
  className?: string;
};

export function Logo({ size = 'md', className }: Props) {
  const s = SIZE[size];

  return (
    <span
      className={`inline-flex items-center ${className ?? ''}`}
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: s.text,
        fontWeight: 600,
        color: 'var(--color-action)',
        letterSpacing: 'var(--tracking-serif)',
        lineHeight: 1,
      }}
    >
      borrow
    </span>
  );
}
