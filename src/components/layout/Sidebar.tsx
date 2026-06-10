import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HOIcon from '@/components/ui/HOIcon';
import StatusDot from '@/components/ui/StatusDot';
import { getSystemInfo } from '@/api/settings';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const META_SOFT = '#4A4C5C';
const DIVIDER = 'rgba(255,255,255,0.08)';

type Route = 'dashboard' | 'services' | 'notifications' | 'settings';

interface NavItemProps {
  id: Route;
  icon: string;
  label: string;
  badge?: number;
  dot?: boolean;
  active: boolean;
  onNavigate: (r: Route) => void;
}

function NavItem({ id, icon, label, badge, dot, active, onNavigate }: NavItemProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onNavigate(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
        color: active ? '#fff' : META,
        backgroundColor: active ? 'rgba(255,255,255,0.05)' : (hover ? 'rgba(255,255,255,0.03)' : 'transparent'),
        borderLeft: '2px solid transparent',
        fontSize: 13.5, fontWeight: active ? 600 : 500,
        transition: 'background-color 0.16s, color 0.16s',
      }}
    >
      <HOIcon name={icon} size={17} color={active ? ACCENT : META} stroke={1.7} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span style={{ fontSize: 10.5, fontWeight: 600, color: active ? '#fff' : META_SOFT, fontVariantNumeric: 'tabular-nums' }}>{badge}</span>
      )}
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F25C6E', boxShadow: '0 0 6px #F25C6E' }} />}
    </div>
  );
}

interface SidebarProps {
  route: Route;
  onNavigate: (r: Route) => void;
  total: number;
  downCount: number;
  onLogout: () => void;
}

export default function Sidebar({ route, onNavigate, total, downCount, onLogout }: SidebarProps) {
  const { data: sysInfo } = useQuery({ queryKey: ['systemInfo'], queryFn: getSystemInfo, staleTime: 60_000 });

  const nav = [
    { id: 'dashboard' as Route, icon: 'dashboard', label: '대시보드' },
    { id: 'services' as Route, icon: 'server', label: '서비스', badge: total },
    { id: 'notifications' as Route, icon: 'bell', label: '알림', dot: downCount > 0 },
    { id: 'settings' as Route, icon: 'sliders', label: '설정' },
  ];

  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: 'rgba(8,9,14,0.55)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      display: 'flex', flexDirection: 'column', padding: '26px 18px',
    }}>
      {/* 워드마크 */}
      <div style={{ padding: '0 8px', marginBottom: 30 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: '#fff' }}>
          HomeOps <span style={{ color: ACCENT }}>.</span>
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: META_SOFT, marginTop: 4 }}>
          Operations Center
        </div>
      </div>

      {/* 네비 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {nav.map((n) => (
          <NavItem key={n.id} {...n} active={n.id === route} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* 장치 정보 */}
      <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${DIVIDER}` }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: META_SOFT, marginBottom: 12, paddingLeft: 4 }}>장치</div>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
          padding: '13px 14px', borderRadius: 11,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <StatusDot up={true} size={7} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              {sysInfo?.hostname ?? '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: META, marginBottom: 4 }}>
            <span>IP</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{sysInfo?.localIp ?? '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: META }}>
            <span>연결</span><span style={{ color: '#3DD68C', fontWeight: 600 }}>활성</span>
          </div>
        </div>
      </div>

      {/* 계정 */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #6B5BD4)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff',
        }}>관</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>관리자</div>
          <div style={{ fontSize: 10, color: META_SOFT }}>admin@homeops</div>
        </div>
        <div onClick={onLogout} style={{ cursor: 'pointer', color: META_SOFT }} title="로그아웃">
          <HOIcon name="logout" size={15} color={META_SOFT} />
        </div>
      </div>
    </aside>
  );
}
