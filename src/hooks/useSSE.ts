import { useEffect, useRef, useCallback } from 'react';
import type { ResourceSnapshot } from '@/types';

const HISTORY_LEN = 48;

function walk(v: number, step: number, min: number, max: number): number {
  let n = v + (Math.random() - 0.5) * step;
  if (n < min) n = min + (min - n) * 0.5;
  if (n > max) n = max - (n - max) * 0.5;
  return n;
}

export function useSSE(onData: (snapshot: ResourceSnapshot) => void) {
  const esRef = useRef<EventSource | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountedRef = useRef(true);
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (esRef.current) esRef.current.close();

    const es = new EventSource('/api/dashboard/stream');
    esRef.current = es;

    es.addEventListener('resources', (e) => {
      try {
        const snapshot: ResourceSnapshot = JSON.parse(e.data);
        onDataRef.current(snapshot);
      } catch {
        // ignore parse errors
      }
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (mountedRef.current) {
        timerRef.current = setTimeout(connect, 3000);
      }
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}

export function buildInitialHistory(base: number, jitter: number): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < HISTORY_LEN; i++) {
    v = walk(v, jitter, base * 0.5, base * 1.5);
    arr.push(v);
  }
  return arr;
}

export { HISTORY_LEN };
