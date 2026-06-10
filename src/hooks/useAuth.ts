import { useState, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout } from '@/api/auth';
import type { LoginRequest } from '@/types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (req: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const tokens = await apiLogin(req);
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setIsAuthenticated(true);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '아이디 또는 비밀번호가 올바르지 않습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, logout };
}
