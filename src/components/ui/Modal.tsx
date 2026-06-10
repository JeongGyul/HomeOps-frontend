import { type ReactNode } from 'react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export default function Modal({ title, subtitle, onClose, children, footer, width = 500 }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(5,6,9,0.62)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%', maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          borderRadius: 18, background: 'rgba(18,20,28,0.97)', border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.6)', animation: 'hoToastIn 0.3s cubic-bezier(0.22,1,0.36,1)', overflow: 'hidden',
        }}
      >
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>{title}</h2>
            {subtitle && <div style={{ fontSize: 12.5, color: '#75778B', marginTop: 5 }}>{subtitle}</div>}
          </div>
          <div
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, cursor: 'pointer', color: '#75778B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1 }}
          >
            ×
          </div>
        </div>
        <div style={{ padding: '24px 26px', overflowY: 'auto' }}>{children}</div>
        {footer && (
          <div style={{ padding: '16px 26px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
