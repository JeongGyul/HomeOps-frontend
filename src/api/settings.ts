import client from './client';
import type { AppSettings, StoreStatus, SystemInfo, ApiResponse } from '@/types';

export const getSettings = async (): Promise<AppSettings> => {
  const { data } = await client.get<ApiResponse<AppSettings>>('/api/settings');
  return data.result;
};

export const updateSettings = async (patch: Partial<AppSettings>): Promise<AppSettings> => {
  const { data } = await client.patch<ApiResponse<AppSettings>>('/api/settings', patch);
  return data.result;
};

export const getStoreStatus = async (): Promise<StoreStatus> => {
  const { data } = await client.get<ApiResponse<StoreStatus>>('/api/settings/status');
  return data.result;
};

export const getSystemInfo = async (): Promise<SystemInfo> => {
  const { data } = await client.get<ApiResponse<SystemInfo>>('/api/settings/system');
  return data.result;
};
