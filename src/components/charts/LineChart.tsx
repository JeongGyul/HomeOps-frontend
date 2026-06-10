import { useMemo } from 'react';

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  min?: number;
  max?: number;
  pad?: number;
}

export default function LineChart({ data, width = 300, height = 64, color = '#4A5BE8', min, max, pad = 6 }: LineChartProps) {
  const id = useMemo(() => 'lc' + Math.random().toString(36).slice(2, 8), []);

  if (!data || data.length < 2) return <svg width={width} height={height} />;

  const lo = min != null ? min : Math.min(...data);
  const hi = max != null ? max : Math.max(...data);
  const span = hi - lo || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const pts: [number, number][] = data.map((v, i) => [
    pad + (i / (data.length - 1)) * innerW,
    pad + innerH - ((v - lo) / span) * innerH,
  ]);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1][0]},${height - pad} L ${pts[0][0]},${height - pad} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible', width: '100%' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad} x2={width - pad} y1={pad + innerH * 0.5} y2={pad + innerH * 0.5} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="6.5" fill={color} opacity="0.18">
        <animate attributeName="r" values="4;9;4" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.28;0;0.28" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
