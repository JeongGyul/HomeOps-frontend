import client from './client';
import type { NotificationEvent, Webhook, WebhookCreateRequest, ApiResponse } from '@/types';

export const getNotifications = async (page = 0, size = 40): Promise<NotificationEvent[]> => {
  const { data } = await client.get<ApiResponse<NotificationEvent[]>>('/api/notifications', {
    params: { page, size },
  });
  return data.result;
};

export const getWebhooks = async (): Promise<Webhook[]> => {
  const { data } = await client.get<ApiResponse<Webhook[]>>('/api/webhooks');
  return data.result;
};

export const createWebhook = async (req: WebhookCreateRequest): Promise<Webhook> => {
  const { data } = await client.post<ApiResponse<Webhook>>('/api/webhooks', req);
  return data.result;
};

export const updateWebhook = async (id: number, req: WebhookCreateRequest): Promise<Webhook> => {
  const { data } = await client.put<ApiResponse<Webhook>>(`/api/webhooks/${id}`, req);
  return data.result;
};

export const deleteWebhook = async (id: number): Promise<void> => {
  await client.delete(`/api/webhooks/${id}`);
};

export const toggleWebhook = async (id: number): Promise<Webhook> => {
  const { data } = await client.patch<ApiResponse<Webhook>>(`/api/webhooks/${id}/toggle`);
  return data.result;
};

export const testWebhook = async (id: number): Promise<void> => {
  await client.post(`/api/webhooks/${id}/test`);
};
