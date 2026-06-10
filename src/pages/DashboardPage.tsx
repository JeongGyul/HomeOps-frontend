import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import ResourceCard from '@/components/dashboard/ResourceCard';
import ServiceCard from '@/components/dashboard/ServiceCard';
import EventLog from '@/components/dashboard/EventLog';
import { PrimaryButton } from '@/components/ui/FormControls';
import { getServices } from '@/api/services';
import { getNotifications } from '@/api/notifications';
import { useSSE, buildInitialHistory, HISTORY_LEN } from '@/hooks/useSSE';
import type { ResourcesState, ResourceSnapshot } from '@/types';

const ACCENT = '#4A5BE8';

function initResources(): ResourcesState {
  return {
    cpu: { value: 34, history: buildInitialHistory(34, 9) },
    ram: { value: 58, history: buildInitialHistory(58, 5) },
    temp: { value: 52, history: buildInitialHistory(52, 3) },
    network: { value: 2.1, history: buildInitialHistory(2.1, 0.8) },
  };
}

interface DashboardPageProps {
  onNavigateToServices: () => void;
}

export default function DashboardPage({ onNavigateToServices }: DashboardPageProps) {
  const [resources, setResources] = useState<ResourcesState>(initResources);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    refetchInterval: 5000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(0, 20),
    refetchInterval: 10000,
  });

  const handleSSEData = useCallback((snapshot: ResourceSnapshot) => {
    setLastUpdated(new Date());
    setResources((prev) => {
      const push = (cur: { value: number; history: number[] }, val: number) => {
        // slice(-N) 으로 새 배열 한 번만 생성, push+shift 2회 대신
        const history = cur.history.length >= HISTORY_LEN
          ? [...cur.history.slice(1), val]
          : [...cur.history, val];
        return { value: val, history };
      };
      return {
        cpu: push(prev.cpu, snapshot.cpu),
        ram: push(prev.ram, snapshot.ram),
        temp: push(prev.temp, snapshot.temp),
        network: push(prev.network, snapshot.network),
      };
    });
  }, []);

  useSSE(handleSSEData);

  const upCount = services.filter((s) => s.up && !s.paused).length;
  const downCount = services.filter((s) => !s.up && !s.paused).length;
  const total = services.length;

  const secondsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <>
      <PageHeader eyebrow="대시보드" title="실시간 모니터링">
        {/* LIVE 배지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: `1px solid ${ACCENT}55`, background: `${ACCENT}1a` }}>
          <span style={{ position: 'relative', width: 7, height: 7 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: ACCENT }} />
            <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1px solid ${ACCENT}`, animation: 'hoPulse 1.6s ease-out infinite' }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#fff' }}>LIVE</span>
        </div>
        <span style={{ fontSize: 11.5, color: '#75778B', whiteSpace: 'nowrap' }}>
          {secondsAgo <= 1 ? '방금 갱신' : `${secondsAgo}초 전 갱신`}
        </span>
      </PageHeader>

      <div style={{ flex: 1, minHeight: 0, padding: '22px 32px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        {/* 리소스 카드 */}
        <div style={{ display: 'flex', gap: 18 }}>
          <ResourceCard icon="cpu" label="CPU 사용률" value={resources.cpu.value} unit="%" history={resources.cpu.history} min={0} max={100} />
          <ResourceCard icon="drive" label="메모리" value={resources.ram.value} unit="%" history={resources.ram.history} min={0} max={100} />
          <ResourceCard icon="thermometer" label="CPU 온도" value={resources.temp.value} unit="°C" history={resources.temp.history} min={30} max={85} danger={resources.temp.value >= 68} />
        </div>

        {/* 하단: 서비스 그리드 + 이벤트 로그 */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 20 }}>
          <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 서비스 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>서비스</h2>
                <div style={{ display: 'flex', gap: 7 }}>
                  {[`전체 ${total}`, `정상 ${upCount}`, `다운 ${downCount}`].map((f, i) => (
                    <span key={f} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', padding: '5px 11px', borderRadius: 999, color: i === 0 ? '#fff' : '#75778B', background: i === 0 ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <PrimaryButton icon="plus" onClick={onNavigateToServices}>서비스 추가</PrimaryButton>
            </div>

            {/* 서비스 그리드 */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4, marginRight: -4 }} className="scrollbar-thin">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {services.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            </div>
          </section>

          <EventLog events={notifications} />
        </div>
      </div>
    </>
  );
}
