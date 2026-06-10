import HOIcon from '@/components/ui/HOIcon';
import LineChart from '@/components/charts/LineChart';

const ACCENT = '#4A5BE8';
const META = '#75778B';

interface ResourceCardProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
  history: number[];
  min: number;
  max: number;
  danger?: boolean;
}

export default function ResourceCard({ icon, label, value, unit, history, min, max, danger }: ResourceCardProps) {
  const color = danger ? '#F25C6E' : ACCENT;
  return (
    <div style={{
      background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
      padding: '18px 20px 14px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: META }}>
          <HOIcon name={icon} size={15} stroke={1.7} />
          <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(value)}
        </span>
        <span style={{ fontSize: 15, color: META, fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <LineChart data={history} height={64} color={color} min={min} max={max} />
      </div>
    </div>
  );
}
