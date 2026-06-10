export const ACCENT = '#4A5BE8';

export const theme = {
  accent: ACCENT,
  fg: '#FFFFFF',
  meta: '#75778B',
  metaSoft: '#4A4C5C',
  up: '#3DD68C',
  down: '#F25C6E',
  mono: "'JetBrains Mono','SF Mono',Menlo,monospace",
  pageBg: `radial-gradient(900px 480px at 12% -8%, ${ACCENT}26, transparent 60%),
           radial-gradient(760px 520px at 100% 0%, #6B5BD42e, transparent 55%),
           linear-gradient(180deg, #0a0b10 0%, #050507 100%)`,
  card: 'rgba(14,15,22,0.5)',
  cardBlur: 'blur(18px)',
  cardBorder: '1px solid rgba(255,255,255,0.12)',
  radius: 16,
  shadow: '0 14px 40px rgba(0,0,0,0.4)',
  sidebar: 'rgba(8,9,14,0.55)',
  sidebarBorder: '1px solid rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.08)',
  inset: 'rgba(255,255,255,0.04)',
} as const;

export type Theme = typeof theme;
