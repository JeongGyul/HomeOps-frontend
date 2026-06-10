import HOIcon from '@/components/ui/HOIcon';
import type { NotificationEvent } from '@/types';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const META_SOFT = '#4A4C5C';
const DIVIDER = 'rgba(255,255,255,0.08)';

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

interface EventLogRowProps {
  event: NotificationEvent;
  last: boolean;
}

function EventLogRow({ event, last }: EventLogRowProps) {
  const isCrash = event.eventType === 'CRASH';
  const color = isCrash ? '#F25C6E' : '#3DD68C';
  return (
    <div style={{ display: 'flex', gap: 13, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: `${color}1f`, border: `1px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HOIcon name={isCrash ? 'arrowDown' : 'arrowUp'} size={14} color={color} stroke={2.2} />
        </div>
        {!last && <div style={{ flex: 1, width: 1, background: DIVIDER, marginTop: 4, minHeight: 18 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.serviceName}
            <span style={{ color, marginLeft: 7, fontWeight: 600 }}>{isCrash ? '다운' : '복구'}</span>
          </div>
          <span style={{ fontSize: 10.5, color: META_SOFT, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>
            {formatTime(event.createdAt)}
          </span>
        </div>
        <div style={{ marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, letterSpacing: '0.06em', color: META, border: `1px solid ${DIVIDER}`, borderRadius: 999, padding: '2px 8px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5865F2' }} />
          Discord 알림 전송됨
        </div>
      </div>
    </div>
  );
}

interface EventLogProps {
  events: NotificationEvent[];
}

export default function EventLog({ events }: EventLogProps) {
  return (
    <aside style={{
      background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
      width: 336, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: 0, minHeight: 0,
    }}>
      <div style={{ padding: '18px 20px 16px', borderBottom: `1px solid ${DIVIDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <HOIcon name="history" size={17} color={ACCENT} stroke={1.8} />
          <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>이벤트 로그</h2>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 600, color: META, background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '3px 9px' }}>
            {events.length}
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: META_SOFT, marginTop: 7, letterSpacing: '0.04em' }}>
          상태 전환 이력 · CRASH / RECOVER
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }} className="scrollbar-thin">
        {events.length === 0 ? (
          <div style={{ color: META_SOFT, fontSize: 12, textAlign: 'center', padding: '40px 0' }}>
            기록된 이벤트가 없습니다
          </div>
        ) : (
          events.map((e, i) => <EventLogRow key={e.id} event={e} last={i === events.length - 1} />)
        )}
      </div>
    </aside>
  );
}
