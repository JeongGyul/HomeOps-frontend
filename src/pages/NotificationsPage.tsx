import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';
import Switch from '@/components/ui/Switch';
import HOIcon from '@/components/ui/HOIcon';
import TypeBadge from '@/components/ui/TypeBadge';
import { PrimaryButton, GhostButton, IconBtn, Field, TextInput, Segmented, Select } from '@/components/ui/FormControls';
import { getNotifications, getWebhooks, createWebhook, updateWebhook, deleteWebhook, toggleWebhook, testWebhook } from '@/api/notifications';
import { getSettings, updateSettings } from '@/api/settings';
import { getServices } from '@/api/services';
import type { Webhook, WebhookCreateRequest, NotificationEvent } from '@/types';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const META_SOFT = '#4A4C5C';
const DIVIDER = 'rgba(255,255,255,0.08)';

function DiscordMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0, background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="#fff">
        <path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.3.5a14 14 0 0 1 4.1 1.3 13 13 0 0 0-14.9 0A14 14 0 0 1 8.7 3.5L8.4 3a19 19 0 0 0-4.7 1.4C.8 8.7 0 12.9.4 17a19 19 0 0 0 5.7 2.9l.5-.9a12 12 0 0 1-2-1l.5-.4a13 13 0 0 0 11 0l.5.4a12 12 0 0 1-2 1l.5.9a19 19 0 0 0 5.7-2.9c.5-4.8-.8-9-3.7-12.6ZM8.3 14.5c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Zm7.4 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z" />
      </svg>
    </div>
  );
}

function Checkbox({ checked, accent = ACCENT }: { checked: boolean; accent?: string }) {
  return (
    <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `1.5px solid ${checked ? accent : DIVIDER}`, background: checked ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
      {checked && <HOIcon name="check" size={12} color="#fff" stroke={3} />}
    </div>
  );
}

function WebhookModal({ editing, services, onClose, onSuccess }: { editing: Webhook | null; services: { id: number; name: string; checkType: 'HTTP' | 'TCP' | 'PROCESS' }[]; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState(() =>
    editing
      ? { name: editing.name, url: editing.url, scope: editing.targetAll ? 'all' : 'custom', selected: editing.targetAll ? [] : [...editing.serviceIds] }
      : { name: '', url: '', scope: 'all', selected: [] as number[] },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const createMut = useMutation({ mutationFn: createWebhook, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['webhooks'] }); onSuccess(); } });
  const updateMut = useMutation({ mutationFn: ({ id, req }: { id: number; req: WebhookCreateRequest }) => updateWebhook(id, req), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['webhooks'] }); onSuccess(); } });

  const toggleSel = (id: number) => setForm((f) => ({ ...f, selected: f.selected.includes(id) ? f.selected.filter((x) => x !== id) : [...f.selected, id] }));

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '이름을 입력하세요';
    if (!form.url.trim()) e.url = 'Webhook URL을 입력하세요';
    else if (!/^https?:\/\//.test(form.url.trim())) e.url = 'http(s):// 로 시작하는 URL이어야 합니다';
    if (form.scope === 'custom' && form.selected.length === 0) e.scope = '알림 대상 서비스를 1개 이상 선택하세요';
    setErrors(e);
    if (Object.keys(e).length) return;

    const req: WebhookCreateRequest = { name: form.name, url: form.url, targetAll: form.scope === 'all', serviceIds: form.scope === 'all' ? [] : form.selected };
    if (editing) updateMut.mutate({ id: editing.id, req });
    else createMut.mutate(req);
  };

  return (
    <Modal title={editing ? 'Webhook 수정' : 'Webhook 등록'} width={520} subtitle={editing ? '채널 정보와 알림 대상 서비스를 수정합니다' : 'Discord 채널과 알림 대상 서비스를 연결합니다'} onClose={onClose}
      footer={<><GhostButton onClick={onClose}>취소</GhostButton><PrimaryButton onClick={submit}>{editing ? '저장' : '등록'}</PrimaryButton></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="채널 이름" error={errors.name}><TextInput value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="예: 미디어 채널" /></Field>
        <Field label="Webhook URL" error={errors.url} hint="Discord 채널 설정 → 연동 → 웹후크에서 발급"><TextInput mono value={form.url} onChange={(v) => setForm((f) => ({ ...f, url: v }))} placeholder="https://discord.com/api/webhooks/..." /></Field>
        <Field label="알림 대상" error={errors.scope}>
          <Segmented value={form.scope} onChange={(v) => setForm((f) => ({ ...f, scope: v }))} options={[{ value: 'all', label: '전체 서비스' }, { value: 'custom', label: '특정 서비스' }]} />
          {form.scope === 'custom' && (
            <div style={{ marginTop: 12, border: `1px solid ${DIVIDER}`, borderRadius: 11, overflow: 'hidden', maxHeight: 232, overflowY: 'auto' }}>
              {services.map((s, i) => {
                const checked = form.selected.includes(s.id);
                return (
                  <div key={s.id} onClick={() => toggleSel(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', cursor: 'pointer', borderTop: i ? `1px solid ${DIVIDER}` : 'none', background: checked ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                    <Checkbox checked={checked} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.name}</span>
                    <TypeBadge type={s.checkType} />
                  </div>
                );
              })}
            </div>
          )}
        </Field>
      </div>
    </Modal>
  );
}

function WebhookCard({ wh, svcMap, onEdit, onDelete }: { wh: Webhook; svcMap: Record<number, string>; onEdit: (w: Webhook) => void; onDelete: (w: Webhook) => void }) {
  const queryClient = useQueryClient();
  const toggleMut = useMutation({ mutationFn: () => toggleWebhook(wh.id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }) });
  const testMut = useMutation({ mutationFn: () => testWebhook(wh.id) });

  const chips = wh.targetAll
    ? [{ key: 'all', label: '전체 서비스', all: true }]
    : wh.serviceIds.map((id) => ({ key: id, label: svcMap[id], all: false })).filter((c) => c.label);

  return (
    <div style={{ background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.4)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 13, transition: 'opacity 0.2s', opacity: wh.enabled ? 1 : 0.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <DiscordMark size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wh.name}</div>
          <div style={{ fontSize: 10.5, color: META_SOFT, fontFamily: "'JetBrains Mono',monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wh.url}</div>
        </div>
        <Switch checked={wh.enabled} onChange={() => toggleMut.mutate()} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: META_SOFT, marginRight: 2 }}>대상</span>
        {chips.length === 0
          ? <span style={{ fontSize: 11.5, color: META_SOFT }}>지정된 서비스 없음</span>
          : chips.map((c) => (
            <span key={String(c.key)} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, color: c.all ? ACCENT : '#fff', background: c.all ? `${ACCENT}1a` : 'rgba(255,255,255,0.05)', border: `1px solid ${c.all ? ACCENT + '55' : DIVIDER}`, whiteSpace: 'nowrap' }}>{c.label}</span>
          ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', borderTop: `1px solid ${DIVIDER}`, paddingTop: 11 }}>
        <div onClick={() => testMut.mutate()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', color: META, fontSize: 11.5, fontWeight: 600, marginRight: 'auto', whiteSpace: 'nowrap' }}>
          <HOIcon name="bell" size={13} stroke={1.8} />테스트 전송
        </div>
        <IconBtn name="edit" title="수정" onClick={() => onEdit(wh)} />
        <IconBtn name="trash" title="삭제" danger onClick={() => onDelete(wh)} />
      </div>
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

function formatTime(dateStr: string) {
  try { return new Date(dateStr).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return dateStr; }
}

function HistoryRow({ event }: { event: NotificationEvent }) {
  const isCrash = event.eventType === 'CRASH';
  const color = isCrash ? '#F25C6E' : '#3DD68C';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: `1px solid ${DIVIDER}` }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: `${color}1f`, border: `1px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HOIcon name={isCrash ? 'arrowDown' : 'arrowUp'} size={13} color={color} stroke={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{event.serviceName}<span style={{ color, marginLeft: 7 }}>{isCrash ? '다운' : '복구'}</span></div>
        <div style={{ fontSize: 11.5, color: META, marginTop: 2 }}>{event.description}</div>
      </div>
      <div style={{ fontSize: 11, color: META_SOFT, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{formatTime(event.createdAt)}</div>
    </div>
  );
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'CRASH' | 'RECOVER'>('all');
  const [modal, setModal] = useState<Webhook | null | 'new'>(null);
  const [delTarget, setDelTarget] = useState<Webhook | null>(null);

  const { data: webhooks = [] } = useQuery({ queryKey: ['webhooks'], queryFn: getWebhooks });
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: () => getNotifications(0, 40) });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices });

  const updateSettingsMut = useMutation({ mutationFn: updateSettings, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }) });
  const patchSettings = (patch: Partial<typeof settings>) =>
    updateSettingsMut.mutate({
      notifyCrash: settings?.notifyCrash ?? true,
      notifyRecover: settings?.notifyRecover ?? true,
      failThreshold: settings?.failThreshold ?? 2,
      defaultInterval: settings?.defaultInterval ?? 30,
      ...patch,
    });
  const deleteMut = useMutation({ mutationFn: (id: number) => deleteWebhook(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['webhooks'] }); setDelTarget(null); } });

  const svcMap = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.name])) as Record<number, string>, [services]);
  const filtered = notifications.filter((n) => filter === 'all' || n.eventType === filter);
  const activeCount = webhooks.filter((w) => w.enabled).length;

  return (
    <>
      <PageHeader eyebrow="알림" title="알림 설정">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: `1px solid ${activeCount ? ACCENT + '55' : DIVIDER}`, background: activeCount ? `${ACCENT}1a` : 'transparent' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: activeCount ? ACCENT : META_SOFT }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>웹훅 {webhooks.length}개 · 활성 {activeCount}</span>
        </div>
      </PageHeader>

      <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 28px', display: 'flex', gap: 22, overflow: 'hidden' }}>
        {/* 좌: Webhook + 알림 규칙 */}
        <div style={{ width: 460, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 4, marginRight: -4 }} className="scrollbar-thin">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>Discord Webhook</h2>
              <span style={{ fontSize: 12, color: META }}>{webhooks.length}개</span>
            </div>
            <PrimaryButton icon="plus" onClick={() => setModal('new')}>Webhook 추가</PrimaryButton>
          </div>

          {webhooks.map((wh) => <WebhookCard key={wh.id} wh={wh} svcMap={svcMap} onEdit={(w) => setModal(w)} onDelete={(w) => setDelTarget(w)} />)}
          {webhooks.length === 0 && (
            <div style={{ background: 'rgba(14,15,22,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '32px 20px', textAlign: 'center', color: META_SOFT, fontSize: 12.5 }}>
              등록된 Webhook이 없습니다. 추가해 알림을 받아보세요.
            </div>
          )}

          {/* 알림 규칙 카드 */}
          <div style={{ background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <HOIcon name="sliders" size={16} color={ACCENT} stroke={1.8} />
              <h3 style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>알림 규칙</h3>
            </div>
            <div style={{ marginTop: 4 }}>
              <SettingRow title="서비스 다운 시 알림" desc="ServiceCrashedEvent 발행 시 전송">
                <Switch checked={settings?.notifyCrash ?? true} onChange={(v) => patchSettings({ notifyCrash: v })} />
              </SettingRow>
              <SettingRow title="서비스 복구 시 알림" desc="다운된 서비스가 다시 정상화될 때">
                <Switch checked={settings?.notifyRecover ?? true} onChange={(v) => patchSettings({ notifyRecover: v })} />
              </SettingRow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 0 4px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>연속 실패 임계값</div>
                  <div style={{ fontSize: 11.5, color: META, marginTop: 3 }}>N회 연속 실패 시 다운으로 확정</div>
                </div>
                <div style={{ width: 130 }}>
                  <Select
                    value={String(settings?.failThreshold ?? 2)}
                    onChange={(v) => patchSettings({ failThreshold: parseInt(v, 10) })}
                    options={[{ value: '1', label: '1회' }, { value: '2', label: '2회' }, { value: '3', label: '3회' }, { value: '5', label: '5회' }]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우: 이벤트 이력 */}
        <div style={{ background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 16px', borderBottom: `1px solid ${DIVIDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <HOIcon name="history" size={16} color={ACCENT} stroke={1.8} />
              <h3 style={{ fontSize: 14.5, fontWeight: 600, margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>이벤트 이력</h3>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${DIVIDER}` }}>
              {([{ id: 'all', label: '전체' }, { id: 'CRASH', label: '장애' }, { id: 'RECOVER', label: '복구' }] as const).map((f) => (
                <div key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '6px 13px', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, fontWeight: 600, background: filter === f.id ? ACCENT : 'transparent', color: filter === f.id ? '#fff' : META, transition: 'background 0.15s' }}>{f.label}</div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="scrollbar-thin">
            {filtered.length === 0
              ? <div style={{ color: META_SOFT, fontSize: 12, textAlign: 'center', padding: '48px 0' }}>해당하는 이벤트가 없습니다</div>
              : filtered.map((e) => <HistoryRow key={e.id} event={e} />)
            }
          </div>
        </div>
      </div>

      {modal && <WebhookModal editing={modal === 'new' ? null : modal as Webhook} services={services} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />}
      {delTarget && (
        <Modal title="Webhook 삭제" width={420} subtitle={`'${delTarget.name}' Webhook을 제거합니다`} onClose={() => setDelTarget(null)}
          footer={<><GhostButton onClick={() => setDelTarget(null)}>취소</GhostButton><div onClick={() => deleteMut.mutate(delTarget.id)} style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer', background: '#F25C6E', color: '#fff', fontSize: 12.5, fontWeight: 600 }}>삭제</div></>}
        >
          <div style={{ fontSize: 13, color: META, lineHeight: 1.6 }}>이 채널로는 더 이상 알림이 전송되지 않습니다.</div>
        </Modal>
      )}
    </>
  );
}
