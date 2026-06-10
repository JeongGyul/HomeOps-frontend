import { type ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export default function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A4C5C', marginBottom: 6 }}>
          {eyebrow}
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.03em', margin: 0, color: '#fff' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>{children}</div>
    </header>
  );
}
