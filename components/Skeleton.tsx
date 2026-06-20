type Props = {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
};

export function Skeleton({ width = '100%', height = 20, radius = 8 }: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'var(--brand-elevated)',
        animation: 'skeleton-pulse 1.4s ease-in-out infinite',
      }}
    />
  );
}
