import client from './client';
import type { MonitoredService, ServiceCreateRequest, ApiResponse, DashboardSummary, ResourceSnapshot } from '@/types';

export const getServices = async (): Promise<MonitoredService[]> => {
  const { data } = await client.get<ApiResponse<MonitoredService[]>>('/api/services');
  return data.result;
};

export const createService = async (req: ServiceCreateRequest): Promise<MonitoredService> => {
  const { data } = await client.post<ApiResponse<MonitoredService>>('/api/services', req);
  return data.result;
};

export const updateService = async (id: number, req: ServiceCreateRequest): Promise<MonitoredService> => {
  const { data } = await client.put<ApiResponse<MonitoredService>>(`/api/services/${id}`, req);
  return data.result;
};

export const deleteService = async (id: number): Promise<void> => {
  await client.delete(`/api/services/${id}`);
};

export const togglePauseService = async (id: number): Promise<MonitoredService> => {
  const { data } = await client.patch<ApiResponse<MonitoredService>>(`/api/services/${id}/pause`);
  return data.result;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await client.get<ApiResponse<DashboardSummary>>('/api/dashboard/summary');
  return data.result;
};

export const getResources = async (): Promise<ResourceSnapshot> => {
  const { data } = await client.get<ApiResponse<ResourceSnapshot>>('/api/dashboard/resources');
  return data.result;
};
