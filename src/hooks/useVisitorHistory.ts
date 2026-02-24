import { useState, useEffect, useCallback } from 'react';

export interface HistoricalVisitor {
  lat: number;
  lng: number;
  city: string;
  country: string;
  connectedAt: number;
}

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return 'http://localhost:3001';
  return '';
};

export function useVisitorHistory() {
  const [history, setHistory] = useState<HistoricalVisitor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/visitors/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.visitors || []);
      }
    } catch (err) {
      console.error('[VisitorHistory] Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, refetch: fetchHistory };
}
