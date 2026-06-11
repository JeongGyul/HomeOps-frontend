import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import HOIcon from '@/components/ui/HOIcon';
import { GhostButton, Select } from '@/components/ui/FormControls';
import { getSettings, updateSettings, getStoreStatus, getSystemInfo } from '@/api/settings';
import { getDashboardSummary } from '@/api/services';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const META_SOFT = '#4A4C5C';
const DIVIDER = 'rgba(255,255,255,0.08)';

function StorePill({ status }: { status: 'connected' | 'disconnected' | 'error' | 'unknown' }) {
  const map = {
    connected: { c: '#3DD68C', label: '연결됨' },
    disconnected: { c: '#F25C6E', label: '끊김' },
    error: { c: '#F5A623', label: '오류' },
    unknown: { c: '#75778B', label: '확인 불가' },
  };
  const { c, label } = map[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: c, border: `1px solid ${c}55`, background: `${c}14`, borderRadius: 999, padding: '4px 10px' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
      {label}
    </span>
  );
}

function KV({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${DIVIDER}` }}>
      <span style={{ fontSize: 12.5, color: META }}>{label}</span>
      <span style={{ fontSize: 12.5, color: '#fff', fontFamily: mono ? "'JetBrains Mono',monospace" : 'inherit', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function SettingRow({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: `1px solid ${DIVIDER}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{title}</div>
        {desc && <div style={{ fontSize: 11.5, color: META, marginTop: 3 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Card({ title, icon, children, right }: { title: string; icon?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
        {icon && <HOIcon name={icon} size={16} color={ACCENT} stroke={1.8} />}
        <h3 style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>{title}</h3>
        {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
      </div>
      {children}
    </div>
  );
}

interface SettingsPageProps {
  onLogout: () => void;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}일 ${h}시간 ${m}분`;
  if (h > 0) return `${h}시간 ${m}분`;
  return `${m}분`;
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { data: storeStatus, isError: storeError } = useQuery({ queryKey: ['storeStatus'], queryFn: getStoreStatus, refetchInterval: 30000, retry: 1 });
  const { data: summary } = useQuery({ queryKey: ['summary'], queryFn: getDashboardSummary });
  const { data: sysInfo } = useQuery({ queryKey: ['systemInfo'], queryFn: getSystemInfo, staleTime: 60_000 });

  const updateMut = useMutation({ mutationFn: updateSettings, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }) });
  const patchSettings = (patch: Partial<typeof settings>) =>
    updateMut.mutate({
      notifyCrash: settings?.notifyCrash ?? true,
      notifyRecover: settings?.notifyRecover ?? true,
      failThreshold: settings?.failThreshold ?? 2,
      defaultInterval: settings?.defaultInterval ?? 30,
      ...patch,
    });

  return (
    <>
      <PageHeader eyebrow="설정" title="시스템 설정" />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 32px 32px' }} className="scrollbar-thin">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 980 }}>

          {/* 장치 카드 */}
          <Card title="장치" icon="cpu" right={<StorePill status="connected" />}>
            <div style={{ marginTop: 8 }}>
              <KV label="호스트명" value={sysInfo?.hostname ?? '—'} />
              <KV label="IP 주소" value={sysInfo?.localIp ?? '—'} />
              <KV label="OS" value={sysInfo?.os ?? '—'} mono={false} />
              <KV label="가동 시간" value={sysInfo ? formatUptime(sysInfo.uptimeSeconds) : '—'} mono={false} />
              <KV label="서비스 수" value={String(summary?.total ?? '—')} />
            </div>
          </Card>

          {/* 데이터 스토어 카드 */}
          <Card title="데이터 스토어" icon="drive">
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                <div>
                  <div style={{ fontSize: 12.5, color: '#fff', fontWeight: 600 }}>MySQL</div>
                  <div style={{ fontSize: 11, color: META, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>localhost:3306 · homeops</div>
                </div>
                <StorePill status={storeError ? 'unknown' : (storeStatus?.mysqlStatus ?? 'unknown')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0 4px' }}>
                <div>
                  <div style={{ fontSize: 12.5, color: '#fff', fontWeight: 600 }}>Redis</div>
                  <div style={{ fontSize: 11, color: META, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>localhost:6379 · 실시간 상태 캐시</div>
                </div>
                <StorePill status={storeError ? 'unknown' : (storeStatus?.redisStatus ?? 'unknown')} />
              </div>
            </div>
          </Card>

          {/* 모니터링 기본값 */}
          <Card title="모니터링 기본값" icon="sliders">
            <div style={{ marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>기본 체크 주기</div>
                  <div style={{ fontSize: 11.5, color: META, marginTop: 3 }}>신규 서비스에 적용될 기본값</div>
                </div>
                <div style={{ width: 140 }}>
                  <Select
                    value={String(settings?.defaultInterval ?? 30)}
                    onChange={(v) => patchSettings({ defaultInterval: parseInt(v, 10) })}
                    options={[{ value: '15', label: '15초마다' }, { value: '30', label: '30초마다' }, { value: '60', label: '1분마다' }]}
                  />
                </div>
              </div>
              <SettingRow title="등록된 서비스" desc="현재 모니터링 중인 총 서비스 수">
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>{summary?.total ?? '—'}</span>
              </SettingRow>
            </div>
          </Card>

          {/* 계정 카드 */}
          <Card title="계정" icon="server">
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #6B5BD4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: '#fff' }}>관</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>관리자</div>
                <div style={{ fontSize: 12, color: META, fontFamily: "'JetBrains Mono',monospace" }}>admin@homeops</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <GhostButton>비밀번호 변경</GhostButton>
              <GhostButton danger onClick={onLogout}>로그아웃</GhostButton>
            </div>
          </Card>
        </div>

        <div style={{ fontSize: 11, color: META_SOFT, marginTop: 22, letterSpacing: '0.04em' }}>
          HomeOps v0.1
        </div>
      </div>
    </>
  );
}
