import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';
import { PrimaryButton, GhostButton, IconBtn, Field, TextInput, Segmented, Select } from '@/components/ui/FormControls';
import TypeBadge from '@/components/ui/TypeBadge';
import { getServices, createService, updateService, deleteService, togglePauseService } from '@/api/services';
import type { MonitoredService, ServiceCreateRequest, CheckType } from '@/types';

const DIVIDER = 'rgba(255,255,255,0.08)';
const META = '#75778B';
const META_SOFT = '#4A4C5C';

const EMPTY_FORM: { name: string; checkType: CheckType; target: string; checkInterval: string } = {
  name: '', checkType: 'HTTP', target: '', checkInterval: '30',
};

interface ServiceModalProps {
  editing: MonitoredService | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ServiceModal({ editing, onClose, onSuccess }: ServiceModalProps) {
  const [form, setForm] = useState(() =>
    editing
      ? { name: editing.name, checkType: editing.checkType, target: editing.target, checkInterval: String(editing.checkInterval) }
      : { ...EMPTY_FORM },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const createMut = useMutation({ mutationFn: createService, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); onSuccess(); } });
  const updateMut = useMutation({ mutationFn: ({ id, req }: { id: number; req: ServiceCreateRequest }) => updateService(id, req), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); onSuccess(); } });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const targetPlaceholder: Record<CheckType, string> = {
    HTTP: 'http://homeserver.local:8080',
    TCP: '192.168.0.10:32400',
    PROCESS: 'python3 bot.py',
  };
  const targetLabel: Record<CheckType, string> = {
    HTTP: '대상 URL', TCP: '대상 IP:Port', PROCESS: '프로세스 명령어',
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '서비스 이름을 입력하세요';
    if (!form.target.trim()) e.target = '대상을 입력하세요';
    if (form.checkType === 'TCP' && form.target && !/:\d+$/.test(form.target.trim())) e.target = 'IP:Port 형식이어야 합니다 (예: 192.168.0.10:445)';
    setErrors(e);
    if (Object.keys(e).length) return;

    const req: ServiceCreateRequest = { name: form.name, checkType: form.checkType, target: form.target, checkInterval: parseInt(form.checkInterval, 10) };
    if (editing) updateMut.mutate({ id: editing.id, req });
    else createMut.mutate(req);
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <Modal
      title={editing ? '서비스 수정' : '서비스 등록'}
      subtitle={editing ? '체크 방식과 대상을 수정합니다' : '모니터링할 서비스를 추가합니다'}
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={onClose}>취소</GhostButton>
          <PrimaryButton onClick={submit}>{isPending ? '처리중...' : editing ? '저장' : '등록'}</PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="서비스 이름" error={errors.name}>
          <TextInput value={form.name} onChange={(v) => set('name', v)} placeholder="예: File Browser" />
        </Field>
        <Field label="체크 방식">
          <Segmented
            value={form.checkType}
            onChange={(v) => set('checkType', v)}
            options={[
              { value: 'HTTP', label: 'HTTP', icon: 'globe' },
              { value: 'TCP', label: 'TCP', icon: 'plug' },
              { value: 'PROCESS', label: 'PROCESS', icon: 'terminal' },
            ]}
          />
        </Field>
        <Field
          label={targetLabel[form.checkType as CheckType]}
          error={errors.target}
          hint={form.checkType === 'PROCESS' ? 'ps 출력에서 매칭할 명령어 패턴' : form.checkType === 'HTTP' ? '2xx/3xx 응답이면 정상으로 간주' : 'TCP 소켓 연결 성공 시 정상'}
        >
          <TextInput mono value={form.target} onChange={(v) => set('target', v)} placeholder={targetPlaceholder[form.checkType as CheckType]} />
        </Field>
        <Field label="체크 주기">
          <Select
            value={form.checkInterval}
            onChange={(v) => set('checkInterval', v)}
            options={[
              { value: '15', label: '15초마다' },
              { value: '30', label: '30초마다' },
              { value: '60', label: '1분마다' },
              { value: '120', label: '2분마다' },
            ]}
          />
        </Field>
      </div>
    </Modal>
  );
}

function ServiceRow({ service, onEdit, onDelete }: { service: MonitoredService; onEdit: (s: MonitoredService) => void; onDelete: (s: MonitoredService) => void }) {
  const [hover, setHover] = useState(false);
  const queryClient = useQueryClient();
  const pauseMut = useMutation({ mutationFn: () => togglePauseService(service.id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }) });

  const paused = service.paused;
  const dotColor = paused ? META_SOFT : (service.up ? '#3DD68C' : '#F25C6E');
  const statusLabel = paused ? '일시중지' : (service.up ? '정상' : '다운');

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '120px 1fr 110px 96px 90px 132px', alignItems: 'center',
        gap: 12, padding: '14px 20px', borderBottom: `1px solid ${DIVIDER}`,
        background: hover ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: paused ? 'none' : `0 0 8px ${dotColor}`, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: paused ? META_SOFT : (service.up ? '#3DD68C' : '#F25C6E') }}>{statusLabel}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
        <div style={{ fontSize: 11, color: META, fontFamily: "'JetBrains Mono',monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.target}</div>
      </div>
      <div><TypeBadge type={service.checkType} /></div>
      <div style={{ fontSize: 12, color: META, fontFamily: "'JetBrains Mono',monospace" }}>{service.checkInterval}s</div>
      <div style={{ fontSize: 12.5, color: META, fontFamily: "'JetBrains Mono',monospace" }}>
        {paused ? '—' : service.checkType === 'PROCESS' ? (service.up ? '실행중' : '중단') : service.up ? `${service.latency}ms` : '없음'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifySelf: 'end', opacity: hover ? 1 : 0.45, transition: 'opacity 0.15s' }}>
        <IconBtn name={paused ? 'play' : 'pause'} title={paused ? '재개' : '일시중지'} onClick={() => pauseMut.mutate()} />
        <IconBtn name="edit" title="수정" onClick={() => onEdit(service)} />
        <IconBtn name="trash" title="삭제" danger onClick={() => onDelete(service)} />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<MonitoredService | null | 'new'>(null);
  const [delTarget, setDelTarget] = useState<MonitoredService | null>(null);

  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices, refetchInterval: 5000 });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); setDelTarget(null); },
  });

  const upCount = services.filter((s) => s.up && !s.paused).length;
  const downCount = services.filter((s) => !s.up && !s.paused).length;

  return (
    <>
      <PageHeader eyebrow="관리" title="서비스 관리">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: META }}>
          <span><span style={{ color: '#3DD68C', fontWeight: 600 }}>{upCount}</span> 정상</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span><span style={{ color: downCount ? '#F25C6E' : META, fontWeight: 600 }}>{downCount}</span> 다운</span>
        </div>
        <PrimaryButton icon="plus" onClick={() => setModal('new')}>서비스 추가</PrimaryButton>
      </PageHeader>

      <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 28px', overflow: 'hidden', display: 'flex' }}>
        <div style={{
          background: 'rgba(14,15,22,0.5)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
          flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* 테이블 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 110px 96px 90px 132px', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${DIVIDER}`, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: META_SOFT, fontWeight: 600 }}>
            <div>상태</div><div>서비스 / 대상</div><div>체크방식</div><div>주기</div><div>응답</div>
            <div style={{ justifySelf: 'end' }}>관리</div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="scrollbar-thin">
            {services.map((s) => (
              <ServiceRow key={s.id} service={s} onEdit={(svc) => setModal(svc)} onDelete={(svc) => setDelTarget(svc)} />
            ))}
            {services.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: META_SOFT, fontSize: 13 }}>
                등록된 서비스가 없습니다. 서비스 추가 버튼을 눌러 시작하세요.
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <ServiceModal
          editing={modal === 'new' ? null : modal as MonitoredService}
          onClose={() => setModal(null)}
          onSuccess={() => setModal(null)}
        />
      )}

      {delTarget && (
        <Modal
          title="서비스 삭제"
          width={420}
          subtitle={`'${delTarget.name}' 서비스를 모니터링 목록에서 제거합니다`}
          onClose={() => setDelTarget(null)}
          footer={
            <>
              <GhostButton onClick={() => setDelTarget(null)}>취소</GhostButton>
              <div
                onClick={() => deleteMut.mutate(delTarget.id)}
                style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer', background: '#F25C6E', color: '#fff', fontSize: 12.5, fontWeight: 600 }}
              >
                {deleteMut.isPending ? '삭제중...' : '삭제'}
              </div>
            </>
          }
        >
          <div style={{ fontSize: 13, color: META, lineHeight: 1.6 }}>
            삭제 후에도 상태 전환 이력은 보존됩니다. 이 작업은 되돌릴 수 없습니다.
          </div>
        </Modal>
      )}
    </>
  );
}
