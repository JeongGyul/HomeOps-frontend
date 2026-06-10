import HOIcon from './HOIcon';
import type { CheckType } from '@/types';

const TYPE_ICON: Record<CheckType, string> = {
  HTTP: 'globe',
  TCP: 'plug',
  PROCESS: 'terminal',
};

interface TypeBadgeProps {
  type: CheckType;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.03)',
      fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: '#75778B', fontWeight: 600,
    }}>
      <HOIcon name={TYPE_ICON[type]} size={11} stroke={1.8} />
      {type}
    </span>
  );
}
