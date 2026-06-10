import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ServicesPage from '@/pages/ServicesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import { useAuth } from '@/hooks/useAuth';
import { getServices } from '@/api/services';

type Route = 'dashboard' | 'services' | 'notifications' | 'settings';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 3000, retry: 1 } },
});

const PAGE_BG = `radial-gradient(900px 480px at 12% -8%, #4A5BE826, transparent 60%),
                radial-gradient(760px 520px at 100% 0%, #6B5BD42e, transparent 55%),
                linear-gradient(180deg, #0a0b10 0%, #050507 100%)`;

function AppShell() {
  const { isAuthenticated, loading, error, login, logout } = useAuth();
  const [route, setRoute] = useState<Route>('dashboard');

  // 사이드바 배지용 — DashboardPage/ServicesPage 와 queryKey 공유, 추가 네트워크 요청 없음
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={async (u, p) => { await login({ username: u, password: p }); }}
        loading={loading}
        error={error}
      />
    );
  }

  const downCount = services.filter((s) => !s.up && !s.paused).length;
  const total = services.length;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', overflow: 'hidden',
      background: PAGE_BG, color: '#fff',
      fontFamily: "'Poppins','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
    }}>
      <Sidebar route={route} onNavigate={setRoute} total={total} downCount={downCount} onLogout={logout} />
      <main style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {route === 'dashboard' && <DashboardPage onNavigateToServices={() => setRoute('services')} />}
        {route === 'services' && <ServicesPage />}
        {route === 'notifications' && <NotificationsPage />}
        {route === 'settings' && <SettingsPage onLogout={logout} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
