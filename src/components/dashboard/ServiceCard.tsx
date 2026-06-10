import { useState } from 'react';
import StatusDot from '@/components/ui/StatusDot';
import TypeBadge from '@/components/ui/TypeBadge';
import Sparkline from '@/components/charts/Sparkline';
import type { MonitoredService } from '@/types';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const DIVIDER = 'rgba(255,255,255,0.08)';

interface ServiceCardProps {
  service: MonitoredService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [hover, setHover] = useState(false);
  const isDown = !service.up;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'rgba(20,22,31,0.72)',
        border: `1px solid ${isDown ? 'rgba(242,92,110,0.45)' : hover ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
        padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12,
        cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <StatusDot up={service.up} />
        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {service.name}
        </span>
        <TypeBadge type={service.checkType} />
      </div>

      {/* 타겟 */}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: META, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {service.target}
      </div>

      {/* 푸터 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: `1px solid ${DIVIDER}`, paddingTop: 11 }}>
        <div>
          {isDown ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#F25C6E' }}>응답 없음</span>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F25C6E', border: '1px solid #F25C6E55', borderRadius: 999, padding: '2px 7px' }}>장애</span>
            </div>
          ) : service.checkType === 'PROCESS' ? (
            <div style={{ fontSize: 11, color: META }}>
              <span style={{ color: '#3DD68C', fontWeight: 600 }}>실행 중</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontSize: 19, fontWeight: 600, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontVariantNumeric: 'tabular-nums' }}>
                {service.latency ?? '—'}
              </span>
              <span style={{ fontSize: 11, color: META }}>ms</span>
            </div>
          )}
        </div>
        {!isDown && service.checkType !== 'PROCESS' && service.latency != null && (
          <Sparkline
            data={[service.latency * 0.7, service.latency * 1.2, service.latency * 0.9, service.latency * 1.1, service.latency, service.latency * 0.85, service.latency]}
            width={64} height={22}
            color={service.latency > 100 ? '#F25C6E' : ACCENT}
          />
        )}
      </div>
    </div>
  );
}
