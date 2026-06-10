import HOIcon from '@/components/ui/HOIcon';

const ACCENT = '#4A5BE8';
const META = '#75778B';

export interface ToastData {
  kind: 'crash' | 'recover' | 'test' | 'info';
  name?: string;
  message?: string;
}

interface ToastProps {
  toast: ToastData | null;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  const isCrash = toast.kind === 'crash';
  const isRecover = toast.kind === 'recover';
  const isDiscord = isCrash || isRecover || toast.kind === 'test';
  const edge = isCrash ? 'rgba(242,92,110,0.4)' : isRecover ? 'rgba(61,214,140,0.4)' : `${ACCENT}66`;
  const eyebrow = isDiscord ? 'Discord Webhook · 전송됨' : '시스템';

  let body: React.ReactNode;
  if (isCrash || isRecover) {
    body = (
      <>
        <span style={{ color: isCrash ? '#F25C6E' : '#3DD68C' }}>{toast.name}</span>
        {isCrash ? ' 서비스가 다운되었습니다' : ' 서비스가 복구되었습니다'}
      </>
    );
  } else {
    body = (
      <>
        {toast.name && <span style={{ color: ACCENT }}>{toast.name}</span>}
        {toast.name ? ' · ' : ''}
        {toast.message}
      </>
    );
  }

  return (
    <div style={{
      position: 'absolute', right: 28, bottom: 24, zIndex: 40,
      display: 'flex', alignItems: 'center', gap: 13,
      padding: '14px 18px', minWidth: 280, maxWidth: 360,
      background: 'rgba(10,11,16,0.86)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      border: `1px solid ${edge}`,
      borderRadius: 14, boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
      animation: 'hoToastIn 0.35s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: isDiscord ? '#5865F2' : ACCENT,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDiscord ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.3.5a14 14 0 0 1 4.1 1.3 13 13 0 0 0-14.9 0A14 14 0 0 1 8.7 3.5L8.4 3a19 19 0 0 0-4.7 1.4C.8 8.7 0 12.9.4 17a19 19 0 0 0 5.7 2.9l.5-.9a12 12 0 0 1-2-1l.5-.4a13 13 0 0 0 11 0l.5.4a12 12 0 0 1-2 1l.5.9a19 19 0 0 0 5.7-2.9c.5-4.8-.8-9-3.7-12.6ZM8.3 14.5c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Zm7.4 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z" />
          </svg>
        ) : (
          <HOIcon name="bell" size={17} color="#fff" stroke={2} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: META, marginBottom: 3 }}>
          {eyebrow}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{body}</div>
      </div>
    </div>
  );
}
