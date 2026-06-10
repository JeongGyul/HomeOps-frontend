interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: string;
}

export default function Switch({ checked, onChange, accent = '#4A5BE8' }: SwitchProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 999, padding: 3, cursor: 'pointer', flexShrink: 0,
        background: checked ? accent : 'rgba(255,255,255,0.14)',
        transition: 'background 0.2s',
        display: 'flex', justifyContent: checked ? 'flex-end' : 'flex-start', alignItems: 'center',
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
    </div>
  );
}
