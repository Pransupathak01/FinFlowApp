import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from '../../../services/dashboardService';
import { Alert } from 'react-native';

export interface Transaction {
  id: string;
  title: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  time: string;
  type: 'credit' | 'debit';
}

export interface DashboardData {
  todayTotal: number;
  weeklyTotal: number;
  todaySuccess: number;
  todayFailed: number;
  pendingReconciliation: number;
  chartData: { x: string; y: number; failed: number }[];
  recentActivity: Transaction[];
}

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await getDashboardData();
      setData(res);
      setError(null);
    } catch (err: any) {
      console.error('[Dashboard Error]', err);
      setError(err.message);
      if (isRefresh) {
        Alert.alert('Update Failed', 'Could not refresh dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { loading, data, refresh, error };
}

