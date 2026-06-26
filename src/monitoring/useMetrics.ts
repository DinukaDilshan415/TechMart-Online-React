
import { useState, useEffect, useRef } from 'react';
import { fetchMetrics, type MetricsDTO } from '../monitoring/metricsService';

export interface MetricsState {
  data:    MetricsDTO | null;
  history: number[]; 
  error:   string | null;
  loading: boolean;
}

export function useMetrics(pollIntervalMs = 3000): MetricsState {
  const [data,    setData]    = useState<MetricsDTO | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function poll() {
    try {
      const metrics = await fetchMetrics();
      setData(metrics);
      setHistory(prev => [...prev.slice(-19), metrics.avgResponseTimeMs]);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? 'Cannot reach Payara');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, pollIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pollIntervalMs]);

  return { data, history, error, loading };
}