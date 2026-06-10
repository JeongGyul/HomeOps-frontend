import client from './client';
import type { LoginRequest, AuthTokens, ApiResponse } from '@/types';

export const login = async (req: LoginRequest): Promise<AuthTokens> => {
  const { data } = await client.post<ApiResponse<AuthTokens>>('/auth/login', req);
  return data.result;
};

export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};
