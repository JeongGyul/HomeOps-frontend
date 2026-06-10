const PATHS: Record<string, string> = {
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z',
  server:    'M4 4h16v6H4zM4 14h16v6H4z',
  bell:      'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  sliders:   'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  cpu:       'M6 6h12v12H6zM9 9h6v6H9M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3',
  thermometer: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z',
  drive:     'M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11ZM6 16h.01M10 16h.01',
  globe:     'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10Z',
  terminal:  'M4 17l6-6-6-6M12 19h8',
  plug:      'M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0z',
  plus:      'M12 5v14M5 12h14',
  refresh:   'M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chevron:   'M9 6l6 6-6 6',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7',
  arrowUp:   'M12 19V5M5 12l7-7 7 7',
  history:   'M3 3v5h5M3.05 13a9 9 0 1 0 2.6-6.4L3 8M12 7v5l3 2',
  play:      'M6 3l14 9-14 9V3Z',
  pause:     'M6 4h4v16H6zM14 4h4v16h-4z',
  edit:      'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  trash:     'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  check:     'M20 6L9 17l-5-5',
  link:      'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  network:   'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
};

interface HOIconProps {
  name: string;
  size?: number;
  color?: string;
  stroke?: number;
  className?: string;
}

export default function HOIcon({ name, size = 18, color = 'currentColor', stroke = 1.6, className }: HOIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
      className={className}
    >
      <path d={PATHS[name] ?? ''} />
    </svg>
  );
}
