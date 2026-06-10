interface StatusDotProps {
  up: boolean;
  size?: number;
}

export default function StatusDot({ up, size = 8 }: StatusDotProps) {
  const color = up ? '#3DD68C' : '#F25C6E';
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-block' }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      {up && (
        <span style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          border: `1px solid ${color}`,
          animation: 'hoPulse 1.8s ease-out infinite',
        }} />
      )}
    </span>
  );
}
