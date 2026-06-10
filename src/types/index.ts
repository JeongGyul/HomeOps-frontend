export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type CheckType = 'HTTP' | 'TCP' | 'PROCESS';

export interface MonitoredService {
  id: number;
  name: string;
  checkType: CheckType;
  target: string;
  checkInterval: number;
  paused: boolean;
  up: boolean;
  latency: number | null;
  createdAt: string;
}

export interface ServiceCreateRequest {
  name: string;
  checkType: CheckType;
  target: string;
  checkInterval: number;
}

export interface DashboardSummary {
  upCount: number;
  downCount: number;
  pausedCount: number;
  total: number;
}

export interface ResourceSnapshot {
  cpu: number;
  ram: number;
  temp: number;
  network: number;
}

export type EventType = 'CRASH' | 'RECOVER';

export interface NotificationEvent {
  id: number;
  serviceName: string;
  eventType: EventType;
  description: string;
  createdAt: string;
}

export interface Webhook {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
  targetAll: boolean;
  serviceIds: number[];
  createdAt: string;
}

export interface WebhookCreateRequest {
  name: string;
  url: string;
  targetAll: boolean;
  serviceIds: number[];
}

export interface AppSettings {
  notifyCrash: boolean;
  notifyRecover: boolean;
  failThreshold: number;
  defaultInterval: number;
}

export interface StoreStatus {
  mysqlStatus: 'connected' | 'disconnected' | 'error';
  redisStatus: 'connected' | 'disconnected' | 'error';
}

export interface SystemInfo {
  hostname: string;
  localIp: string;
  os: string;
  uptimeSeconds: number;
}

export interface ResourceHistory {
  value: number;
  history: number[];
}

export interface ResourcesState {
  cpu: ResourceHistory;
  ram: ResourceHistory;
  temp: ResourceHistory;
  network: ResourceHistory;
}
