import { type ReactNode } from 'react';
import HOIcon from './HOIcon';

const ACCENT = '#4A5BE8';
const DIVIDER = 'rgba(255,255,255,0.08)';
const META = '#75778B';

function inputBase(mono?: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 9,
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${DIVIDER}`,
    color: '#fff', fontSize: 13, fontFamily: mono ? "'JetBrains Mono','SF Mono',Menlo,monospace" : 'inherit',
    outline: 'none', transition: 'border-color 0.15s',
  };
}

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div>
      {label && <div style={{ fontSize: 11, letterSpacing: '0.04em', color: META, marginBottom: 8, fontWeight: 600 }}>{label}</div>}
      {children}
      {error && <div style={{ fontSize: 11, color: '#F25C6E', marginTop: 6 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: '#4A4C5C', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  accent?: string;
}

export function TextInput({ value, onChange, placeholder, mono, accent = ACCENT }: TextInputProps) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.target.style.borderColor = accent; }}
      onBlur={(e) => { e.target.style.borderColor = DIVIDER; }}
      style={inputBase(mono)}
    />
  );
}

interface SegmentedOption {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedProps {
  value: string;
  options: SegmentedOption[];
  onChange: (v: string) => void;
  accent?: string;
}

export function Segmented({ value, options, onChange, accent = ACCENT }: SegmentedProps) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: `1px solid ${DIVIDER}` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <div
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1, textAlign: 'center', padding: '9px 8px', borderRadius: 7, cursor: 'pointer',
              background: active ? accent : 'transparent', color: active ? '#fff' : META,
              fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, transition: 'background 0.15s, color 0.15s',
            }}
          >
            {o.icon && <HOIcon name={o.icon} size={14} color={active ? '#fff' : META} stroke={1.8} />}
            {o.label}
          </div>
        );
      })}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
}

export function Select({ value, options, onChange }: SelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputBase(), appearance: 'none', cursor: 'pointer', paddingRight: 34 }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#16181f' }}>{o.label}</option>
        ))}
      </select>
      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: META }}>
        <HOIcon name="chevron" size={14} stroke={2} />
      </div>
    </div>
  );
}

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  icon?: string;
  danger?: boolean;
  variant?: 'primary' | 'ghost';
}

export function PrimaryButton({ onClick, children, icon }: ButtonProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9,
        background: '#fff', color: '#000',
        fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'transform 0.15s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
    >
      {icon && <HOIcon name={icon} size={15} color="#000" stroke={2} />}
      {children}
    </div>
  );
}

export function GhostButton({ onClick, children, danger }: ButtonProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 16px', borderRadius: 9, cursor: 'pointer',
        border: `1px solid ${danger ? '#F25C6E66' : DIVIDER}`,
        color: danger ? '#F25C6E' : META,
        fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

interface IconBtnProps {
  name: string;
  title?: string;
  onClick?: () => void;
  danger?: boolean;
}

export function IconBtn({ name, title, onClick, danger }: IconBtnProps) {
  return (
    <div
      title={title}
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: danger ? '#F25C6E' : META,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = danger ? 'rgba(242,92,110,0.14)' : 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      <HOIcon name={name} size={15} stroke={1.8} />
    </div>
  );
}
