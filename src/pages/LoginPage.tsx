import { useState } from 'react';
import HOIcon from '@/components/ui/HOIcon';

const ACCENT = '#4A5BE8';
const META = '#75778B';
const DIVIDER = 'rgba(255,255,255,0.08)';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

export default function LoginPage({ onLogin, loading, error }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) onLogin(username, password);
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(900px 480px at 12% -8%, ${ACCENT}26, transparent 60%),
                   radial-gradient(760px 520px at 100% 0%, #6B5BD42e, transparent 55%),
                   linear-gradient(180deg, #0a0b10 0%, #050507 100%)`,
      fontFamily: "'Poppins','Apple SD Gothic Neo',sans-serif",
    }}>
      <div style={{ width: 420, padding: '0 24px' }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', marginBottom: 6 }}>
            HomeOps <span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A4C5C' }}>
            Operations Center
          </div>
        </div>

        {/* 카드 */}
        <div style={{
          background: 'rgba(14,15,22,0.7)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
          boxShadow: '0 30px 90px rgba(0,0,0,0.5)', padding: '32px',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 6px' }}>로그인</h2>
          <p style={{ fontSize: 12.5, color: META, margin: '0 0 26px' }}>관리자 계정으로 로그인하세요</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.04em', color: META, marginBottom: 8, fontWeight: 600 }}>아이디</div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: META }}>
                  <HOIcon name="server" size={16} stroke={1.6} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '12px 13px 12px 40px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${DIVIDER}`,
                    color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = ACCENT; }}
                  onBlur={(e) => { e.target.style.borderColor = DIVIDER; }}
                />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.04em', color: META, marginBottom: 8, fontWeight: 600 }}>비밀번호</div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: META }}>
                  <HOIcon name="sliders" size={16} stroke={1.6} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '12px 13px 12px 40px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${DIVIDER}`,
                    color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = ACCENT; }}
                  onBlur={(e) => { e.target.style.borderColor = DIVIDER; }}
                />
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 12, color: '#F25C6E', padding: '10px 14px', borderRadius: 9, background: 'rgba(242,92,110,0.1)', border: '1px solid rgba(242,92,110,0.3)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'rgba(255,255,255,0.1)' : '#fff',
                color: loading ? META : '#000',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                transition: 'background 0.2s, transform 0.15s',
                marginTop: 4,
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#4A4C5C' }}>
          HomeOps — 홈서버 운영 센터
        </div>
      </div>
    </div>
  );
}
